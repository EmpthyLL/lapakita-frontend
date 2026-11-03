"use client";

import { useRoleContext } from "@/hooks/use-role-context";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  DASHBOARD_NAV,
  NavItem,
  SETTINGS_NAV,
  WALLET_NAV,
} from "./DashboardNav";

export function DashboardMobileBottomNav() {
  const pathname = usePathname();
  const { activeRole, isWalletPage, isSettingsPage } = useRoleContext();

  let items: NavItem[] = DASHBOARD_NAV[activeRole] || DASHBOARD_NAV.tenant;

  if (isWalletPage) {
    items = WALLET_NAV;
  } else if (isSettingsPage) {
    items = SETTINGS_NAV.filter((item) => !item.href.includes("persona"));
  } else {
    // Sembunyikan menu notifications dari mobile bottom nav di setiap role dashboard
    items = items.filter((item) => !item.href.includes("/notifications"));
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 flex md:hidden items-center justify-around border-t border-border bg-background/95 px-1 py-1.5 backdrop-blur-lg supports-backdrop-filter:bg-background/80 shadow-lg overflow-x-auto">
      {items.map((item) => {
        const isActive =
          pathname === item.href ||
          (item.href !== `/dashboard/${activeRole}` &&
            item.href !== "/dashboard/wallet" &&
            item.href !== "/dashboard/settings" &&
            pathname.startsWith(item.href));

        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex flex-col items-center justify-center gap-1 rounded-xl px-2 py-1 text-[10px] font-medium transition-all shrink-0 min-w-12",
              isActive
                ? isWalletPage || isSettingsPage
                  ? "text-muted-foreground font-semibold bg-secondary/80 "
                  : "text-primary font-semibold bg-primary/10"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            <item.icon className="h-4.5 w-4.5 shrink-0" />
            <span className="truncate max-w-16">{item.mobileLabel}</span>
          </Link>
        );
      })}
    </div>
  );
}
