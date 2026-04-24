import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getCurrentUser, getRoleByUserId } from '@/lib/supabase';

type Props = { searchParams: { error?: string } };

export default async function DashboardPage({ searchParams }: Props) {
  const user = await getCurrentUser();
  if (!user) redirect('/login');

  const role = await getRoleByUserId(user.id);

  if (role === 'admin' || role === 'teacher') {
    redirect('/admin');
  }

  if (role === 'student') {
    redirect('/student');
  }

  return (
    <main className="container auth-page">
      <h1>Dashboard</h1>
      {searchParams.error ? <p className="alert error">{searchParams.error}</p> : null}
      <p>Tài khoản của bạn chưa được gán role. Hãy liên hệ quản trị viên.</p>
      <Link href="/login">Quay lại đăng nhập</Link>
    </main>
  );
}
