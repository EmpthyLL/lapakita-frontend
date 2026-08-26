"use client";

import { LanguageSwitcher } from "@/components/common/LanguageSwitcher";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
import {
  Bell,
  ChevronDown,
  ChevronRight,
  LogOut,
  Repeat,
  User,
  Wallet,
} from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface DashboardTopbarProps {
  userName?: string;
  userAvatarUrl?: string;
}

function useBreadcrumb(pathname: string) {
  const segments = pathname.split("/").filter(Boolean);
  return segments.map((seg, i) => {
    const cleanedLabel = seg
      .replace(/[_-]/g, " ")
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");

    return {
      label: cleanedLabel,
      href: "/" + segments.slice(0, i + 1).join("/"),
    };
  });
}

export function DashboardTopbar({
  userName: propUserName,
  userAvatarUrl: propAvatarUrl,
}: DashboardTopbarProps) {
  const pathname = usePathname();
  const breadcrumb = useBreadcrumb(pathname);
  const { data: session } = useSession();

  const userName = session?.user?.name || propUserName || "User";
  const userAvatarUrl = session?.user?.avatarUrl || propAvatarUrl || "";
  const activeRole = session?.user?.activeRole || "tenant";

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
    <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-border bg-background/95 px-6 backdrop-blur">
      {/* Breadcrumb dengan pemisah underscore & hyphen */}
      <nav className="flex items-center gap-1.5 text-sm text-muted-foreground">
        {breadcrumb.map((crumb, i) => (
          <span key={crumb.href} className="flex items-center gap-1.5">
            {i > 0 && <ChevronRight className="h-3.5 w-3.5 shrink-0" />}
            {i === breadcrumb.length - 1 ? (
              <span className="font-medium text-foreground">{crumb.label}</span>
            ) : (
              <Link
                href={crumb.href}
                className="hover:text-foreground transition-colors"
              >
                {crumb.label}
              </Link>
            )}
          </span>
        ))}
      </nav>

      {/* Right Actions */}
      <div className="flex items-center gap-2">
        <LanguageSwitcher showLabel={false} />

        <button
          type="button"
          className="relative flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground outline-none"
          aria-label="Notifications"
        >
          <Bell className="h-4.5 w-4.5" />
          <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-destructive" />
        </button>

        <div className="mx-1 h-4 w-px bg-border" />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-1.5 rounded-full outline-none ring-primary/40 focus-visible:ring-2">
              <Avatar className="h-9 w-9 border border-border">
                <AvatarImage
                  src={userAvatarUrl}
                  alt={userName}
                  className="object-cover"
                />
                <AvatarFallback className="bg-primary/10 text-primary font-bold text-xs">
                  {getInitials(userName)}
                </AvatarFallback>
              </Avatar>
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
                  <span className="font-medium text-primary">{activeRole}</span>
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />

            <DropdownMenuItem asChild className="cursor-pointer">
              <Link
                href="/dashboard/profile"
                className="flex items-center w-full"
              >
                <User className="mr-2 h-4 w-4" /> Profile
              </Link>
            </DropdownMenuItem>

            <DropdownMenuItem asChild className="cursor-pointer">
              <Link
                href="/dashboard/wallet"
                className="flex items-center w-full"
              >
                <Wallet className="mr-2 h-4 w-4" /> Wallet
              </Link>
            </DropdownMenuItem>

            {/* Switch Role Menu */}
            <DropdownMenuSub>
              <DropdownMenuSubTrigger className="cursor-pointer">
                <Repeat className="mr-2 h-4 w-4" /> Switch Role
              </DropdownMenuSubTrigger>
              <DropdownMenuSubContent>
                <DropdownMenuItem asChild className="cursor-pointer">
                  <Link
                    href="/dashboard/tenant"
                    className="flex items-center w-full"
                  >
                    <span className="mr-2 h-2 w-2 rounded-full bg-primary" />
                    Tenant
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild className="cursor-pointer">
                  <Link
                    href="/dashboard/owner"
                    className="flex items-center w-full"
                  >
                    <span className="mr-2 h-2 w-2 rounded-full bg-emerald-500" />
                    Stall Owner
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild className="cursor-pointer">
                  <Link
                    href="/dashboard/supplier"
                    className="flex items-center w-full"
                  >
                    <span className="mr-2 h-2 w-2 rounded-full bg-amber-500" />
                    Supplier
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuSubContent>
            </DropdownMenuSub>

            <DropdownMenuSeparator />

            {/* Direct Logout Trigger */}
            <DropdownMenuItem
              onClick={() => signOut({ callbackUrl: "/login" })}
              className="text-destructive focus:text-destructive cursor-pointer"
            >
              <LogOut className="mr-2 h-4 w-4" /> Sign Out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
