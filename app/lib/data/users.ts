import postgres from 'postgres';
import { UsersTable } from '../definitions';

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

export async function fetchUsers(
    sortBy: string = 'name',
    sortOrder: 'ASC' | 'DESC' = 'ASC',
): Promise<UsersTable[]> {
    try {
        const validSortFields = ['name', 'email', 'role'];
        const sortField = validSortFields.includes(sortBy) ? sortBy : 'name';

        const data = await sql<UsersTable[]>`
      SELECT id, name, email, role
      FROM users
      ORDER BY ${sql(sortField)} ${sql.unsafe(sortOrder)}
    `;
        return data;
    } catch (error) {
        console.error('Database Error:', error);
        throw new Error('Failed to fetch users.');
    }
}

export async function fetchUserById(id: string) {
    try {
        const data = await sql<UsersTable[]>`
      SELECT id, name, email, role
      FROM users
      WHERE id = ${id}
    `;
        return data[0];
    } catch (error) {
        console.error('Database Error:', error);
        throw new Error('Failed to fetch user.');
    }
}
