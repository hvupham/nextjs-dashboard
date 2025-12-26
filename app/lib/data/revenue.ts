import postgres from 'postgres';
import { Revenue, LatestSubscriptionRaw } from '../definitions';
import { formatCurrency } from '../utils';

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

export async function fetchRevenue() {
    try {
        // Artificially delay a response for demo purposes.
        // Don't do this in production :)

        console.log('Fetching revenue data...');
        await new Promise((resolve) => setTimeout(resolve, 3000));

        const data = await sql<Revenue[]>`SELECT * FROM revenue`;

        console.log('Data fetch completed after 3 seconds.');

        return data;
    } catch (error) {
        console.error('Database Error:', error);
        throw new Error('Failed to fetch revenue data.');
    }
}

export async function fetchLatestSubscriptions() {
    try {
        const data = await sql<LatestSubscriptionRaw[]>`
      SELECT subscriptions.amount, customers.name, customers.email, subscriptions.id
      FROM subscriptions
      JOIN customers ON subscriptions.customer_id = customers.id
      ORDER BY subscriptions.date DESC
      LIMIT 5`;

        const latestSubscriptions = data.map((subscription) => ({
            ...subscription,
            amount: formatCurrency(subscription.amount),
        }));
        return latestSubscriptions;
    } catch (error) {
        console.error('Database Error:', error);
        throw new Error('Failed to fetch the latest subscriptions.');
    }
}

export async function fetchCardData() {
    try {
        // You can probably combine these into a single SQL query
        // However, we are intentionally splitting them to demonstrate
        // how to initialize multiple queries in parallel with JS.
        const subscriptionCountPromise = sql`SELECT COUNT(*) FROM subscriptions`;
        const customerCountPromise = sql`SELECT COUNT(*) FROM customers`;
        const subscriptionStatusPromise = sql`SELECT
         SUM(CASE WHEN status = 'paid' THEN amount ELSE 0 END) AS "paid",
         SUM(CASE WHEN status = 'pending' THEN amount ELSE 0 END) AS "pending"
         FROM subscriptions`;

        const data = await Promise.all([
            subscriptionCountPromise,
            customerCountPromise,
            subscriptionStatusPromise,
        ]);

        const numberOfsubscriptions = Number(data[0][0].count ?? '0');
        const numberOfCustomers = Number(data[1][0].count ?? '0');
        const totalPaidsubscriptions = formatCurrency(data[2][0].paid ?? '0');
        const totalPendingsubscriptions = formatCurrency(data[2][0].pending ?? '0');

        return {
            numberOfCustomers,
            numberOfsubscriptions,
            totalPaidsubscriptions,
            totalPendingsubscriptions,
        };
    } catch (error) {
        console.error('Database Error:', error);
        throw new Error('Failed to fetch card data.');
    }
}
