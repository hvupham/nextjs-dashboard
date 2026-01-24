# Hướng dẫn Cài đặt SIM Card Features

## Database Migration

Để sử dụng các tính năng SIM card, bạn cần thêm các cột vào bảng `products` trong cơ sở dữ liệu PostgreSQL.

### Tùy chọn 1: Chạy Script Migration (Khuyến nghị)

```bash
npm run migrate:sim-columns
```

### Tùy chọn 2: SQL trực tiếp

Kết nối vào PostgreSQL và chạy các lệnh sau:

```sql
ALTER TABLE products
ADD COLUMN IF NOT EXISTS msn VARCHAR(255),
ADD COLUMN IF NOT EXISTS imsi VARCHAR(255),
ADD COLUMN IF NOT EXISTS carrier VARCHAR(255),
ADD COLUMN IF NOT EXISTS imei VARCHAR(255),
ADD COLUMN IF NOT EXISTS iccid VARCHAR(255),
ADD COLUMN IF NOT EXISTS device_type VARCHAR(255),
ADD COLUMN IF NOT EXISTS sim_type VARCHAR(50),
ADD COLUMN IF NOT EXISTS capacity VARCHAR(255),
ADD COLUMN IF NOT EXISTS shipping_date DATE,
ADD COLUMN IF NOT EXISTS expiration_date DATE,
ADD COLUMN IF NOT EXISTS activation_date DATE,
ADD COLUMN IF NOT EXISTS options TEXT;
```

## Thêm Script Migration vào package.json

Nếu bạn muốn chạy migration bằng npm, hãy thêm dòng này vào `package.json`:

```json
{
  "scripts": {
    "migrate:sim-columns": "ts-node migrations/add-sim-columns.ts"
  }
}
```

## Trường SIM Card

| Tên Cột | Kiểu | Mô Tả |
|---------|------|-------|
| `msn` | VARCHAR(255) | Mobile Serial Number / IMSI |
| `imsi` | VARCHAR(255) | International Mobile Subscriber Identity |
| `carrier` | VARCHAR(255) | Nhà mạng (SoftBank, DoCoMo, au) |
| `imei` | VARCHAR(255) | International Mobile Equipment Identity |
| `iccid` | VARCHAR(255) | Integrated Circuit Card Identifier |
| `device_type` | VARCHAR(255) | Loại thiết bị (SIMフリー, iPhone, etc.) |
| `sim_type` | VARCHAR(50) | Loại SIM: physical, multi, esim |
| `capacity` | VARCHAR(255) | Dung lượng (50GB, 100GB, etc.) |
| `shipping_date` | DATE | Ngày xuất kho (出荷日) |
| `expiration_date` | DATE | Ngày hết hạn (満了日) |
| `activation_date` | DATE | Ngày kích hoạt (開通日) |
| `options` | TEXT | Các tùy chọn bổ sung (オプション) |

## Sử dụng Features

### Tạo SIM Card Product

1. Vào `/dashboard/products/create`
2. Chọn loại sản phẩm: "SIM Card"
3. Điền thông tin cơ bản (Tên, Giá, Tồn kho, etc.)
4. Phần "Thông tin SIM Card" sẽ hiển thị để nhập các chi tiết SIM
5. Nhấn "Tạo sản phẩm"

### Xem Chi Tiết SIM Product

1. Vào trang Sản phẩm
2. Nhấn vào tên sản phẩm
3. Sẽ hiển thị:
   - Thẻ SIM trực quan với các thông tin chính
   - Bảng chi tiết đầy đủ thông tin
   - Thông tin giá và tồn kho

### Chỉnh Sửa SIM Product

1. Vào chi tiết sản phẩm
2. Nhấn nút "Chỉnh sửa" (biểu tượng bút chì)
3. Cập nhật thông tin SIM
4. Nhấn "Cập nhật sản phẩm"

## Format Hiển Thị

### Thẻ SIM (SIM Card Visual)

Hiển thị dạng thẻ với:
- Nhà mạng (Carrier)
- Dung lượng (Capacity)
- MSN / IMSI
- Loại SIM
- Loại thiết bị
- ICCID
- Ngày xuất kho
- Ngày hết hạn

### Bảng Chi Tiết

Danh sách đầy đủ tất cả thông tin SIM card.

### Thông Tin Giá

- Giá hàng tháng (¥)
- Tồn kho
- Trạng thái (Có sẵn / Hết hàng)

## Ghi Chú

- Tất cả các trường SIM card đều là **optional**
- Nếu database chưa có các cột, hệ thống sẽ fallback tự động
- Component sẽ xử lý gracefully nếu các trường không tồn tại
