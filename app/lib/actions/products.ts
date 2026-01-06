'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import postgres from 'postgres';
import { z } from 'zod';
import { requireAdmin } from '@/app/lib/actions/permissions';

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

const ProductFormSchema = z.object({
    id: z.string(),
    name: z.string().min(1, { message: 'Please enter a product name.' }),
    type: z.enum(['sim', 'pocket-wifi'], { message: 'Please select a product type.' }),
    monthly_price: z.coerce
        .number()
        .gt(0, { message: 'Please enter a price greater than 0.' }),
    description: z.string().min(1, { message: 'Please enter a description.' }),
    stock: z.coerce
        .number()
        .min(0, { message: 'Stock cannot be negative.' }),
    status: z.enum(['available', 'out-of-stock'], { message: 'Please select a status.' }),
});

const CreateProduct = ProductFormSchema.omit({ id: true });
const UpdateProduct = ProductFormSchema.omit({ id: true });

export type ProductState = {
    errors?: {
        name?: string[];
        type?: string[];
        monthly_price?: string[];
        description?: string[];
        stock?: string[];
        status?: string[];
    };
    message: string;
};

export async function createProduct(prevState: ProductState, formData: FormData) {
    await requireAdmin();
    
    const validatedFields = CreateProduct.safeParse({
        name: formData.get('name'),
        type: formData.get('type'),
        monthly_price: formData.get('monthly_price'),
        description: formData.get('description'),
        stock: formData.get('stock'),
        status: formData.get('status'),
    });

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: 'Missing Fields. Failed to Create Product.',
        };
    }

    const { name, type, monthly_price, description, stock, status } = validatedFields.data;

    try {
        await sql`
            INSERT INTO products (name, type, monthly_price, description, stock, status)
            VALUES (${name}, ${type}, ${monthly_price}, ${description}, ${stock}, ${status})
        `;
    } catch (error) {
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
        name: formData.get('name'),
        type: formData.get('type'),
        monthly_price: formData.get('monthly_price'),
        description: formData.get('description'),
        stock: formData.get('stock'),
        status: formData.get('status'),
    });

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: 'Missing Fields. Failed to Update Product.',
        };
    }

    const { name, type, monthly_price, description, stock, status } = validatedFields.data;

    try {
        await sql`
            UPDATE products
            SET name = ${name}, type = ${type}, monthly_price = ${monthly_price}, 
                description = ${description}, stock = ${stock}, status = ${status}
            WHERE id = ${id}
        `;
    } catch (error) {
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
