# Hướng dẫn import câu hỏi mẫu

## 1) Import thủ công

Dành cho số lượng ít hoặc cần kiểm soát chất lượng từng câu.

Trường bắt buộc:
- Nội dung câu hỏi
- Loại câu hỏi
- Tối thiểu 2 đáp án
- Đáp án đúng
- Chuyên đề

## 2) Import từ Excel

## 2.1 Cấu trúc cột khuyến nghị

1. STT
2. Chuyên đề
3. Nội dung câu hỏi
4. Đáp án A
5. Đáp án B
6. Đáp án C
7. Đáp án D
8. Đáp án E
9. Đáp án đúng
10. Giải thích
11. Mức độ (easy|medium|hard)
12. Điểm
13. Trạng thái (active|hidden)

## 2.2 Quy tắc validate

- Thiếu nội dung câu hỏi -> lỗi.
- Không đủ đáp án tối thiểu -> lỗi.
- Thiếu đáp án đúng -> lỗi.
- Đáp án đúng không thuộc tập đáp án -> lỗi.
- Trùng nội dung + chuyên đề -> cảnh báo trùng.
- Điểm <= 0 hoặc không phải số -> lỗi.

## 2.3 Luồng import

1. Upload file.
2. Parse dữ liệu.
3. Validate từng dòng.
4. Hiển thị bảng preview: hợp lệ/lỗi.
5. Cho phép tải file lỗi để sửa.
6. Xác nhận import chính thức.

## 3) Import từ Word

## 3.1 Mẫu chuẩn

Câu 1: Nội dung câu hỏi?
A. Đáp án A
B. Đáp án B
C. Đáp án C
D. Đáp án D
Đáp án đúng: B
Giải thích: ...

## 3.2 Quy tắc parser

- Mỗi block bắt đầu bằng `Câu <số>:`.
- Dòng đáp án theo nhãn `A.`, `B.`, `C.`, `D.`, `E.`.
- Dòng đáp án đúng: `Đáp án đúng:`.
- Dòng giải thích là tùy chọn.

## 3.3 Lỗi thường gặp

- Thiếu tiền tố `Câu`.
- Sai định dạng nhãn đáp án (`A)` thay vì `A.`).
- Không có `Đáp án đúng:`.

## 4) Mẹo dữ liệu sạch

- Chuẩn hóa font Unicode và xuống dòng.
- Một câu hỏi chỉ thuộc một chuyên đề chính (nếu có thể).
- Dùng từ khóa rõ ràng, hạn chế viết tắt.
