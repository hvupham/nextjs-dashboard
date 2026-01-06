# Role-Based Access Control (RBAC)

Hệ thống dashboard hỗ trợ 2 role: **admin** và **user** (nhân viên sale).

## Quick Start

### Admin Role
- Quản lý người dùng, sản phẩm, và báo cáo
- Routes: `/dashboard/users`, `/dashboard/products`

### User Role  
- Quản lý khách hàng và đơn hàng
- Xem sản phẩm (không được edit)

## Core Files

- `middleware.ts` - Route protection
- `auth.config.ts` - Authorization config
- `app/lib/permissions.ts` - Permission utilities
- `app/ui/dashboard/nav-links.tsx` - Conditional navigation

## Usage Examples

### Server Component
```typescript
import { checkPermission } from '@/app/lib/permissions';

export default async function Page() {
  const canViewUsers = await checkPermission('canViewUsers');
  if (!canViewUsers) return <div>Access denied</div>;
  return <UsersTable />;
}
```

### Server Action
```typescript
import { requireAdmin } from '@/app/lib/actions/permissions';

export async function deleteUser(id: string) {
  await requireAdmin();
  // Delete user...
}
```

### Client Component
```typescript
const { data: session } = useSession();
if (session?.user?.role === 'admin') {
  return <AdminPanel />;
}
```

## Permission Model

| Action | Admin | User |
|--------|-------|------|
| View Users | ✅ | ❌ |
| View Customers | ✅ | ✅ |
| Edit Customers | ✅ | ✅ |
| View Subscriptions | ✅ | ✅ |
| Edit Subscriptions | ✅ | ✅ |
| View Products | ✅ | ✅ |
| Create/Edit Products | ✅ | ❌ |
| View Reports | ✅ | ❌ |

## See Also

- `.github/copilot-instructions.md` - AI coding instructions
- `RBAC_GUIDE.md` - Detailed RBAC documentation
