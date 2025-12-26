import bcrypt from 'bcrypt';
import postgres from 'postgres';
import { customers, subscriptions, products, revenue, users, monthly_payments } from '../lib/placeholder-data';

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

async function seedsubscriptions() {
  await sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;

  await sql`
    CREATE TABLE IF NOT EXISTS subscriptions (
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

  // Add new columns to existing subscriptions table if they don't exist
  await sql`
    DO $$ 
    BEGIN 
      IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='subscriptions' AND column_name='product_type') THEN
        ALTER TABLE subscriptions ADD COLUMN product_type VARCHAR(255);
      END IF;
      IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='subscriptions' AND column_name='data_type') THEN
        ALTER TABLE subscriptions ADD COLUMN data_type VARCHAR(255);
      END IF;
      IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='subscriptions' AND column_name='sim_status') THEN
        ALTER TABLE subscriptions ADD COLUMN sim_status VARCHAR(50);
      END IF;
      IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='subscriptions' AND column_name='employee_id') THEN
        ALTER TABLE subscriptions ADD COLUMN employee_id UUID;
      END IF;
      IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='subscriptions' AND column_name='export_date') THEN
        ALTER TABLE subscriptions ADD COLUMN export_date DATE;
      END IF;
      IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='subscriptions' AND column_name='tracking_number') THEN
        ALTER TABLE subscriptions ADD COLUMN tracking_number VARCHAR(255);
      END IF;
      IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='subscriptions' AND column_name='package_months') THEN
        ALTER TABLE subscriptions ADD COLUMN package_months INT DEFAULT 1;
      END IF;
      IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='subscriptions' AND column_name='notes') THEN
        ALTER TABLE subscriptions ADD COLUMN notes TEXT;
      END IF;
    END $$;
  `;

  const insertedsubscriptions = await Promise.all(
    subscriptions.map(
      (subscription) => sql`
        INSERT INTO subscriptions (customer_id, amount, status, date, product_type, data_type, sim_status, employee_id, export_date, tracking_number, package_months, notes)
        VALUES (${subscription.customer_id}, ${subscription.amount}, ${subscription.status}, ${subscription.date}, ${subscription.product_type ?? null}, ${subscription.data_type ?? null}, ${subscription.sim_status ?? null}, ${subscription.employee_id ?? null}, ${subscription.export_date ?? null}, ${subscription.tracking_number ?? null}, ${subscription.package_months ?? null}, ${subscription.notes ?? null})
        ON CONFLICT (id) DO NOTHING
        RETURNING id;
      `,
    ),
  );

  // Flatten and filter the results to get actual IDs and subscription data
  const subscriptionResults = insertedsubscriptions
    .filter(result => result && result.length > 0)
    .map((result, index) => ({
      id: result[0].id,
      ...subscriptions[index],
    }));

  return subscriptionResults;
}

async function seedCustomers() {
  await sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;

  await sql`
    CREATE TABLE IF NOT EXISTS customers (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      email VARCHAR(255) NOT NULL,
      phone_number VARCHAR(20)
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
        INSERT INTO customers (id, name, email, phone_number)
        VALUES (${customer.id}, ${customer.name}, ${customer.email}, ${customer.phone_number ?? null})
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

async function seedMonthlyPayments(subscriptions: any[]) {
  await sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;

  await sql`
    CREATE TABLE IF NOT EXISTS monthly_payments (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      subscription_id UUID NOT NULL REFERENCES subscriptions(id),
      payment_month DATE NOT NULL,
      payment_status VARCHAR(50) DEFAULT 'pending',
      amount INT,
      paid_date DATE
    );
  `;

  // Create monthly payments starting from subscription date for package_months duration
  const insertedMonthlyPayments = [];

  for (const subscription of subscriptions) {
    const startDate = new Date(subscription.date);
    const monthlyAmount = Math.floor(subscription.amount / subscription.package_months);

    // Create payment records for each month in the package
    for (let i = 0; i < subscription.package_months; i++) {
      const paymentDate = new Date(startDate.getFullYear(), startDate.getMonth() + i, 1);
      const paymentMonth = paymentDate.toISOString().split('T')[0]; // YYYY-MM-DD format
      const isPaid = subscription.status === 'paid';
      const paidDate = isPaid ? new Date(paymentDate.getFullYear(), paymentDate.getMonth() + 1, 5).toISOString().split('T')[0] : null;

      const result = await sql`
        INSERT INTO monthly_payments (subscription_id, payment_month, payment_status, amount, paid_date)
        VALUES (${subscription.id}, ${paymentMonth}, ${isPaid ? 'paid' : 'pending'}, ${monthlyAmount}, ${paidDate})
        ON CONFLICT (id) DO NOTHING
        RETURNING id;
      `;
      insertedMonthlyPayments.push(result);
    }
  }

  return insertedMonthlyPayments;
}

export async function GET() {
  try {
    // Run all seed functions sequentially
    await seedUsers();
    await seedCustomers();
    const subscriptionsWithIds = await seedsubscriptions();
    await seedMonthlyPayments(subscriptionsWithIds);
    await seedRevenue();
    await seedProducts();

    return Response.json({ message: 'Database seeded successfully' });
  } catch (error) {
    console.error('Seed error:', error);
    return Response.json({ error: String(error) }, { status: 500 });
  }
}
