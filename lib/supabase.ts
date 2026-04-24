import { cookies } from 'next/headers';

export type UserRole = 'admin' | 'teacher' | 'student';

export type Session = {
  access_token: string;
  refresh_token: string;
  token_type: string;
  expires_in: number;
};

export type SupabaseUser = {
  id: string;
  email?: string;
};

const required = (value: string | undefined, key: string) => {
  if (!value) {
    throw new Error(`Thiếu biến môi trường ${key}`);
  }

  return value;
};

export const SUPABASE_URL = required(process.env.NEXT_PUBLIC_SUPABASE_URL, 'NEXT_PUBLIC_SUPABASE_URL');
export const SUPABASE_ANON_KEY = required(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY, 'NEXT_PUBLIC_SUPABASE_ANON_KEY');

const getHeaders = (token?: string) => {
  const headers: Record<string, string> = {
    apikey: SUPABASE_ANON_KEY,
    'Content-Type': 'application/json'
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  return headers;
};

export async function signUp(email: string, password: string, fullName: string) {
  const response = await fetch(`${SUPABASE_URL}/auth/v1/signup`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify({
      email,
      password,
      data: {
        full_name: fullName,
        role: 'student' satisfies UserRole
      }
    }),
    cache: 'no-store'
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data?.msg ?? 'Đăng ký thất bại');
  }

  return data as { session: Session | null };
}

export async function signIn(email: string, password: string) {
  const response = await fetch(`${SUPABASE_URL}/auth/v1/token?grant_type=password`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify({ email, password }),
    cache: 'no-store'
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data?.error_description ?? 'Đăng nhập thất bại');
  }

  return data as Session;
}

export function setSessionCookies(session: Session) {
  const cookieStore = cookies();
  cookieStore.set('sb-access-token', session.access_token, { httpOnly: true, sameSite: 'lax', secure: true, path: '/' });
  cookieStore.set('sb-refresh-token', session.refresh_token, { httpOnly: true, sameSite: 'lax', secure: true, path: '/' });
}

export function clearSessionCookies() {
  const cookieStore = cookies();
  cookieStore.delete('sb-access-token');
  cookieStore.delete('sb-refresh-token');
}

export async function getCurrentUser(token?: string): Promise<SupabaseUser | null> {
  const cookieStore = cookies();
  const accessToken = token ?? cookieStore.get('sb-access-token')?.value;

  if (!accessToken) {
    return null;
  }

  const response = await fetch(`${SUPABASE_URL}/auth/v1/user`, {
    headers: getHeaders(accessToken),
    cache: 'no-store'
  });

  if (!response.ok) {
    return null;
  }

  return (await response.json()) as SupabaseUser;
}

export async function getRoleByUserId(userId: string, token?: string): Promise<UserRole | null> {
  const cookieStore = cookies();
  const accessToken = token ?? cookieStore.get('sb-access-token')?.value;

  if (!accessToken) {
    return null;
  }

  const response = await fetch(`${SUPABASE_URL}/rest/v1/profiles?id=eq.${userId}&select=role`, {
    headers: getHeaders(accessToken),
    cache: 'no-store'
  });

  if (!response.ok) {
    return null;
  }

  const [profile] = (await response.json()) as { role: UserRole }[];
  return profile?.role ?? null;
}

export async function insertCourse(payload: { code: string; title: string; description: string }, token?: string) {
  const cookieStore = cookies();
  const accessToken = token ?? cookieStore.get('sb-access-token')?.value;

  const response = await fetch(`${SUPABASE_URL}/rest/v1/courses`, {
    method: 'POST',
    headers: {
      ...getHeaders(accessToken),
      Prefer: 'return=representation'
    },
    body: JSON.stringify(payload),
    cache: 'no-store'
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(error || 'Không thể tạo khóa học');
  }
}

export async function getCourses(token?: string) {
  const cookieStore = cookies();
  const accessToken = token ?? cookieStore.get('sb-access-token')?.value;

  const response = await fetch(`${SUPABASE_URL}/rest/v1/courses?select=id,code,title,description,created_at&order=created_at.desc`, {
    headers: getHeaders(accessToken),
    cache: 'no-store'
  });

  if (!response.ok) {
    return [];
  }

  return (await response.json()) as {
    id: string;
    code: string;
    title: string;
    description: string;
    created_at: string;
  }[];
}

export async function insertQuestion(
  payload: {
    course_id: string;
    question_text: string;
    option_a: string;
    option_b: string;
    option_c: string;
    option_d: string;
    correct_option: 'A' | 'B' | 'C' | 'D';
    explanation: string;
  },
  token?: string
) {
  const cookieStore = cookies();
  const accessToken = token ?? cookieStore.get('sb-access-token')?.value;

  const response = await fetch(`${SUPABASE_URL}/rest/v1/questions`, {
    method: 'POST',
    headers: {
      ...getHeaders(accessToken),
      Prefer: 'return=representation'
    },
    body: JSON.stringify(payload),
    cache: 'no-store'
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(error || 'Không thể tạo câu hỏi');
  }
}

export async function getQuestions(token?: string) {
  const cookieStore = cookies();
  const accessToken = token ?? cookieStore.get('sb-access-token')?.value;

  const response = await fetch(
    `${SUPABASE_URL}/rest/v1/questions?select=id,question_text,correct_option,course_id,created_at&order=created_at.desc&limit=20`,
    {
      headers: getHeaders(accessToken),
      cache: 'no-store'
    }
  );

  if (!response.ok) {
    return [];
  }

  return (await response.json()) as {
    id: string;
    question_text: string;
    correct_option: 'A' | 'B' | 'C' | 'D';
    course_id: string;
    created_at: string;
  }[];
}
