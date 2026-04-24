'use server';

import { redirect } from 'next/navigation';
import {
  clearSessionCookies,
  getCurrentUser,
  getRoleByUserId,
  insertCourse,
  insertQuestion,
  setSessionCookies,
  signIn,
  signUp
} from '@/lib/supabase';
import { z } from '@/lib/zod';

const registerSchema = z.object({
  fullName: z.string().min(2).max(80),
  email: z.string().email(),
  password: z.string().min(6).max(72)
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6).max(72)
});

const courseSchema = z.object({
  code: z.string().min(2).max(32),
  title: z.string().min(3).max(120),
  description: z.string().min(3).max(300)
});

const questionSchema = z.object({
  courseId: z.string().min(1),
  questionText: z.string().min(5).max(500),
  optionA: z.string().min(1).max(200),
  optionB: z.string().min(1).max(200),
  optionC: z.string().min(1).max(200),
  optionD: z.string().min(1).max(200),
  correctOption: z.enum(['A', 'B', 'C', 'D'] as const),
  explanation: z.string().min(3).max(500)
});

const firstIssue = (issues: { message: string }[]) => issues[0]?.message ?? 'Dữ liệu chưa hợp lệ.';

export async function registerAction(formData: FormData) {
  const parsed = registerSchema.safeParse({
    fullName: formData.get('fullName'),
    email: formData.get('email'),
    password: formData.get('password')
  });

  if (!parsed.success) {
    redirect(`/register?error=${encodeURIComponent(firstIssue(parsed.error.issues))}`);
  }

  try {
    const result = await signUp(parsed.data.email, parsed.data.password, parsed.data.fullName);

    if (result.session) {
      setSessionCookies(result.session);
      redirect('/dashboard');
    }

    redirect('/login?message=Đăng ký thành công. Vui lòng kiểm tra email để xác thực tài khoản.');
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Đăng ký thất bại';
    redirect(`/register?error=${encodeURIComponent(message)}`);
  }
}

export async function loginAction(formData: FormData) {
  const parsed = loginSchema.safeParse({
    email: formData.get('email'),
    password: formData.get('password')
  });

  if (!parsed.success) {
    redirect(`/login?error=${encodeURIComponent(firstIssue(parsed.error.issues))}`);
  }

  try {
    const session = await signIn(parsed.data.email, parsed.data.password);
    setSessionCookies(session);
    redirect('/dashboard');
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Đăng nhập thất bại';
    redirect(`/login?error=${encodeURIComponent(message)}`);
  }
}

export async function logoutAction() {
  clearSessionCookies();
  redirect('/login?message=Đăng xuất thành công.');
}

async function requireAdminOrTeacher() {
  const user = await getCurrentUser();
  if (!user) redirect('/login');

  const role = await getRoleByUserId(user.id);
  if (role !== 'admin' && role !== 'teacher') {
    redirect('/dashboard?error=Bạn không có quyền truy cập khu vực quản trị.');
  }
}

export async function createCourseAction(formData: FormData) {
  await requireAdminOrTeacher();

  const parsed = courseSchema.safeParse({
    code: formData.get('code'),
    title: formData.get('title'),
    description: formData.get('description')
  });

  if (!parsed.success) {
    redirect(`/admin/courses?error=${encodeURIComponent(firstIssue(parsed.error.issues))}`);
  }

  try {
    await insertCourse(parsed.data);
    redirect('/admin/courses?message=Đã tạo khóa học thành công.');
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Không thể tạo khóa học.';
    redirect(`/admin/courses?error=${encodeURIComponent(message)}`);
  }
}

export async function createQuestionAction(formData: FormData) {
  await requireAdminOrTeacher();

  const parsed = questionSchema.safeParse({
    courseId: formData.get('courseId'),
    questionText: formData.get('questionText'),
    optionA: formData.get('optionA'),
    optionB: formData.get('optionB'),
    optionC: formData.get('optionC'),
    optionD: formData.get('optionD'),
    correctOption: formData.get('correctOption'),
    explanation: formData.get('explanation')
  });

  if (!parsed.success) {
    redirect(`/admin/questions?error=${encodeURIComponent(firstIssue(parsed.error.issues))}`);
  }

  try {
    await insertQuestion({
      course_id: parsed.data.courseId,
      question_text: parsed.data.questionText,
      option_a: parsed.data.optionA,
      option_b: parsed.data.optionB,
      option_c: parsed.data.optionC,
      option_d: parsed.data.optionD,
      correct_option: parsed.data.correctOption,
      explanation: parsed.data.explanation
    });
    redirect('/admin/questions?message=Đã thêm câu hỏi mới vào ngân hàng.');
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Không thể tạo câu hỏi.';
    redirect(`/admin/questions?error=${encodeURIComponent(message)}`);
  }
}
