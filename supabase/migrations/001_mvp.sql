-- MVP schema for Supabase PostgreSQL

create extension if not exists "pgcrypto";

create type public.user_role as enum ('admin', 'teacher', 'student');

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  role public.user_role not null default 'student',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.courses (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  created_at timestamptz not null default now(),
  created_by uuid references public.profiles(id) on delete set null
);

create table if not exists public.question_categories (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  description text,
  created_at timestamptz not null default now(),
  created_by uuid references public.profiles(id) on delete set null
);

create table if not exists public.questions (
  id uuid primary key default gen_random_uuid(),
  category_id uuid not null references public.question_categories(id) on delete restrict,
  course_id uuid references public.courses(id) on delete set null,
  content text not null,
  explanation text,
  created_at timestamptz not null default now(),
  created_by uuid references public.profiles(id) on delete set null
);

create table if not exists public.answers (
  id uuid primary key default gen_random_uuid(),
  question_id uuid not null references public.questions(id) on delete cascade,
  answer_key text not null,
  content text not null,
  is_correct boolean not null default false,
  created_at timestamptz not null default now(),
  unique(question_id, answer_key)
);

create table if not exists public.exams (
  id uuid primary key default gen_random_uuid(),
  course_id uuid references public.courses(id) on delete set null,
  title text not null,
  description text,
  duration_minutes integer not null default 30,
  created_at timestamptz not null default now(),
  created_by uuid references public.profiles(id) on delete set null
);

create table if not exists public.exam_questions (
  exam_id uuid not null references public.exams(id) on delete cascade,
  question_id uuid not null references public.questions(id) on delete cascade,
  sort_order integer not null default 0,
  primary key(exam_id, question_id)
);

create table if not exists public.exam_attempts (
  id uuid primary key default gen_random_uuid(),
  exam_id uuid not null references public.exams(id) on delete cascade,
  student_id uuid not null references public.profiles(id) on delete cascade,
  score numeric(6,2) default 0,
  started_at timestamptz not null default now(),
  submitted_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists public.exam_attempt_answers (
  id uuid primary key default gen_random_uuid(),
  exam_attempt_id uuid not null references public.exam_attempts(id) on delete cascade,
  question_id uuid not null references public.questions(id) on delete cascade,
  answer_id uuid references public.answers(id) on delete set null,
  created_at timestamptz not null default now(),
  unique(exam_attempt_id, question_id)
);

create index if not exists idx_questions_category on public.questions(category_id);
create index if not exists idx_questions_course on public.questions(course_id);
create index if not exists idx_answers_question on public.answers(question_id);
create index if not exists idx_attempts_exam on public.exam_attempts(exam_id);
create index if not exists idx_attempts_student on public.exam_attempts(student_id);

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, role)
  values (new.id, coalesce(new.raw_user_meta_data ->> 'full_name', ''), 'student')
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

-- RLS
alter table public.profiles enable row level security;
alter table public.courses enable row level security;
alter table public.question_categories enable row level security;
alter table public.questions enable row level security;
alter table public.answers enable row level security;
alter table public.exams enable row level security;
alter table public.exam_questions enable row level security;
alter table public.exam_attempts enable row level security;
alter table public.exam_attempt_answers enable row level security;

create or replace function public.current_user_role()
returns public.user_role
language sql
stable
as $$
  select role from public.profiles where id = auth.uid();
$$;

create policy "profiles select own or admin"
on public.profiles
for select
using (id = auth.uid() or public.current_user_role() = 'admin');

create policy "profiles update admin only"
on public.profiles
for update
using (public.current_user_role() = 'admin')
with check (public.current_user_role() = 'admin');

create policy "profiles insert self"
on public.profiles
for insert
with check (id = auth.uid());

create policy "courses read authenticated"
on public.courses
for select
using (auth.role() = 'authenticated');

create policy "courses write admin_teacher"
on public.courses
for all
using (public.current_user_role() in ('admin', 'teacher'))
with check (public.current_user_role() in ('admin', 'teacher'));

create policy "categories read authenticated"
on public.question_categories
for select
using (auth.role() = 'authenticated');

create policy "categories write admin_teacher"
on public.question_categories
for all
using (public.current_user_role() in ('admin', 'teacher'))
with check (public.current_user_role() in ('admin', 'teacher'));

create policy "questions read authenticated"
on public.questions
for select
using (auth.role() = 'authenticated');

create policy "questions write admin_teacher"
on public.questions
for all
using (public.current_user_role() in ('admin', 'teacher'))
with check (public.current_user_role() in ('admin', 'teacher'));

create policy "answers read authenticated"
on public.answers
for select
using (auth.role() = 'authenticated');

create policy "answers write admin_teacher"
on public.answers
for all
using (public.current_user_role() in ('admin', 'teacher'))
with check (public.current_user_role() in ('admin', 'teacher'));

create policy "exams read authenticated"
on public.exams
for select
using (auth.role() = 'authenticated');

create policy "exams write admin_teacher"
on public.exams
for all
using (public.current_user_role() in ('admin', 'teacher'))
with check (public.current_user_role() in ('admin', 'teacher'));

create policy "exam_questions read authenticated"
on public.exam_questions
for select
using (auth.role() = 'authenticated');

create policy "exam_questions write admin_teacher"
on public.exam_questions
for all
using (public.current_user_role() in ('admin', 'teacher'))
with check (public.current_user_role() in ('admin', 'teacher'));

create policy "attempts read own or admin"
on public.exam_attempts
for select
using (student_id = auth.uid() or public.current_user_role() in ('admin', 'teacher'));

create policy "attempts insert own"
on public.exam_attempts
for insert
with check (student_id = auth.uid());

create policy "attempt_answers read own or admin"
on public.exam_attempt_answers
for select
using (
  exists (
    select 1 from public.exam_attempts ea
    where ea.id = exam_attempt_id and (ea.student_id = auth.uid() or public.current_user_role() in ('admin', 'teacher'))
  )
);

create policy "attempt_answers insert own"
on public.exam_attempt_answers
for insert
with check (
  exists (
    select 1 from public.exam_attempts ea
    where ea.id = exam_attempt_id and ea.student_id = auth.uid()
  )
);

insert into public.question_categories (name, description)
values
  ('Toán', 'Danh mục câu hỏi môn Toán'),
  ('Tiếng Anh', 'Danh mục câu hỏi môn Tiếng Anh'),
  ('Tin học', 'Danh mục câu hỏi môn Tin học')
on conflict (name) do nothing;
