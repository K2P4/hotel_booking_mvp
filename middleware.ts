import { NextResponse, type NextRequest } from 'next/server';
import { createClient } from './app/lib/supabase/server';

export async function middleware(request: NextRequest) {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const path = request.nextUrl.pathname;

  const isLoginPage = path.startsWith('/login');
  const isRegisterPage = path.startsWith('/register');
  const isAuthPage = isLoginPage || isRegisterPage;
  const isAdminRoute = path.startsWith('/admin');
  const isHomeRoute = path === '/';

  // not-logged
  if (!user) {
    if (isAuthPage) {
      return NextResponse.next();
    }

    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', path);
    return NextResponse.redirect(loginUrl);
  }

  // logged
  if (user && isAuthPage) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  // admin
  if (isAdminRoute) {
    const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single();

    if (!profile || profile.role !== 'admin') {
      return NextResponse.redirect(new URL('/', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
};
