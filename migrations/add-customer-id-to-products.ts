import postgres from 'postgres';

const sql = postgres(process.env.DATABASE_URL_UNPOOLED || process.env.POSTGRES_URL!, { ssl: 'require' });

async function addCustomerIdToProducts() {
  try {
    console.log('Adding customer_id column to products table...');
    
    // Add customer_id column
    await sql`
      ALTER TABLE products 
      ADD COLUMN customer_id VARCHAR(255)
    `;
    
    console.log('✅ Successfully added customer_id column to products table');
  } catch (error) {
    if ((error as any).message?.includes('already exists')) {
      console.log('ℹ️ customer_id column already exists');
    } else {
      console.error('❌ Error adding customer_id column:', error);
      throw error;
    }
  } finally {
    await sql.end();
  }
}

addCustomerIdToProducts();
