"use client";

import { useRoleTheme } from "@/components/providers/theme_provider";
import { cn } from "@/lib/utils";
import { Role } from "@/types";
import { History, LayoutDashboard, Settings, Wallet } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const ROLE_NAV_ITEMS = {
  tenant: [
    { label: "Home", href: "/dashboard/tenant", icon: LayoutDashboard },
    { label: "Businesses", href: "/dashboard/tenant/businesses", icon: Wallet },
    { label: "Leases", href: "/dashboard/tenant/leases", icon: History },
  ],
  owner: [
    { label: "Home", href: "/dashboard/owner", icon: LayoutDashboard },
    { label: "Portfolio", href: "/dashboard/owner/portfolio", icon: Wallet },
    { label: "Tenancies", href: "/dashboard/owner/tenancies", icon: History },
  ],
  supplier: [
    { label: "Home", href: "/dashboard/supplier", icon: LayoutDashboard },
    { label: "Catalog", href: "/dashboard/supplier/catalog", icon: Wallet },
    { label: "Orders", href: "/dashboard/supplier/orders", icon: History },
  ],
};

export function DashboardMobileBottomNav() {
  const pathname = usePathname();
  const { role } = useRoleTheme();
  const activeRole = (role as Role) || "tenant";

  const currentRoleNav = ROLE_NAV_ITEMS[activeRole] || ROLE_NAV_ITEMS.tenant;

  const items = [
    ...currentRoleNav,
    { label: "Wallet", href: "/dashboard/wallet", icon: Wallet },
    { label: "Settings", href: "/dashboard/settings", icon: Settings },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 flex md:hidden items-center justify-around border-t border-border bg-background/90 px-2 py-2 backdrop-blur-lg supports-backdrop-filter:bg-background/80 shadow-lg">
      {items.map((item) => {
        const isActive =
          pathname === item.href ||
          (item.href !== `/dashboard/${activeRole}` &&
            pathname.startsWith(item.href));

        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex flex-col items-center justify-center gap-1 rounded-xl px-3 py-1.5 text-[11px] font-medium transition-all",
              isActive
                ? "text-primary font-semibold bg-primary/10"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            <item.icon className="h-5 w-5 shrink-0" />
            <span className="truncate max-w-16">{item.label}</span>
          </Link>
        );
      })}
    </div>
  );
}
