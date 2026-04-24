# Nền tảng Ôn thi Trắc nghiệm Trực tuyến

Bộ khung hệ thống web app ôn thi trắc nghiệm chuyên nghiệp, phục vụ trung tâm đào tạo, trường học, viện nghiên cứu và doanh nghiệp.

## Thành phần đã xây dựng

- Kiến trúc hệ thống full-stack (frontend + backend + worker + storage + cache).
- Thiết kế cơ sở dữ liệu chuẩn hóa cho ngân hàng câu hỏi, đề thi, lượt thi, chứng nhận.
- Thiết kế API chi tiết theo chuẩn REST/OpenAPI.
- Thiết kế UI/UX cho cả khu vực học viên và Admin Dashboard.
- Tài liệu hướng dẫn cài đặt, vận hành, import câu hỏi Excel/Word.

## Cấu trúc thư mục

- `docs/architecture.md`: Kiến trúc tổng thể, luồng nghiệp vụ, bảo mật, mở rộng.
- `docs/admin-guide.md`: Hướng dẫn sử dụng cho admin/giáo viên.
- `docs/import-guide.md`: Hướng dẫn import câu hỏi mẫu từ Excel/Word.
- `db/schema.sql`: Cấu trúc database PostgreSQL hoàn chỉnh.
- `backend/openapi.yaml`: Thiết kế API backend đầy đủ endpoint cốt lõi.
- `frontend/design-system.md`: Định hướng giao diện, UX pattern, responsive.

## Khuyến nghị stack triển khai thực tế

- Frontend: Next.js 15 + TypeScript + Tailwind + shadcn/ui.
- Backend: NestJS + PostgreSQL + Redis + BullMQ.
- Storage: S3-compatible (MinIO/S3) cho ảnh/file đính kèm.
- Authentication: JWT + Refresh Token + RBAC.
- Import Excel/Word: `xlsx` + `mammoth` + pipeline validate trước khi ghi DB.
- Chứng nhận PDF: `pdf-lib` + QRCode.

## Khởi tạo nhanh môi trường local (đề xuất)

1. Cài Docker + Docker Compose.
2. Dựng PostgreSQL/Redis/MinIO theo `docker-compose.yml` (cần tạo thêm ở bước triển khai code runtime).
3. Chạy migration từ `db/schema.sql`.
4. Triển khai backend theo hợp đồng API trong `backend/openapi.yaml`.
5. Triển khai frontend theo guideline tại `frontend/design-system.md`.

---

Nếu bạn muốn, tôi có thể tiếp tục ở bước kế tiếp: dựng **code chạy thực tế** (Next.js + NestJS) theo đúng tài liệu trong repo này.
