import postgres from 'postgres';
import { Customer, CustomersTableType, FormattedCustomersTable } from '../definitions';

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

export async function fetchCustomerById(id: string): Promise<Customer | undefined> {
    try {
        const customer = await sql<Customer[]>`
      SELECT
        id,
        name,
        email,
        phone_number
      FROM customers
      WHERE id = ${id}
    `;

        return customer[0];
    } catch (err) {
        console.error('Database Error:', err);
        throw new Error('Failed to fetch customer.');
    }
}

export async function fetchCustomers() {
    try {
        const customers = await sql<any[]>`
      SELECT
        id,
        name,
        email,
        phone_number
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
        const validSortFields = ['name', 'email'];
        const sortField = validSortFields.includes(sortBy) ? sortBy : 'name';

        let orderField = 'customers.name';
        if (sortField === 'email') orderField = 'customers.email';

        const data = await sql<CustomersTableType[]>`
		SELECT
		  customers.id,
		  customers.name,
		  customers.email,
		  customers.phone_number
		FROM customers
		WHERE
		  customers.name ILIKE ${`%${query}%`} OR
        customers.email ILIKE ${`%${query}%`}
		ORDER BY ${sql(orderField)} ${sql.unsafe(sortOrder)}
	  `;

        return data;
    } catch (err) {
        console.error('Database Error:', err);
        throw new Error('Failed to fetch customer table.');
    }
}
