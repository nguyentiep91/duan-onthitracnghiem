import { redirect } from 'next/navigation';
import { createQuestionAction } from '@/app/actions';
import { getCourses, getCurrentUser, getQuestions, getRoleByUserId } from '@/lib/supabase';

type Props = { searchParams: { error?: string; message?: string } };

export default async function QuestionsPage({ searchParams }: Props) {
  const user = await getCurrentUser();
  if (!user) redirect('/login');

  const role = await getRoleByUserId(user.id);
  if (role !== 'admin' && role !== 'teacher') {
    redirect('/dashboard?error=Bạn không có quyền vào trang câu hỏi.');
  }

  const courses = await getCourses();
  const questions = await getQuestions();

  return (
    <main className="container auth-page">
      <h1>Ngân hàng câu hỏi</h1>
      {searchParams.error ? <p className="alert error">{searchParams.error}</p> : null}
      {searchParams.message ? <p className="alert success">{searchParams.message}</p> : null}

      <form action={createQuestionAction} className="form-card">
        <label>
          Môn thi
          <select name="courseId" required>
            <option value="">-- Chọn môn --</option>
            {courses.map((course) => (
              <option key={course.id} value={course.id}>
                {course.code} - {course.title}
              </option>
            ))}
          </select>
        </label>
        <label>
          Nội dung câu hỏi
          <textarea name="questionText" required rows={3} />
        </label>
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
        <label>
          Đáp án đúng
          <select name="correctOption" required>
            <option value="A">A</option>
            <option value="B">B</option>
            <option value="C">C</option>
            <option value="D">D</option>
          </select>
        </label>
        <label>
          Giải thích
          <textarea name="explanation" rows={3} required />
        </label>
        <button type="submit" className="btn btn-primary">
          Thêm câu hỏi
        </button>
      </form>

      <section>
        <h2>Câu hỏi mới nhất</h2>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Câu hỏi</th>
                <th>Đáp án đúng</th>
                <th>Course ID</th>
              </tr>
            </thead>
            <tbody>
              {questions.map((q) => (
                <tr key={q.id}>
                  <td>{q.question_text}</td>
                  <td>{q.correct_option}</td>
                  <td>{q.course_id}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}
