'use client';

import { logout } from '@/app/lib/actions/auth';
import { ArrowRightOnRectangleIcon } from '@heroicons/react/24/outline';

export default function LogoutButton() {
  return (
    <button
      onClick={() => logout()}
      className="w-full flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-md transition"
      title="Đăng xuất"
    >
      <ArrowRightOnRectangleIcon className="h-4 w-4" />
      <span className="hidden md:inline">Đăng xuất</span>
    </button>
  );
}
