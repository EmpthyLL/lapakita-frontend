import { routing } from "@/i18n/routing";
import { auth } from "@/lib/auth";
import createMiddleware from "next-intl/middleware";
import { NextRequest, NextResponse } from "next/server";

const handleI18nRouting = createMiddleware(routing);

const guestOnlyPages = [
  "/login",
  "/register",
  "/verify-otp",
  "/forgot-password",
  "/reset-password",
];

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

const isDashboardPage = (pathname: string) => {
  const path = getPathWithoutLocale(pathname);
  return path.startsWith("/dashboard");
};

export default async function middleware(request: NextRequest) {
  const response = handleI18nRouting(request);

  const pathname = request.nextUrl.pathname;
  const match = pathname.match(/^\/(en|id)/);
  const locale = match ? match[1] : routing.defaultLocale;

  const session = await auth();

  const isProfileIncomplete =
    session?.user && (!session.user.defaultPhone || !session.user.defaultName);

  // 1. JIKA USER SUDAH LOGIN
  if (session) {
    // A. Buka /dashboard tapi profil belum lengkap -> redirect ke /complete-profile
    if (isProfileIncomplete && isDashboardPage(pathname)) {
      return NextResponse.redirect(
        new URL(`/${locale}/complete-profile`, request.url),
      );
    }

    // B. Buka /complete-profile tapi profil SUDAH lengkap -> redirect ke /dashboard
    if (!isProfileIncomplete && isCompleteProfilePage(pathname)) {
      return NextResponse.redirect(
        new URL(`/${locale}/dashboard`, request.url),
      );
    }

    // C. Buka Guest Pages (/login, /register, dll)
    if (isGuestOnlyPage(pathname)) {
      const targetPath = isProfileIncomplete
        ? "/complete-profile"
        : "/dashboard";
      return NextResponse.redirect(
        new URL(`/${locale}${targetPath}`, request.url),
      );
    }
  }

  // 2. JIKA USER BELUM LOGIN & mencoba buka Halaman Terproteksi (/dashboard atau /complete-profile)
  if (
    !session &&
    (isDashboardPage(pathname) || isCompleteProfilePage(pathname))
  ) {
    return NextResponse.redirect(new URL(`/${locale}/login`, request.url));
  }

  return response;
}

export const config = {
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
