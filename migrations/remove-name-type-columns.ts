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

async function removeNameTypeColumns() {
  try {
    console.log('Starting migration: remove name and type columns...');

    // Drop the name and type columns from products table
    await sql`
      ALTER TABLE products
      DROP COLUMN IF EXISTS name,
      DROP COLUMN IF EXISTS type;
    `;

    console.log('✅ Successfully removed name and type columns from products table');
  } catch (error) {
    console.error('❌ Migration failed:', error);
    throw error;
  }
}

removeNameTypeColumns();
