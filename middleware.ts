import { NextResponse, type NextRequest } from 'next/server';


export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isProtected = pathname.startsWith('/dashboard') || pathname.startsWith('/admin') || pathname.startsWith('/student');

  if (!isProtected) {
    return NextResponse.next();
  }

  const accessToken = request.cookies.get('sb-access-token')?.value;

  if (!accessToken) {
    const loginUrl = new URL('/login', request.url);
    return NextResponse.redirect(loginUrl);
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnon) {
    return NextResponse.next();
  }

  const userResponse = await fetch(`${supabaseUrl}/auth/v1/user`, {
    headers: {
      apikey: supabaseAnon,
      Authorization: `Bearer ${accessToken}`
    }
  });

  if (!userResponse.ok) {
    const loginUrl = new URL('/login', request.url);
    return NextResponse.redirect(loginUrl);
  }

  const user = (await userResponse.json()) as { id: string };

  const profileResponse = await fetch(`${supabaseUrl}/rest/v1/profiles?id=eq.${user.id}&select=role`, {
    headers: {
      apikey: supabaseAnon,
      Authorization: `Bearer ${accessToken}`
    }
  });

  if (!profileResponse.ok) {
    return NextResponse.next();
  }

  const [profile] = (await profileResponse.json()) as { role: 'admin' | 'teacher' | 'student' }[];
  const role = profile?.role;

  if (pathname.startsWith('/admin') && role !== 'admin' && role !== 'teacher') {
    return NextResponse.redirect(new URL('/dashboard?error=Bạn không có quyền vào admin.', request.url));
  }

  if (pathname.startsWith('/student') && role !== 'student') {
    return NextResponse.redirect(new URL('/dashboard?error=Bạn không có quyền vào khu vực học viên.', request.url));
  }


  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/admin/:path*', '/student/:path*']
};
