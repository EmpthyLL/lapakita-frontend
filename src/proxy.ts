import createMiddleware from "next-intl/middleware";
import { NextRequest, NextResponse } from "next/server";
import { routing } from "./i18n/routing";
import { auth } from "./lib/auth";

const handleI18nRouting = createMiddleware(routing);

// Halaman khusus tamu (Guest Only)
const guestOnlyPages = [
  "/login",
  "/register",
  "/verify-otp",
  "/forgot-password",
  "/reset-password",
];

// Helper mengecek path tanpa locale
const getPathWithoutLocale = (pathname: string) => {
  return pathname.replace(/^\/(en|id)/, "") || "/";
};

// Helper pengecekan jenis halaman
const isGuestOnlyPage = (pathname: string) => {
  const path = getPathWithoutLocale(pathname);
  return guestOnlyPages.some((page) => path.startsWith(page));
};

const isCompleteProfilePage = (pathname: string) => {
  const path = getPathWithoutLocale(pathname);
  return path.startsWith("/complete-profile");
};

const isProtectedPage = (pathname: string) => {
  const path = getPathWithoutLocale(pathname);
  return path.startsWith("/dashboard");
};

export default async function middleware(request: NextRequest) {
  // 1. Jalankan routing i18n
  const response = handleI18nRouting(request);

  // Deteksi locale yang aktif
  const pathname = request.nextUrl.pathname;
  const match = pathname.match(/^\/(en|id)/);
  const locale = match ? match[1] : routing.defaultLocale;

  // 2. Ambil session user dari NextAuth
  const session = await auth();

  // Cek kelengkapan data dasar user (defaultPhone / defaultName)
  const isProfileIncomplete =
    session?.user && (!session.user.phone || !session.user.name);

  // 3. JIKA PROFIL BELUM LENGKAP -> Paksa tetap di /complete-profile
  if (session && isProfileIncomplete) {
    if (!isCompleteProfilePage(pathname)) {
      return NextResponse.redirect(
        new URL(`/${locale}/complete-profile`, request.url),
      );
    }
    return response;
  }

  // 4. JIKA PROFIL SUDAH LENGKAP & mencoba buka halaman /complete-profile -> Redirect ke Dashboard
  if (session && !isProfileIncomplete && isCompleteProfilePage(pathname)) {
    return NextResponse.redirect(new URL(`/${locale}/dashboard`, request.url));
  }

  // 5. JIKA USER SUDAH LOGIN & mencoba buka Halaman Guest (/login, /register, dll)
  if (session && isGuestOnlyPage(pathname)) {
    return NextResponse.redirect(new URL(`/${locale}/dashboard`, request.url));
  }

  // 6. JIKA USER BELUM LOGIN & mencoba buka Halaman Terproteksi (/dashboard)
  if (!session && isProtectedPage(pathname)) {
    return NextResponse.redirect(new URL(`/${locale}/login`, request.url));
  }

  return response;
}

export const config = {
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
