import Link from 'next/link';
import { logoutAction } from '@/app/actions';
import { getCurrentUser, getRoleByUserId } from '@/lib/supabase';

export async function AuthStatus() {
  const user = await getCurrentUser();
  if (!user) {
    return (
      <div className="auth-links">
        <Link href="/login">Đăng nhập</Link>
        <Link href="/register">Đăng ký</Link>
      </div>
    );
  }

  const role = await getRoleByUserId(user.id);

  return (
    <div className="auth-links">
      <span>{user.email}</span>
      <span className="role-pill">{role ?? 'student'}</span>
      <form action={logoutAction}>
        <button className="btn btn-secondary" type="submit">
          Đăng xuất
        </button>
      </form>
    </div>
  );
}
