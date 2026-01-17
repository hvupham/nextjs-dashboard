'use server';

import bcrypt from 'bcrypt';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import postgres from 'postgres';
import { z } from 'zod';
import { requireAdmin } from '@/app/lib/actions/permissions';

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

const UserFormSchema = z.object({
    id: z.string(),
    name: z.string().min(1, { message: 'Please enter a name.' }),
    email: z.string().email({ message: 'Please enter a valid email.' }),
    password: z.string().min(6, { message: 'Password must be at least 6 characters.' }),
    role: z.enum(['admin', 'user'], { message: 'Please select a role.' }),
});

const CreateUser = UserFormSchema.omit({ id: true });
const UpdateUser = UserFormSchema.omit({ id: true, password: true });

export type UserState = {
    errors?: {
        name?: string[];
        email?: string[];
        password?: string[];
        role?: string[];
    };
    message: string;
};

export async function createUser(prevState: UserState, formData: FormData) {
    await requireAdmin();
    
    const validatedFields = CreateUser.safeParse({
        name: formData.get('name'),
        email: formData.get('email'),
        password: formData.get('password'),
        role: formData.get('role'),
    });

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: 'Missing Fields. Failed to Create User.',
        };
    }

    const { name, email, password, role } = validatedFields.data;
    const hashedPassword = await bcrypt.hash(password, 10);

    try {
        await sql`
            INSERT INTO users (name, email, password, role)
            VALUES (${name}, ${email}, ${hashedPassword}, ${role})
        `;
    } catch (error) {
        return {
            message: 'Database Error: Failed to Create User.',
        };
    }

    revalidatePath('/dashboard/users');
    redirect('/dashboard/users');
}

export async function updateUser(
    id: string,
    prevState: UserState,
    formData: FormData,
) {
    await requireAdmin();
    
    const validatedFields = UpdateUser.safeParse({
        name: formData.get('name'),
        email: formData.get('email'),
        role: formData.get('role'),
    });

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: 'Missing Fields. Failed to Update User.',
        };
    }

    const { name, email, role } = validatedFields.data;

    try {
        await sql`
            UPDATE users
            SET name = ${name}, email = ${email}, role = ${role}
            WHERE id = ${id}
        `;
    } catch (error) {
        return { message: 'Database Error: Failed to Update User.' };
    }

    revalidatePath('/dashboard/users');
    redirect('/dashboard/users');
}

export async function deleteUser(id: string) {
    await requireAdmin();
    
    try {
        await sql`DELETE FROM users WHERE id = ${id}`;
        revalidatePath('/dashboard/users');
    } catch (error) {
        throw new Error('Failed to Delete User.');
    }
}

export async function fetchUsersByIds(ids: string[]) {
    try {
        const users = await sql`
            SELECT * FROM users WHERE id = ANY(${ids})
        `;
        return users;
    } catch (error) {
        throw new Error('Failed to Fetch Users.');
    }
}