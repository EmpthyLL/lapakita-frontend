"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
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
  ArrowUpRight,
  ChevronDown,
  LayoutDashboard,
  LogOut,
  Menu,
  Repeat,
  Settings,
  Wallet,
  X,
} from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { LanguageSwitcher } from "../common/LanguageSwitcher";
import { Logo } from "./Logo";

type RoleVariant = "tenant" | "owner" | "supplier";

function isNavLinkActive(pathname: string, href: string) {
  if (href.startsWith("#")) return false;
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

// Helper untuk mendapatkan class warna teks & background sesuai role aktif
const getRoleThemeClasses = (role: RoleVariant) => {
  switch (role) {
    case "owner":
      return {
        text: "text-owner",
        bgSoft: "bg-owner/10",
        border: "border-owner/30",
      };
    case "supplier":
      return {
        text: "text-supplier",
        bgSoft: "bg-supplier/10",
        border: "border-supplier/30",
      };
    case "tenant":
    default:
      return {
        text: "text-tenant",
        bgSoft: "bg-tenant/10",
        border: "border-tenant/30",
      };
  }
};

export function SiteHeader() {
  const t = useTranslations("common.nav");
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const wasOpenBeforeDesktop = useRef(false);
  const { data: session } = useSession();

  useEffect(() => {
    const desktopQuery = window.matchMedia("(min-width: 1024px)");
    const syncSheetToViewport = (event: MediaQueryListEvent) => {
      if (event.matches) {
        wasOpenBeforeDesktop.current = mobileOpen;
        setMobileOpen(false);
      } else {
        setMobileOpen(wasOpenBeforeDesktop.current);
      }
    };

    desktopQuery.addEventListener("change", syncSheetToViewport);
    return () =>
      desktopQuery.removeEventListener("change", syncSheetToViewport);
  }, [mobileOpen]);

  const isLoggedIn = Boolean(session?.user);

  // 1. Role Aktif (Default: tenant)
  const activeRole: RoleVariant =
    (session?.user?.activeRole as RoleVariant) || "tenant";

  const theme = getRoleThemeClasses(activeRole);

  // 2. Ambil detail Persona berdasarkan activeRole
  const currentPersona = session?.user?.personas?.[activeRole];

  // 3. Nama: Persona display_name -> defaultName -> Fallback "User"
  const userName =
    currentPersona?.display_name || session?.user?.defaultName || "User";

  // 4. Avatar: Persona avatar_url -> defaultAvatarUrl -> Fallback ""
  const userAvatarUrl =
    currentPersona?.avatar_url || session?.user?.defaultAvatarUrl || "";

  const userEmail = session?.user?.email;

  const navLinks = [
    { label: t("home"), href: "/" },
    { label: t("stalls"), href: "/stalls" },
    { label: t("features"), href: "/features" },
    { label: t("about"), href: "/about" },
    { label: t("pricing"), href: "/pricing" },
    { label: t("contact"), href: "/contact" },
  ];

  // Extraction Inisial Nama (misal: "John Doe" -> "JD")
  const getInitials = (str: string) => {
    if (!str || str.trim() === "") return "U";
    const parts = str.trim().split(" ");
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full border-b border-border backdrop-blur supports-backdrop-filter:bg-background/70",
        "bg-background/90",
      )}
    >
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
                    ? "font-semibold text-gradient-brand"
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
                <Button variant="ghost" size="sm">
                  {t("login")}
                </Button>
              </Link>
              <Link href="/register">
                <Button variant="primary" size="sm">
                  {t("get_started")}
                </Button>
              </Link>
            </>
          ) : (
            <>
              {/* Button Dashboard */}
              <Link href={`/dashboard/${activeRole}`}>
                <Button
                  variant={activeRole}
                  size="sm"
                  className="h-8 px-3 text-xs"
                >
                  <LayoutDashboard className="mr-1.5 size-3.5" />
                  {t("dashboard")}
                  <ArrowUpRight />
                </Button>
              </Link>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="relative flex items-center gap-1 rounded-full outline-none focus-visible:ring-2 focus-visible:ring-ring/50">
                    <Avatar className="h-8 w-8 border border-border">
                      <AvatarImage
                        src={userAvatarUrl}
                        alt={userName}
                        className="object-cover"
                      />
                      <AvatarFallback
                        className={cn(
                          "font-bold text-xs transition-colors",
                          theme.bgSoft,
                          theme.text,
                        )}
                      >
                        {getInitials(userName)}
                      </AvatarFallback>
                    </Avatar>

                    {/* Status Dot Indicator Role Aktif */}
                    <span
                      className={cn(
                        "absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-background",
                        {
                          "bg-tenant": activeRole === "tenant",
                          "bg-owner": activeRole === "owner",
                          "bg-supplier": activeRole === "supplier",
                        },
                      )}
                    />
                    <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 z-50">
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-semibold leading-none text-foreground truncate">
                        {userName}
                      </p>
                      {userEmail && (
                        <p className="text-xs text-muted-foreground truncate">
                          {userEmail}
                        </p>
                      )}
                      <p className="text-xs leading-none text-muted-foreground capitalize pt-0.5">
                        {t("active_role")}:{" "}
                        <span
                          className={cn("font-semibold capitalize", theme.text)}
                        >
                          {activeRole}
                        </span>
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />

                  <DropdownMenuItem asChild className="cursor-pointer">
                    <Link
                      href="/dashboard/settings"
                      className="flex items-center w-full"
                    >
                      <Settings className="mr-2 h-4 w-4" /> {t("settings")}
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
                    <DropdownMenuSubContent className="z-50">
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
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen} modal={false}>
            <SheetTrigger asChild>
              <button
                aria-label={mobileOpen ? t("close_menu") : t("open_menu")}
                className="relative flex h-10 w-10 items-center justify-center rounded-lg text-foreground transition-colors hover:bg-secondary outline-none cursor-pointer"
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
              showCloseButton={false}
              dismissibleOverlay
              onInteractOutside={(event) => event.preventDefault()}
              className="right-0 z-50 rounded-l-3xl border-l border-border/60 bg-background/95 p-0 pt-16 backdrop-blur-xl data-[side=right]:inset-y-0 data-[side=right]:h-dvh data-[side=right]:w-[min(24rem,calc(100vw-4rem))] data-[state=open]:zoom-in-95 data-[state=closed]:zoom-out-95"
            >
              <div className="flex min-h-0 flex-1 flex-col overflow-y-auto">
                <div className="space-y-4 border-b border-border/60 bg-secondary/20 p-5">
                  {!isLoggedIn ? (
                    <div className="flex flex-col gap-2">
                      <Link
                        href="/register"
                        onClick={() => setMobileOpen(false)}
                      >
                        <Button
                          variant="primary"
                          size="sm"
                          className="w-full rounded-xl py-5 font-semibold shadow-xs"
                        >
                          {t("get_started")}
                        </Button>
                      </Link>
                      <Link href="/login" onClick={() => setMobileOpen(false)}>
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full rounded-xl py-5 font-semibold"
                        >
                          {t("login")}
                        </Button>
                      </Link>
                    </div>
                  ) : (
                    <>
                      <div className="flex items-center gap-3 rounded-2xl border border-border/80 bg-background p-3.5 shadow-xs">
                        <div className="relative shrink-0">
                          <Avatar className="h-10 w-10 border border-border">
                            <AvatarImage
                              src={userAvatarUrl}
                              alt={userName}
                              className="object-cover"
                            />
                            <AvatarFallback
                              className={cn(
                                "font-bold text-xs transition-colors",
                                theme.bgSoft,
                                theme.text,
                              )}
                            >
                              {getInitials(userName)}
                            </AvatarFallback>
                          </Avatar>
                          <span
                            className={cn(
                              "absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-background",
                              {
                                "bg-tenant": activeRole === "tenant",
                                "bg-owner": activeRole === "owner",
                                "bg-supplier": activeRole === "supplier",
                              },
                            )}
                          />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-semibold text-foreground">
                            {userName}
                          </p>
                          {userEmail && (
                            <p className="truncate text-xs text-muted-foreground">
                              {userEmail}
                            </p>
                          )}
                          <p className="text-xs text-muted-foreground capitalize pt-0.5">
                            {t("role")}:{" "}
                            <span
                              className={cn(
                                "font-semibold capitalize",
                                theme.text,
                              )}
                            >
                              {activeRole}
                            </span>
                          </p>
                        </div>

                        {/* Dropdown Role tanpa panah, ada dot warna role, dan model sama persis */}
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <button
                              type="button"
                              aria-label={t("switch_role")}
                              className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-border text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground cursor-pointer"
                            >
                              <Repeat className="size-4" />
                            </button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="z-50">
                            {(["tenant", "owner", "supplier"] as const).map(
                              (role) => (
                                <DropdownMenuItem
                                  key={role}
                                  asChild
                                  className="cursor-pointer"
                                >
                                  <Link
                                    href={`/dashboard/${role}`}
                                    className="flex items-center w-full"
                                  >
                                    <span
                                      className={cn(
                                        "mr-2 h-2 w-2 rounded-full",
                                        {
                                          "bg-tenant": role === "tenant",
                                          "bg-owner": role === "owner",
                                          "bg-supplier": role === "supplier",
                                        },
                                      )}
                                    />
                                    <span
                                      className={cn(
                                        activeRole === role &&
                                          getRoleThemeClasses(role).text,
                                      )}
                                    >
                                      {t(`roles.${role}`)}
                                    </span>
                                  </Link>
                                </DropdownMenuItem>
                              ),
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>

                      <div className="flex flex-col gap-2">
                        <Link
                          href={`/dashboard/${activeRole}`}
                          onClick={() => setMobileOpen(false)}
                        >
                          <Button
                            variant={activeRole}
                            size="sm"
                            className="w-full rounded-xl py-5 font-semibold gap-2 shadow-xs"
                          >
                            <LayoutDashboard className="size-4" />
                            {t("dashboard")}
                            <ArrowUpRight className="size-3.5 opacity-70 ml-auto" />
                          </Button>
                        </Link>
                      </div>
                      <Accordion type="single" collapsible>
                        <AccordionItem
                          value="shortcuts"
                          className="rounded-xl border border-border/80 bg-background px-3"
                        >
                          <AccordionTrigger className="py-3 text-sm hover:no-underline">
                            {t("shortcuts")}
                          </AccordionTrigger>
                          <AccordionContent>
                            <div className="grid gap-1">
                              <Link
                                href="/dashboard/wallet"
                                onClick={() => setMobileOpen(false)}
                                className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors hover:bg-secondary"
                              >
                                <Wallet className="size-4" />
                                {t("wallet")}
                              </Link>
                              <Link
                                href="/dashboard/settings"
                                onClick={() => setMobileOpen(false)}
                                className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors hover:bg-secondary"
                              >
                                <Settings className="size-4" />
                                {t("settings")}
                              </Link>
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                      </Accordion>
                    </>
                  )}
                </div>

                <div className="space-y-1.5 p-5">
                  <p className="mb-3 px-1 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                    {t("main_menu")}
                  </p>
                  {navLinks.map((link) => {
                    const active = isNavLinkActive(pathname, link.href);
                    return (
                      <Link
                        key={link.href}
                        href={link.href}
                        onClick={() => setMobileOpen(false)}
                        aria-current={active ? "page" : undefined}
                        className={cn(
                          "relative flex items-center rounded-xl px-4 py-3 text-sm transition-colors duration-200",
                          active
                            ? "bg-gradient-brand-light font-bold shadow-xs"
                            : "text-foreground font-semibold hover:bg-secondary/60",
                        )}
                      >
                        <span
                          className={
                            active ? "text-white font-bold" : "text-foreground"
                          }
                        >
                          {link.label}
                        </span>
                      </Link>
                    );
                  })}
                </div>
              </div>

              {isLoggedIn && (
                <div className="border-t border-border/60 p-4">
                  <button
                    type="button"
                    onClick={() => {
                      setMobileOpen(false);
                      signOut({ callbackUrl: "/login" });
                    }}
                    className="flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold text-destructive transition-colors hover:bg-destructive/10"
                  >
                    <LogOut className="size-4" />
                    {t("sign_out")}
                  </button>
                </div>
              )}
            </SheetContent>
          </Sheet>
        </div>
      </div>
      <div className="h-0.5 w-full bg-gradient-brand opacity-70" />
    </header>
  );
}
