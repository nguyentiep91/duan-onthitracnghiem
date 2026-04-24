import Link from 'next/link';
import { createCourseAction } from '@/app/actions/admin';
import { createClient } from '@/lib/supabase/server';

type PageProps = {
  searchParams?: { [key: string]: string | string[] | undefined };
};

export default async function AdminCoursesPage({ searchParams }: PageProps) {
  const error = typeof searchParams?.error === 'string' ? searchParams.error : undefined;
  const message = typeof searchParams?.message === 'string' ? searchParams.message : undefined;
  const supabase = await createClient();

  const { data: courses } = await supabase.from('courses').select('id, title, description, created_at').order('created_at', {
    ascending: false
  });

  return (
    <main className="container section">
      <div className="panel">
        <h1>Quản lý khóa học / môn thi</h1>
        <p>
          <Link href="/admin">← Quay về dashboard</Link>
        </p>
        {error ? <p className="alert error">{error}</p> : null}
        {message ? <p className="alert success">{message}</p> : null}

        <form action={createCourseAction} className="form-grid panel">
          <h2>Tạo khóa học mới</h2>
          <label>
            Tên khóa học
            <input name="title" required minLength={3} />
          </label>
          <label>
            Mô tả
            <textarea name="description" rows={4} />
          </label>
          <button className="btn btn-primary" type="submit">
            Tạo khóa học
          </button>
        </form>

        <div className="panel">
          <h2>Danh sách khóa học</h2>
          <table className="table">
            <thead>
              <tr>
                <th>Tên</th>
                <th>Mô tả</th>
                <th>Ngày tạo</th>
              </tr>
            </thead>
            <tbody>
              {(courses || []).map((course) => (
                <tr key={course.id}>
                  <td>{course.title}</td>
                  <td>{course.description || '-'}</td>
                  <td>{new Date(course.created_at).toLocaleString('vi-VN')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}
