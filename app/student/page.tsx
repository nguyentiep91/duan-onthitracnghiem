import Link from 'next/link';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { logoutAction } from '@/app/actions/auth';

export default async function StudentPage() {
  const supabase = await createClient();

  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  const [{ data: profile }, { count: attemptCount }, { count: totalQuestions }] = await Promise.all([
    supabase.from('profiles').select('full_name, role').eq('id', user.id).single(),
    supabase.from('exam_attempts').select('*', { count: 'exact', head: true }).eq('student_id', user.id),
    supabase.from('questions').select('*', { count: 'exact', head: true })
  ]);

  return (
    <main className="container section">
      <div className="panel">
        <div className="panel-head">
          <h1>Dashboard học viên</h1>
          <form action={logoutAction}>
            <button className="btn btn-light" type="submit">
              Đăng xuất
            </button>
          </form>
        </div>
        <p>
          Xin chào <strong>{profile?.full_name || user.email}</strong> ({profile?.role}).
        </p>
        <div className="grid two">
          <article className="card">
            <h3>Số lượt làm bài</h3>
            <p>{attemptCount ?? 0}</p>
          </article>
          <article className="card">
            <h3>Tổng câu hỏi hệ thống</h3>
            <p>{totalQuestions ?? 0}</p>
          </article>
        </div>
        <p>
          Nếu bạn là quản trị viên, truy cập <Link href="/admin">khu vực admin</Link>.
        </p>
      </div>
    </main>
  );
}
