import postgres from 'postgres';
import { ProductsTable, ProductForm } from '../definitions';

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

export async function fetchProducts(
    sortBy: string = 'name',
    sortOrder: 'ASC' | 'DESC' = 'ASC',
): Promise<ProductsTable[]> {
    try {
        const validSortFields = ['name', 'type', 'monthly_price', 'stock', 'status'];
        const sortField = validSortFields.includes(sortBy) ? sortBy : 'name';

        const data = await sql<ProductsTable[]>`
      SELECT id, name, type, monthly_price, description, stock, status
      FROM products
      ORDER BY ${sql(sortField)} ${sql.unsafe(sortOrder)}
    `;
        return data;
    } catch (error) {
        console.error('Database Error:', error);
        throw new Error('Failed to fetch products.');
    }
}

export async function fetchProductById(id: string): Promise<ProductForm> {
    try {
        const data = await sql<ProductForm[]>`
      SELECT id, name, type, monthly_price, description, stock, status
      FROM products
      WHERE id = ${id}
    `;
        return data[0];
    } catch (error) {
        console.error('Database Error:', error);
        throw new Error('Failed to fetch product.');
    }
}
