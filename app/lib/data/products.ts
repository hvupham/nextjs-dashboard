import postgres from 'postgres';
import { ProductForm, ProductsTable } from '../definitions';

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

export async function fetchProducts(
    sortBy: string = 'msn',
    sortOrder: 'ASC' | 'DESC' = 'ASC',
    statusFilter?: number,
): Promise<ProductsTable[]> {
    try {
        const validSortFields = ['msn', 'carrier', 'monthly_price', 'stock', 'status'];
        const sortField = validSortFields.includes(sortBy) ? sortBy : 'msn';

        // Try to select with SIM columns first
        try {
            let query = sql<ProductsTable[]>`
        SELECT id, monthly_price, description, stock, status,
               msn, carrier, capacity, iccid, sim_status_id, shipping_date, activation_date,
               current_month_usage, previous_month_usage
        FROM products`;
            
            if (statusFilter) {
                query = sql<ProductsTable[]>`
        SELECT id, monthly_price, description, stock, status,
               msn, carrier, capacity, iccid, sim_status_id, shipping_date, activation_date,
               current_month_usage, previous_month_usage
        FROM products
        WHERE sim_status_id = ${statusFilter}
        ORDER BY ${sql(sortField)} ${sql.unsafe(sortOrder)}
      `;
            } else {
                query = sql<ProductsTable[]>`
        SELECT id, monthly_price, description, stock, status,
               msn, carrier, capacity, iccid, sim_status_id, shipping_date, activation_date,
               current_month_usage, previous_month_usage
        FROM products
        ORDER BY ${sql(sortField)} ${sql.unsafe(sortOrder)}
      `;
            }

            const data = await query;
            return data;
        } catch (simError) {
            // Fallback if SIM columns don't exist yet
            const data = await sql<ProductsTable[]>`
        SELECT id, monthly_price, description, stock, status,
               null::text as msn, null::text as carrier, null::text as capacity,
               null::text as iccid, null::integer as sim_status_id, null::text as shipping_date,
               null::text as activation_date, null::text as current_month_usage,
               null::text as previous_month_usage
        FROM products
        ORDER BY ${sql(sortField)} ${sql.unsafe(sortOrder)}
      `;
            return data;
        }
    } catch (error) {
        console.error('Database Error:', error);
        throw new Error('Failed to fetch products.');
    }
}

export async function fetchProductById(id: string): Promise<ProductForm> {
    try {
        // Try to select with SIM columns first
        try {
            const data = await sql<ProductForm[]>`
        SELECT id, monthly_price, description, stock, status,
               msn, imsi, carrier, imei, iccid, device_type, sim_type,
               capacity, shipping_date, expiration_date, activation_date, options, sim_status_id,
               current_month_usage, previous_month_usage
        FROM products
        WHERE id = ${id}
      `;
            return data[0];
        } catch (simError) {
            // Fallback if SIM columns don't exist yet
            const data = await sql<ProductForm[]>`
        SELECT id, monthly_price, description, stock, status
        FROM products
        WHERE id = ${id}
      `;
            return data[0];
        }
    } catch (error) {
        console.error('Database Error:', error);
        throw new Error('Failed to fetch product.');
    }
}
