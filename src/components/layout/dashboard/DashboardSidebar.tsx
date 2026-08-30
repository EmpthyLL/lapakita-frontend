/* eslint-disable react-hooks/purity */
"use client";

import { Logo } from "@/components/layout/Logo";
import { useRoleTheme } from "@/components/providers/theme_provider";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { Role } from "@/types";
import { ChevronsLeft, ChevronsRight } from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  DASHBOARD_FOOTER_NAV,
  DASHBOARD_NAV,
  GENERAL_NAV,
} from "./DashboardNav";

function isActive(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

const GENERAL_ROUTES = [
  "/dashboard/profile",
  "/dashboard/wallet",
  "/dashboard/settings",
];

// Mappings untuk warna hover kustom tiap role berbasis token global CSS
const ROLE_HOVER_CLASSES: Record<Role, string> = {
  tenant: "hover:bg-tenant-secondary hover:text-tenant",
  owner: "hover:bg-owner-secondary hover:text-owner",
  supplier: "hover:bg-supplier-secondary hover:text-supplier",
};

export function DashboardSidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const { role } = useRoleTheme();
  const { data: session } = useSession();

  const plan = session?.user?.subscriptionPlan;
  const expiresAt = session?.user?.subscriptionExpiresAt;

  const isGeneralPage = GENERAL_ROUTES.some((route) =>
    pathname.startsWith(route),
  );

  function canAccessMenuItem(itemBadge?: string): boolean {
    if (itemBadge !== "PRO") return true;
    if (!plan || plan === "free") return false;
    if (plan === "all_access") return true;

    if (!expiresAt) return false;
    return new Date(expiresAt).getTime() > Date.now();
  }

  const rawNavItems = isGeneralPage
    ? GENERAL_NAV
    : (DASHBOARD_NAV[role as Role] ?? DASHBOARD_NAV.tenant);

  const navItems = rawNavItems.filter((item) => canAccessMenuItem(item.badge));

  return (
    <TooltipProvider delayDuration={0}>
      <aside
        className={cn(
          "sticky top-0 flex h-screen shrink-0 flex-col border-r border-border bg-card transition-all duration-200",
          collapsed ? "w-18" : "w-64",
        )}
      >
        {/* Logo / Collapse Toggle */}
        <div className="flex h-16 shrink-0 items-center justify-between border-b border-border px-4">
          {!collapsed && <Logo variant="full" className="h-7 w-auto" />}
          <button
            type="button"
            onClick={() => setCollapsed((c) => !c)}
            className={cn(
              "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground outline-none",
              collapsed && "mx-auto",
            )}
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed ? (
              <ChevronsRight className="h-4 w-4" />
            ) : (
              <ChevronsLeft className="h-4 w-4" />
            )}
          </button>
        </div>

        {/* Mode Indicator Badge */}
        {!collapsed && (
          <div className="px-4 pt-4">
            <span
              className={cn(
                "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold uppercase tracking-wide transition-colors",
                isGeneralPage
                  ? "bg-secondary text-secondary-foreground border border-border"
                  : "bg-primary-secondary text-primary",
              )}
            >
              {isGeneralPage
                ? "General Mode"
                : role === "tenant"
                  ? "Tenant Mode"
                  : role === "owner"
                    ? "Stall Owner Mode"
                    : "Supplier Mode"}
            </span>
          </div>
        )}

        {/* Main Navigation (Atas) */}
        <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
          {navItems.map((item) => {
            const active = isActive(pathname, item.href);

            // Tentukan style hover: khusus di general page gunakan warna role masing-masing
            const hoverClass =
              isGeneralPage && item.role
                ? ROLE_HOVER_CLASSES[item.role]
                : "hover:bg-secondary hover:text-foreground";

            const linkEl = (
              <Link
                href={item.href}
                className={cn(
                  "group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                  collapsed && "justify-center px-0",
                  active
                    ? isGeneralPage
                      ? "bg-secondary text-foreground font-semibold shadow-xs"
                      : "bg-primary text-primary-foreground shadow-xs"
                    : cn("text-muted-foreground", hoverClass),
                )}
              >
                <item.icon className="h-4.5 w-4.5 shrink-0" />
                {!collapsed && (
                  <>
                    <span className="min-w-0 flex-1 truncate">
                      {item.label}
                    </span>
                    {item.badge && (
                      <span
                        className={cn(
                          "shrink-0 rounded-full px-1.5 py-0.5 text-[10px] font-bold uppercase",
                          active
                            ? "bg-primary-foreground/20 text-primary-foreground"
                            : "bg-primary-secondary text-primary",
                        )}
                      >
                        {item.badge}
                      </span>
                    )}
                  </>
                )}
              </Link>
            );

            if (!collapsed) return <div key={item.href}>{linkEl}</div>;

            return (
              <Tooltip key={item.href}>
                <TooltipTrigger asChild>{linkEl}</TooltipTrigger>
                <TooltipContent side="right">{item.label}</TooltipContent>
              </Tooltip>
            );
          })}
        </nav>

        {/* Footer Navigation (Bawah: Wallet & Settings) */}
        <div className="space-y-1 border-t border-border px-3 py-4">
          {DASHBOARD_FOOTER_NAV.map((item) => {
            const active = isActive(pathname, item.href);
            const linkEl = (
              <Link
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                  collapsed && "justify-center px-0",
                  active
                    ? "bg-secondary text-foreground font-semibold shadow-xs"
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground",
                )}
              >
                <item.icon className="h-4.5 w-4.5 shrink-0" />
                {!collapsed && <span className="truncate">{item.label}</span>}
              </Link>
            );

            if (!collapsed) return <div key={item.href}>{linkEl}</div>;

            return (
              <Tooltip key={item.href}>
                <TooltipTrigger asChild>{linkEl}</TooltipTrigger>
                <TooltipContent side="right">{item.label}</TooltipContent>
              </Tooltip>
            );
          })}
        </div>
      </aside>
    </TooltipProvider>
  );
}
