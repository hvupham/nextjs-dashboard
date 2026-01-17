import { auth } from '@/app/lib/auth';

export type Role = 'admin' | 'user';

export interface Permission {
  canViewCustomers: boolean;
  canEditCustomers: boolean;
  canViewSubscriptions: boolean;
  canEditSubscriptions: boolean;
  canViewUsers: boolean;
  canCreateUsers: boolean;
  canEditUsers: boolean;
  canDeleteUsers: boolean;
  canViewProducts: boolean;
  canCreateProducts: boolean;
  canEditProducts: boolean;
  canDeleteProducts: boolean;
  canViewReports: boolean;
}

/**
 * Lấy quyền hạn dựa trên role
 */
export const getPermissions = (role: Role): Permission => {
  if (role === 'admin') {
    return {
      canViewCustomers: true,
      canEditCustomers: true,
      canViewSubscriptions: true,
      canEditSubscriptions: true,
      canViewUsers: true,
      canCreateUsers: true,
      canEditUsers: true,
      canDeleteUsers: true,
      canViewProducts: true,
      canCreateProducts: true,
      canEditProducts: true,
      canDeleteProducts: true,
      canViewReports: true,
    };
  }

  // Role: 'user' (nhân viên sale)
  return {
    canViewCustomers: true,
    canEditCustomers: true,
    canViewSubscriptions: true,
    canEditSubscriptions: true,
    canViewUsers: false,
    canCreateUsers: false,
    canEditUsers: false,
    canDeleteUsers: false,
    canViewProducts: true,
    canCreateProducts: false,
    canEditProducts: false,
    canDeleteProducts: false,
    canViewReports: false,
  };
};

/**
 * Kiểm tra xem người dùng có quyền thực hiện hành động nào đó không
 */
export const checkPermission = async (
  permission: keyof Permission
): Promise<boolean> => {
  const session = await auth();
  
  if (!session?.user) {
    return false;
  }

  const permissions = getPermissions(session.user.role as Role);
  return permissions[permission] ?? false;
};

/**
 * Kiểm tra xem người dùng có phải admin không
 */
export const isAdmin = async (): Promise<boolean> => {
  const session = await auth();
  return session?.user?.role === 'admin';
};

/**
 * Kiểm tra xem người dùng có phải user (nhân viên sale) không
 */
export const isUser = async (): Promise<boolean> => {
  const session = await auth();
  return session?.user?.role === 'user';
};
