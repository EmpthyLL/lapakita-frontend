import type { Role } from "@/types";
import type { LucideIcon } from "lucide-react";
import {
  BarChart3,
  Building2,
  CalendarCheck,
  ClipboardList,
  FileSpreadsheet,
  Handshake,
  KeyRound,
  LayoutDashboard,
  Package,
  Radar,
  Settings,
  ShoppingCart,
  Store,
  Truck,
  User,
  Users,
  Wallet,
} from "lucide-react";

export interface DashboardNavItem {
  label: string;
  href: string;
  icon: LucideIcon;
  badge?: string;
  role?: Role; // Added role field to map custom hover colors
}

// ── 1. DASHBOARD UTAMA BERDASARKAN ROLE AKUN ────────────────────────────────
export const DASHBOARD_NAV: Record<Role, DashboardNavItem[]> = {
  // TENANT
  tenant: [
    { label: "Overview", href: "/dashboard/tenant", icon: LayoutDashboard },
    {
      label: "My Businesses",
      href: "/dashboard/tenant/businesses",
      icon: Store,
    },
    {
      label: "My Leases & Events",
      href: "/dashboard/tenant/leases",
      icon: KeyRound,
    },
    {
      label: "Rent History & Invoices",
      href: "/dashboard/tenant/billing",
      icon: Wallet,
    },
    {
      label: "Business Intelligence",
      href: "/dashboard/tenant/analytics",
      icon: BarChart3,
      badge: "PRO",
    },
    {
      label: "Report History",
      href: "/dashboard/tenant/reports",
      icon: FileSpreadsheet,
    },
  ],

  // OWNER
  owner: [
    { label: "Overview", href: "/dashboard/owner", icon: LayoutDashboard },
    {
      label: "Property Portfolio",
      href: "/dashboard/owner/portfolio",
      icon: Building2,
    },
    {
      label: "Lease Applications",
      href: "/dashboard/owner/applications",
      icon: ClipboardList,
    },
    {
      label: "Active Tenancies",
      href: "/dashboard/owner/tenancies",
      icon: CalendarCheck,
    },
    {
      label: "Deposits & Escrow",
      href: "/dashboard/owner/deposits",
      icon: Wallet,
    },
    {
      label: "Strategy Analytics",
      href: "/dashboard/owner/analytics",
      icon: BarChart3,
      badge: "PRO",
    },
    {
      label: "Report History",
      href: "/dashboard/owner/reports",
      icon: FileSpreadsheet,
    },
  ],

  // SUPPLIER
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
      badge: "PRO",
    },
    {
      label: "Report History",
      href: "/dashboard/supplier/reports",
      icon: FileSpreadsheet,
    },
  ],
};

// ── 2. GENERAL MODE NAV (Menu Role di Bagian Atas) ─────────────────────────
export const GENERAL_NAV: DashboardNavItem[] = [
  {
    label: "Tenant Mode",
    href: "/dashboard/tenant",
    icon: User,
    role: "tenant",
  },
  {
    label: "Stall Owner Mode",
    href: "/dashboard/owner",
    icon: Store,
    role: "owner",
  },
  {
    label: "Supplier Mode",
    href: "/dashboard/supplier",
    icon: Truck,
    role: "supplier",
  },
];

// ── 3. BUSINESS WORKSPACE NAV ──────────────────────────────────────────────
export function getBusinessWorkspaceNav(
  businessId: string,
): DashboardNavItem[] {
  const base = `/dashboard/business/${businessId}`;
  return [
    { label: "Business Overview", href: base, icon: LayoutDashboard },
    { label: "POS Cashier", href: `${base}/pos`, icon: ShoppingCart },
    { label: "Products & Stock", href: `${base}/products`, icon: Package },
    { label: "Staff Accounts", href: `${base}/staff`, icon: Users },
    { label: "Supplier Procurement", href: `${base}/marketplace`, icon: Store },
    { label: "Business Settings", href: `${base}/settings`, icon: Settings },
  ];
}

export const DASHBOARD_FOOTER_NAV: DashboardNavItem[] = [
  { label: "Wallet & Payouts", href: "/dashboard/wallet", icon: Wallet },
  { label: "Account Settings", href: "/dashboard/settings", icon: Settings },
];
