import postgres from 'postgres';
import { SubscriptionsTable, SubscriptionForm } from '../definitions';

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

const ITEMS_PER_PAGE = 6;

export async function fetchFilteredSubscriptions(
    query: string,
    currentPage: number,
    sortBy: string = 'date',
    sortOrder: 'ASC' | 'DESC' = 'DESC',
) {
    const offset = (currentPage - 1) * ITEMS_PER_PAGE;
    const validSortFields = ['amount', 'date', 'name'];
    const sortField = validSortFields.includes(sortBy) ? sortBy : 'date';

    let orderField = 'subscriptions.date';
    if (sortField === 'name') orderField = 'customers.name';
    else if (sortField === 'amount') orderField = 'subscriptions.amount';

    try {
        const subscriptions = await sql<SubscriptionsTable[]>`
      SELECT
        subscriptions.id,
        subscriptions.amount,
        subscriptions.date,
        subscriptions.status,
        subscriptions.product_type,
        subscriptions.data_type,
        subscriptions.sim_status,
        subscriptions.employee_id,
        subscriptions.export_date,
        subscriptions.tracking_number,
        subscriptions.package_months,
        subscriptions.notes,
        customers.name,
        customers.email
      FROM subscriptions
      JOIN customers ON subscriptions.customer_id = customers.id
      WHERE
        customers.name ILIKE ${`%${query}%`} OR
        customers.email ILIKE ${`%${query}%`} OR
        subscriptions.amount::text ILIKE ${`%${query}%`} OR
        subscriptions.date::text ILIKE ${`%${query}%`} OR
        subscriptions.status ILIKE ${`%${query}%`}
      ORDER BY ${sql(orderField)} ${sql.unsafe(sortOrder)}
      LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset}
    `;

        return subscriptions;
    } catch (error) {
        console.error('Database Error:', error);
        throw new Error('Failed to fetch subscriptions.');
    }
}

export async function fetchSubscriptionsPages(query: string) {
    try {
        const data = await sql`SELECT COUNT(*)
    FROM subscriptions
    JOIN customers ON subscriptions.customer_id = customers.id
    WHERE
      customers.name ILIKE ${`%${query}%`} OR
      customers.email ILIKE ${`%${query}%`} OR
      subscriptions.amount::text ILIKE ${`%${query}%`} OR
      subscriptions.date::text ILIKE ${`%${query}%`} OR
      subscriptions.status ILIKE ${`%${query}%`}
  `;

        const totalPages = Math.ceil(Number(data[0].count) / ITEMS_PER_PAGE);
        return totalPages;
    } catch (error) {
        console.error('Database Error:', error);
        throw new Error('Failed to fetch total number of subscriptions.');
    }
}

export async function fetchSubscriptionById(id: string) {
    try {
        const data = await sql<any[]>`
      SELECT
        subscriptions.id,
        subscriptions.customer_id,
        customers.name as customer_name,
        customers.email as customer_email,
        subscriptions.amount,
        subscriptions.date,
        subscriptions.status,
        subscriptions.product_type,
        subscriptions.data_type,
        subscriptions.sim_status,
        subscriptions.employee_id,
        users.name as employee_name,
        subscriptions.export_date,
        subscriptions.tracking_number,
        subscriptions.package_months,
        subscriptions.notes
      FROM subscriptions
      JOIN customers ON subscriptions.customer_id = customers.id
      LEFT JOIN users ON subscriptions.employee_id = users.id
      WHERE subscriptions.id = ${id};
    `;

        const subscription = data.map((subscription) => ({
            ...subscription,
            // Convert amount from cents to dollars
            amount: subscription.amount / 100,
        }));

        return subscription[0];
    } catch (error) {
        console.error('Database Error:', error);
        throw new Error('Failed to fetch subscription.');
    }
}
export async function fetchMonthlyPaymentsBySubscriptionId(subscriptionId: string) {
    try {
        const payments = await sql<any[]>`
      SELECT
        id,
        subscription_id,
        payment_month,
        payment_status,
        amount,
        paid_date
      FROM monthly_payments
      WHERE subscription_id = ${subscriptionId}
      ORDER BY payment_month ASC
    `;

        return payments.map(payment => ({
            ...payment,
            // Convert amount from cents to dollars
            amount: payment.amount / 100,
        }));
    } catch (error) {
        console.error('Database Error:', error);
        throw new Error('Failed to fetch monthly payments.');
    }
}