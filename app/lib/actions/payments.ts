'use server';

import { requireAuth } from '@/app/lib/actions/permissions';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import postgres from 'postgres';
import { z } from 'zod';

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

const PaymentSchema = z.object({
  product_id: z.string().uuid(),
  customer_id: z.string().uuid(),
  billing_month: z.string(), // YYYY-MM-DD format
  amount: z.coerce.number().gt(0),
  status: z.enum(['pending', 'paid', 'overdue']),
  payment_date: z.string().nullish().default(null),
  notes: z.string().nullish().default(null),
});

export async function createPayment(formData: FormData) {
  try {
    await requireAuth();
  } catch (error) {
    redirect('/login');
  }

  const rawData = {
    product_id: formData.get('product_id'),
    customer_id: formData.get('customer_id'),
    billing_month: formData.get('billing_month'),
    amount: formData.get('amount'),
    status: formData.get('status'),
    payment_date: formData.get('payment_date'),
    notes: formData.get('notes'),
  };

  const validatedData = PaymentSchema.parse(rawData);

  try {
    const paymentDate = validatedData.status === 'paid' && validatedData.payment_date 
      ? new Date(validatedData.payment_date) 
      : null;

    await sql`
      INSERT INTO payments (product_id, customer_id, billing_month, amount, status, payment_date, notes)
      VALUES (
        ${validatedData.product_id}::uuid,
        ${validatedData.customer_id}::uuid,
        ${validatedData.billing_month}::date,
        ${validatedData.amount},
        ${validatedData.status},
        ${paymentDate},
        ${validatedData.notes}
      )
    `;

    revalidatePath('/dashboard/payments');
    return { success: true };
  } catch (error) {
    console.error('Failed to create payment:', error);
    throw new Error('Failed to create payment.');
  }
}

export async function updatePayment(id: string, formData: FormData) {
  try {
    await requireAuth();
  } catch (error) {
    redirect('/login');
  }

  const rawData = {
    status: formData.get('status'),
    payment_date: formData.get('payment_date'),
    notes: formData.get('notes'),
  };

  const validatedData = z.object({
    status: z.enum(['pending', 'paid', 'overdue']),
    payment_date: z.string().nullish().default(null),
    notes: z.string().nullish().default(null),
  }).parse(rawData);

  try {
    // Get current payment to check old status and get details for next month
    const currentPayment = await sql`
      SELECT product_id, customer_id, billing_month, amount, status
      FROM payments
      WHERE id = ${id}::uuid
      LIMIT 1
    `;

    if (currentPayment.length === 0) {
      throw new Error('Payment not found');
    }

    const oldPayment = currentPayment[0];
    const paymentDate = validatedData.status === 'paid' && validatedData.payment_date
      ? new Date(validatedData.payment_date)
      : null;

    // Update current payment
    await sql`
      UPDATE payments
      SET status = ${validatedData.status},
          payment_date = ${paymentDate},
          notes = ${validatedData.notes},
          updated_at = CURRENT_TIMESTAMP
      WHERE id = ${id}::uuid
    `;

    // If status changed to 'paid', automatically create payment for next month
    if (validatedData.status === 'paid' && oldPayment.status !== 'paid') {
      // Calculate next month based on TODAY's date, not the billing_month
      const today = new Date();
      const nextMonthDate = new Date(today.getFullYear(), today.getMonth() + 1, 1);
      const nextMonthStr = nextMonthDate.toISOString().split('T')[0];

      // Check if payment already exists for next month
      const existingNextPayment = await sql`
        SELECT id FROM payments
        WHERE product_id = ${oldPayment.product_id}::uuid
          AND customer_id = ${oldPayment.customer_id}::uuid
          AND billing_month = ${nextMonthStr}::date
        LIMIT 1
      `;

      if (existingNextPayment.length === 0) {
        // Create new payment for next month
        try {
          await sql`
            INSERT INTO payments (product_id, customer_id, billing_month, amount, status)
            VALUES (
              ${oldPayment.product_id}::uuid,
              ${oldPayment.customer_id}::uuid,
              ${nextMonthStr}::date,
              ${oldPayment.amount},
              'pending'
            )
          `;
        } catch (insertError) {
          console.error('Failed to create next month payment:', insertError);
          // Don't throw error if next month payment creation fails
          // The main payment update succeeded
        }
      }
    }

    revalidatePath('/dashboard/payments');
    revalidatePath(`/dashboard/payments/${id}`);

    return { success: true };
  } catch (error) {
    console.error('Failed to update payment:', error);
    throw new Error('Failed to update payment.');
  }
}

export async function deletePayment(id: string) {
  try {
    await requireAuth();
  } catch (error) {
    redirect('/login');
  }

  try {
    await sql`DELETE FROM payments WHERE id = ${id}::uuid`;
    revalidatePath('/dashboard/payments');
  } catch (error) {
    throw new Error('Failed to delete payment.');
  }
}

export async function markPaymentAsPaid(id: string, paymentDate: string) {
  try {
    await requireAuth();
  } catch (error) {
    redirect('/login');
  }

  try {
    // Get current payment details before updating
    const currentPayment = await sql`
      SELECT product_id, customer_id, billing_month, amount, status
      FROM payments
      WHERE id = ${id}::uuid
      LIMIT 1
    `;

    if (currentPayment.length === 0) {
      throw new Error('Payment not found');
    }

    const oldPayment = currentPayment[0];

    // Update current payment to paid
    await sql`
      UPDATE payments
      SET status = 'paid',
          payment_date = ${new Date(paymentDate)},
          updated_at = CURRENT_TIMESTAMP
      WHERE id = ${id}::uuid
    `;

    // If old status wasn't 'paid', automatically create payment for next month
    if (oldPayment.status !== 'paid') {
      // Calculate next month based on TODAY's date, not the billing_month
      const today = new Date();
      const nextMonthDate = new Date(today.getFullYear(), today.getMonth() + 1, 1);
      const nextMonthStr = nextMonthDate.toISOString().split('T')[0];

      // Check if payment already exists for next month
      const existingNextPayment = await sql`
        SELECT id FROM payments
        WHERE product_id = ${oldPayment.product_id}::uuid
          AND customer_id = ${oldPayment.customer_id}::uuid
          AND billing_month = ${nextMonthStr}::date
        LIMIT 1
      `;

      if (existingNextPayment.length === 0) {
        // Create new payment for next month
        try {
          await sql`
            INSERT INTO payments (product_id, customer_id, billing_month, amount, status)
            VALUES (
              ${oldPayment.product_id}::uuid,
              ${oldPayment.customer_id}::uuid,
              ${nextMonthStr}::date,
              ${oldPayment.amount},
              'pending'
            )
          `;
        } catch (insertError) {
          console.error('Failed to create next month payment:', insertError);
          // Don't throw error if next month payment creation fails
          // The main payment update succeeded
        }
      }
    }

    revalidatePath('/dashboard/payments');
    // Revalidate product detail page if we know the product ID
    if (oldPayment.product_id) {
      revalidatePath(`/dashboard/products/${oldPayment.product_id}`);
    }
    return { success: true };
  } catch (error) {
    console.error('Failed to mark payment as paid:', error);
    throw new Error('Failed to mark payment as paid.');
  }
}
