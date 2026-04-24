import Link from 'next/link';
import { registerAction } from '@/app/actions';

type Props = { searchParams: { error?: string; message?: string } };

export default function RegisterPage({ searchParams }: Props) {
  return (
    <main className="container auth-page">
      <h1>Tạo tài khoản học viên</h1>
      <p>Đăng ký để bắt đầu làm đề và theo dõi tiến độ ôn thi.</p>
      {searchParams.error ? <p className="alert error">{searchParams.error}</p> : null}
      {searchParams.message ? <p className="alert success">{searchParams.message}</p> : null}
      <form action={registerAction} className="form-card">
        <label>
          Họ và tên
          <input name="fullName" required minLength={2} maxLength={80} />
        </label>
        <label>
          Email
          <input type="email" name="email" required />
        </label>
        <label>
          Mật khẩu
          <input type="password" name="password" required minLength={6} maxLength={72} />
        </label>
        <button type="submit" className="btn btn-primary">
          Đăng ký
        </button>
      </form>
      <p>
        Đã có tài khoản? <Link href="/login">Đăng nhập tại đây</Link>
      </p>
    </main>
  );
}
