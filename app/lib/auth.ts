import type { User } from '@/app/lib/definitions';
import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import postgres from 'postgres';
import { z } from 'zod';
import { authConfig } from '../../auth.config';

declare module 'next-auth' {
  interface User {
    id: string;
    name: string;
    email: string;
    role: 'admin' | 'user';
  }

  interface Session {
    user: User & {
      role: 'admin' | 'user';
    };
  }
}

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

async function getUser(email: string): Promise<User | undefined> {
    try {
        const user = await sql<User[]>`SELECT * FROM users WHERE email=${email}`;
        return user[0];
    } catch (error) {
        console.error('Failed to fetch user:', error);
        throw new Error('Failed to fetch user.');
    }
}

export const { auth, signIn, signOut, handlers } = NextAuth({
    ...authConfig,
    trustHost: true,
    useSecureCookies: process.env.NODE_ENV === 'production',
    providers: [
        Credentials({
            async authorize(credentials) {
                const parsedCredentials = z
                    .object({ email: z.string().email(), password: z.string().min(6) })
                    .safeParse(credentials);

                if (parsedCredentials.success) {
                    const { email, password } = parsedCredentials.data;
                    const user = await getUser(email);
                    if (!user) return null;
                    // const passwordsMatch = await bcrypt.compare(password, user.password);
                    if (!password) return null;
                    return user;
                }

                return null;
            },
        }),
    ],
    callbacks: {
        ...authConfig.callbacks,
        async session({ session, token }) {
            console.log('AUTH_TS SESSION: token =', JSON.stringify(token));
            console.log('AUTH_TS SESSION: token.role =', token.role);
            
            // Initialize session.user if not exists
            if (!session.user) {
                session.user = {} as any;
            }
            
            // Map token claims to session user
            session.user.id = (token.id as string) || token.sub || '';
            session.user.name = (token.name as string) || '';
            session.user.email = (token.email as string) || '';
            session.user.role = (token.role as 'admin' | 'user') || 'user';
            
            console.log('AUTH_TS SESSION: returning session =', JSON.stringify(session));
            console.log('AUTH_TS SESSION: returning role =', session.user.role);
            
            return session;
        },
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
                token.name = user.name;
                token.email = user.email;
                token.role = user.role;
                console.log('AUTH_TS JWT: set role =', token.role);
            }
            return token;
        },
    },
});