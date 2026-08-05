import { Role, RoleColor } from "@/types/roles";
import type { LucideIcon } from "lucide-react";
import {
  Building2,
  Home,
  Layers,
  Search,
  TrendingUp,
  ShoppingCart,
  PackageSearch,
  Users,
  Store,
  Sparkles,
  Activity,
  Compass,
  LayoutDashboard,
  AlertCircle,
  ClipboardCheck,
  UserCheck,
  Lock,
  Receipt,
  BellRing,
  Key,
  KeyRound,
  ShieldAlert,
  Vault,
  ScanSearch,
  Building,
  Percent,
  Handshake,
  Megaphone,
  Repeat,
  Zap,
  ClipboardList,
  Truck,
  Package,
  Layers3,
  Radar,
  Sparkle,
} from "lucide-react";

export interface FeatureItem {
  icon: LucideIcon;
  title: string;
  description: string;
  tier?: "free" | "premium";
}

export interface FeatureGroup {
  title: string;
  description?: string;
  items: FeatureItem[];
}

export interface RoleContent {
  label: string;
  badge: string;
  headline: string;
  description: string;
  groups: FeatureGroup[];
  color: RoleColor;
}

export const ROLE_CONTENT: Record<Role, RoleContent> = {
  tenant: {
    label: "Tenant",
    badge: "For Business Operators & Tenants",
    headline: "From Business Idea to Daily Retail Operations",
    color: "primary",
    description:
      "Whether you run from a rented stall, a home-based cloud kitchen, or a temporary booth — every business gets its own POS, inventory, staff access, and financial ledger under one account.",
    groups: [
      {
        title: "Multi-Business Management Hub",
        description: "Non-stall businesses welcome.",
        items: [
          {
            icon: Building2,
            title: "Multiple Business Profiles",
            description:
              'Run several SME businesses under a single Lapakita account — e.g. "Kedai Kopi 90", "Ayam Geprek Express", "Laundry Clean".',
          },
          {
            icon: Layers,
            title: "Isolated POS & Ledger Per Business",
            description:
              "Each business gets its own POS, inventory, staff access, and financial ledger — nothing mixes with another.",
          },
          {
            icon: Home,
            title: "Non-Stall Businesses Accepted",
            description:
              "Operate from an offline rented stall, a home-based cloud kitchen, an online-based shop, or a temporary booth — all equally welcome.",
          },
        ],
      },
      {
        title: "Stall Discovery, Comparison & Simulation",
        items: [
          {
            icon: Search,
            title: "Data-Backed Location Search & Filter",
            description:
              "Filter stalls by business type compatibility (F&B, Retail, Services), spatial utilities (power, water, ventilation), radius, rent, and deposit budget.",
          },
          {
            icon: Layers,
            title: "Multi-Stall Side-by-Side Comparison",
            description:
              "Compare up to 3 prospective locations on revenue potential, break-even velocity, foot-traffic score, and nearby competition density.",
          },
          {
            icon: TrendingUp,
            title: "Turnover & Performance Simulation",
            description:
              "Run deterministic financial simulations under Conservative, Balanced, and Optimistic scenarios before committing to a stall.",
          },
        ],
      },
      {
        title: "Built-in POS & Staff Access",
        items: [
          {
            icon: ShoppingCart,
            title: "Digital Order Processing",
            description:
              "Process customer orders, issue digital receipts, and log cash/QRIS payments in real-time.",
          },
          {
            icon: PackageSearch,
            title: "Real-Time Material Usage Tracking",
            description:
              "Automatically track raw material consumption as orders come through the POS.",
          },
          {
            icon: Users,
            title: "Restricted Cashier Accounts",
            description:
              "Assign staff accounts with limited access — no visibility into net profit reports.",
          },
        ],
      },
      {
        title: "Context-Aware Supplier Marketplace",
        items: [
          {
            icon: Store,
            title: "In-Dashboard B2B Marketplace",
            description:
              "Access a curated supplier marketplace directly inside your business dashboard.",
          },
          {
            icon: Sparkles,
            title: "Automatic Category Matching",
            description:
              "Get raw material and supply recommendations automatically matched to your specific business category.",
          },
        ],
      },
      {
        title: "Lease Alerts & Key Loss Requests",
        items: [
          {
            icon: BellRing,
            title: "Upcoming Expiry & Payment Countdown",
            description:
              "Get clear yellow alerts starting 7 days before lease expiry to help you plan extensions or peaceful move-outs on time.",
          },
          {
            icon: KeyRound,
            title: "In-App Replacement Key Request",
            description:
              "Lost your physical key? Request a spare key directly from the owner with automated deposit deduction for reproduction fees.",
          },
        ],
      },
      {
        title: "Business Intelligence (BI) Analytics",
        items: [
          {
            icon: Activity,
            title: "Diagnostic Business Health Score",
            description:
              "Objective daily/weekly analytics on revenue trends, peak-hour service delays, and slow-moving menu items.",
            tier: "free",
          },
          {
            icon: Compass,
            title: "Prescriptive Business Co-Pilot",
            description:
              "Actionable guidance — opening hours expansion, discount strategy for high-margin items, restock alerts based on local demand.",
            tier: "premium",
          },
        ],
      },
    ],
  },

  owner: {
    label: "Stall Owner",
    badge: "For Property & Space Owners",
    headline: "Transparent Portfolio Management & Dispute-Free Leasing",
    color: "owner",
    description:
      "Owners are portfolio managers first. Lapakita gives certainty of income, minimizes vacancy, and keeps the rental process free of disputes.",
    groups: [
      {
        title: "Portfolio Dashboard",
        items: [
          {
            icon: LayoutDashboard,
            title: "Real-Time Occupancy Overview",
            description:
              "See Occupied Stalls and Vacant Units across your entire portfolio in one place.",
          },
          {
            icon: AlertCircle,
            title: "Alerted Lease Tracking",
            description:
              "Get flagged leases that require action or renewal before they lapse unnoticed.",
          },
        ],
      },
      {
        title: "Tenant Vetting & Contracts",
        items: [
          {
            icon: ClipboardCheck,
            title: "Application Review & Rating Check",
            description:
              "Review incoming lease applications and inspect each tenant's profile rating and business type before deciding.",
          },
          {
            icon: UserCheck,
            title: "Approve or Reject Workflow",
            description:
              "Approve or reject contracts directly from the application queue — no back-and-forth paperwork.",
          },
          {
            icon: Lock,
            title: "Price-Locked Lease Terms",
            description:
              "Once approved, monthly rent and deposit terms are locked — preventing mid-lease price disputes.",
          },
        ],
      },
      {
        title: "Overdue Alerts & Manual Lease Actions",
        items: [
          {
            icon: Receipt,
            title: "Automated Payment Tracking",
            description:
              "Payment due dates are tracked automatically without cluttering your dashboard with premature alerts.",
          },
          {
            icon: ShieldAlert,
            title: "Red Overdue Badges & Manual Termination",
            description:
              "Overdue leases trigger clear red alerts only after deadlines pass, empowering you to manually follow up, review, or terminate leases.",
          },
        ],
      },
      {
        title: "Deposit Protection & Key Management",
        items: [
          {
            icon: Key,
            title: "Simplified Key Control & Spare Management",
            description:
              "Hand over keys directly to tenants. Issue spares upon request and deduct replacement fees seamlessly from the security deposit.",
          },
          {
            icon: Vault,
            title: "Escrow-Held Security Deposits",
            description:
              "Deposits are held safely in a neutral escrow payment gateway account, protecting both parties until lease completion.",
          },
          {
            icon: ScanSearch,
            title: "Photo-Evidence Damage Claims",
            description:
              "To claim deposit funds for property damage or unreturned key reproduction, simply submit photo evidence for verification.",
          },
        ],
      },
      {
        title: "Stall Strategy Analytics (BI)",
        items: [
          {
            icon: Building,
            title: "Daily Vacancy Loss Calculation",
            description:
              "See the exact financial loss accumulating during vacant periods, day by day.",
            tier: "premium",
          },
          {
            icon: Percent,
            title: "Pricing & Duration Recommendations",
            description:
              "Get optimal monthly pricing and lease duration suggestions to maximize occupancy rate.",
            tier: "premium",
          },
        ],
      },
    ],
  },

  supplier: {
    label: "Supplier",
    badge: "For B2B Distributors & Wholesalers",
    headline: "Direct SME Matchmaking & Predictable Recurring Orders",
    color: "supplier",
    description:
      "Supplier features center on direct B2B matchmaking — not just analytics — connecting suppliers with SMEs ready to become loyal, recurring customers.",
    groups: [
      {
        title: "Direct SME Marketplace Matchmaking",
        description: "The core feature of the supplier module.",
        items: [
          {
            icon: Handshake,
            title: "In-Dashboard Catalog Placement",
            description:
              "Your catalog is showcased directly inside the procurement dashboard of matching SME tenants.",
          },
          {
            icon: Megaphone,
            title: "Zero Ad Spend Required",
            description:
              "Skip expensive advertising — the system brings your products to tenants who already need them.",
          },
        ],
      },
      {
        title: "Subscriber & Recurring Orders",
        items: [
          {
            icon: Repeat,
            title: "Primary Supplier Tagging",
            description:
              'Tenants can tag you as their "Primary Supplier" for a given ingredient or item.',
          },
          {
            icon: Zap,
            title: "1-Click Automated Reorder",
            description:
              "When a tenant's POS inventory runs low, reordering from you happens in a single click.",
          },
        ],
      },
      {
        title: "Order Fulfillment & Dispatch",
        items: [
          {
            icon: ClipboardList,
            title: "Pending Order Tracking",
            description:
              "Track pending B2B purchase orders with full delivery destination details in one list.",
          },
          {
            icon: Truck,
            title: "Digital Delivery Notes",
            description:
              "Issue digital delivery notes and streamline wholesale dispatch routes.",
          },
        ],
      },
      {
        title: "Catalog & Stock Control",
        items: [
          {
            icon: Package,
            title: "Catalog & MOQ Management",
            description:
              "Manage your B2B product catalog and set minimum order quantities (MOQ) per item.",
          },
          {
            icon: Layers3,
            title: "Tiered Pricing & Stock Monitoring",
            description:
              "Configure volume-based tier pricing and monitor warehouse stock levels in real-time.",
          },
        ],
      },
      {
        title: "Demand & Opportunity Intelligence",
        items: [
          {
            icon: Radar,
            title: "Subscriber Demand Signals",
            description:
              "View aggregated, privacy-safe demand signals from your subscriber base — e.g. predicted weekly coffee bean consumption.",
            tier: "premium",
          },
          {
            icon: Sparkle,
            title: "Market Opportunity Gaps",
            description:
              "Discover trending raw materials in demand locally that aren't yet in your catalog.",
            tier: "premium",
          },
        ],
      },
    ],
  },
};

export const ROLE_ORDER: Role[] = ["tenant", "owner", "supplier"];
