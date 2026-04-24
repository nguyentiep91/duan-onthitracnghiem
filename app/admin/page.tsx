import Link from 'next/link';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { logoutAction } from '@/app/actions/auth';

export default async function AdminPage() {
  const supabase = await createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  const [{ count: coursesCount }, { count: questionCount }, { count: studentCount }, { count: attemptCount }] =
    await Promise.all([
      supabase.from('courses').select('*', { count: 'exact', head: true }),
      supabase.from('questions').select('*', { count: 'exact', head: true }),
      supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('role', 'student'),
      supabase.from('exam_attempts').select('*', { count: 'exact', head: true })
    ]);

  return (
    <main className="container section">
      <div className="panel">
        <div className="panel-head">
          <h1>Admin Dashboard</h1>
          <form action={logoutAction}>
            <button className="btn btn-light" type="submit">
              Đăng xuất
            </button>
          </form>
        </div>

        <div className="grid two">
          <article className="card">
            <h3>Tổng khóa học</h3>
            <p>{coursesCount ?? 0}</p>
          </article>
          <article className="card">
            <h3>Tổng câu hỏi</h3>
            <p>{questionCount ?? 0}</p>
          </article>
          <article className="card">
            <h3>Tổng học viên</h3>
            <p>{studentCount ?? 0}</p>
          </article>
          <article className="card">
            <h3>Tổng lượt thi</h3>
            <p>{attemptCount ?? 0}</p>
          </article>
        </div>

        <div className="actions">
          <Link className="btn btn-primary" href="/admin/courses">
            Quản lý khóa học
          </Link>
          <Link className="btn btn-secondary" href="/admin/questions">
            Quản lý câu hỏi
          </Link>
        </div>
      </div>
    </main>
  );
}
