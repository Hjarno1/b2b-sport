import { NextRequest, NextResponse } from 'next/server';

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const clubId = req.cookies.get('clubId')?.value;
  console.log('[middleware] clubId =', clubId);

  if (pathname === '/login' && clubId) {
    const redirectUrl = req.nextUrl.clone();
    redirectUrl.pathname = `/clubs/${clubId}`;
    return NextResponse.redirect(redirectUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/login', '/app/(auth)/login'],
};
