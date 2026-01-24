import * as fs from 'fs';
import * as path from 'path';
import postgres from 'postgres';

// Load environment variables from .env.local
const envPath = path.resolve(process.cwd(), '.env.local');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf-8');
  envContent.split('\n').forEach((line) => {
    const match = line.match(/^([^=]+)=(.*)$/);
    if (match) {
      process.env[match[1].trim()] = match[2].trim();
    }
  });
}

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

async function addSIMColumnsToProducts() {
  try {
    console.log('Adding SIM card columns to products table...');

    // Add columns if they don't exist
    await sql`
      ALTER TABLE products
      ADD COLUMN IF NOT EXISTS msn VARCHAR(255),
      ADD COLUMN IF NOT EXISTS imsi VARCHAR(255),
      ADD COLUMN IF NOT EXISTS carrier VARCHAR(255),
      ADD COLUMN IF NOT EXISTS imei VARCHAR(255),
      ADD COLUMN IF NOT EXISTS iccid VARCHAR(255),
      ADD COLUMN IF NOT EXISTS device_type VARCHAR(255),
      ADD COLUMN IF NOT EXISTS sim_type VARCHAR(50),
      ADD COLUMN IF NOT EXISTS capacity VARCHAR(255),
      ADD COLUMN IF NOT EXISTS shipping_date DATE,
      ADD COLUMN IF NOT EXISTS expiration_date DATE,
      ADD COLUMN IF NOT EXISTS activation_date DATE,
      ADD COLUMN IF NOT EXISTS options TEXT,
      ADD COLUMN IF NOT EXISTS sim_status VARCHAR(50),
      ADD COLUMN IF NOT EXISTS current_month_usage VARCHAR(50),
      ADD COLUMN IF NOT EXISTS previous_month_usage VARCHAR(50)
    `;

    console.log('✓ Successfully added SIM card columns to products table');
  } catch (error) {
    console.error('Error adding columns:', error);
    throw error;
  } finally {
    await sql.end();
  }
}

addSIMColumnsToProducts().catch((error) => {
  console.error('Migration failed:', error);
  process.exit(1);
});
