'use server';

import { requireAdmin } from '@/app/lib/actions/permissions';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import postgres from 'postgres';
import { z } from 'zod';

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

const ProductFormSchema = z.object({
    id: z.string(),
    monthly_price: z.coerce
        .number()
        .gt(0, { message: 'Please enter a price greater than 0.' }),
    description: z.string().optional().default(''),
    stock: z.coerce
        .number()
        .min(0, { message: 'Stock cannot be negative.' }),
    status: z.enum(['available', 'out-of-stock'], { message: 'Please select a status.' }),
    // SIM Card fields
    msn: z.string().nullish().default(null),
    imsi: z.string().nullish().default(null),
    carrier: z.string().nullish().default(null),
    imei: z.string().nullish().default(null),
    iccid: z.string().nullish().default(null),
    device_type: z.string().nullish().default(null),
    sim_type: z.enum(['physical', 'multi', 'esim']).nullish().default(null),
    capacity: z.string().nullish().default(null),
    shipping_date: z.string().nullish().default(null),
    expiration_date: z.string().nullish().default(null),
    activation_date: z.string().nullish().default(null),
    options: z.string().nullish().default(null),
    sim_status_id: z.preprocess(
        (val) => {
            if (val === '' || val === null || val === undefined) return undefined;
            return Number(val);
        },
        z.number().int().optional()
    ),
    current_month_usage: z.string().nullish().default(null),
    previous_month_usage: z.string().nullish().default(null),
});

const CreateProduct = ProductFormSchema.omit({ id: true });
const UpdateProduct = ProductFormSchema.omit({ id: true });

export type ProductState = {
    errors?: {
        monthly_price?: string[];
        description?: string[];
        stock?: string[];
        status?: string[];
        msn?: string[];
        imsi?: string[];
        carrier?: string[];
        imei?: string[];
        iccid?: string[];
        device_type?: string[];
        sim_type?: string[];
        capacity?: string[];
        shipping_date?: string[];
        expiration_date?: string[];
        activation_date?: string[];
        options?: string[];
        sim_status_id?: string[];
        current_month_usage?: string[];
        previous_month_usage?: string[];
    };
    message: string;
};

export async function createProduct(prevState: ProductState, formData: FormData) {
    await requireAdmin();
    
    const validatedFields = CreateProduct.safeParse({
        monthly_price: formData.get('monthly_price'),
        description: formData.get('description'),
        stock: formData.get('stock'),
        status: formData.get('status'),
        msn: formData.get('msn'),
        imsi: formData.get('imsi'),
        carrier: formData.get('carrier'),
        imei: formData.get('imei'),
        iccid: formData.get('iccid'),
        device_type: formData.get('device_type'),
        sim_type: formData.get('sim_type'),
        capacity: formData.get('capacity'),
        shipping_date: formData.get('shipping_date'),
        expiration_date: formData.get('expiration_date'),
        activation_date: formData.get('activation_date'),
        options: formData.get('options'),
        sim_status_id: formData.get('sim_status_id'),
        current_month_usage: formData.get('current_month_usage'),
        previous_month_usage: formData.get('previous_month_usage'),
    });

    if (!validatedFields.success) {
        console.error('Validation errors:', validatedFields.error.flatten().fieldErrors);
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: 'Missing Fields. Failed to Create Product.',
        };
    }

    const {
        monthly_price, 
        description, 
        stock, 
        status,
        msn,
        imsi,
        carrier,
        imei,
        iccid,
        device_type,
        sim_type,
        capacity,
        shipping_date,
        expiration_date,
        activation_date,
        options,
        sim_status_id,
        current_month_usage,
        previous_month_usage,
    } = validatedFields.data;

    try {
        await sql`
            INSERT INTO products (
                monthly_price, description, stock, status,
                msn, imsi, carrier, imei, iccid, device_type, sim_type,
                capacity, shipping_date, expiration_date, activation_date, options, sim_status_id,
                current_month_usage, previous_month_usage
            )
            VALUES (
                ${monthly_price}, ${description}, ${stock}, ${status},
                ${msn || null}, ${imsi || null}, ${carrier || null}, ${imei || null},
                ${iccid || null}, ${device_type || null}, ${sim_type || null},
                ${capacity || null}, ${shipping_date || null}, ${expiration_date || null},
                ${activation_date || null}, ${options || null}, ${sim_status_id || null},
                ${current_month_usage || null}, ${previous_month_usage || null}
            )
        `;
    } catch (error) {
        console.error('Database Error:', error);
        return {
            message: 'Database Error: Failed to Create Product.',
        };
    }

    revalidatePath('/dashboard/products');
    redirect('/dashboard/products');
}

export async function updateProduct(
    id: string,
    prevState: ProductState,
    formData: FormData,
) {
    await requireAdmin();
    
    const validatedFields = UpdateProduct.safeParse({
        monthly_price: formData.get('monthly_price'),
        description: formData.get('description'),
        stock: formData.get('stock'),
        status: formData.get('status'),
        msn: formData.get('msn'),
        imsi: formData.get('imsi'),
        carrier: formData.get('carrier'),
        imei: formData.get('imei'),
        iccid: formData.get('iccid'),
        device_type: formData.get('device_type'),
        sim_type: formData.get('sim_type'),
        capacity: formData.get('capacity'),
        shipping_date: formData.get('shipping_date'),
        expiration_date: formData.get('expiration_date'),
        activation_date: formData.get('activation_date'),
        options: formData.get('options'),
        sim_status_id: formData.get('sim_status_id'),
        current_month_usage: formData.get('current_month_usage'),
        previous_month_usage: formData.get('previous_month_usage'),
    });

    if (!validatedFields.success) {
        console.error('Validation errors:', validatedFields.error.flatten().fieldErrors);
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: 'Missing Fields. Failed to Update Product.',
        };
    }

    const { 
        monthly_price, 
        description, 
        stock, 
        status,
        msn,
        imsi,
        carrier,
        imei,
        iccid,
        device_type,
        sim_type,
        capacity,
        shipping_date,
        expiration_date,
        activation_date,
        options,
        sim_status_id,
        current_month_usage,
        previous_month_usage,
    } = validatedFields.data;

    try {
        await sql`
            UPDATE products
            SET monthly_price = ${monthly_price}, 
                description = ${description}, stock = ${stock}, status = ${status},
                msn = ${msn || null}, imsi = ${imsi || null}, carrier = ${carrier || null},
                imei = ${imei || null}, iccid = ${iccid || null}, device_type = ${device_type || null},
                sim_type = ${sim_type || null}, capacity = ${capacity || null},
                shipping_date = ${shipping_date || null}, expiration_date = ${expiration_date || null},
                activation_date = ${activation_date || null}, options = ${options || null},
                sim_status_id = ${sim_status_id || null}, current_month_usage = ${current_month_usage || null},
                previous_month_usage = ${previous_month_usage || null}
            WHERE id = ${id}
        `;
    } catch (error) {
        console.error('Database Error:', error);
        return { message: 'Database Error: Failed to Update Product.' };
    }

    revalidatePath('/dashboard/products');
    redirect('/dashboard/products');
}

export async function deleteProduct(id: string) {
    await requireAdmin();
    
    try {
        await sql`DELETE FROM products WHERE id = ${id}`;
        revalidatePath('/dashboard/products');
    } catch (error) {
        throw new Error('Failed to Delete Product.');
    }
}
export async function updateProductCustomer(productId: string, customerId: string | null) {
    try {
        await requireAdmin();
    } catch (error) {
        redirect('/login');
    }

    if (!productId) {
        throw new Error('Product ID is required');
    }

    try {
        if (customerId === '' || customerId === null) {
            // Clear customer
            await sql`UPDATE products SET customer_id = NULL WHERE id = ${productId}`;
        } else {
            // Assign customer
            await sql`UPDATE products SET customer_id = ${customerId} WHERE id = ${productId}`;
        }
        revalidatePath(`/dashboard/products/${productId}`);
        revalidatePath('/dashboard/products');
        return { success: true };
    } catch (error) {
        console.error('Failed to update product customer:', error);
        throw new Error('Failed to update product customer.');
    }
}