import { NextResponse } from 'next/server';

export function middleware(request) {
  // Get the token from cookies
  const token = request.cookies.get('token')?.value;
  
  // Define public paths that don't require authentication
  const publicPaths = ['/auth/login', '/auth/register', '/auth/forgot-password'];
  
  // Check if the current path is a public path
  const isPublicPath = publicPaths.some(path => 
    request.nextUrl.pathname.startsWith(path)
  );

  // If user is not logged in and trying to access a protected route
  if (!token && !isPublicPath) {
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }

  // If user is logged in and trying to access login page
  if (token && isPublicPath) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

// Configure which routes to run middleware on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!api|_next/static|_next/image|favicon.ico|public).*)',
  ],
};
