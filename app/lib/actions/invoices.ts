'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import postgres from 'postgres';
import { z } from 'zod';

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

const FormSchema = z.object({
    id: z.string(),
    customerId: z.string({
        invalid_type_error: 'Please select a customer.',
    }),
    amount: z.coerce
        .number()
        .gt(0, { message: 'Please enter an amount greater than $0.' }),
    status: z.enum(['pending', 'paid'], {
        required_error: 'Please select an invoice status.',
    }),
    date: z.string(),
    productType: z.string().optional(),
    dataType: z.string().optional(),
    simStatus: z.string().optional(),
    employeeId: z.string().optional(),
    exportDate: z.string().optional(),
    trackingNumber: z.string().optional(),
    packageMonths: z.coerce.number().optional(),
    notes: z.string().optional(),
});

const CreateInvoice = FormSchema.omit({ id: true, date: true });
const UpdateInvoice = FormSchema.omit({ id: true, date: true });

export type State = {
    errors?: {
        customerId?: string[];
        amount?: string[];
        status?: string[];
        productType?: string[];
        dataType?: string[];
        simStatus?: string[];
        employeeId?: string[];
        exportDate?: string[];
        trackingNumber?: string[];
        packageMonths?: string[];
        notes?: string[];
    };
    message?: string | null;
};

export async function createInvoice(prevState: State, formData: FormData) {
    // Validate form using Zod
    const validatedFields = CreateInvoice.safeParse({
        customerId: formData.get('customerId'),
        amount: formData.get('amount'),
        status: formData.get('status'),
        productType: formData.get('productType') || undefined,
        dataType: formData.get('dataType') || undefined,
        simStatus: formData.get('simStatus') || undefined,
        employeeId: formData.get('employeeId') || undefined,
        exportDate: formData.get('exportDate') || undefined,
        trackingNumber: formData.get('trackingNumber') || undefined,
        packageMonths: formData.get('packageMonths') || undefined,
        notes: formData.get('notes') || undefined,
    });

    // If form validation fails, return errors early. Otherwise, continue.
    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: 'Missing Fields. Failed to Create Invoice.',
        };
    }

    // Prepare data for insertion into the database
    const { customerId, amount, status, productType, dataType, simStatus, employeeId, exportDate, trackingNumber, packageMonths, notes } = validatedFields.data;
    const amountInCents = amount * 100;
    const date = new Date().toISOString().split('T')[0];

    // Insert data into the database
    try {
        await sql`
      INSERT INTO invoices (customer_id, amount, status, date, product_type, data_type, sim_status, employee_id, export_date, tracking_number, package_months, notes)
      VALUES (${customerId}, ${amountInCents}, ${status}, ${date}, ${productType ?? null}, ${dataType ?? null}, ${simStatus ?? null}, ${employeeId ?? null}, ${exportDate ?? null}, ${trackingNumber ?? null}, ${packageMonths ?? null}, ${notes ?? null})
    `;
    } catch (error) {
        // If a database error occurs, return a more specific error.
        return {
            message: 'Database Error: Failed to Create Invoice.',
        };
    }

    // Revalidate the cache for the invoices page and redirect the user.
    revalidatePath('/dashboard/invoices');
    redirect('/dashboard/invoices');
}

export async function updateInvoice(
    id: string,
    prevState: State,
    formData: FormData,
) {
    const validatedFields = UpdateInvoice.safeParse({
        customerId: formData.get('customerId'),
        amount: formData.get('amount'),
        status: formData.get('status'),
        productType: formData.get('productType') || undefined,
        dataType: formData.get('dataType') || undefined,
        simStatus: formData.get('simStatus') || undefined,
        employeeId: formData.get('employeeId') || undefined,
        exportDate: formData.get('exportDate') || undefined,
        trackingNumber: formData.get('trackingNumber') || undefined,
        packageMonths: formData.get('packageMonths') || undefined,
        notes: formData.get('notes') || undefined,
    });

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: 'Missing Fields. Failed to Update Invoice.',
        };
    }

    const { customerId, amount, status, productType, dataType, simStatus, employeeId, exportDate, trackingNumber, packageMonths, notes } = validatedFields.data;
    const amountInCents = amount * 100;

    try {
        await sql`
      UPDATE invoices
      SET customer_id = ${customerId}, amount = ${amountInCents}, status = ${status}, product_type = ${productType ?? null}, data_type = ${dataType ?? null}, sim_status = ${simStatus ?? null}, employee_id = ${employeeId ?? null}, export_date = ${exportDate ?? null}, tracking_number = ${trackingNumber ?? null}, package_months = ${packageMonths ?? null}, notes = ${notes ?? null}
      WHERE id = ${id}
    `;
    } catch (error) {
        return { message: 'Database Error: Failed to Update Invoice.' };
    }

    revalidatePath('/dashboard/invoices');
    redirect('/dashboard/invoices');
}

export async function deleteInvoice(id: string) {
    throw new Error('Failed to Delete Invoice');

    // Unreachable code block
    await sql`DELETE FROM invoices WHERE id = ${id}`;
    revalidatePath('/dashboard/invoices');
}
