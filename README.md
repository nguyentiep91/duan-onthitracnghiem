# Nền tảng Ôn thi Trắc nghiệm Trực tuyến (MVP - Next.js + Supabase)

Dự án đang ở giai đoạn MVP với mục tiêu chạy thực tế:

- Đăng ký / đăng nhập / đăng xuất bằng Supabase Auth.
- Phân quyền `admin`, `teacher`, `student` qua bảng `profiles`.
- Dashboard phân luồng theo quyền:
  - `/dashboard` tự điều hướng
  - `/admin` cho admin
  - `/student` cho học viên
- Quản lý khóa học cơ bản: `/admin/courses`.
- Quản lý ngân hàng câu hỏi cơ bản + tạo câu hỏi thủ công: `/admin/questions`.
- Middleware bảo vệ route dashboard/admin.

> Landing page ban đầu vẫn được giữ tại `/`.

---

## 1) Công nghệ

- Next.js App Router + TypeScript
- Supabase Auth + PostgreSQL
- Server Actions cho nghiệp vụ tạo khóa học/câu hỏi và auth form
- Zod để validate dữ liệu đầu vào

## 2) Thiết lập biến môi trường

Copy file mẫu:

```bash
cp .env.example .env.local
```

Điền giá trị từ Supabase Project Settings -> API:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## 3) Tạo Supabase project & chạy migration

1. Tạo project mới tại Supabase.
2. Mở SQL Editor và chạy file:

```sql
supabase/migrations/001_mvp.sql
```

Migration sẽ tạo các bảng yêu cầu:
- `profiles`
- `courses`
- `question_categories`
- `questions`
- `answers`
- `exams`
- `exam_questions`
- `exam_attempts`
- `exam_attempt_answers`

Kèm theo:
- Trigger tự tạo `profiles` khi user đăng ký.
- RLS policies cho bảo mật truy cập dữ liệu theo role.

## 4) Chạy local

```bash
npm install
npm run dev
```

Build production:

```bash
npm run build
npm start
```

## 5) Tạo tài khoản admin đầu tiên

Sau khi đăng ký user đầu tiên, vào SQL Editor chạy:

```sql
update public.profiles
set role = 'admin'
where id = '<USER_UUID>';
```

`USER_UUID` lấy trong bảng `auth.users` hoặc `public.profiles`.

## 6) Các route chính

- `/` landing page
- `/login`
- `/register`
- `/dashboard`
- `/student`
- `/admin`
- `/admin/courses`
- `/admin/questions`

## 7) Ghi chú bảo mật

- Các route dashboard/admin được middleware kiểm tra session.
- Người không đăng nhập truy cập route bảo vệ sẽ bị chuyển về `/login`.
- Người không phải admin không vào được `/admin`.
- Tất cả form quan trọng đều qua server actions + validate Zod + RLS ở DB.
