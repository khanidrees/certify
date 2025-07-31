import { NextResponse, NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const cookieName = 'token'; // Replace with your actual cookie name
  // Check if the authentication cookie exists
  // console.log(request.cookies);
  // console.log(request.nextUrl.pathname);
  if (!request.cookies.has(cookieName) || !request.cookies.has('role')) {
    // If the cookie is not present and the user is not already on the login page,
    // redirect to the login page.
    if (!request.nextUrl.pathname.includes('/auth')) {
      return NextResponse.redirect(new URL('/auth/signin', request.url));
    }
    return NextResponse.next();
  }

  // token and role is present

  const userRole = request.cookies.get('role')?.value;
  console.log(userRole);
  console.log(request.nextUrl.pathname);

  // If the cookie exists and the user is on the login page, redirect to the home page.
  if (request.nextUrl.pathname.includes('/auth') ) {
    if(userRole === 'learner') {
      return NextResponse.redirect(new URL('/learner-dashboard', request.url));
    }
    if(userRole === 'admin') {
      return NextResponse.redirect(new URL('/admin/dashboard', request.url));
    }
    if(userRole === 'organization') {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
    return NextResponse.redirect(new URL('/', request.url));
  }
  // console.log(userRole !== 'admin')
  // only role can access respective dashboards
  if (request.nextUrl.pathname ==='/admin/dashboard' && userRole !== 'admin') {
    return NextResponse.redirect(new URL('/auth/signin', request.url));
  }
  if (request.nextUrl.pathname === '/dashboard'  && userRole !== 'organization') {
    return NextResponse.redirect(new URL('/auth/signin', request.url));
  }
  if (request.nextUrl.pathname==='/learner-dashboard' && userRole !== 'learner') {
    return NextResponse.redirect(new URL('/auth/signin', request.url));
  }


  return NextResponse.next();
}

// Configure the paths where the middleware should run.
export const config = {
  matcher: [
    '/auth/signin',
    '/auth/signup',
    '/admin/dashboard',
    '/learner-dashboard',
    '/organization',
    '/dashboard',

  ],
};