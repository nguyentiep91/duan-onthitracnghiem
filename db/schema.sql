-- PostgreSQL schema for online exam platform

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TYPE user_role AS ENUM ('ADMIN', 'TEACHER', 'STUDENT');
CREATE TYPE user_status AS ENUM ('ACTIVE', 'LOCKED');
CREATE TYPE question_type AS ENUM ('SINGLE_CHOICE', 'MULTI_CHOICE', 'TRUE_FALSE', 'FILL_BLANK');
CREATE TYPE difficulty_level AS ENUM ('EASY', 'MEDIUM', 'HARD');
CREATE TYPE publish_status AS ENUM ('DRAFT', 'PUBLISHED', 'HIDDEN');
CREATE TYPE exam_status AS ENUM ('DRAFT', 'PUBLISHED', 'LOCKED');
CREATE TYPE session_status AS ENUM ('IN_PROGRESS', 'SUBMITTED', 'AUTO_SUBMITTED', 'EXPIRED');
CREATE TYPE certificate_status AS ENUM ('PENDING', 'APPROVED', 'REJECTED', 'ISSUED');

CREATE TABLE organizations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  code VARCHAR(50) UNIQUE,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID REFERENCES organizations(id) ON DELETE SET NULL,
  full_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  phone VARCHAR(30),
  password_hash TEXT NOT NULL,
  role user_role NOT NULL DEFAULT 'STUDENT',
  status user_status NOT NULL DEFAULT 'ACTIVE',
  company_name VARCHAR(255),
  date_of_birth DATE,
  national_id VARCHAR(50),
  email_verified_at TIMESTAMP,
  registered_at TIMESTAMP NOT NULL DEFAULT NOW(),
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE courses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  thumbnail_url TEXT,
  visibility publish_status NOT NULL DEFAULT 'DRAFT',
  start_date DATE,
  created_by UUID REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE topics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE questions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  topic_id UUID REFERENCES topics(id) ON DELETE SET NULL,
  question_type question_type NOT NULL,
  content TEXT NOT NULL,
  explanation TEXT,
  difficulty difficulty_level NOT NULL DEFAULT 'MEDIUM',
  score NUMERIC(6,2) NOT NULL DEFAULT 1,
  status publish_status NOT NULL DEFAULT 'DRAFT',
  image_url TEXT,
  attachment_url TEXT,
  created_by UUID REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE question_options (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  question_id UUID NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
  option_key VARCHAR(5) NOT NULL,
  option_text TEXT NOT NULL,
  is_correct BOOLEAN NOT NULL DEFAULT FALSE,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  UNIQUE(question_id, option_key)
);

CREATE TABLE question_tags (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  question_id UUID NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
  tag_name VARCHAR(100) NOT NULL,
  UNIQUE(question_id, tag_name)
);

CREATE TABLE student_groups (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE group_members (
  group_id UUID REFERENCES student_groups(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  PRIMARY KEY (group_id, user_id)
);

CREATE TABLE exams (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  course_id UUID REFERENCES courses(id) ON DELETE SET NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  question_pick_mode VARCHAR(20) NOT NULL CHECK (question_pick_mode IN ('MANUAL', 'RANDOM')),
  question_count INT NOT NULL DEFAULT 20,
  duration_minutes INT NOT NULL DEFAULT 30,
  max_attempts INT NOT NULL DEFAULT 1,
  passing_score NUMERIC(6,2) NOT NULL DEFAULT 0,
  show_answers BOOLEAN NOT NULL DEFAULT TRUE,
  show_explanations BOOLEAN NOT NULL DEFAULT FALSE,
  shuffle_questions BOOLEAN NOT NULL DEFAULT TRUE,
  shuffle_options BOOLEAN NOT NULL DEFAULT TRUE,
  anti_copy BOOLEAN NOT NULL DEFAULT FALSE,
  anti_multi_tab BOOLEAN NOT NULL DEFAULT FALSE,
  start_at TIMESTAMP,
  end_at TIMESTAMP,
  status exam_status NOT NULL DEFAULT 'DRAFT',
  created_by UUID REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE exam_questions (
  exam_id UUID REFERENCES exams(id) ON DELETE CASCADE,
  question_id UUID REFERENCES questions(id) ON DELETE CASCADE,
  sort_order INT NOT NULL DEFAULT 0,
  PRIMARY KEY (exam_id, question_id)
);

CREATE TABLE exam_target_groups (
  exam_id UUID REFERENCES exams(id) ON DELETE CASCADE,
  group_id UUID REFERENCES student_groups(id) ON DELETE CASCADE,
  PRIMARY KEY (exam_id, group_id)
);

CREATE TABLE exam_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  exam_id UUID NOT NULL REFERENCES exams(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  attempt_no INT NOT NULL,
  started_at TIMESTAMP NOT NULL DEFAULT NOW(),
  submitted_at TIMESTAMP,
  duration_seconds INT,
  score NUMERIC(8,2),
  total_questions INT,
  correct_count INT,
  wrong_count INT,
  unanswered_count INT,
  percentage NUMERIC(5,2),
  is_passed BOOLEAN,
  status session_status NOT NULL DEFAULT 'IN_PROGRESS',
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  UNIQUE (exam_id, student_id, attempt_no)
);

CREATE TABLE exam_session_answers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id UUID NOT NULL REFERENCES exam_sessions(id) ON DELETE CASCADE,
  question_id UUID NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
  selected_option_keys TEXT,
  text_answer TEXT,
  is_correct BOOLEAN,
  earned_score NUMERIC(6,2) DEFAULT 0,
  answered_at TIMESTAMP,
  UNIQUE(session_id, question_id)
);

CREATE TABLE import_jobs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  created_by UUID REFERENCES users(id) ON DELETE SET NULL,
  source_type VARCHAR(20) NOT NULL CHECK (source_type IN ('MANUAL', 'EXCEL', 'WORD')),
  file_url TEXT,
  total_rows INT DEFAULT 0,
  valid_rows INT DEFAULT 0,
  invalid_rows INT DEFAULT 0,
  status VARCHAR(20) NOT NULL CHECK (status IN ('UPLOADED', 'PARSING', 'PREVIEW', 'IMPORTED', 'FAILED')),
  error_report_url TEXT,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE import_job_rows (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  import_job_id UUID NOT NULL REFERENCES import_jobs(id) ON DELETE CASCADE,
  row_no INT NOT NULL,
  payload JSONB NOT NULL,
  is_valid BOOLEAN NOT NULL DEFAULT TRUE,
  errors JSONB,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE certificates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  exam_session_id UUID REFERENCES exam_sessions(id) ON DELETE SET NULL,
  certificate_code VARCHAR(100) UNIQUE NOT NULL,
  course_name VARCHAR(255),
  exam_name VARCHAR(255),
  completed_at TIMESTAMP NOT NULL DEFAULT NOW(),
  status certificate_status NOT NULL DEFAULT 'PENDING',
  pdf_url TEXT,
  qr_code_url TEXT,
  approved_by UUID REFERENCES users(id) ON DELETE SET NULL,
  approved_at TIMESTAMP,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  actor_id UUID REFERENCES users(id) ON DELETE SET NULL,
  actor_role user_role,
  action VARCHAR(100) NOT NULL,
  entity_type VARCHAR(100) NOT NULL,
  entity_id UUID,
  metadata JSONB,
  ip_address VARCHAR(50),
  user_agent TEXT,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_status ON users(status);
CREATE INDEX idx_questions_topic ON questions(topic_id);
CREATE INDEX idx_questions_status ON questions(status);
CREATE INDEX idx_exams_status ON exams(status);
CREATE INDEX idx_exams_course ON exams(course_id);
CREATE INDEX idx_sessions_exam_student ON exam_sessions(exam_id, student_id);
CREATE INDEX idx_sessions_created ON exam_sessions(created_at);
CREATE INDEX idx_import_jobs_status ON import_jobs(status);
CREATE INDEX idx_certificates_code ON certificates(certificate_code);
CREATE INDEX idx_audit_logs_actor ON audit_logs(actor_id);
