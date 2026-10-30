/* eslint-disable @next/next/no-img-element */
"use client";

import { LanguageSwitcher } from "@/components/common/LanguageSwitcher";
import { RoleSelectPopover } from "@/components/common/input/RoleSelectPopover";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarTrigger,
} from "@/components/ui/menubar";
import { getCountryFlag } from "@/lib/countries";
import { cn } from "@/lib/utils";
import { Role, RoleAndAll } from "@/types";
import {
  ChevronDown,
  ChevronRight,
  LogOut,
  Menu,
  Settings,
  User,
  Wallet,
} from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { NotificationPopover } from "./NotificationPopover";

interface DashboardTopbarProps {
  userName?: string;
  userAvatarUrl?: string;
  onOpenMobileMenu?: () => void;
}

const VALID_ROLES: Role[] = ["tenant", "owner", "supplier"];

const getRoleThemeClasses = (role: Role) => {
  switch (role) {
    case "owner":
      return {
        text: "text-owner",
        bgSoft: "bg-owner/10",
        border: "data-[state=open]:border-owner",
        ring: "data-[state=open]:ring-owner/20",
      };
    case "supplier":
      return {
        text: "text-supplier",
        bgSoft: "bg-supplier/10",
        border: "data-[state=open]:border-supplier",
        ring: "data-[state=open]:ring-supplier/20",
      };
    case "tenant":
    default:
      return {
        text: "text-tenant",
        bgSoft: "bg-tenant/10",
        border: "data-[state=open]:border-tenant",
        ring: "data-[state=open]:ring-tenant/20",
      };
  }
};

function useBreadcrumb(pathname: string) {
  const segments = pathname.split("/").filter(Boolean);
  const hasDashboard = segments[0]?.toLowerCase() === "dashboard";
  const filteredSegments = hasDashboard ? segments.slice(1) : segments;

  return filteredSegments.map((seg, i) => {
    const isRoleRoot = i === 0;
    const cleanedLabel = isRoleRoot
      ? "Dashboard"
      : seg
          .replace(/[_-]/g, " ")
          .split(" ")
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(" ");

    return {
      label: cleanedLabel,
      href: "/" + segments.slice(0, (hasDashboard ? 1 : 0) + i + 1).join("/"),
    };
  });
}

export function DashboardTopbar({
  userName: propUserName,
  userAvatarUrl: propAvatarUrl,
  onOpenMobileMenu,
}: DashboardTopbarProps) {
  const pathname = usePathname();
  const breadcrumb = useBreadcrumb(pathname);
  const { data: session } = useSession();

  const isWalletPage = pathname.startsWith("/dashboard/wallet");
  const isSettingsPage = pathname.startsWith("/dashboard/settings");

  const segments = pathname.split("/").filter(Boolean);
  const dashboardIndex = segments.lastIndexOf("dashboard");
  const currentPathRole = segments[dashboardIndex + 1] as Role;

  const currentRole: Role = VALID_ROLES.includes(currentPathRole)
    ? currentPathRole
    : (session?.user?.activeRole as Role) || "tenant";

  const activeRole: RoleAndAll =
    isWalletPage || isSettingsPage ? "all" : currentRole;

  const displayRole: Role =
    activeRole === "all"
      ? (session?.user?.activeRole as Role) || "tenant"
      : currentRole;

  const profileRoutePath = `/dashboard/${currentRole}/profile`;

  const theme = getRoleThemeClasses(displayRole);
  const persona = session?.user?.personas?.[displayRole];

  const userName =
    persona?.display_name ||
    session?.user?.defaultName ||
    propUserName ||
    "User";
  const userAvatarUrl =
    persona?.avatar_url ||
    session?.user?.defaultAvatarUrl ||
    propAvatarUrl ||
    "";

  const activePhone = persona?.phone || session?.user?.defaultPhone;

  let formattedDialCode = "+62";
  let formattedNumber = "";

  if (typeof activePhone === "object" && activePhone !== null) {
    formattedDialCode = activePhone.dial_code || "+62";
    formattedNumber = activePhone.number || "";
  }
  const phoneFlagUrl = getCountryFlag(formattedDialCode);

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
    <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-border bg-background/95 px-4 sm:px-6 backdrop-blur">
      <div className="flex items-center gap-3 min-w-0">
        {/* Tombol Hamburger Menu untuk layar mobile */}
        <button
          type="button"
          onClick={onOpenMobileMenu}
          className="flex md:hidden h-9 w-9 shrink-0 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground outline-none cursor-pointer"
          aria-label="Open mobile menu"
        >
          <Menu className="h-5 w-5" />
        </button>

        {/* Breadcrumb disembunyikan sebagian di mobile agar muat */}
        <nav className="hidden sm:flex items-center gap-1.5 text-sm text-muted-foreground truncate">
          {breadcrumb.map((crumb, i) => (
            <span
              key={crumb.href}
              className="flex items-center gap-1.5 truncate"
            >
              {i > 0 && <ChevronRight className="h-3.5 w-3.5 shrink-0" />}
              {i === breadcrumb.length - 1 ? (
                <span className="font-medium text-foreground truncate">
                  {crumb.label}
                </span>
              ) : (
                <Link
                  href={crumb.href}
                  className="hover:text-foreground transition-colors truncate"
                >
                  {crumb.label}
                </Link>
              )}
            </span>
          ))}
        </nav>
      </div>

      <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
        <LanguageSwitcher showLabel={false} />

        {/* Panggil komponen NotificationPopover yang terpisah */}
        <NotificationPopover />

        <div className="mx-0.5 sm:mx-1 h-4 w-px bg-border" />

        <RoleSelectPopover
          value={activeRole}
          onChange={(role) => {
            window.location.href =
              role === "all" ? "/dashboard/settings" : `/dashboard/${role}`;
          }}
          mode="topbar"
          showGeneral={true}
        />

        <Menubar className="border-none bg-transparent p-0 shadow-none h-auto w-auto">
          <MenubarMenu>
            <MenubarTrigger
              className={cn(
                "group relative flex cursor-pointer items-center gap-1 rounded-full border border-transparent p-0.5 outline-none transition-all duration-150 focus-visible:ring-2 focus-visible:ring-ring/50 data-[state=open]:bg-transparent data-[state=open]:text-foreground data-[state=open]:ring-2",
                theme.border,
                theme.ring,
              )}
            >
              <span className="relative flex shrink-0">
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
                <span
                  className={cn(
                    "absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-background",
                    {
                      "bg-tenant": displayRole === "tenant",
                      "bg-owner": displayRole === "owner",
                      "bg-supplier": displayRole === "supplier",
                    },
                  )}
                />
              </span>
              <ChevronDown className="ml-0.5 h-3.5 w-3.5 text-muted-foreground transition-transform duration-150 group-data-[state=open]:rotate-180" />
            </MenubarTrigger>
            <MenubarContent align="end" className="z-60 w-64">
              <div className="flex items-center gap-3 py-1.5 px-3">
                <Avatar className="h-10 w-10 border border-border shrink-0">
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
                <div className="flex flex-col space-y-0.5 overflow-hidden">
                  <p className="text-sm font-semibold leading-tight text-foreground truncate">
                    {userName}
                  </p>

                  {formattedNumber && (
                    <div className="flex items-center gap-1.5 pt-0.5">
                      <img
                        src={phoneFlagUrl}
                        alt="Country flag"
                        className="h-3 w-4 object-contain rounded-xs shrink-0"
                      />
                      <p className="text-[11px] leading-tight text-muted-foreground truncate font-mono">
                        {formattedDialCode} {formattedNumber}
                      </p>
                    </div>
                  )}

                  <p className="text-[11px] leading-tight text-muted-foreground capitalize pt-0.5">
                    Active Role:{" "}
                    <span
                      className={cn("font-semibold capitalize", theme.text)}
                    >
                      {displayRole}
                    </span>
                  </p>
                </div>
              </div>
              <MenubarSeparator />

              <MenubarItem asChild className="cursor-pointer">
                <Link
                  href={profileRoutePath}
                  className="flex items-center w-full"
                >
                  <User className="mr-2 h-4 w-4" /> Profile
                </Link>
              </MenubarItem>

              <MenubarItem asChild className="cursor-pointer">
                <Link
                  href="/dashboard/settings"
                  className="flex items-center w-full"
                >
                  <Settings className="mr-2 h-4 w-4" /> Settings
                </Link>
              </MenubarItem>

              <MenubarItem asChild className="cursor-pointer">
                <Link
                  href="/dashboard/wallet"
                  className="flex items-center w-full"
                >
                  <Wallet className="mr-2 h-4 w-4" /> Wallet
                </Link>
              </MenubarItem>

              <MenubarSeparator />

              <MenubarItem
                onClick={() => signOut({ callbackUrl: "/login" })}
                className="text-destructive focus:text-destructive cursor-pointer"
              >
                <LogOut className="mr-2 h-4 w-4" /> Sign Out
              </MenubarItem>
            </MenubarContent>
          </MenubarMenu>
        </Menubar>
      </div>
    </header>
  );
}
