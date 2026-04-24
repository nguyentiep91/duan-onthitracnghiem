import { createCourseAction } from '@/app/actions';
import { getCourses, getCurrentUser, getRoleByUserId } from '@/lib/supabase';
import { redirect } from 'next/navigation';

type Props = { searchParams: { error?: string; message?: string } };

export default async function CoursesPage({ searchParams }: Props) {
  const user = await getCurrentUser();
  if (!user) redirect('/login');

  const role = await getRoleByUserId(user.id);
  if (role !== 'admin' && role !== 'teacher') {
    redirect('/dashboard?error=Bạn không có quyền vào trang khóa học.');
  }

  const courses = await getCourses();

  return (
    <main className="container auth-page">
      <h1>Quản lý khóa học / môn thi</h1>
      {searchParams.error ? <p className="alert error">{searchParams.error}</p> : null}
      {searchParams.message ? <p className="alert success">{searchParams.message}</p> : null}

      <form action={createCourseAction} className="form-card">
        <label>
          Mã môn
          <input name="code" required minLength={2} maxLength={32} placeholder="MATH-12" />
        </label>
        <label>
          Tên môn/khóa học
          <input name="title" required minLength={3} maxLength={120} placeholder="Toán 12 - Ôn thi THPT" />
        </label>
        <label>
          Mô tả
          <textarea name="description" required minLength={3} maxLength={300} rows={3} />
        </label>
        <button type="submit" className="btn btn-primary">
          Tạo khóa học
        </button>
      </form>

      <section>
        <h2>Danh sách môn thi</h2>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Mã môn</th>
                <th>Tên môn</th>
                <th>Mô tả</th>
              </tr>
            </thead>
            <tbody>
              {courses.map((course) => (
                <tr key={course.id}>
                  <td>{course.code}</td>
                  <td>{course.title}</td>
                  <td>{course.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}
