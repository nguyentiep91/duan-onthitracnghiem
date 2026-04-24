'use server';

import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import { courseSchema, questionSchema } from '@/lib/validation/schemas';

async function requireAdminOrTeacher() {
  const supabase = await createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  if (!profile || !['admin', 'teacher'].includes(profile.role)) {
    redirect('/student');
  }

  return { supabase, userId: user.id };
}

export async function createCourseAction(formData: FormData) {
  const parsed = courseSchema.safeParse({
    title: formData.get('title'),
    description: formData.get('description')
  });

  if (!parsed.success) {
    redirect(`/admin/courses?error=${encodeURIComponent(parsed.error.issues[0]?.message ?? 'Dữ liệu không hợp lệ')}`);
  }

  const { supabase } = await requireAdminOrTeacher();
  const { error } = await supabase.from('courses').insert({
    title: parsed.data.title,
    description: parsed.data.description || null
  });

  if (error) {
    redirect(`/admin/courses?error=${encodeURIComponent(error.message)}`);
  }

  revalidatePath('/admin/courses');
  redirect('/admin/courses?message=' + encodeURIComponent('Tạo khóa học thành công'));
}

export async function createQuestionAction(formData: FormData) {
  const parsed = questionSchema.safeParse({
    categoryId: formData.get('categoryId'),
    courseId: formData.get('courseId'),
    content: formData.get('content'),
    explanation: formData.get('explanation'),
    optionA: formData.get('optionA'),
    optionB: formData.get('optionB'),
    optionC: formData.get('optionC'),
    optionD: formData.get('optionD'),
    correctOption: formData.get('correctOption')
  });

  if (!parsed.success) {
    redirect(`/admin/questions?error=${encodeURIComponent(parsed.error.issues[0]?.message ?? 'Dữ liệu không hợp lệ')}`);
  }

  const { supabase, userId } = await requireAdminOrTeacher();
  const payload = parsed.data;

  const { data: question, error: questionError } = await supabase
    .from('questions')
    .insert({
      category_id: payload.categoryId,
      course_id: payload.courseId || null,
      content: payload.content,
      explanation: payload.explanation || null,
      created_by: userId
    })
    .select('id')
    .single();

  if (questionError || !question) {
    redirect(`/admin/questions?error=${encodeURIComponent(questionError?.message ?? 'Không thể tạo câu hỏi')}`);
  }

  const options = [
    { key: 'A', content: payload.optionA },
    { key: 'B', content: payload.optionB },
    { key: 'C', content: payload.optionC },
    { key: 'D', content: payload.optionD }
  ];

  const { error: answersError } = await supabase.from('answers').insert(
    options.map((item) => ({
      question_id: question.id,
      answer_key: item.key,
      content: item.content,
      is_correct: item.key === payload.correctOption
    }))
  );

  if (answersError) {
    await supabase.from('questions').delete().eq('id', question.id);
    redirect(`/admin/questions?error=${encodeURIComponent(answersError.message)}`);
  }

  revalidatePath('/admin/questions');
  redirect('/admin/questions?message=' + encodeURIComponent('Tạo câu hỏi thành công'));
}
