'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import postgres from 'postgres';
import { z } from 'zod';

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

const FormSchema = z.object({
    id: z.string(),
    customerId: z.string({
        invalid_type_error: 'Vui lòng chọn khách hàng.',
    }),
    amount: z.coerce
        .number()
        .gt(0, { message: 'Vui lòng nhập số tiền lớn hơn $0.' }),
    status: z.enum(['pending', 'paid'], {
        required_error: 'Vui lòng chọn trạng thái hóa đơn.',
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

const Createsubscription = FormSchema.omit({ id: true, date: true });
const Updatesubscription = FormSchema.omit({ id: true, date: true });

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

export async function createsubscription(prevState: State, formData: FormData) {
    // Validate form using Zod
    const validatedFields = Createsubscription.safeParse({
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
            message: 'Các trường bắt buộc bị thiếu. Không thể tạo hóa đơn.',
        };
    }

    // Prepare data for insertion into the database
    const { customerId, amount, status, productType, dataType, simStatus, employeeId, exportDate, trackingNumber, packageMonths, notes } = validatedFields.data;
    const amountInCents = amount * 100;
    const date = new Date().toISOString().split('T')[0];

    // Insert data into the database
    try {
        await sql`
      INSERT INTO subscriptions (customer_id, amount, status, date, product_type, data_type, sim_status, employee_id, export_date, tracking_number, package_months, notes)
      VALUES (${customerId}, ${amountInCents}, ${status}, ${date}, ${productType ?? null}, ${dataType ?? null}, ${simStatus ?? null}, ${employeeId ?? null}, ${exportDate ?? null}, ${trackingNumber ?? null}, ${packageMonths ?? null}, ${notes ?? null})
    `;
    } catch (error) {
        // If a database error occurs, return a more specific error.
        return {
            message: 'Lỗi cơ sở dữ liệu: Không thể tạo hóa đơn.',
        };
    }

    // Revalidate the cache for the subscriptions page and redirect the user.
    revalidatePath('/dashboard/subscriptions');
    redirect('/dashboard/subscriptions');
}

export async function updatesubscription(
    id: string,
    prevState: State,
    formData: FormData,
) {
    const validatedFields = Updatesubscription.safeParse({
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
            message: 'Các trường bắt buộc bị thiếu. Không thể cập nhật hóa đơn.',
        };
    }

    const { customerId, amount, status, productType, dataType, simStatus, employeeId, exportDate, trackingNumber, packageMonths, notes } = validatedFields.data;
    const amountInCents = amount * 100;

    try {
        await sql`
      UPDATE subscriptions
      SET customer_id = ${customerId}, amount = ${amountInCents}, status = ${status}, product_type = ${productType ?? null}, data_type = ${dataType ?? null}, sim_status = ${simStatus ?? null}, employee_id = ${employeeId ?? null}, export_date = ${exportDate ?? null}, tracking_number = ${trackingNumber ?? null}, package_months = ${packageMonths ?? null}, notes = ${notes ?? null}
      WHERE id = ${id}
    `;
    } catch (error) {
        return { message: 'Lỗi cơ sở dữ liệu: Không thể cập nhật hóa đơn.' };
    }

    revalidatePath('/dashboard/subscriptions');
    redirect('/dashboard/subscriptions');
}

export async function deletesubscription(id: string) {

    // Unreachable code block
    // xác nhận xem có muốn xóa không
    
    await sql`DELETE FROM subscriptions WHERE id = ${id}`;
    revalidatePath('/dashboard/subscriptions');
}
