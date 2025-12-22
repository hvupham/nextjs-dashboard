import postgres from 'postgres';
import { CustomerField, CustomersTableType, FormattedCustomersTable } from '../definitions';
import { formatCurrency } from '../utils';

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

export async function fetchCustomers() {
    try {
        const customers = await sql<CustomerField[]>`
      SELECT
        id,
        name
      FROM customers
      ORDER BY name ASC
    `;

        return customers;
    } catch (err) {
        console.error('Database Error:', err);
        throw new Error('Failed to fetch all customers.');
    }
}

export async function fetchFilteredCustomers(
    query: string,
    sortBy: string = 'name',
    sortOrder: 'ASC' | 'DESC' = 'ASC',
): Promise<FormattedCustomersTable[]> {
    try {
        const validSortFields = ['name', 'email', 'total_invoices', 'total_pending', 'total_paid'];
        const sortField = validSortFields.includes(sortBy) ? sortBy : 'name';

        let orderField = 'customers.name';
        if (sortField === 'email') orderField = 'customers.email';
        else if (sortField === 'total_invoices') orderField = 'total_invoices';
        else if (sortField === 'total_pending') orderField = 'total_pending';
        else if (sortField === 'total_paid') orderField = 'total_paid';

        const data = await sql<CustomersTableType[]>`
		SELECT
		  customers.id,
		  customers.name,
		  customers.email,
		  customers.image_url,
		  COUNT(invoices.id) AS total_invoices,
		  SUM(CASE WHEN invoices.status = 'pending' THEN invoices.amount ELSE 0 END) AS total_pending,
		  SUM(CASE WHEN invoices.status = 'paid' THEN invoices.amount ELSE 0 END) AS total_paid
		FROM customers
		LEFT JOIN invoices ON customers.id = invoices.customer_id
		WHERE
		  customers.name ILIKE ${`%${query}%`} OR
        customers.email ILIKE ${`%${query}%`}
		GROUP BY customers.id, customers.name, customers.email, customers.image_url
		ORDER BY ${sql(orderField)} ${sql.unsafe(sortOrder)}
	  `;

        const customers = data.map((customer) => ({
            ...customer,
            total_pending: formatCurrency(customer.total_pending),
            total_paid: formatCurrency(customer.total_paid),
        }));

        return customers;
    } catch (err) {
        console.error('Database Error:', err);
        throw new Error('Failed to fetch customer table.');
    }
}
