# Cập Nhật Trạng Thái SIM Card

## Tóm Tắt Thay Đổi

Đã thêm hỗ trợ cho các trạng thái SIM card vào hệ thống quản lý sản phẩm.

## Trạng Thái SIM Card Mới

| Trạng Thái | Icon | Mô Tả |
|----------|------|-------|
| **Active** | 🟢 | Hoạt động - SIM đang hoạt động bình thường |
| **Not Activated** | 🔵 | Chưa kích hoạt - SIM chưa được kích hoạt |
| **Resetting** | 🔄 | Đang làm lại - Đang thực hiện reset SIM |
| **In Stock** | 📦 | Tồn kho - SIM còn tồn kho, chưa bán |
| **Suspended** | 🔴 | Tạm dừng - SIM bị tạm dừng dịch vụ |

## Các File Cập Nhật

### 1. Type Definitions
- **File**: `app/lib/definitions.ts`
- **Thay Đổi**: Thêm field `sim_status` vào `Product`, `ProductsTable`, `ProductForm`
- **Kiểu**: `'active' | 'not-activated' | 'resetting' | 'in-stock' | 'suspended'`

### 2. Database Actions
- **File**: `app/lib/actions/products.ts`
- **Thay Đổi**:
  - Thêm `sim_status` vào schema validation
  - Cập nhật `createProduct` function
  - Cập nhật `updateProduct` function
  - Thêm `sim_status` vào `ProductState` error handling

### 3. Database Queries
- **File**: `app/lib/data/products.ts`
- **Thay Đổi**:
  - `fetchProducts`: Thêm `sim_status` vào SELECT
  - `fetchProductById`: Thêm `sim_status` vào SELECT
  - Fallback queries hỗ trợ nếu cột chưa tồn tại

### 4. Migration Script
- **File**: `migrations/add-sim-columns.ts`
- **Thay Đổi**: Thêm `sim_status VARCHAR(50)` vào migration

### 5. Form Tạo Sản Phẩm
- **File**: `app/ui/products/create-form-sim.tsx`
- **Thay Đổi**: Thêm select dropdown cho `sim_status`

### 6. Form Chỉnh Sửa Sản Phẩm
- **File**: `app/ui/products/edit-form-sim.tsx`
- **Thay Đổi**: Thêm select dropdown cho `sim_status` với giá trị pre-filled

### 7. Component Chi Tiết SIM
- **File**: `app/ui/products/sim-card-detail.tsx`
- **Thay Đổi**:
  - Hiển thị trạng thái SIM trong bảng chi tiết
  - Thêm helper function `getSIMStatusLabel()` để format trạng thái với icon

## Sử Dụng

### Khi Tạo Sản Phẩm SIM
1. Vào `/dashboard/products/create`
2. Chọn loại sản phẩm: **SIM Card**
3. Trong phần "Thông tin SIM Card", chọn trạng thái từ dropdown:
   - 🟢 Hoạt động (Active)
   - 🔵 Chưa kích hoạt (Not Activated)
   - 🔄 Đang làm lại (Resetting)
   - 📦 Tồn kho (In Stock) - *mặc định*
   - 🔴 Tạm dừng (Suspended)

### Khi Xem Chi Tiết SIM
- Trạng thái SIM sẽ hiển thị trong bảng "Chi tiết thông tin"
- Format: `[Icon] [Tên trạng thái]`
- Ví dụ: `🟢 Hoạt động`

### Khi Chỉnh Sửa SIM
1. Vào trang chi tiết sản phẩm
2. Nhấn nút "Chỉnh sửa"
3. Trong phần SIM Card, cập nhật trạng thái nếu cần
4. Nhấn "Cập nhật sản phẩm"

## Database Migration

Chạy migration để thêm cột `sim_status` vào database:

```bash
npx ts-node migrations/add-sim-columns.ts
```

Hoặc SQL trực tiếp:

```sql
ALTER TABLE products
ADD COLUMN IF NOT EXISTS sim_status VARCHAR(50);
```

## Build Status

✅ Build thành công
✅ Không có TypeScript errors
✅ Tất cả routes được render thành công

## Ghi Chú

- Trạng thái SIM là **optional** (có thể để trống)
- Mặc định khi tạo: `in-stock` (Tồn kho)
- Có thể thay đổi trạng thái bất cứ lúc nào
- Trạng thái không ảnh hưởng đến trạng thái sản phẩm chung (`available`/`out-of-stock`)
