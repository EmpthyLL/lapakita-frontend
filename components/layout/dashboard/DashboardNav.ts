import type { Role } from "@/types";
import type { LucideIcon } from "lucide-react";
import {
  BarChart3,
  Building2,
  ClipboardList,
  Handshake,
  LayoutDashboard,
  Package,
  Radar,
  Settings,
  ShoppingCart,
  Store,
  Truck,
  Users,
  Vault,
  Wallet,
} from "lucide-react";

export interface DashboardNavItem {
  label: string;
  href: string;
  icon: LucideIcon;
  badge?: string;
}

export const DASHBOARD_NAV: Record<Role, DashboardNavItem[]> = {
  tenant: [
    { label: "Overview", href: "/dashboard/tenant", icon: LayoutDashboard },
    { label: "POS Cashier", href: "/dashboard/tenant/pos", icon: ShoppingCart },
    {
      label: "Products & Stock",
      href: "/dashboard/tenant/products",
      icon: Package,
    },
    { label: "Staff Accounts", href: "/dashboard/tenant/staff", icon: Users },
    {
      label: "Supplier Marketplace",
      href: "/dashboard/tenant/marketplace",
      icon: Store,
    },
    {
      label: "Analytics",
      href: "/dashboard/tenant/analytics",
      icon: BarChart3,
      badge: "Pro",
    },
  ],
  owner: [
    { label: "Overview", href: "/dashboard/owner", icon: LayoutDashboard },
    {
      label: "Property Portfolio",
      href: "/dashboard/owner/portfolio",
      icon: Building2,
    },
    {
      label: "Applications",
      href: "/dashboard/owner/applications",
      icon: ClipboardList,
    },
    {
      label: "Deposits & Escrow",
      href: "/dashboard/owner/deposits",
      icon: Vault,
    },
    {
      label: "Strategy Analytics",
      href: "/dashboard/owner/analytics",
      icon: BarChart3,
      badge: "Pro",
    },
  ],
  supplier: [
    { label: "Overview", href: "/dashboard/supplier", icon: LayoutDashboard },
    { label: "Catalog", href: "/dashboard/supplier/catalog", icon: Package },
    { label: "Orders", href: "/dashboard/supplier/orders", icon: Truck },
    {
      label: "Subscribers",
      href: "/dashboard/supplier/subscribers",
      icon: Handshake,
    },
    {
      label: "Demand Signals",
      href: "/dashboard/supplier/demand",
      icon: Radar,
      badge: "Pro",
    },
  ],
};

export const DASHBOARD_FOOTER_NAV: DashboardNavItem[] = [
  { label: "Wallet", href: "/wallet", icon: Wallet },
  { label: "Settings", href: "/settings", icon: Settings },
];
