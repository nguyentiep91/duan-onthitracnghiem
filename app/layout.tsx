import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Nền tảng ôn thi trắc nghiệm trực tuyến',
  description:
    'Hệ thống ôn thi trắc nghiệm chuyên nghiệp: quản lý câu hỏi, import Excel/Word, tạo đề thi, dashboard học viên và admin.'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi">
      <body>{children}</body>
    </html>
  );
}
