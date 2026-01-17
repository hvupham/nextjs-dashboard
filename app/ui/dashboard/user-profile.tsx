import { auth } from '@/app/lib/auth';
import { getPermissions } from '@/app/lib/permissions';
import { UserIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';
import LogoutButton from './logout-button';

export default async function UserProfile() {
  const session = await auth();
  const user = session?.user;

  if (!user) {
    return null;
  }
  console.log('User Profile User Role:', user.role);

  const permissions = getPermissions(user.role as 'admin' | 'user');
  const isAdmin = user.role === 'admin';

  return (
    <div className="mt-4 border-t border-gray-200 pt-4">
      <div className="flex items-center gap-3 rounded-md bg-blue-50 p-3">
        <div className={clsx(
          'flex h-10 w-10 items-center justify-center rounded-full text-white text-sm font-bold',
          isAdmin ? 'bg-blue-600' : 'bg-green-500'
        )}>
          <UserIcon className="h-6 w-6" />
        </div>
        <div className="hidden md:block flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-900 truncate">
            {user.name}
          </p>
          <p className={clsx(
            'text-xs font-semibold truncate',
            isAdmin ? 'text-blue-600' : 'text-green-600'
          )}>
            {isAdmin ? '👨‍💼 Admin' : '👤 User'}
          </p>
        </div>
      </div>
      <div className="mt-2">
        <LogoutButton />
      </div>
    </div>
  );
}
