-- MVP schema for Next.js + Supabase
create extension if not exists "pgcrypto";

create type public.app_role as enum ('admin', 'teacher', 'student');

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  role public.app_role not null default 'student',
  created_at timestamptz not null default now()
);

create table if not exists public.courses (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  title text not null,
  description text not null,
  created_by uuid references auth.users(id),
  created_at timestamptz not null default now()
);

create table if not exists public.questions (
  id uuid primary key default gen_random_uuid(),
  course_id uuid not null references public.courses(id) on delete cascade,
  question_text text not null,
  option_a text not null,
  option_b text not null,
  option_c text not null,
  option_d text not null,
  correct_option text not null check (correct_option in ('A', 'B', 'C', 'D')),
  explanation text not null,
  created_by uuid references auth.users(id),
  created_at timestamptz not null default now()
);

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
as $$
begin
  insert into public.profiles (id, full_name, role)
  values (new.id, coalesce(new.raw_user_meta_data ->> 'full_name', ''),
    coalesce((new.raw_user_meta_data ->> 'role')::public.app_role, 'student'))
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute procedure public.handle_new_user();

alter table public.profiles enable row level security;
alter table public.courses enable row level security;
alter table public.questions enable row level security;

create or replace function public.current_role()
returns public.app_role
language sql
stable
as $$
  select role from public.profiles where id = auth.uid();
$$;

drop policy if exists "Profiles select own" on public.profiles;
create policy "Profiles select own"
on public.profiles
for select
using (auth.uid() = id or public.current_role() in ('admin', 'teacher'));

drop policy if exists "Profiles update own" on public.profiles;
create policy "Profiles update own"
on public.profiles
for update
using (auth.uid() = id);

drop policy if exists "Courses read all auth" on public.courses;
create policy "Courses read all auth"
on public.courses
for select
using (auth.role() = 'authenticated');

drop policy if exists "Courses manage by admin teacher" on public.courses;
create policy "Courses manage by admin teacher"
on public.courses
for all
using (public.current_role() in ('admin', 'teacher'))
with check (public.current_role() in ('admin', 'teacher'));

drop policy if exists "Questions read all auth" on public.questions;
create policy "Questions read all auth"
on public.questions
for select
using (auth.role() = 'authenticated');

drop policy if exists "Questions manage by admin teacher" on public.questions;
create policy "Questions manage by admin teacher"
on public.questions
for all
using (public.current_role() in ('admin', 'teacher'))
with check (public.current_role() in ('admin', 'teacher'));
