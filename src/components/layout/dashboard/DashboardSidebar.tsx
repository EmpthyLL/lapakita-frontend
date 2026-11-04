"use client";

import { Logo } from "@/components/layout/Logo";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useRoleContext } from "@/hooks/use-role-context";
import { cn } from "@/lib/utils";
import { Role } from "@/types";
import { ChevronsLeft, ChevronsRight, LayoutDashboard } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  DASHBOARD_FOOTER_NAV,
  DASHBOARD_NAV,
  SETTINGS_NAV,
  WALLET_NAV,
} from "./DashboardNav";

function isNavActive(pathname: string, href: string) {
  return pathname === href;
}

function isFooterActive(pathname: string, href: string) {
  if (href === "/dashboard") {
    return pathname === "/dashboard";
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}

// Styling khusus hover & active per role agar selaras
const ROLE_THEME_CLASSES: Record<Role, { active: string; hover: string }> = {
  tenant: {
    active: "bg-tenant-secondary text-tenant font-semibold shadow-xs",
    hover: "hover:bg-tenant-secondary hover:text-tenant",
  },
  owner: {
    active: "bg-owner-secondary text-owner font-semibold shadow-xs",
    hover: "hover:bg-owner-secondary hover:text-owner",
  },
  supplier: {
    active: "bg-supplier-secondary text-supplier font-semibold shadow-xs",
    hover: "hover:bg-supplier-secondary hover:text-supplier",
  },
};

interface DashboardSidebarProps {
  mobileOpen?: boolean;
  setMobileOpen?: (open: boolean) => void;
}

export function DashboardSidebar({
  mobileOpen,
  setMobileOpen,
}: DashboardSidebarProps) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  // Menggunakan hook general useRoleContext
  const { activeRole, isWalletPage, isSettingsPage, session } =
    useRoleContext();

  const sessionActiveRole =
    (session?.user?.activeRole as Role) || activeRole || "tenant";

  const isGeneralPage = isWalletPage || isSettingsPage;

  let rawNavItems = DASHBOARD_NAV[activeRole] ?? DASHBOARD_NAV.tenant;
  let sectionLabel =
    activeRole === "tenant"
      ? "Tenant Mode"
      : activeRole === "owner"
        ? "Stall Owner Mode"
        : "Supplier Mode";

  if (isWalletPage) {
    rawNavItems = WALLET_NAV;
    sectionLabel = "General Mode";
  } else if (isSettingsPage) {
    rawNavItems = SETTINGS_NAV;
    sectionLabel = "General Mode";
  }

  const navItems = rawNavItems;

  const sidebarContent = (isMob = false) => (
    <div className="flex h-full flex-col bg-card">
      <div className="flex h-16 shrink-0 items-center justify-between border-b border-border px-4">
        {(!collapsed || isMob) && (
          <Logo variant="full" className="h-7 w-auto" />
        )}
        {!isMob && (
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
        )}
      </div>

      {(!collapsed || isMob) && (
        <div className="px-4 pt-4">
          <span
            className={cn(
              "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold uppercase tracking-wide transition-colors",
              isGeneralPage
                ? "bg-secondary text-secondary-foreground border border-border"
                : "bg-primary-secondary text-primary",
            )}
          >
            {sectionLabel}
          </span>
        </div>
      )}

      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
        {isGeneralPage && (
          <div className="mb-3 pb-3 border-b border-border">
            {(() => {
              const workspaceHref = `/dashboard/${sessionActiveRole}`;
              const label =
                sessionActiveRole === "tenant"
                  ? "Tenant Workspace"
                  : sessionActiveRole === "owner"
                    ? "Stall Owner Workspace"
                    : "Supplier Workspace";

              const shortcutEl = (
                <Link
                  href={workspaceHref}
                  onClick={() => isMob && setMobileOpen?.(false)}
                  className={cn(
                    "group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground",
                    collapsed && !isMob && "justify-center px-0",
                  )}
                >
                  <LayoutDashboard className="h-4.5 w-4.5 shrink-0" />
                  {(!collapsed || isMob) && (
                    <span className="min-w-0 flex-1 truncate">{label}</span>
                  )}
                </Link>
              );

              if (!collapsed || isMob) return shortcutEl;

              return (
                <Tooltip>
                  <TooltipTrigger asChild>{shortcutEl}</TooltipTrigger>
                  <TooltipContent side="right">{label}</TooltipContent>
                </Tooltip>
              );
            })()}
          </div>
        )}

        {navItems.map((item) => {
          const active = isNavActive(pathname, item.href);

          const roleTheme = ROLE_THEME_CLASSES[activeRole] ?? {
            active: "bg-secondary text-foreground font-semibold shadow-xs",
            hover: "hover:bg-secondary hover:text-foreground",
          };

          const activeClass = isGeneralPage
            ? "bg-secondary text-foreground font-semibold shadow-xs"
            : roleTheme.active;

          const hoverClass = isGeneralPage
            ? "hover:bg-secondary hover:text-foreground"
            : roleTheme.hover;

          const linkEl = (
            <Link
              href={item.href}
              onClick={() => isMob && setMobileOpen?.(false)}
              className={cn(
                "group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                collapsed && !isMob && "justify-center px-0",
                active ? activeClass : cn("text-muted-foreground", hoverClass),
              )}
            >
              <item.icon className="h-4.5 w-4.5 shrink-0" />
              {(!collapsed || isMob) && (
                <span className="min-w-0 flex-1 truncate">{item.label}</span>
              )}
            </Link>
          );

          if (!collapsed || isMob) return <div key={item.href}>{linkEl}</div>;

          return (
            <Tooltip key={item.href}>
              <TooltipTrigger asChild>{linkEl}</TooltipTrigger>
              <TooltipContent side="right">{item.label}</TooltipContent>
            </Tooltip>
          );
        })}
      </nav>

      <div className="space-y-1 border-t border-border px-3 py-4">
        {DASHBOARD_FOOTER_NAV.map((item) => {
          const active = isFooterActive(pathname, item.href);
          const linkEl = (
            <Link
              href={item.href}
              onClick={() => isMob && setMobileOpen?.(false)}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                collapsed && !isMob && "justify-center px-0",
                active
                  ? "bg-secondary text-foreground font-semibold shadow-xs"
                  : "text-muted-foreground hover:bg-secondary hover:text-foreground",
              )}
            >
              <item.icon className="h-4.5 w-4.5 shrink-0" />
              {(!collapsed || isMob) && (
                <span className="truncate">{item.label}</span>
              )}
            </Link>
          );

          if (!collapsed || isMob) return <div key={item.href}>{linkEl}</div>;

          return (
            <Tooltip key={item.href}>
              <TooltipTrigger asChild>{linkEl}</TooltipTrigger>
              <TooltipContent side="right">{item.label}</TooltipContent>
            </Tooltip>
          );
        })}
      </div>
    </div>
  );

  return (
    <TooltipProvider delayDuration={0}>
      <aside
        className={cn(
          "sticky top-0 hidden md:flex h-screen shrink-0 flex-col border-r border-border bg-card transition-all duration-200",
          collapsed ? "w-18" : "w-64",
        )}
      >
        {sidebarContent(false)}
      </aside>

      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent side="left" className="p-0 w-72 border-r border-border">
          <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
          {sidebarContent(true)}
        </SheetContent>
      </Sheet>
    </TooltipProvider>
  );
}
