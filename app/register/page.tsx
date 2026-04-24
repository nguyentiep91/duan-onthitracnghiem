import Link from 'next/link';
import { registerAction } from '@/app/actions/auth';

type PageProps = {
  searchParams?: { [key: string]: string | string[] | undefined };
};

export default function RegisterPage({ searchParams }: PageProps) {
  const error = typeof searchParams?.error === 'string' ? searchParams.error : undefined;

  return (
    <main className="container auth-wrap">
      <div className="auth-card">
        <h1>Đăng ký thành viên</h1>
        {error ? <p className="alert error">{error}</p> : null}
        <form action={registerAction} className="form-grid">
          <label>
            Họ và tên
            <input name="fullName" required minLength={2} />
          </label>
          <label>
            Email
            <input name="email" type="email" required />
          </label>
          <label>
            Mật khẩu
            <input name="password" type="password" required minLength={8} />
          </label>
          <button className="btn btn-primary" type="submit">
            Tạo tài khoản
          </button>
        </form>
        <p>
          Đã có tài khoản? <Link href="/login">Đăng nhập</Link>
        </p>
      </div>
    </main>
  );
}
