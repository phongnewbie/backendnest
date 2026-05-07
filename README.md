# ACTA Solution Backend - NestJS & Prisma

Dự án Backend cung cấp API cho hệ thống ACTA Solution, xây dựng trên nền tảng NestJS, Prisma và PostgreSQL.

## 🛠 Công nghệ sử dụng

- **Framework:** [NestJS](https://nestjs.com/)
- **ORM:** [Prisma](https://www.prisma.io/)
- **Database:** PostgreSQL
- **Package Manager:** Yarn
- **Documentation:** Swagger (OpenAPI)
- **Testing:** Jest

## 🚀 Hướng dẫn cài đặt

### 1. Clone project và cài đặt dependencies
```bash
yarn install
```

### 2. Cấu hình môi trường
Tạo file `.env` dựa trên file `.env.example`:
```bash
cp .env.example .env
```
Cập nhật các thông số cần thiết trong `.env`:
- `DATABASE_URL`: Đường dẫn kết nối PostgreSQL.
- `JWT_SECRET`: Khóa bí mật cho JWT.
- `PORT`: Cổng chạy ứng dụng (Mặc định: 4000).

### 3. Cấu hình Database (Prisma)
Đẩy schema lên database và tạo Prisma Client:
```bash
yarn prisma db push
# Hoặc chạy migrations nếu đã có dữ liệu quan trọng
# yarn prisma migrate dev
```

### 4. Seed dữ liệu (Tùy chọn)
Dự án có file seed để khởi tạo dữ liệu mẫu:
```bash
yarn prisma db seed
```

## 💻 Chạy ứng dụng

```bash
# Chế độ phát triển (watch mode)
yarn start:dev

# Chế độ debug
yarn start:debug

# Chế độ production
yarn start:prod
```

## 🧪 Kiểm thử (Testing)

Dự án sử dụng Repository pattern với Mock Repository giúp chạy unit tests nhanh chóng mà không cần database thật.

```bash
# Chạy tất cả tests
yarn test

# Chạy watch mode
yarn test:watch

# Xem độ bao phủ (coverage)
yarn test:cov
```

## 📖 Tài liệu API (Swagger)

Sau khi chạy ứng dụng, bạn có thể truy cập tài liệu API tại:
`http://localhost:4000/api/docs` (Thay đổi cổng nếu bạn cấu hình khác trong `.env`).

## 📁 Cấu trúc thư mục chính

- `src/auth`: Xử lý đăng ký, đăng nhập và phân quyền.
- `src/businesses`: Quản lý doanh nghiệp.
- `src/brands`: Quản lý thương hiệu.
- `src/places`: Quản lý các địa điểm/cửa hàng.
- `src/checkins`: Logic quét mã QR và check-in.
- `src/common`: Các module dùng chung (Prisma, Interceptors, Filters, Utils).
- `prisma/schema.prisma`: Định nghĩa cấu trúc Database.

## 📜 Quy chuẩn Code

- Sử dụng **Repository Pattern** để tách biệt logic nghiệp vụ và truy xuất dữ liệu.
- Sử dụng **Dependency Injection** thông qua interface tokens (ví dụ: `@Inject('IPLACES_REPOSITORY')`).
- Luôn kiểm tra tính sở hữu (Ownership) trước khi thực hiện các thao tác Update/Delete.
- Tuân thủ các quy tắc trong `CODING_CONVENTIONS.md`.

## 📄 License

Dự án này thuộc sở hữu của ACTA Solution.
