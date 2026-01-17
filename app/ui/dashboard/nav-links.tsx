'use client';
import {
  DocumentDuplicateIcon,
  HomeIcon,
  ShoppingBagIcon,
  UserGroupIcon,
  UsersIcon,
} from '@heroicons/react/24/outline';
import clsx from 'clsx';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

// Map of links to display in the side navigation.
// Depending on the size of the application, this would be stored in a database.
const links = [
  { name: 'Trang chủ', href: '/dashboard', icon: HomeIcon, requiredRole: 'admin' },
  {
    name: 'Đăng Ký',
    href: '/dashboard/subscriptions',
    icon: DocumentDuplicateIcon,
    requiredRole: null,
  },
  { name: 'Khách hàng', href: '/dashboard/customers', icon: UserGroupIcon, requiredRole: null },
  { name: 'Sản phẩm', href: '/dashboard/products', icon: ShoppingBagIcon, requiredRole: null },
  { name: 'Nhân viên', href: '/dashboard/users', icon: UsersIcon, requiredRole: 'admin' },
];

export default function NavLinks() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const userRole = session?.user?.role;
  console.log('NavLinks User Role:', userRole);

  return (
    <>
      {links.map((link) => {
        const LinkIcon = link.icon;
        
        // Nếu link yêu cầu role cụ thể và user không có role đó, thì không hiển thị
        if (link.requiredRole && userRole !== link.requiredRole) {
          return null;
        }

        return (
          <Link
            key={link.name}
            href={link.href}
            className={clsx(
              'flex h-[48px] grow items-center justify-center gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium hover:bg-sky-100 hover:text-blue-600 md:flex-none md:justify-start md:p-2 md:px-3',
              {
                'bg-sky-100 text-blue-600': pathname === link.href,
              },
            )}
          >
            <LinkIcon className="w-6" />
            <p className="hidden md:block">{link.name}</p>
          </Link>
        );
      })}
    </>
  );
}
