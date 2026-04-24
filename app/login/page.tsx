import Link from 'next/link';
import { loginAction } from '@/app/actions/auth';

type PageProps = {
  searchParams?: { [key: string]: string | string[] | undefined };
};

export default function LoginPage({ searchParams }: PageProps) {
  const error = typeof searchParams?.error === 'string' ? searchParams.error : undefined;
  const message = typeof searchParams?.message === 'string' ? searchParams.message : undefined;

  return (
    <main className="container auth-wrap">
      <div className="auth-card">
        <h1>Đăng nhập</h1>
        {error ? <p className="alert error">{error}</p> : null}
        {message ? <p className="alert success">{message}</p> : null}
        <form action={loginAction} className="form-grid">
          <label>
            Email
            <input name="email" type="email" required />
          </label>
          <label>
            Mật khẩu
            <input name="password" type="password" required minLength={8} />
          </label>
          <button className="btn btn-primary" type="submit">
            Đăng nhập
          </button>
        </form>
        <p>
          Chưa có tài khoản? <Link href="/register">Đăng ký ngay</Link>
        </p>
      </div>
    </main>
  );
}
