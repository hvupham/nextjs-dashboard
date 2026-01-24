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

async function addSimStatusIdColumn() {
  try {
    console.log('Adding sim_status_id column to products table...');

    // Add sim_status_id foreign key column
    await sql`
      ALTER TABLE products
      ADD COLUMN IF NOT EXISTS sim_status_id INTEGER REFERENCES sim_statuses(id);
    `;

    // Set default status for existing products (in-stock if no status set)
    await sql`
      UPDATE products
      SET sim_status_id = (SELECT id FROM sim_statuses WHERE code = 'in-stock')
      WHERE sim_status_id IS NULL AND sim_status IS NOT NULL;
    `;

    console.log('✅ Successfully added sim_status_id column to products table');
  } catch (error) {
    console.error('❌ Migration failed:', error);
    throw error;
  }
}

addSimStatusIdColumn();
