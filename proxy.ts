import { routing } from "@/i18n/routing";
import { auth } from "@/lib/auth";
import createMiddleware from "next-intl/middleware";
import { NextRequest, NextResponse } from "next/server";

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

const isGuestOnlyPage = (pathname: string) => {
  const path = getPathWithoutLocale(pathname);
  return guestOnlyPages.some((page) => path.startsWith(page));
};

const isCompleteProfilePage = (pathname: string) => {
  const path = getPathWithoutLocale(pathname);
  return path.startsWith("/complete-profile");
};

// Protected pages: /dashboard dan /complete-profile
const isProtectedPage = (pathname: string) => {
  const path = getPathWithoutLocale(pathname);
  return path.startsWith("/dashboard") || path.startsWith("/complete-profile");
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

  // Cek kelengkapan data dasar user (defaultPhone & defaultName)
  const isProfileIncomplete =
    session?.user && (!session.user.defaultPhone || !session.user.defaultName);

  // 3. JIKA USER SUDAH LOGIN:
  if (session) {
    // A. Jika profil BELUM LENGKAP & mencoba akses Protected Page selain /complete-profile -> Redirect ke /complete-profile
    if (
      isProfileIncomplete &&
      !isCompleteProfilePage(pathname) &&
      isProtectedPage(pathname)
    ) {
      return NextResponse.redirect(
        new URL(`/${locale}/complete-profile`, request.url),
      );
    }

    // B. Jika profil SUDAH LENGKAP & mencoba buka /complete-profile -> Redirect ke /dashboard
    if (!isProfileIncomplete && isCompleteProfilePage(pathname)) {
      return NextResponse.redirect(
        new URL(`/${locale}/dashboard`, request.url),
      );
    }

    // C. Jika mencoba buka Guest Pages (/login, /register, dll):
    if (isGuestOnlyPage(pathname)) {
      const targetPath = isProfileIncomplete
        ? "/complete-profile"
        : "/dashboard";
      return NextResponse.redirect(
        new URL(`/${locale}${targetPath}`, request.url),
      );
    }
  }

  // 4. JIKA USER BELUM LOGIN & mencoba buka Halaman Terproteksi (/dashboard atau /complete-profile)
  if (!session && isProtectedPage(pathname)) {
    return NextResponse.redirect(new URL(`/${locale}/login`, request.url));
  }

  return response;
}

export const config = {
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
