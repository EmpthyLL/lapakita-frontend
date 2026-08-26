"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import {
  ChevronDown,
  LayoutDashboard,
  LogOut,
  Menu,
  Repeat,
  User,
  Wallet,
  X,
} from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { LanguageSwitcher } from "../common/LanguageSwitcher";
import { Logo } from "./Logo";

type RoleVariant = "tenant" | "owner" | "supplier";

function isNavLinkActive(pathname: string, href: string) {
  if (href.startsWith("#")) return false;
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function SiteHeader() {
  const t = useTranslations("common.nav");
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { data: session } = useSession();

  const isLoggedIn = Boolean(session?.user);
  const userName = session?.user?.name || "User";
  const userAvatarUrl = session?.user?.avatarUrl || "";

  // Mengambil activeRole resmi dari session (default: tenant)
  const activeRole: RoleVariant =
    (session?.user?.activeRole as RoleVariant) || "tenant";

  const navLinks = [
    { label: t("home"), href: "/" },
    { label: t("stalls"), href: "/stalls" },
    { label: t("features"), href: "/features" },
    { label: t("about"), href: "/about" },
    { label: t("pricing"), href: "/pricing" },
    { label: t("contact"), href: "/contact" },
  ];

  const getInitials = (str: string) => {
    if (!str) return "U";
    return str
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/90 backdrop-blur supports-backdrop-filter:bg-background/70">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <div className="flex shrink-0 items-center">
          <Logo variant="full" />
        </div>

        {/* Desktop Nav */}
        <nav className="hidden items-center gap-1 lg:flex">
          {navLinks.map((link) => {
            const active = isNavLinkActive(pathname, link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "relative rounded-md px-3 py-2 text-sm font-medium transition-colors",
                  active
                    ? "text-primary"
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground",
                )}
              >
                {link.label}
                {active && (
                  <span className="absolute inset-x-3 -bottom-px h-0.5 rounded-full bg-gradient-brand" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Desktop Auth State & Language Switcher */}
        <div className="hidden items-center gap-2 lg:flex">
          <LanguageSwitcher showLabel={false} />

          <div className="mx-1 h-4 w-px bg-border" />

          {!isLoggedIn ? (
            <>
              <Link href="/login">
                <Button variant="ghost">{t("login")}</Button>
              </Link>
              <Link href="/register">
                <Button variant="primary">{t("get_started")}</Button>
              </Link>
            </>
          ) : (
            <>
              {/* Button Dashboard secara otomatis memakai variant: tenant / owner / supplier */}
              <Link href={`/dashboard/${activeRole}`}>
                <Button variant={activeRole}>
                  <LayoutDashboard className="mr-2 h-4 w-4" />
                  {t("dashboard")}
                </Button>
              </Link>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="relative flex items-center gap-1 rounded-full outline-none focus-visible:ring-2 focus-visible:ring-ring/50">
                    <Avatar className="h-9 w-9 border border-border">
                      <AvatarImage
                        src={userAvatarUrl}
                        alt={userName}
                        className="object-cover"
                      />
                      <AvatarFallback className="bg-primary-secondary text-primary font-bold text-xs">
                        {getInitials(userName)}
                      </AvatarFallback>
                    </Avatar>

                    {/* Status Dot Indikator Role Aktif */}
                    <span
                      className={cn(
                        "absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-background",
                        {
                          "bg-tenant": activeRole === "tenant",
                          "bg-owner": activeRole === "owner",
                          "bg-supplier": activeRole === "supplier",
                        },
                      )}
                    />
                    <ChevronDown className="h-4 w-4 text-muted-foreground" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-semibold leading-none text-foreground truncate">
                        {userName}
                      </p>
                      <p className="text-xs leading-none text-muted-foreground capitalize">
                        Role:{" "}
                        <span
                          className={cn("font-semibold", {
                            "text-tenant": activeRole === "tenant",
                            "text-owner": activeRole === "owner",
                            "text-supplier": activeRole === "supplier",
                          })}
                        >
                          {activeRole}
                        </span>
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />

                  <DropdownMenuItem asChild className="cursor-pointer">
                    <Link
                      href="/dashboard/profile"
                      className="flex items-center w-full"
                    >
                      <User className="mr-2 h-4 w-4" /> {t("profile")}
                    </Link>
                  </DropdownMenuItem>

                  <DropdownMenuItem asChild className="cursor-pointer">
                    <Link
                      href="/dashboard/wallet"
                      className="flex items-center w-full"
                    >
                      <Wallet className="mr-2 h-4 w-4" /> {t("wallet")}
                    </Link>
                  </DropdownMenuItem>

                  <DropdownMenuSub>
                    <DropdownMenuSubTrigger className="cursor-pointer">
                      <Repeat className="mr-2 h-4 w-4" /> {t("switch_role")}
                    </DropdownMenuSubTrigger>
                    <DropdownMenuSubContent>
                      <DropdownMenuItem asChild className="cursor-pointer">
                        <Link
                          href="/dashboard/tenant"
                          className="flex items-center w-full"
                        >
                          <span className="mr-2 h-2 w-2 rounded-full bg-tenant" />
                          {t("roles.tenant")}
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild className="cursor-pointer">
                        <Link
                          href="/dashboard/owner"
                          className="flex items-center w-full"
                        >
                          <span className="mr-2 h-2 w-2 rounded-full bg-owner" />
                          {t("roles.owner")}
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild className="cursor-pointer">
                        <Link
                          href="/dashboard/supplier"
                          className="flex items-center w-full"
                        >
                          <span className="mr-2 h-2 w-2 rounded-full bg-supplier" />
                          {t("roles.supplier")}
                        </Link>
                      </DropdownMenuItem>
                    </DropdownMenuSubContent>
                  </DropdownMenuSub>

                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => signOut({ callbackUrl: "/login" })}
                    className="text-destructive focus:text-destructive cursor-pointer"
                  >
                    <LogOut className="mr-2 h-4 w-4" /> {t("sign_out")}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          )}
        </div>

        {/* Mobile Hamburger & Sheet */}
        <div className="flex items-center gap-2 lg:hidden">
          <LanguageSwitcher showLabel={false} />

          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <button
                aria-label={mobileOpen ? "Close menu" : "Open menu"}
                className="relative flex h-10 w-10 items-center justify-center rounded-lg text-foreground transition-colors hover:bg-secondary outline-none"
              >
                <Menu
                  className={cn(
                    "absolute h-5 w-5 transition-all duration-300",
                    mobileOpen
                      ? "rotate-90 scale-0 opacity-0"
                      : "rotate-0 scale-100 opacity-100",
                  )}
                />
                <X
                  className={cn(
                    "absolute h-5 w-5 transition-all duration-300",
                    mobileOpen
                      ? "rotate-0 scale-100 opacity-100"
                      : "-rotate-90 scale-0 opacity-0",
                  )}
                />
              </button>
            </SheetTrigger>

            <SheetContent
              side="right"
              className="w-full max-w-xs p-0 sm:max-w-sm"
            >
              <div className="flex h-16 items-center border-b border-border px-4">
                <Logo variant="full" />
              </div>

              <div className="flex flex-col gap-1 p-4">
                {navLinks.map((link) => {
                  const active = isNavLinkActive(pathname, link.href);
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setMobileOpen(false)}
                      className={cn(
                        "rounded-lg px-3 py-2.5 text-base font-medium transition-colors",
                        active
                          ? "bg-primary-secondary text-primary"
                          : "text-foreground hover:bg-secondary",
                      )}
                    >
                      {link.label}
                    </Link>
                  );
                })}
              </div>

              <div className="mt-auto space-y-3 border-t border-border p-4">
                {!isLoggedIn ? (
                  <>
                    <Link
                      href="/register"
                      onClick={() => setMobileOpen(false)}
                      className="block"
                    >
                      <Button variant="primary" className="w-full">
                        {t("get_started")}
                      </Button>
                    </Link>
                    <Link
                      href="/login"
                      onClick={() => setMobileOpen(false)}
                      className="block"
                    >
                      <Button variant="outline" className="w-full">
                        {t("login")}
                      </Button>
                    </Link>
                  </>
                ) : (
                  <>
                    <Link
                      href={`/dashboard/${activeRole}`}
                      onClick={() => setMobileOpen(false)}
                      className="block"
                    >
                      <Button variant={activeRole} className="w-full">
                        <LayoutDashboard className="mr-2 h-4 w-4" />
                        {t("dashboard")}
                      </Button>
                    </Link>

                    <div className="flex items-center gap-3 rounded-lg border border-border p-3">
                      <div className="relative">
                        <Avatar className="h-9 w-9 border border-border">
                          <AvatarImage
                            src={userAvatarUrl}
                            alt={userName}
                            className="object-cover"
                          />
                          <AvatarFallback className="bg-primary-secondary text-primary font-bold text-xs">
                            {getInitials(userName)}
                          </AvatarFallback>
                        </Avatar>
                        <span
                          className={cn(
                            "absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-background",
                            {
                              "bg-tenant": activeRole === "tenant",
                              "bg-owner": activeRole === "owner",
                              "bg-supplier": activeRole === "supplier",
                            },
                          )}
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-foreground">
                          {userName}
                        </p>
                        <p className="text-xs text-muted-foreground capitalize">
                          Role:{" "}
                          <span
                            className={cn("font-semibold", {
                              "text-tenant": activeRole === "tenant",
                              "text-owner": activeRole === "owner",
                              "text-supplier": activeRole === "supplier",
                            })}
                          >
                            {activeRole}
                          </span>
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        setMobileOpen(false);
                        signOut({ callbackUrl: "/login" });
                      }}
                      className="flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium text-destructive hover:bg-destructive/10 transition-colors"
                    >
                      <LogOut className="h-4 w-4" />
                      {t("sign_out")}
                    </button>
                  </>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
      <div className="h-0.5 w-full bg-gradient-brand opacity-70" />
    </header>
  );
}
