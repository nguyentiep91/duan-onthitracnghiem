const primaryFeatures = [
  {
    title: 'Ngân hàng câu hỏi thông minh',
    desc: 'Tổ chức câu hỏi theo chuyên đề, mức độ và loại câu hỏi. Hỗ trợ giải thích đáp án, hình ảnh và file đính kèm.'
  },
  {
    title: 'Import Excel / Word',
    desc: 'Tải lên file theo mẫu chuẩn, kiểm tra lỗi tự động và xem trước dữ liệu trước khi lưu chính thức.'
  },
  {
    title: 'Tạo đề thi linh hoạt',
    desc: 'Tạo đề thủ công hoặc random từ ngân hàng câu hỏi. Cấu hình thời gian, số lần thi và điểm đạt.'
  },
  {
    title: 'Chấm điểm tự động',
    desc: 'Tính điểm ngay sau khi nộp bài, hiển thị số câu đúng/sai, thời gian làm bài và trạng thái đạt.'
  }
];

const questionBankItems = [
  'Một đáp án đúng, nhiều đáp án đúng, đúng/sai, điền khuyết',
  'Phân loại theo chuyên đề: Toán, Lý, Hóa, Tiếng Anh, nghiệp vụ...',
  'Cấu hình độ khó: dễ / trung bình / khó',
  'Cho phép ẩn/hiện câu hỏi theo trạng thái vận hành'
];

const dashboardCards = [
  {
    group: 'Dashboard học viên',
    metrics: ['Lịch sử thi', 'Kết quả từng đề', 'Tỷ lệ hoàn thành', 'Chứng nhận đã cấp']
  },
  {
    group: 'Dashboard admin',
    metrics: ['Tổng học viên', 'Tổng đề thi', 'Lượt thi theo ngày', 'Tỷ lệ đạt toàn hệ thống']
  }
];

export default function HomePage() {
  return (
    <main>
      <header className="topbar">
        <div className="container nav">
          <div className="brand">ExamPro Platform</div>
          <nav>
            <a href="#features">Tính năng</a>
            <a href="#question-bank">Ngân hàng câu hỏi</a>
            <a href="#dashboards">Dashboard</a>
            <button className="btn btn-secondary">Đăng ký</button>
          </nav>
        </div>
      </header>

      <section className="hero container">
        <p className="hero-badge">Nền tảng luyện thi trực tuyến tin cậy</p>
        <h1>Nền tảng ôn thi trắc nghiệm trực tuyến chuyên nghiệp</h1>
        <p>
          Hệ thống hỗ trợ tạo ngân hàng câu hỏi, import Excel/Word, tổ chức thi online, chấm điểm tự động và
          thống kê kết quả học viên nhanh chóng, chính xác.
        </p>
        <div className="actions">
          <button className="btn btn-primary">Bắt đầu ôn thi</button>
          <button className="btn btn-light">Xem khóa học</button>
        </div>
      </section>

      <section id="features" className="container section">
        <h2>Tính năng chính</h2>
        <div className="grid four">
          {primaryFeatures.map((item) => (
            <article className="card" key={item.title}>
              <h3>{item.title}</h3>
              <p>{item.desc}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="question-bank" className="container section split">
        <div>
          <h2>Ngân hàng câu hỏi chuẩn hóa</h2>
          <p>
            Xây dựng kho câu hỏi quy mô lớn với khả năng tái sử dụng theo từng khóa học/chuyên đề, giúp đội ngũ
            đào tạo giảm mạnh thời gian chuẩn bị đề.
          </p>
          <ul>
            {questionBankItems.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
        <aside className="highlight">
          <h3>Import dữ liệu chuyên nghiệp</h3>
          <p>Upload file Excel/Word, xem preview, phát hiện lỗi trùng, thiếu đáp án và sai định dạng.</p>
          <p className="mock">Mock data: 2.450 câu hỏi • 32 chuyên đề • 18 đề thi đang hoạt động</p>
        </aside>
      </section>

      <section className="container section">
        <h2>Quản lý đề thi & thành viên</h2>
        <div className="grid two">
          <article className="card">
            <h3>Quản lý đề thi</h3>
            <p>
              Cấu hình thời gian làm bài, số câu hỏi, số lần thi, điểm đạt, trộn câu hỏi/đáp án và lịch mở đề theo
              ngày.
            </p>
          </article>
          <article className="card">
            <h3>Đăng ký thành viên</h3>
            <p>
              Học viên đăng ký tài khoản, tham gia khóa học, luyện tập không giới hạn hoặc thi chính thức theo quyền
              được gán.
            </p>
          </article>
        </div>
      </section>

      <section id="dashboards" className="container section">
        <h2>Dashboard học viên & admin</h2>
        <div className="grid two">
          {dashboardCards.map((card) => (
            <article className="card" key={card.group}>
              <h3>{card.group}</h3>
              <ul>
                {card.metrics.map((metric) => (
                  <li key={metric}>{metric}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>

      <footer className="footer">
        <div className="container">
          <strong>ExamPro Platform</strong>
          <p>Giải pháp ôn thi trắc nghiệm hiện đại cho trung tâm đào tạo, trường học, viện nghiên cứu và doanh nghiệp.</p>
        </div>
      </footer>
    </main>
  );
}
