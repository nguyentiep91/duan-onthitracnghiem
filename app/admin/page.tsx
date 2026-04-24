import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getCurrentUser, getRoleByUserId } from '@/lib/supabase';

export default async function AdminPage() {
  const user = await getCurrentUser();
  if (!user) redirect('/login');

  const role = await getRoleByUserId(user.id);
  if (role !== 'admin' && role !== 'teacher') {
    redirect('/dashboard?error=Bạn không có quyền vào admin.');
  }

  return (
    <main className="container auth-page">
      <h1>Admin Dashboard</h1>
      <p>Quản lý khóa học và ngân hàng câu hỏi cho hệ thống ôn thi.</p>
      <div className="grid two">
        <article className="card">
          <h3>Quản lý khóa học/môn thi</h3>
          <p>Tạo và theo dõi các môn thi đang triển khai.</p>
          <Link href="/admin/courses">Đi đến /admin/courses</Link>
        </article>
        <article className="card">
          <h3>Ngân hàng câu hỏi</h3>
          <p>Tạo thủ công câu hỏi 4 đáp án A/B/C/D và lời giải.</p>
          <Link href="/admin/questions">Đi đến /admin/questions</Link>
        </article>
      </div>
    </main>
  );
}
