# 1) Kiến trúc hệ thống đề xuất

## 1.1 Mô hình tổng thể

Hệ thống tách thành 4 lớp:

1. **Web Frontend (Next.js)**
   - Portal học viên: đăng ký/đăng nhập, làm bài, xem kết quả, tải chứng nhận.
   - Admin Portal: quản lý câu hỏi, đề thi, học viên, thống kê.
2. **Backend API (NestJS)**
   - Authentication + RBAC + business logic thi trắc nghiệm.
3. **Background Worker (BullMQ/Queue)**
   - Import Excel/Word, gửi email, cấp chứng nhận PDF, thống kê định kỳ.
4. **Data Layer**
   - PostgreSQL (dữ liệu nghiệp vụ), Redis (session/cache/rate-limit), S3/MinIO (file).

## 1.2 Sơ đồ luồng chính

- Đăng nhập: FE -> `/auth/login` -> JWT/Refresh -> FE lưu secure cookie.
- Làm bài: FE gọi `/exam-sessions/start` -> tải câu hỏi -> autosave `/answers/save` -> submit `/exam-sessions/{id}/submit` -> backend chấm điểm -> trả kết quả.
- Import Excel/Word: Admin upload file -> tạo `import_jobs` -> worker parse/validate -> preview -> confirm import.
- Cấp chứng nhận: khi đạt điều kiện, worker render PDF + QR -> lưu S3 -> trả URL tải.

## 1.3 Phân quyền chi tiết (RBAC)

- **ADMIN**: toàn quyền hệ thống.
- **TEACHER**: quản lý câu hỏi/đề thi/kết quả lớp phụ trách.
- **STUDENT**: chỉ truy cập dữ liệu cá nhân và bài thi được gán.

Có thể mở rộng ABAC theo tổ chức/chi nhánh sau này.

## 1.4 Nghiệp vụ quan trọng

### A. Ngân hàng câu hỏi

- Hỗ trợ: single choice, multiple choice, true/false, fill blank.
- Mỗi câu có thể có media (ảnh/file), giải thích, độ khó, điểm.
- Có trạng thái publish/hidden và kiểm duyệt.

### B. Đề thi

- Chế độ lấy câu:
  1) Chọn thủ công.
  2) Random theo chuyên đề + độ khó + số lượng.
- Có cấu hình: thời gian, số lần thi, ngưỡng đạt, xem đáp án/giải thích, trộn câu/đáp án.
- Có lịch mở/đóng đề và gán theo nhóm học viên.

### C. Làm bài thi

- Đồng hồ đếm ngược real-time.
- Autosave định kỳ 10–15 giây/lần.
- Cảnh báo trước khi hết giờ (5 phút, 1 phút).
- Tự nộp khi hết thời gian.
- Giới hạn số lần theo cấu hình đề.

### D. Chấm điểm

- Chấm tự động tức thì.
- Lưu snapshot đề + câu hỏi tại thời điểm thi để đảm bảo tính bất biến khi câu hỏi gốc thay đổi.
- Công thức điểm linh hoạt (điểm tuyệt đối hoặc theo trọng số).

### E. Chứng nhận

- Điều kiện cấp: đạt điểm tối thiểu + trạng thái duyệt (nếu bật).
- Sinh mã chứng nhận duy nhất.
- Trang tra cứu công khai theo mã/số điện thoại.

## 1.5 Bảo mật

- Hash mật khẩu bằng Argon2/Bcrypt.
- JWT access ngắn hạn + refresh token rotate.
- Rate limit đăng nhập/đăng ký/OTP/quên mật khẩu.
- CSRF protection (nếu dùng cookie session).
- Validate upload file (mime, size, extension).
- Audit log hành động admin.
- Mã hóa dữ liệu nhạy cảm (CCCD/sđt) ở mức DB nếu yêu cầu.

## 1.6 Khả năng mở rộng

- Tách service import/chấm điểm thành microservice khi tải lớn.
- Dùng read-replica cho báo cáo.
- Cache dashboard bằng Redis.
- Dùng CDN cho static/media.

---

# 2) Danh sách trang bắt buộc

## Học viên

1. Trang chủ
2. Đăng nhập
3. Đăng ký
4. Quên mật khẩu
5. Danh sách khóa học
6. Chi tiết khóa học
7. Danh sách đề thi
8. Làm bài thi
9. Kết quả bài thi
10. Lịch sử làm bài
11. Tài khoản cá nhân
12. Tra cứu chứng nhận
13. Liên hệ
14. Giới thiệu
15. Chính sách bảo mật
16. Điều khoản sử dụng

## Admin/Teacher

1. Dashboard tổng quan
2. Quản lý câu hỏi
3. Import câu hỏi (thủ công/Excel/Word)
4. Quản lý đề thi
5. Quản lý học viên
6. Quản lý khóa học/chuyên đề
7. Kết quả & thống kê
8. Chứng nhận
9. Cài đặt hệ thống
10. Nhật ký hoạt động

---

# 3) Lộ trình triển khai khuyến nghị

## Giai đoạn 1 (MVP - 4 đến 6 tuần)

- Auth + RBAC.
- Quản lý câu hỏi + đề thi.
- Làm bài + chấm điểm + lịch sử.
- Dashboard cơ bản.

## Giai đoạn 2 (2 đến 4 tuần)

- Import Excel/Word nâng cao + preview lỗi.
- Xuất Excel kết quả/học viên.
- Chứng nhận PDF + QR.
- Gửi email thông báo.

## Giai đoạn 3 (2 đến 4 tuần)

- Chống gian lận (anti-tab, log focus/blur, device fingerprint).
- API tích hợp hệ thống ngoài.
- Billing/kích hoạt khóa học.
