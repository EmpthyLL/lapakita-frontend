import type { Role } from "@/types";
import type { LucideIcon } from "lucide-react";
import {
  BarChart3,
  Bell,
  Building2,
  CalendarCheck,
  ClipboardList,
  CreditCard,
  FileCheck2,
  FileSpreadsheet,
  Handshake,
  History,
  KeyRound,
  LayoutDashboard,
  Lock,
  Package,
  Phone,
  Radar,
  Receipt,
  Settings,
  ShieldCheck,
  ShoppingCart,
  Store,
  Truck,
  UserCheck,
  UserCog,
  Users,
  Wallet,
  WalletCards,
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

export const SETTINGS_NAV: DashboardNavItem[] = [
  {
    label: "General Profile",
    href: "/dashboard/settings",
    icon: UserCog,
  },
  {
    label: "Phone & Contact",
    href: "/dashboard/settings/phone",
    icon: Phone,
  },
  {
    label: "Security & Password",
    href: "/dashboard/settings/security",
    icon: Lock,
  },
  {
    label: "Documents & KYC",
    href: "/dashboard/settings/documents",
    icon: FileCheck2,
  },
  {
    label: "Persona Preferences",
    href: "/dashboard/settings/preferences",
    icon: UserCheck,
  },
  {
    label: "Notifications",
    href: "/dashboard/settings/notifications",
    icon: Bell,
  },
];

// ── PERSONA PROFILES SUB-NAV (Dipisah Per Role) ─────────────────────────────
export const PERSONA_PROFILES_NAV: DashboardNavItem[] = [
  {
    label: "Tenant Profile",
    href: "/dashboard/settings/profile/tenant",
    icon: UserCog,
    role: "tenant",
  },
  {
    label: "Owner Profile",
    href: "/dashboard/settings/profile/owner",
    icon: UserCog,
    role: "owner",
  },
  {
    label: "Supplier Profile",
    href: "/dashboard/settings/profile/supplier",
    icon: UserCog,
    role: "supplier",
  },
];

// ── WALLET & SUBSCRIPTION NAV (Sidebar / Tab Wallet) ────────────────────────
export const WALLET_NAV: DashboardNavItem[] = [
  {
    label: "Overview & Balance",
    href: "/dashboard/wallet",
    icon: WalletCards,
  },
  {
    label: "Subscriptions & Plans",
    href: "/dashboard/wallet/subscription",
    icon: CreditCard,
  },
  {
    label: "Payout Accounts",
    href: "/dashboard/wallet/payout-methods",
    icon: ShieldCheck,
  },
  {
    label: "Escrow Deposits",
    href: "/dashboard/wallet/escrow",
    icon: KeyRound,
  },
  {
    label: "Transaction History",
    href: "/dashboard/wallet/history",
    icon: History,
  },
  {
    label: "Invoices & Receipts",
    href: "/dashboard/wallet/invoices",
    icon: Receipt,
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
  { label: "Account Settings", href: "/dashboard/settings", icon: Settings },
  { label: "Wallet & Payouts", href: "/dashboard/wallet", icon: Wallet },
];
