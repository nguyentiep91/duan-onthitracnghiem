# UI/UX Design System cho nền tảng ôn thi

## 1) Nguyên tắc thiết kế

- Chuyên nghiệp, dễ đọc, tập trung vào nội dung thi.
- Tối ưu thao tác nhanh cho admin.
- Tránh rối mắt, ưu tiên phân cấp thông tin rõ ràng.

## 2) Bảng màu gợi ý

- Primary: `#0F3D8F` (xanh dương đậm)
- Secondary: `#1E66F5`
- CTA: `#F59E0B` (cam vàng nhẹ)
- Success: `#16A34A`
- Danger: `#DC2626`
- Background: `#F8FAFC`
- Surface: `#FFFFFF`
- Text: `#0F172A`

## 3) Typography

- Font đề xuất: Inter / Be Vietnam Pro.
- Cỡ chữ:
  - H1: 36–44
  - H2: 28–32
  - Body: 15–16
  - Caption: 13–14

## 4) Layout trang chủ

1. Hero
   - Tiêu đề lớn: “Nền tảng ôn thi trắc nghiệm trực tuyến chuyên nghiệp”.
   - 3 CTA: Bắt đầu ôn thi / Đăng ký tài khoản / Xem khóa học.
2. Tính năng nổi bật (8 cards).
3. Lợi ích theo đối tượng.
4. Quy trình 3 bước: Tạo câu hỏi -> Tạo đề -> Tổ chức thi.
5. Testimonials/đơn vị sử dụng.
6. Footer pháp lý.

## 5) Layout trang làm bài

- Header cố định: tên đề + đồng hồ đếm ngược.
- Sidebar: lưới số câu (trạng thái chưa làm/đã làm/đánh dấu).
- Main content: câu hỏi + đáp án.
- Footer actions: câu trước/câu sau/nộp bài.
- Toast cảnh báo còn 5 phút và 1 phút.

## 6) Component chính

- `QuestionCard`
- `QuestionNavigator`
- `ExamTimer`
- `AutosaveIndicator`
- `ResultSummary`
- `ImportPreviewTable`
- `StatCard`
- `LineChart` / `DonutChart`

## 7) Trạng thái UX cần có

- Loading skeleton khi gọi API.
- Empty state khi chưa có dữ liệu.
- Error state với hướng dẫn sửa.
- Success toast sau mỗi thao tác lưu/import/tạo đề.

## 8) Responsive

- Mobile first.
- Breakpoints: 640 / 768 / 1024 / 1280.
- Trên mobile khi thi: sidebar navigator chuyển thành bottom sheet.

## 9) Accessibility

- Contrast đạt WCAG AA.
- Focus ring rõ trên nút/input.
- Hỗ trợ bàn phím cho thao tác thi cơ bản.
- ARIA label cho đồng hồ, câu hỏi, điều hướng.
