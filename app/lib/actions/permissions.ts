'use server';

import { auth } from '@/app/lib/auth';
import { getPermissions, isAdmin } from '@/app/lib/permissions';

export async function getUserPermissions() {
  const session = await auth();
  
  if (!session?.user) {
    throw new Error('Không có người dùng đăng nhập');
  }

  return {
    role: session.user.role,
    permissions: getPermissions(session.user.role as 'admin' | 'user'),
  };
}

export async function requireAdmin() {
  const admin = await isAdmin();
  
  if (!admin) {
    throw new Error('Chỉ admin mới có thể thực hiện hành động này');
  }
}

export async function requireAuth() {
  const session = await auth();
  
  if (!session?.user) {
    throw new Error('Bạn cần đăng nhập để thực hiện hành động này');
  }
  
  return session.user;
}
