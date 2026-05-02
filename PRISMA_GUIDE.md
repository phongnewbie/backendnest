# Hướng dẫn sử dụng Prisma - ACTA-SOLUTION

Tài liệu này tổng hợp các lệnh Prisma quan trọng để quản lý cơ sở dữ liệu cho dự án.

## 1. Thiết lập ban đầu
Sau khi cấu hình `DATABASE_URL` trong file `.env`:

```bash
# Tạo các bảng trong DB dựa trên schema.prisma
npx prisma migrate dev --name init

# Tạo Prisma Client (để sử dụng trong code NestJS)
npx prisma generate
```

## 2. Phát triển (Development Workflow)
Mỗi khi bạn thay đổi file `prisma/schema.prisma`:

```bash
# 1. Tạo migration mới và cập nhật DB
npx prisma migrate dev --name <ten_thay_doi>

# 2. (Tùy chọn) Nếu DB bị lỗi/rác, muốn xóa sạch và làm lại từ đầu
npx prisma migrate reset
```

## 3. Quản lý Dữ liệu
```bash
# Nạp dữ liệu mẫu (Seed) từ prisma/seed.ts
npx prisma db seed

# Mở giao diện Web để xem/sửa dữ liệu trực quan
npx prisma studio
```

## 4. Lưu ý quan trọng
- Luôn chạy `npx prisma generate` sau khi `migrate` hoặc cài đặt lại `node_modules`.
- Không chỉnh sửa trực tiếp dữ liệu trong DB bằng SQL nếu có thể dùng `Prisma Studio` để tránh làm lệch cấu trúc migration.
- Với Prisma 7+, cấu hình datasource được ưu tiên quản lý tại `prisma.config.ts`.
