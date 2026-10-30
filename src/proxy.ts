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
  "/forget-password",
  "/reset-password",
];

const getPathWithoutLocale = (pathname: string) => {
  return pathname.replace(/^\/(en|id)(?=\/|$)/, "") || "/";
};

const isPathOrSubpath = (pathname: string, path: string) =>
  pathname === path || pathname.startsWith(`${path}/`);

const isGuestOnlyPage = (pathname: string) => {
  const path = getPathWithoutLocale(pathname);
  return guestOnlyPages.some((page) => isPathOrSubpath(path, page));
};

const isCompleteProfilePage = (pathname: string) => {
  const path = getPathWithoutLocale(pathname);
  return isPathOrSubpath(path, "/complete-profile");
};

const isDashboardPage = (pathname: string) => {
  const path = getPathWithoutLocale(pathname);
  return isPathOrSubpath(path, "/dashboard");
};

export default async function middleware(request: NextRequest) {
  const response = handleI18nRouting(request);

  const pathname = request.nextUrl.pathname;
  const isGuestPage = isGuestOnlyPage(pathname);
  const isProtectedPage =
    isDashboardPage(pathname) || isCompleteProfilePage(pathname);

  if (!isGuestPage && !isProtectedPage) {
    return response;
  }

  const match = pathname.match(/^\/(en|id)(?=\/|$)/);
  const locale = match ? match[1] : routing.defaultLocale;

  const session = await auth();
  const authenticatedUser =
    session?.error !== "RefreshTokenError" && session?.user?.token
      ? session.user
      : undefined;
  const isAuthenticated = Boolean(authenticatedUser);

  const isProfileIncomplete = Boolean(
    authenticatedUser &&
      (!authenticatedUser.defaultName ||
        !authenticatedUser.defaultPhone ||
        !authenticatedUser.defaultPhone.number),
  );

  if (isAuthenticated) {
    if (isProfileIncomplete && isDashboardPage(pathname)) {
      return NextResponse.redirect(
        new URL(`/${locale}/complete-profile`, request.url),
      );
    }

    if (!isProfileIncomplete && isCompleteProfilePage(pathname)) {
      return NextResponse.redirect(
        new URL(`/${locale}/dashboard`, request.url),
      );
    }

    if (isGuestPage) {
      const targetPath = isProfileIncomplete
        ? "/complete-profile"
        : "/dashboard";
      return NextResponse.redirect(
        new URL(`/${locale}${targetPath}`, request.url),
      );
    }
  }

  if (
    !isAuthenticated &&
    isProtectedPage
  ) {
    return NextResponse.redirect(new URL(`/${locale}/login`, request.url));
  }

  return response;
}

export const config = {
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
