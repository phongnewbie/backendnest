# Coding Conventions - ACTA-SOLUTION

Tài liệu này quy định các tiêu chuẩn viết code để đảm bảo tính nhất quán và chất lượng cho dự án NestJS.

## 1. Nguyên tắc chung
- **Ngôn ngữ:** Code (biến, hàm, class) viết bằng **Tiếng Anh**. Comment giải thích logic viết bằng **Tiếng Việt**.
- **Clean Code:** Tuân thủ SOLID, DRY (Don't Repeat Yourself), và KISS (Keep It Simple, Stupid).
- **Format:** Tuân thủ cấu hình trong `.prettierrc` và `.eslintrc.js`. Chạy `npm run format` trước khi commit.

## 2. Quy tắc đặt tên (Naming)
- **Classes (Controllers, Services, Modules, Entities):** `PascalCase` (VD: `PlacesService`, `AppController`).
- **Interfaces & Types:** `PascalCase` (VD: `CreatePlaceDto`). Không dùng tiền tố `I` (VD: dùng `Place` thay vì `IPlace`).
- **Variables & Functions:** `camelCase` (VD: `getPlaceById`, `isGuest`).
- **Database Tables (Prisma):** `PascalCase`, số ít (VD: `User`, `CheckIn`).
- **Files:** `kebab-case.extension` (VD: `places.service.ts`, `auth.controller.ts`).

## 3. Cấu trúc Module
Mỗi tính năng mới phải được đóng gói trong một thư mục riêng tại `src/`:
```text
src/feature-name/
├── dto/                 # Data Transfer Objects
├── feature.controller.ts
├── feature.service.ts
└── feature.module.ts
```

## 4. Error Handling
- Không sử dụng `try-catch` trống.
- Sử dụng các `Built-in HTTP Exceptions` của NestJS (VD: `NotFoundException`, `BadRequestException`).
- Luôn trả về thông báo lỗi có nghĩa bằng Tiếng Việt cho người dùng cuối nếu cần.

## 5. Prisma & Database
- Truy vấn DB phải luôn nằm trong `Service`, không viết trực tiếp trong `Controller`.
- Sử dụng `Prisma Client` thông qua `PrismaService` (Dependency Injection).
- Luôn tận dụng tính năng `include` hoặc `select` của Prisma để tránh lỗi N+1 và tối ưu hiệu suất.

## 6. Git Workflow
- **Commit message:** Tuân thủ [Conventional Commits](https://www.conventionalcommits.org/).
    - `feat:` tính năng mới.
    - `fix:` sửa lỗi.
    - `docs:` cập nhật tài liệu.
    - `refactor:` tái cấu trúc code nhưng không đổi logic.
## 7. TypeScript & Typing
- **No `any`**: Tuyệt đối KHÔNG sử dụng kiểu `any`. Sử dụng `unknown`, `generics`, hoặc định nghĩa `interface/type` cụ thể.
- **Explicit Return Types**: Luôn khai báo kiểu trả về cho các function và method.
- **Strict Mode**: Luôn bật chế độ strict trong `tsconfig.json`.

