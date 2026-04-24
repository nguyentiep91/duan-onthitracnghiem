import { z } from 'zod';

export const registerSchema = z.object({
  fullName: z.string().min(2, 'Họ tên tối thiểu 2 ký tự').max(120),
  email: z.string().email('Email không hợp lệ'),
  password: z.string().min(8, 'Mật khẩu tối thiểu 8 ký tự')
});

export const loginSchema = z.object({
  email: z.string().email('Email không hợp lệ'),
  password: z.string().min(1, 'Vui lòng nhập mật khẩu')
});

export const courseSchema = z.object({
  title: z.string().min(3, 'Tên khóa học tối thiểu 3 ký tự').max(150),
  description: z.string().max(1000).optional().or(z.literal(''))
});

export const questionSchema = z.object({
  categoryId: z.string().uuid('Danh mục câu hỏi không hợp lệ'),
  courseId: z.string().uuid('Khóa học không hợp lệ').optional().or(z.literal('')),
  content: z.string().min(10, 'Nội dung câu hỏi tối thiểu 10 ký tự').max(5000),
  explanation: z.string().max(5000).optional().or(z.literal('')),
  optionA: z.string().min(1, 'Đáp án A bắt buộc'),
  optionB: z.string().min(1, 'Đáp án B bắt buộc'),
  optionC: z.string().min(1, 'Đáp án C bắt buộc'),
  optionD: z.string().min(1, 'Đáp án D bắt buộc'),
  correctOption: z.enum(['A', 'B', 'C', 'D'])
});
