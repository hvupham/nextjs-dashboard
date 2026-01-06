# Hướng dẫn Phân Quyền (RBAC) - Next.js Dashboard

## Tổng Quan

Hệ thống dashboard hỗ trợ 2 role:
- **admin**: Quản trị viên - Có quyền truy cập đầy đủ vào tất cả tính năng
- **user**: Nhân viên Sale - Chỉ có quyền truy cập khách hàng, đơn hàng, và xem sản phẩm

## Cấu Trúc Quyền Hạn

### Admin có thể:
- ✅ Xem/Quản lý người dùng
- ✅ Tạo/Sửa/Xóa sản phẩm
- ✅ Xem báo cáo doanh thu
- ✅ Quản lý khách hàng
- ✅ Quản lý đơn hàng

### User (Nhân viên Sale) có thể:
- ✅ Xem/Quản lý khách hàng
- ✅ Xem/Quản lý đơn hàng
- ✅ Xem sản phẩm
- ❌ Không được tạo/sửa/xóa sản phẩm
- ❌ Không được xem báo cáo
- ❌ Không được quản lý người dùng

## Các File Liên Quan

### 1. **middleware.ts** - Bảo vệ route cấp middleware
```typescript
// Kiểm tra admin-only routes
const ADMIN_ONLY_ROUTES = [
  '/dashboard/users',
  '/dashboard/products',
];

// Nếu user không phải admin, sẽ redirect về /dashboard
```

### 2. **auth.config.ts** - Cấu hình authorization callbacks
```typescript
// Kiểm tra role trong authorized callback
if (isOnAdminRoute && auth?.user?.role !== 'admin') {
  return false; // Redirect non-admin users
}
```

### 3. **app/lib/permissions.ts** - Utility functions cho quyền hạn
- `getPermissions(role)` - Lấy tất cả quyền dựa trên role
- `checkPermission(permission)` - Kiểm tra quyền cụ thể (async)
- `isAdmin()` - Kiểm tra admin (async)
- `isUser()` - Kiểm tra user (async)

### 4. **app/lib/actions/permissions.ts** - Server actions
- `getUserPermissions()` - Lấy quyền của user hiện tại
- `requireAdmin()` - Yêu cầu quyền admin (throw error nếu không)

### 5. **app/ui/dashboard/nav-links.tsx** - Navigation với điều kiện role
```typescript
// Chỉ hiển thị "Người dùng" cho admin
{ name: 'Người dùng', href: '/dashboard/users', icon: UsersIcon, requiredRole: 'admin' }
```

## Cách Sử Dụng

### 1. Kiểm tra quyền trong Server Component

```typescript
import { checkPermission, isAdmin } from '@/app/lib/permissions';

export default async function DashboardPage() {
  const canViewUsers = await checkPermission('canViewUsers');
  
  if (!canViewUsers) {
    return <div>Bạn không có quyền truy cập trang này</div>;
  }

  return <UsersTable />;
}
```

### 2. Kiểm tra quyền trong Server Action

```typescript
'use server';

import { requireAdmin } from '@/app/lib/actions/permissions';

export async function deleteUser(id: string) {
  await requireAdmin(); // Throw error nếu không phải admin
  
  // Tiến hành xóa người dùng
  await sql`DELETE FROM users WHERE id = ${id}`;
}
```

### 3. Hiển thị/Ẩn UI dựa trên Role (Client Component)

```typescript
'use client';

import { useSession } from 'next-auth/react';

export default function AdminPanel() {
  const { data: session } = useSession();

  // Chỉ hiển thị cho admin
  if (session?.user?.role !== 'admin') {
    return null;
  }

  return <AdminContent />;
}
```

### 4. Navigation Links có điều kiện

```typescript
// Định nghĩa link với requiredRole
const links = [
  { name: 'Khách hàng', href: '/dashboard/customers', requiredRole: null }, // Tất cả đều thấy
  { name: 'Người dùng', href: '/dashboard/users', requiredRole: 'admin' },  // Chỉ admin
];

// Trong component
if (link.requiredRole && userRole !== link.requiredRole) {
  return null; // Không hiển thị link
}
```

## Ví dụ Thực Tế

### Ví dụ 1: Tạo trang Users (chỉ admin)

**app/dashboard/users/page.tsx**
```typescript
import { checkPermission } from '@/app/lib/permissions';
import UsersTable from '@/app/ui/users/table';

export default async function UsersPage() {
  const canViewUsers = await checkPermission('canViewUsers');
  
  if (!canViewUsers) {
    return (
      <div className="rounded bg-red-100 p-4 text-red-800">
        Bạn không có quyền xem danh sách người dùng
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold">Quản lý người dùng</h1>
      <UsersTable />
    </div>
  );
}
```

### Ví dụ 2: Server Action với yêu cầu admin

**app/lib/actions/products.ts**
```typescript
'use server';

import { requireAdmin } from '@/app/lib/actions/permissions';

export async function deleteProduct(id: string) {
  // Sẽ throw error nếu user không phải admin
  await requireAdmin();
  
  // Xóa product
  await sql`DELETE FROM products WHERE id = ${id}`;
  
  revalidatePath('/dashboard/products');
}
```

### Ví dụ 3: Nút Edit/Delete có điều kiện

**app/ui/products/buttons.tsx**
```typescript
'use client';

import { useSession } from 'next-auth/react';

export function ProductActions({ productId }: { productId: string }) {
  const { data: session } = useSession();
  const isAdmin = session?.user?.role === 'admin';

  return (
    <div className="flex gap-2">
      {isAdmin && (
        <>
          <button onClick={() => editProduct(productId)}>Sửa</button>
          <button onClick={() => deleteProduct(productId)}>Xóa</button>
        </>
      )}
    </div>
  );
}
```

## Kiểm Tra & Debugging

### 1. Kiểm tra role của user hiện tại
```typescript
const { data: session } = useSession();
console.log('Current user role:', session?.user?.role);
```

### 2. Lấy tất cả quyền
```typescript
'use client';

import { getPermissions } from '@/app/lib/permissions';

const permissions = getPermissions('admin');
console.log('Admin permissions:', permissions);
```

### 3. Test middleware protection
- Đăng nhập với role `user`
- Cố gắng truy cập `/dashboard/users`
- Phải redirect về `/dashboard`

## Mở Rộng Hệ Thống

Để thêm quyền mới:

1. **Thêm vào `Permission` interface** (app/lib/permissions.ts):
```typescript
export interface Permission {
  // ... quyền hiện tại
  canExportData: boolean;
}
```

2. **Cập nhật `getPermissions()`**:
```typescript
if (role === 'admin') {
  return {
    // ...
    canExportData: true,
  };
}

// user role
return {
  // ...
  canExportData: false,
};
```

3. **Sử dụng quyền mới**:
```typescript
const canExport = await checkPermission('canExportData');
```

## Lưu Ý Bảo Mật

1. **Luôn kiểm tra quyền ở phía server** - Không chỉ rely trên client-side checks
2. **Sử dụng `requireAdmin()`** trong server actions vô cùng quan trọng
3. **Middleware.ts** chỉ cung cấp lớp bảo vệ đầu tiên
4. **Luôn validate trên database level** nếu có thể

## Troubleshooting

### User không thấy link
- Kiểm tra `requiredRole` trong `nav-links.tsx`
- Kiểm tra session trả về đúng role

### Permission denied error
- Đảm bảo đã gọi `await requireAdmin()` đúng cách
- Kiểm tra role của user trong database

### Route không được bảo vệ
- Kiểm tra `middleware.ts` có đang chạy không
- Xác minh `ADMIN_ONLY_ROUTES` bao gồm route cần bảo vệ
