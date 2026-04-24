import Link from 'next/link';
import { loginAction } from '@/app/actions';

type Props = { searchParams: { error?: string; message?: string } };

export default function LoginPage({ searchParams }: Props) {
  return (
    <main className="container auth-page">
      <h1>Đăng nhập hệ thống</h1>
      <p>Truy cập dashboard theo đúng vai trò được phân quyền.</p>
      {searchParams.error ? <p className="alert error">{searchParams.error}</p> : null}
      {searchParams.message ? <p className="alert success">{searchParams.message}</p> : null}
      <form action={loginAction} className="form-card">
        <label>
          Email
          <input type="email" name="email" required />
        </label>
        <label>
          Mật khẩu
          <input type="password" name="password" required minLength={6} maxLength={72} />
        </label>
        <button type="submit" className="btn btn-primary">
          Đăng nhập
        </button>
      </form>
      <p>
        Chưa có tài khoản? <Link href="/register">Đăng ký ngay</Link>
      </p>
    </main>
  );
}
