import type { Role } from "@/types";
import type { LucideIcon } from "lucide-react";
import {
  BarChart3,
  Bell,
  BellRing,
  Building2,
  CalendarCheck,
  ClipboardList,
  CreditCard,
  FileCheck2,
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
} from "lucide-react";

export interface NavItem {
  label: string;
  mobileLabel: string;
  href: string;
  icon: LucideIcon;
  role?: Role;
}

// ── 1. MAIN DASHBOARD NAV (DITAMBAHKAN NOTIFIKASI DI TIAP ROLE) ────────────────
export const DASHBOARD_NAV: Record<Role, NavItem[]> = {
  tenant: [
    {
      label: "Overview",
      mobileLabel: "Overview",
      href: "/dashboard/tenant",
      icon: LayoutDashboard,
    },
    {
      label: "My Businesses",
      mobileLabel: "Businesses",
      href: "/dashboard/tenant/businesses",
      icon: Store,
    },
    {
      label: "My Leases",
      mobileLabel: "Leases",
      href: "/dashboard/tenant/leases",
      icon: KeyRound,
    },
    {
      label: "Billing & Invoices",
      mobileLabel: "Invoices",
      href: "/dashboard/tenant/billing",
      icon: Wallet,
    },
    {
      label: "Analytics & Reports",
      mobileLabel: "Analytics",
      href: "/dashboard/tenant/analytics",
      icon: BarChart3,
    },
    {
      label: "Notifications",
      mobileLabel: "Notifications",
      href: "/dashboard/tenant/notifications",
      icon: Bell,
    },
  ],

  owner: [
    {
      label: "Overview",
      mobileLabel: "Overview",
      href: "/dashboard/owner",
      icon: LayoutDashboard,
    },
    {
      label: "Property Portfolio",
      mobileLabel: "Portfolio",
      href: "/dashboard/owner/portfolio",
      icon: Building2,
    },
    {
      label: "Lease Applications",
      mobileLabel: "Applications",
      href: "/dashboard/owner/applications",
      icon: ClipboardList,
    },
    {
      label: "Active Tenancies",
      mobileLabel: "Tenancies",
      href: "/dashboard/owner/tenancies",
      icon: CalendarCheck,
    },
    {
      label: "Analytics & Reports",
      mobileLabel: "Analytics",
      href: "/dashboard/owner/analytics",
      icon: BarChart3,
    },
    {
      label: "Notifications",
      mobileLabel: "Notifications",
      href: "/dashboard/owner/notifications",
      icon: Bell,
    },
  ],

  supplier: [
    {
      label: "Overview",
      mobileLabel: "Overview",
      href: "/dashboard/supplier",
      icon: LayoutDashboard,
    },
    {
      label: "Product Catalog",
      mobileLabel: "Catalog",
      href: "/dashboard/supplier/catalog",
      icon: Package,
    },
    {
      label: "Orders & Shipping",
      mobileLabel: "Orders",
      href: "/dashboard/supplier/orders",
      icon: Truck,
    },
    {
      label: "Regular Buyers",
      mobileLabel: "Buyers",
      href: "/dashboard/supplier/subscribers",
      icon: Handshake,
    },
    {
      label: "Demand & Reports",
      mobileLabel: "Demand",
      href: "/dashboard/supplier/demand",
      icon: Radar,
    },
    {
      label: "Notifications",
      mobileLabel: "Notifications",
      href: "/dashboard/supplier/notifications",
      icon: Bell,
    },
  ],
};

// ── 2. WALLET & FINANCIAL NAV (5 ITEMS - ALERTS DI PALING BAWAH) ─────────────
export const WALLET_NAV: NavItem[] = [
  {
    label: "Wallet Overview",
    mobileLabel: "Overview",
    href: "/dashboard/wallet",
    icon: Receipt,
  },
  {
    label: "Transaction History",
    mobileLabel: "History",
    href: "/dashboard/wallet/history",
    icon: History,
  },
  {
    label: "Subscriptions & Plans",
    mobileLabel: "Subscriptions",
    href: "/dashboard/wallet/subscription",
    icon: CreditCard,
  },
  {
    label: "Payment Methods",
    mobileLabel: "Payments",
    href: "/dashboard/wallet/payment-methods",
    icon: ShieldCheck,
  },
  {
    label: "Finance Alerts",
    mobileLabel: "Alerts",
    href: "/dashboard/wallet/notifications",
    icon: BellRing,
  },
];

// ── 3. SETTINGS NAV (6 WEB / 5 MOBILE - NOTIFIKASI DI PALING BAWAH) ──────────
export const SETTINGS_NAV: NavItem[] = [
  {
    label: "General Profile",
    mobileLabel: "Profile",
    href: "/dashboard/settings",
    icon: UserCog,
  },
  {
    label: "Legal Documents",
    mobileLabel: "Legal ID",
    href: "/dashboard/settings/documents",
    icon: FileCheck2,
  },
  {
    label: "Phone & Contact",
    mobileLabel: "Contacts",
    href: "/dashboard/settings/phone",
    icon: Phone,
  },
  {
    label: "Security & Password",
    mobileLabel: "Security",
    href: "/dashboard/settings/password",
    icon: Lock,
  },
  {
    label: "Persona Preferences",
    mobileLabel: "Persona",
    href: "/dashboard/settings/persona",
    icon: UserCheck,
  },
  {
    label: "Notifications",
    mobileLabel: "Notifications",
    href: "/dashboard/settings/notifications",
    icon: Bell,
  },
];

// ── 4. BUSINESS WORKSPACE NAV (POS & PROCUREMENT) ──────────────────────────
export function getBusinessWorkspaceNav(businessId: string): NavItem[] {
  const base = `/dashboard/business/${businessId}`;
  return [
    {
      label: "Overview",
      mobileLabel: "Overview",
      href: base,
      icon: LayoutDashboard,
    },
    {
      label: "POS Cashier",
      mobileLabel: "POS",
      href: `${base}/pos`,
      icon: ShoppingCart,
    },
    {
      label: "Products & Stock",
      mobileLabel: "Products",
      href: `${base}/products`,
      icon: Package,
    },
    {
      label: "Staff Accounts",
      mobileLabel: "Staff",
      href: `${base}/staff`,
      icon: Users,
    },
    {
      label: "B2B Procurement",
      mobileLabel: "Supplier",
      href: `${base}/marketplace`,
      icon: Store,
    },
  ];
}

// ── 5. FOOTER NAV ──────────────────────────────────────────────────────────
export const DASHBOARD_FOOTER_NAV: NavItem[] = [
  {
    label: "Account Settings",
    mobileLabel: "Settings",
    href: "/dashboard/settings",
    icon: Settings,
  },
  {
    label: "Wallet & Payments",
    mobileLabel: "Wallet",
    href: "/dashboard/wallet",
    icon: Wallet,
  },
];
