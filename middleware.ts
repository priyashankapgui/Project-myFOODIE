// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';


export function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value; 

  const protectedRoutes = [
    "/",
    "/dashboard",
    "/profile",
    "/employees",
    "/managers",
    "/suppliers",
    "/today-special",
    "/orders",
    "/complaints",
  ];

  const pathname = request.nextUrl.pathname;

  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );

  if (isProtectedRoute && !token) {
    const signinUrl = new URL("/signin", request.url);
    signinUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(signinUrl);
  }

  const authRoutes = ["/signin", "/signup", "/forgot-password"];
  if (authRoutes.includes(pathname) && token) {
    return NextResponse.redirect(new URL("/admin", request.url));
  }

  return NextResponse.next();
}
