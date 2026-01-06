import { checkPermission, isAdmin } from '@/app/lib/permissions';

/**
 * Ví dụ: Component chỉ hiển thị cho admin
 * Sử dụng trong server components để kiểm tra quyền
 */
export async function AdminPanel() {
  const isAdminUser = await isAdmin();

  if (!isAdminUser) {
    return (
      <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4">
        <p className="text-sm text-yellow-800">
          Bạn không có quyền truy cập vào chức năng này. Chỉ quản trị viên mới có thể xem.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">Bảng điều khiển quản trị</h2>
      <p className="text-gray-600">Chỉ admin có thể thấy nội dung này</p>
    </div>
  );
}

/**
 * Ví dụ: Component kiểm tra quyền cụ thể
 */
export async function UserManagementSection() {
  const canViewUsers = await checkPermission('canViewUsers');
  const canCreateUsers = await checkPermission('canCreateUsers');

  if (!canViewUsers) {
    return null;
  }

  return (
    <div className="space-y-4 rounded-lg border border-gray-200 p-4">
      <h3 className="font-semibold">Quản lý người dùng</h3>
      {canCreateUsers && (
        <button className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600">
          Thêm người dùng mới
        </button>
      )}
    </div>
  );
}
