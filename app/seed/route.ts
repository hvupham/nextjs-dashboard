import bcrypt from 'bcrypt';
import postgres from 'postgres';
import { customers, invoices, products, revenue, users } from '../lib/placeholder-data';

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

async function seedUsers() {
  await sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;
  await sql`
    CREATE TABLE IF NOT EXISTS users (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      email TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL,
      role VARCHAR(50) NOT NULL DEFAULT 'user'
    );
  `;

  // Add role column if it doesn't exist (for existing tables)
  await sql`
    DO $$ 
    BEGIN 
      IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name='users' AND column_name='role'
      ) THEN
        ALTER TABLE users ADD COLUMN role VARCHAR(50) NOT NULL DEFAULT 'user';
      END IF;
    END $$;
  `;

  const insertedUsers = await Promise.all(
    users.map(async (user) => {
      const hashedPassword = await bcrypt.hash(user.password, 10);
      return sql`
        INSERT INTO users (id, name, email, password, role)
        VALUES (${user.id}, ${user.name}, ${user.email}, ${hashedPassword}, ${user.role})
        ON CONFLICT (id) DO UPDATE SET role = ${user.role};
      `;
    }),
  );

  return insertedUsers;
}

async function seedInvoices() {
  await sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;

  await sql`
    CREATE TABLE IF NOT EXISTS invoices (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      customer_id UUID NOT NULL,
      amount INT NOT NULL,
      status VARCHAR(255) NOT NULL,
      date DATE NOT NULL,
      product_type VARCHAR(255),
      data_type VARCHAR(255),
      sim_status VARCHAR(50),
      employee_id UUID,
      export_date DATE,
      tracking_number VARCHAR(255),
      package_months INT DEFAULT 1,
      notes TEXT
    );
  `;

  // Add new columns to existing invoices table if they don't exist
  await sql`
    DO $$ 
    BEGIN 
      IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='invoices' AND column_name='product_type') THEN
        ALTER TABLE invoices ADD COLUMN product_type VARCHAR(255);
      END IF;
      IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='invoices' AND column_name='data_type') THEN
        ALTER TABLE invoices ADD COLUMN data_type VARCHAR(255);
      END IF;
      IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='invoices' AND column_name='sim_status') THEN
        ALTER TABLE invoices ADD COLUMN sim_status VARCHAR(50);
      END IF;
      IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='invoices' AND column_name='employee_id') THEN
        ALTER TABLE invoices ADD COLUMN employee_id UUID;
      END IF;
      IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='invoices' AND column_name='export_date') THEN
        ALTER TABLE invoices ADD COLUMN export_date DATE;
      END IF;
      IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='invoices' AND column_name='tracking_number') THEN
        ALTER TABLE invoices ADD COLUMN tracking_number VARCHAR(255);
      END IF;
      IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='invoices' AND column_name='package_months') THEN
        ALTER TABLE invoices ADD COLUMN package_months INT DEFAULT 1;
      END IF;
      IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='invoices' AND column_name='notes') THEN
        ALTER TABLE invoices ADD COLUMN notes TEXT;
      END IF;
    END $$;
  `;

  const insertedInvoices = await Promise.all(
    invoices.map(
      (invoice) => sql`
        INSERT INTO invoices (customer_id, amount, status, date, product_type, data_type, sim_status, employee_id, export_date, tracking_number, package_months, notes)
        VALUES (${invoice.customer_id}, ${invoice.amount}, ${invoice.status}, ${invoice.date}, ${invoice.product_type ?? null}, ${invoice.data_type ?? null}, ${invoice.sim_status ?? null}, ${invoice.employee_id ?? null}, ${invoice.export_date ?? null}, ${invoice.tracking_number ?? null}, ${invoice.package_months ?? null}, ${invoice.notes ?? null})
        ON CONFLICT (id) DO NOTHING;
      `,
    ),
  );

  return insertedInvoices;
}

async function seedCustomers() {
  await sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;

  await sql`
    CREATE TABLE IF NOT EXISTS customers (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      email VARCHAR(255) NOT NULL,
      phone_number VARCHAR(20),
      image_url VARCHAR(255) NOT NULL
    );
  `;

  // Add phone_number column if it doesn't exist
  await sql`
    DO $$ 
    BEGIN 
      IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='customers' AND column_name='phone_number') THEN
        ALTER TABLE customers ADD COLUMN phone_number VARCHAR(20);
      END IF;
    END $$;
  `;

  const insertedCustomers = await Promise.all(
    customers.map(
      (customer) => sql`
        INSERT INTO customers (id, name, email, phone_number, image_url)
        VALUES (${customer.id}, ${customer.name}, ${customer.email}, ${customer.phone_number ?? null}, ${customer.image_url})
        ON CONFLICT (id) DO NOTHING;
      `,
    ),
  );

  return insertedCustomers;
}

async function seedRevenue() {
  await sql`
    CREATE TABLE IF NOT EXISTS revenue (
      month VARCHAR(4) NOT NULL UNIQUE,
      revenue INT NOT NULL
    );
  `;

  const insertedRevenue = await Promise.all(
    revenue.map(
      (rev) => sql`
        INSERT INTO revenue (month, revenue)
        VALUES (${rev.month}, ${rev.revenue})
        ON CONFLICT (month) DO NOTHING;
      `,
    ),
  );

  return insertedRevenue;
}

async function seedProducts() {
  await sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;

  await sql`
    CREATE TABLE IF NOT EXISTS products (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      type VARCHAR(50) NOT NULL,
      monthly_price INT NOT NULL,
      description TEXT NOT NULL,
      stock INT NOT NULL DEFAULT 0,
      status VARCHAR(50) NOT NULL DEFAULT 'available'
    );
  `;

  const insertedProducts = await Promise.all(
    products.map(
      (product) => sql`
        INSERT INTO products (id, name, type, monthly_price, description, stock, status)
        VALUES (${product.id}, ${product.name}, ${product.type}, ${product.monthly_price}, ${product.description}, ${product.stock}, ${product.status})
        ON CONFLICT (id) DO NOTHING;
      `,
    ),
  );

  return insertedProducts;
}

async function seedMonthlyPayments() {
  await sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;

  await sql`
    CREATE TABLE IF NOT EXISTS monthly_payments (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      invoice_id UUID NOT NULL REFERENCES invoices(id),
      payment_month DATE NOT NULL,
      payment_status VARCHAR(50) DEFAULT 'pending',
      amount INT,
      paid_date DATE
    );
  `;

  return [];
}

export async function GET() {
  try {


    // Run all seed functions sequentially
    await seedUsers();
    await seedCustomers();
    await seedInvoices();
    await seedMonthlyPayments();
    await seedRevenue();
    await seedProducts();

    return Response.json({ message: 'Database seeded successfully' });
  } catch (error) {
    console.error('Seed error:', error);
    return Response.json({ error: String(error) }, { status: 500 });
  }
}
