'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import postgres from 'postgres';
import { z } from 'zod';

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

const CustomerFormSchema = z.object({
    id: z.string(),
    name: z.string().min(1, { message: 'Vui lòng nhập tên khách hàng.' }),
    email: z.string().email({ message: 'Vui lòng nhập email hợp lệ.' }),
    phone_number: z.string().optional(),
});

const CreateCustomer = CustomerFormSchema.omit({ id: true });
const UpdateCustomer = CustomerFormSchema.omit({ id: true });

export type CustomerState = {
    errors?: {
        name?: string[];
        email?: string[];
        phone_number?: string[];
    };
    message: string;
};

export async function createCustomer(prevState: CustomerState, formData: FormData) {
    const validatedFields = CreateCustomer.safeParse({
        name: formData.get('name'),
        email: formData.get('email'),
        phone_number: formData.get('phone_number') || undefined,
    });

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: 'Có trường không hợp lệ. Vui lòng thử lại.',
        };
    }

    const data = validatedFields.data;

    try {
        await sql`
      INSERT INTO customers (name, email, phone_number, image_url)
      VALUES (${data.name}, ${data.email}, ${data.phone_number || null}, '/customers/default.png')
    `;
    } catch (error) {
        return { message: 'Lỗi cơ sở dữ liệu: Không thể tạo khách hàng.', errors: {} };
    }

    revalidatePath('/dashboard/customers');
    redirect('/dashboard/customers');
}

export async function updateCustomer(
    id: string,
    prevState: CustomerState,
    formData: FormData,
) {
    const validatedFields = UpdateCustomer.safeParse({
        name: formData.get('name'),
        email: formData.get('email'),
        phone_number: formData.get('phone_number') || undefined,
    });

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: 'Có trường không hợp lệ. Vui lòng thử lại.',
        };
    }

    const data = validatedFields.data;

    try {
        await sql`
      UPDATE customers
      SET 
        name = ${data.name},
        email = ${data.email},
        phone_number = ${data.phone_number || null}
      WHERE id = ${id}
    `;
    } catch (error) {
        return { message: 'Lỗi cơ sở dữ liệu: Không thể cập nhật khách hàng.', errors: {} };
    }

    revalidatePath('/dashboard/customers');
    redirect('/dashboard/customers');
}

export async function deleteCustomer(id: string) {
    try {
        await sql`DELETE FROM customers WHERE id = ${id}`;
    } catch (error) {
        console.error('Database Error:', error);
    }

    revalidatePath('/dashboard/customers');
}
