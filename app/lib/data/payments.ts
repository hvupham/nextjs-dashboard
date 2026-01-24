import postgres from 'postgres';
import { PaymentsTable } from '../definitions';

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

export async function fetchPayments(status?: string, customerId?: string): Promise<PaymentsTable[]> {
  try {
    let query = sql<PaymentsTable[]>`
      SELECT 
        p.id,
        p.product_id,
        p.customer_id,
        p.billing_month,
        p.amount,
        p.status,
        p.payment_date,
        p.notes,
        pr.msn,
        c.name as customer_name,
        c.email as customer_email
      FROM payments p
      JOIN products pr ON p.product_id = pr.id
      JOIN customers c ON p.customer_id = c.id
    `;

    let conditions = [];
    if (status) {
      conditions.push(sql`p.status = ${status}`);
    }
    if (customerId) {
      conditions.push(sql`p.customer_id = ${customerId}`);
    }

    if (conditions.length > 0) {
      const whereClause = conditions.reduce((prev, curr) => sql`${prev} AND ${curr}`);
      query = sql<PaymentsTable[]>`
        SELECT 
          p.id,
          p.product_id,
          p.customer_id,
          p.billing_month,
          p.amount,
          p.status,
          p.payment_date,
          p.notes,
          pr.msn,
          c.name as customer_name,
          c.email as customer_email
        FROM payments p
        JOIN products pr ON p.product_id = pr.id
        JOIN customers c ON p.customer_id = c.id
        WHERE ${whereClause}
        ORDER BY p.billing_month DESC
      `;
    } else {
      query = sql<PaymentsTable[]>`
        SELECT 
          p.id,
          p.product_id,
          p.customer_id,
          p.billing_month,
          p.amount,
          p.status,
          p.payment_date,
          p.notes,
          pr.msn,
          c.name as customer_name,
          c.email as customer_email
        FROM payments p
        JOIN products pr ON p.product_id = pr.id
        JOIN customers c ON p.customer_id = c.id
        ORDER BY p.billing_month DESC
      `;
    }

    const result = await query;
    return result || [];
  } catch (error) {
    console.error('Failed to fetch payments:', error);
    return [];
  }
}

export async function fetchPaymentById(id: string): Promise<PaymentsTable | null> {
  try {
    const result = await sql<PaymentsTable[]>`
      SELECT 
        p.*,
        pr.msn,
        c.name as customer_name,
        c.email as customer_email
      FROM payments p
      JOIN products pr ON p.product_id = pr.id
      JOIN customers c ON p.customer_id = c.id
      WHERE p.id = ${id}
      LIMIT 1
    `;
    
    return result.length > 0 ? result[0] : null;
  } catch (error) {
    console.error('Failed to fetch payment:', error);
    return null;
  }
}

export async function fetchPaymentsByCustomer(customerId: string): Promise<PaymentsTable[]> {
  try {
    const result = await sql<PaymentsTable[]>`
      SELECT 
        p.id,
        p.product_id,
        p.customer_id,
        p.billing_month,
        p.amount,
        p.status,
        p.payment_date,
        p.notes,
        pr.msn,
        c.name as customer_name,
        c.email as customer_email
      FROM payments p
      JOIN products pr ON p.product_id = pr.id
      JOIN customers c ON p.customer_id = c.id
      WHERE p.customer_id = ${customerId}
      ORDER BY p.billing_month DESC
    `;
    
    return result || [];
  } catch (error) {
    console.error('Failed to fetch payments by customer:', error);
    return [];
  }
}

export async function fetchUnpaidPayments(): Promise<PaymentsTable[]> {
  try {
    const result = await sql<PaymentsTable[]>`
      SELECT 
        p.id,
        p.product_id,
        p.customer_id,
        p.billing_month,
        p.amount,
        p.status,
        p.payment_date,
        p.notes,
        pr.msn,
        c.name as customer_name,
        c.email as customer_email
      FROM payments p
      JOIN products pr ON p.product_id = pr.id
      JOIN customers c ON p.customer_id = c.id
      WHERE p.status IN ('pending', 'overdue')
      ORDER BY p.billing_month DESC
    `;
    
    return result || [];
  } catch (error) {
    console.error('Failed to fetch unpaid payments:', error);
    return [];
  }
}

export async function fetchPaymentsByProduct(productId: string): Promise<PaymentsTable[]> {
  try {
    const result = await sql<PaymentsTable[]>`
      SELECT 
        p.id,
        p.product_id,
        p.customer_id,
        p.billing_month,
        p.amount,
        p.status,
        p.payment_date,
        p.notes,
        pr.msn,
        c.name as customer_name,
        c.email as customer_email
      FROM payments p
      JOIN products pr ON p.product_id = pr.id
      JOIN customers c ON p.customer_id = c.id
      WHERE p.product_id = ${productId}::uuid
      ORDER BY p.billing_month DESC
    `;
    
    return result || [];
  } catch (error) {
    console.error('Failed to fetch payments by product:', error);
    return [];
  }
}
