import { Role } from "@/types";
import type { LucideIcon } from "lucide-react";
import {
  Activity,
  BadgeAlert,
  Building,
  Building2,
  Calculator,
  CalendarClock,
  CalendarDays,
  ClipboardCheck,
  ClipboardList,
  Compass,
  EyeOff,
  Gauge,
  Handshake,
  LayoutDashboard,
  Lock,
  MapPin,
  Megaphone,
  Package,
  Percent,
  Radar,
  Repeat,
  ScanSearch,
  ShieldCheck,
  ShoppingCart,
  SlidersHorizontal,
  Sparkle,
  Sparkles,
  Store,
  Target,
  Truck,
  UserCheck,
  Users,
  Vault,
  Zap,
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
  color: Role;
}

export const ROLE_CONTENT: Record<Role, RoleContent> = {
  tenant: {
    label: "Tenant",
    badge: "For Business Operators & Tenants",
    headline: "From Business Idea to Daily Retail Operations",
    color: "tenant",
    description:
      "Tenants are business operators first, stall renters second. Whether you're running a physical stall or a home-based, cloud kitchen, or online business, you get the same tools.",
    groups: [
      {
        title: "Multi-Business & POS Hub",
        description:
          "Works the same whether you rent a physical stall or run entirely online — no stall required to use any of this.",
        items: [
          {
            icon: Building2,
            title: "Multiple Business Profiles",
            description:
              'Run more than one business from a single account — say "Kedai Kopi 90" and "Ayam Geprek Express" — each kept completely separate.',
          },
          {
            icon: ShoppingCart,
            title: "Built-in POS & Digital Receipts",
            description:
              "Ring up sales, send or print digital receipts, and accept cash or QRIS — all from one cashier screen.",
          },
          {
            icon: Users,
            title: "Restricted Cashier Accounts",
            description:
              "Give staff their own login to process transactions, without letting them see your profit and loss.",
          },
        ],
      },
      {
        title: "Stall Discovery & Budget-Fit Search",
        items: [
          {
            icon: MapPin,
            title: "Landmark & Radius Search",
            description:
              "Search by city or street, or pair a landmark (campuses, schools, office districts) with a custom radius distance to find nearby stalls.",
          },
          {
            icon: SlidersHorizontal,
            title: "Multi-Filter Specs, Size & Placement",
            description:
              "Filter spaces by property type (Mall Island, Ruko, Market Stall, Food Court), placement (Indoor, Semi-Outdoor, Outdoor), exact floor size (sqm), and essential facilities.",
          },
          {
            icon: Target,
            title: "Budget & Target ROI Match",
            description:
              "Input your business type, capital, and target break-even period — e.g. 6 months — to surface stalls whose rent math fits your goals.",
          },
          {
            icon: CalendarDays,
            title: "Lease Schedule & Timeline Filters",
            description:
              "Filter stalls by desired start dates (1st, 15th, End of Month, or 1-28), minimum lease periods, and payment cycles (Monthly, Quarterly, Semesterly, Yearly).",
          },
        ],
      },
      {
        title: "Context-Aware Supplier Marketplace",
        items: [
          {
            icon: Store,
            title: "Shop Suppliers In-Dashboard",
            description:
              "Order raw materials without leaving your business dashboard — no separate app to juggle.",
          },
          {
            icon: Sparkles,
            title: "Matched to Your Business",
            description:
              "See a curated supplier catalog based on what you sell — a coffee shop sees bean and milk suppliers first, automatically.",
          },
        ],
      },
      {
        title: "Business Intelligence & Financial Analytics",
        items: [
          {
            icon: Activity,
            title: "Diagnostic Health Overview",
            description:
              "A daily and weekly snapshot of your revenue trend, transaction volume, and which items are moving slowly.",
            tier: "free",
          },
          {
            icon: Calculator,
            title: "Multi-Timeline Business Forecast",
            description:
              "Project your revenue, margins, and cash flow across 1-week, 1-month, 6-month, and 1-year horizons using your sales history or custom financial presets under Conservative, Balanced, and Optimistic scenarios.",
            tier: "premium",
          },
          {
            icon: Compass,
            title: "Prescriptive Operational Co-Pilot",
            description:
              "Recommendations built from your own POS data — when to adjust your hours, which products to bundle, and when to restock.",
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
      "Owners manage a portfolio, not just a lease. The focus is occupancy, payment certainty, and keeping the process dispute-free.",
    groups: [
      {
        title: "Portfolio Dashboard",
        items: [
          {
            icon: LayoutDashboard,
            title: "Real-Time Occupancy Overview",
            description:
              "See which stalls are occupied and which are vacant, across your whole portfolio, at a glance.",
          },
          {
            icon: CalendarClock,
            title: "Lease Expiry Tracking",
            description:
              "Get a heads-up as a tenant's lease approaches its end date, so nothing lapses unnoticed.",
          },
          {
            icon: EyeOff,
            title: "Manual Relisting Control",
            description:
              "No inaccurate 'available soon' status. Active stalls remain hidden until you personally inspect, clean, and manually republish them.",
          },
        ],
      },
      {
        title: "Tenant Vetting & Price-Locked Leases",
        items: [
          {
            icon: UserCheck,
            title: "Tenant Profile & Rating Review",
            description:
              "Check a prospective tenant's rental history, business type, and rating before you say yes.",
          },
          {
            icon: ClipboardCheck,
            title: "Approve or Reject in One Queue",
            description:
              "Review incoming applications and approve or reject them from a single, simple list.",
          },
          {
            icon: Lock,
            title: "Price-Locked Lease Terms",
            description:
              "Once you approve, rent and deposit are locked into the contract — no changing terms mid-lease.",
          },
          {
            icon: ShieldCheck,
            title: "Custom Lease Rules & Anti-Spam",
            description:
              "Set flexible start dates, minimum lease terms, and payment cycles. Serial ghosters are required to place a 35% refundable deposit commitment when applying.",
          },
        ],
      },
      {
        title: "Overdue Management & Deposit Protection",
        items: [
          {
            icon: BadgeAlert,
            title: "Red Overdue Badges",
            description:
              "A red badge only shows up once a due date has actually passed — no premature alerts, just a clear signal when it's time to follow up.",
          },
          {
            icon: Vault,
            title: "Escrow-Held Security Deposit",
            description:
              "Deposits sit safely in a neutral escrow account for the length of the lease — not in anyone's personal account.",
          },
          {
            icon: ScanSearch,
            title: "Photo-Evidence Damage Claims",
            description:
              "Claiming part of a deposit for damage requires real photo evidence attached to the claim.",
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
              "See exactly how much a vacant stall is costing you, day by day, in real numbers.",
            tier: "premium",
          },
          {
            icon: Percent,
            title: "Pricing & Duration Recommendations",
            description:
              "Get suggested rent adjustments and ideal contract lengths to fill vacancies faster.",
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
      "Suppliers are positioned as supply chain partners, matched directly with UMKM tenants ready to become loyal, recurring customers.",
    groups: [
      {
        title: "Direct SME Matchmaking",
        items: [
          {
            icon: Handshake,
            title: "In-Dashboard Catalog Placement",
            description:
              "Your catalog shows up automatically on the shopping page of tenants whose business it fits.",
          },
          {
            icon: Megaphone,
            title: "Zero Advertising Spend",
            description:
              "Reach buyers who already need your product — no ad budget required to be seen.",
          },
        ],
      },
      {
        title: "Subscriber & Recurring Orders",
        items: [
          {
            icon: Repeat,
            title: "Primary Supplier Designation",
            description:
              'Tenants can set you as their "Primary Supplier" for a given ingredient or item.',
          },
          {
            icon: Zap,
            title: "1-Click Inventory Reorder",
            description:
              "When a tenant's stock runs low, restocking from you takes a single click.",
          },
        ],
      },
      {
        title: "Fulfillment & Catalog Control",
        items: [
          {
            icon: ClipboardList,
            title: "B2B Order Management",
            description:
              "See every incoming order with item details and delivery address in one place.",
          },
          {
            icon: Truck,
            title: "Digital Delivery Notes",
            description:
              "Generate delivery notes digitally instead of doing it on paper.",
          },
          {
            icon: Package,
            title: "Catalog & MOQ Rules",
            description:
              "Set tiered wholesale pricing and minimum order quantities for each product.",
          },
        ],
      },
      {
        title: "Supply Chain Analytics",
        items: [
          {
            icon: Gauge,
            title: "Order Velocity Analytics",
            description:
              "See your sales volume and which products are actually moving.",
            tier: "free",
          },
          {
            icon: Radar,
            title: "Subscriber Demand Signals",
            description:
              "Read aggregated demand across your subscriber network — like expected weekly coffee bean consumption across everyone who buys from you.",
            tier: "premium",
          },
          {
            icon: Sparkle,
            title: "Market Opportunity Gaps",
            description:
              "Spot raw materials in high local demand that aren't in your catalog yet.",
            tier: "premium",
          },
        ],
      },
    ],
  },
};

export const ROLE_ORDER: Role[] = ["tenant", "owner", "supplier"];
