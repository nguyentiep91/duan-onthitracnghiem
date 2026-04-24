import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getCurrentUser, getRoleByUserId } from '@/lib/supabase';

export default async function StudentPage() {
  const user = await getCurrentUser();
  if (!user) redirect('/login');

  const role = await getRoleByUserId(user.id);
  if (role !== 'student') {
    redirect('/dashboard?error=Trang này chỉ dành cho học viên.');
  }

  return (
    <main className="container auth-page">
      <h1>Khu vực học viên</h1>
      <p>Chào mừng bạn đến trang luyện tập. MVP hiện có điều hướng role và nền tảng ngân hàng câu hỏi.</p>
      <div className="grid two">
        <article className="card">
          <h3>Bài thi gần đây</h3>
          <p>Danh sách bài làm sẽ được bổ sung ở bước tiếp theo.</p>
        </article>
        <article className="card">
          <h3>Khóa học tham gia</h3>
          <p>Tích hợp dữ liệu khóa học từ Supabase database.</p>
        </article>
      </div>
      <p>
        Cần hỗ trợ? <Link href="/">Quay về landing page</Link>
      </p>
    </main>
  );
}
