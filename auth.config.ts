import type { NextAuthConfig } from 'next-auth';

export const authConfig = {
    pages: {
        signIn: '/login',
    },
    callbacks: {
        authorized({ auth, request: { nextUrl } }) {
            const isLoggedIn = !!auth?.user;
            const isOnDashboard = nextUrl.pathname.startsWith('/dashboard');
            const isOnAdminRoute = nextUrl.pathname.startsWith('/dashboard/users') || 
                                   nextUrl.pathname.startsWith('/dashboard/products');
            
            if (isOnDashboard) {
                if (!isLoggedIn) return false; // Redirect unauthenticated users to login page
                
                // Kiểm tra admin routes
                if (isOnAdminRoute && auth?.user?.role !== 'admin') {
                    return false; // Redirect non-admin users
                }
                
                return true;
            } else if (isLoggedIn) {
                return Response.redirect(new URL('/dashboard', nextUrl));
            }
            return true;
        },
    },
    providers: [], // Add providers with an empty array for now
} satisfies NextAuthConfig;