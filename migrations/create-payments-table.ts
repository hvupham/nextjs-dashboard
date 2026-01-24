import postgres from 'postgres';

const sql = postgres(process.env.DATABASE_URL_UNPOOLED || process.env.POSTGRES_URL!, { ssl: 'require' });

async function createPaymentsTable() {
  try {
    console.log('Creating payments table...');
    
    await sql`
      CREATE TABLE IF NOT EXISTS payments (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
        customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
        billing_month DATE NOT NULL,
        amount DECIMAL(10, 2) NOT NULL,
        status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'overdue')),
        payment_date TIMESTAMP,
        notes TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(product_id, billing_month)
      )
    `;
    
    console.log('✅ Successfully created payments table');
  } catch (error) {
    if ((error as any).message?.includes('already exists')) {
      console.log('ℹ️ payments table already exists');
    } else {
      console.error('❌ Error creating payments table:', error);
      throw error;
    }
  } finally {
    await sql.end();
  }
}

createPaymentsTable();
