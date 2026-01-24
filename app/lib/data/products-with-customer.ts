import postgres from 'postgres';
import { Product } from '../definitions';

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

export async function fetchProductWithCustomer(id: string): Promise<(Product & { customer_name?: string; customer_email?: string }) | null> {
  try {
    const result = await sql`
      SELECT 
        p.*,
        c.name as customer_name,
        c.email as customer_email
      FROM products p
      LEFT JOIN customers c ON p.customer_id = c.id::varchar
      WHERE p.id = ${id}
      LIMIT 1
    `;

    if (result.length === 0) {
      return null;
    }

    return result[0] as any;
  } catch (error) {
    console.error('Failed to fetch product with customer:', error);
    return null;
  }
}
