import { auth } from '@/app/lib/auth';
import { NextRequest, NextResponse } from 'next/server';

// Routes mà chỉ admin có thể truy cập
const ADMIN_ONLY_ROUTES = [
  '/dashboard/users',
  '/dashboard/products',
];

// Routes mà tất cả người dùng đã đăng nhập có thể truy cập
const PROTECTED_ROUTES = [
  '/dashboard/customers',
  '/dashboard/subscriptions',
];

export async function middleware(request: NextRequest) {
  const session = await auth();
  const pathname = request.nextUrl.pathname;

  // Kiểm tra admin-only routes
  if (ADMIN_ONLY_ROUTES.some(route => pathname.startsWith(route))) {
    if (!session?.user) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
    
    if (session.user.role !== 'admin') {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
  }

  // Kiểm tra protected routes
  if (PROTECTED_ROUTES.some(route => pathname.startsWith(route))) {
    if (!session?.user) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*'],
};
