'use client';

import { useSession } from 'next-auth/react';
import { getPermissions } from '@/app/lib/permissions';

export default function RoleBadge() {
  const { data: session } = useSession();

  if (!session?.user) {
    return null;
  }

  const roleLabel =
    session.user.role === 'admin'
      ? 'Quản trị viên'
      : session.user.role === 'user'
        ? 'Nhân viên Sale'
        : 'Người dùng';

  const bgColor =
    session.user.role === 'admin'
      ? 'bg-red-100 text-red-800'
      : 'bg-blue-100 text-blue-800';

  return (
    <div className={`inline-block rounded-full px-3 py-1 text-xs font-medium ${bgColor}`}>
      {roleLabel}
    </div>
  );
}
