import createMiddleware from "next-intl/middleware";
import { NextRequest, NextResponse } from "next/server";
import { routing } from "./i18n/routing";
import { auth } from "./lib/auth";

const handleI18nRouting = createMiddleware(routing);

// Halaman khusus tamu (Guest Only) - User terautentikasi dilarang masuk
const authPages = [
  "/login",
  "/register",
  "/verify-otp",
  "/forgot-password",
  "/reset-password",
  "/complete-profile",
];

// Helper mengecek halaman Auth
const isAuthPage = (pathname: string) => {
  const pathWithoutLocale = pathname.replace(/^\/(en|id)/, "") || "/";
  return authPages.some((page) => pathWithoutLocale.startsWith(page));
};

// Helper mengecek halaman Terproteksi (Semua yang berawalan /dashboard)
const isProtectedPage = (pathname: string) => {
  const pathWithoutLocale = pathname.replace(/^\/(en|id)/, "") || "/";
  return pathWithoutLocale.startsWith("/dashboard");
};

export default async function middleware(request: NextRequest) {
  // 1. Jalankan routing i18n
  const response = handleI18nRouting(request);

  // Deteksi locale yang sedang aktif
  const pathname = request.nextUrl.pathname;
  const match = pathname.match(/^\/(en|id)/);
  const locale = match ? match[1] : routing.defaultLocale;

  // 2. Ambil session user dari NextAuth
  const session = await auth();

  // 3. Jika USER SUDAH LOGIN & mencoba buka halaman Auth (/login, /register, dll)
  if (session && isAuthPage(pathname)) {
    return NextResponse.redirect(new URL(`/${locale}/dashboard`, request.url));
  }

  // 4. Jika USER BELUM LOGIN & mencoba buka halaman /dashboard (dan turunan sub-route nya)
  if (!session && isProtectedPage(pathname)) {
    return NextResponse.redirect(new URL(`/${locale}/login`, request.url));
  }

  return response;
}

export const config = {
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
