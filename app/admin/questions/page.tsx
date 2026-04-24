import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { createQuestionAction } from '@/app/actions/admin';

type PageProps = {
  searchParams?: { [key: string]: string | string[] | undefined };
};

type QuestionRow = {
  id: string;
  content: string;
  created_at: string;
  question_categories: { name: string } | { name: string }[] | null;
};

export default async function AdminQuestionsPage({ searchParams }: PageProps) {
  const error = typeof searchParams?.error === 'string' ? searchParams.error : undefined;
  const message = typeof searchParams?.message === 'string' ? searchParams.message : undefined;
  const supabase = await createClient();

  const [{ data: categories }, { data: courses }, { data: questions }] = await Promise.all([
    supabase.from('question_categories').select('id, name').order('name'),
    supabase.from('courses').select('id, title').order('title'),
    supabase
      .from('questions')
      .select('id, content, created_at, question_categories(name)')
      .order('created_at', { ascending: false })
      .limit(20)
  ]);

  return (
    <main className="container section">
      <div className="panel">
        <h1>Quản lý ngân hàng câu hỏi</h1>
        <p>
          <Link href="/admin">← Quay về dashboard</Link>
        </p>
        {error ? <p className="alert error">{error}</p> : null}
        {message ? <p className="alert success">{message}</p> : null}

        <form action={createQuestionAction} className="form-grid panel">
          <h2>Tạo câu hỏi thủ công</h2>

          <label>
            Danh mục câu hỏi
            <select name="categoryId" required>
              <option value="">-- Chọn danh mục --</option>
              {(categories || []).map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </label>

          <label>
            Khóa học (tùy chọn)
            <select name="courseId">
              <option value="">-- Không gán khóa học --</option>
              {(courses || []).map((course) => (
                <option key={course.id} value={course.id}>
                  {course.title}
                </option>
              ))}
            </select>
          </label>

          <label>
            Nội dung câu hỏi
            <textarea name="content" rows={4} required minLength={10} />
          </label>

          <label>
            Giải thích (tùy chọn)
            <textarea name="explanation" rows={3} />
          </label>

          <div className="grid two">
            <label>
              Đáp án A
              <input name="optionA" required />
            </label>
            <label>
              Đáp án B
              <input name="optionB" required />
            </label>
            <label>
              Đáp án C
              <input name="optionC" required />
            </label>
            <label>
              Đáp án D
              <input name="optionD" required />
            </label>
          </div>

          <label>
            Đáp án đúng
            <select name="correctOption" required>
              <option value="A">A</option>
              <option value="B">B</option>
              <option value="C">C</option>
              <option value="D">D</option>
            </select>
          </label>

          <button className="btn btn-primary" type="submit">
            Lưu câu hỏi
          </button>
        </form>

        <div className="panel">
          <h2>Câu hỏi mới nhất</h2>
          <table className="table">
            <thead>
              <tr>
                <th>Nội dung</th>
                <th>Danh mục</th>
                <th>Ngày tạo</th>
              </tr>
            </thead>
            <tbody>
              {((questions || []) as QuestionRow[]).map((item) => {
                const categoryName = Array.isArray(item.question_categories)
                  ? item.question_categories[0]?.name
                  : item.question_categories?.name;

                return (
                  <tr key={item.id}>
                    <td>{item.content}</td>
                    <td>{categoryName || '-'}</td>
                    <td>{new Date(item.created_at).toLocaleString('vi-VN')}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}
