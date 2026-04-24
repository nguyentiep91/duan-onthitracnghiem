# Nền tảng Ôn thi Trắc nghiệm Trực tuyến (MVP)

Dự án Next.js App Router mở rộng từ landing page sẵn có, bổ sung đầy đủ luồng MVP cho hệ thống ôn thi:

- Đăng ký `/register`, đăng nhập `/login`, đăng xuất.
- Dashboard phân luồng `/dashboard` theo role: `admin`, `teacher`, `student`.
- Trang học viên `/student`.
- Trang quản trị `/admin`.
- Quản lý khóa học `/admin/courses`.
- Quản lý ngân hàng câu hỏi `/admin/questions` (câu hỏi + A/B/C/D + đáp án đúng + giải thích).
- Bảo vệ route bằng middleware.
- Tích hợp Supabase Auth + Supabase Database qua REST API.
- Server Actions cho các thao tác ghi dữ liệu.
- Validation theo schema kiểu Zod (`lib/zod.ts`).

## Cấu trúc mới quan trọng

- `app/actions.ts`: Server Actions cho auth + admin CRUD.
- `app/register`, `app/login`, `app/dashboard`, `app/student`, `app/admin/*`: các route MVP.
- `middleware.ts`: bảo vệ `/dashboard`, `/student`, `/admin`.
- `lib/supabase.ts`: helper tích hợp Supabase Auth/Database.
- `supabase/migrations/001_mvp.sql`: migration cho profiles/courses/questions + RLS.
- `.env.example`: biến môi trường cần thiết.

## 1) Cấu hình Supabase

### Bước 1: Tạo project Supabase

Tạo project mới tại Supabase dashboard và lấy:

- `Project URL`
- `anon public key`

### Bước 2: Tạo biến môi trường

Copy `.env.example` thành `.env.local`:

```bash
cp .env.example .env.local
```

Điền giá trị thật:

```env
NEXT_PUBLIC_SUPABASE_URL=https://<project-ref>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-anon-key>
```

### Bước 3: Chạy migration SQL

Vào SQL Editor của Supabase, chạy toàn bộ nội dung file:

- `supabase/migrations/001_mvp.sql`

Migration sẽ tạo:

- `profiles` (role-based)
- `courses`
- `questions`
- trigger tạo profile khi user đăng ký
- RLS policies cho role `admin/teacher/student`

## 2) Chạy local

```bash
npm install
npm run dev
```

Mở `http://localhost:3000`.

## 3) Build production

```bash
npm run build
npm start
```

## 4) Deploy Vercel

1. Push code lên GitHub.
2. Import repo vào Vercel.
3. Trong Vercel Project Settings → Environment Variables, thêm:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Redeploy.

## 5) Gợi ý vận hành role

- User đăng ký mới mặc định role `student`.
- Để cấp `teacher` hoặc `admin`, cập nhật cột `profiles.role` trong Supabase SQL Editor:

```sql
update public.profiles
set role = 'admin'
where id = '<user-id>';
```

## Lưu ý

- Landing page gốc tại `/` vẫn được giữ nguyên và chỉ mở rộng thêm liên kết auth.
- Dự án không tái tạo từ đầu, chỉ mở rộng trên codebase hiện có.
