import { Role, RoleColor } from "@/types/roles";
import type { LucideIcon } from "lucide-react";
import {
  Building2,
  Search,
  Layers,
  TrendingUp,
  ShoppingCart,
  PackageSearch,
  Users,
  Store,
  Sparkles,
  Zap,
  Activity,
  Compass,
  LayoutDashboard,
  ClipboardCheck,
  UserCheck,
  Lock,
  Receipt,
  AlertTriangle,
  DoorOpen,
  KeyRound,
  ScanSearch,
  Radar,
  Handshake,
  Megaphone,
  Repeat,
  ClipboardList,
  Truck,
  Package,
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
    badge: "For Tenants",
    headline: "Run Your Business — On or Off a Stall",
    color: "primary",
    description:
      "Tenants aren't just renters — they're business operators. Home-based, cloud kitchen, or off-platform businesses are just as welcome as stall renters: everyone gets POS, stock, staff, and marketplace access.",
    groups: [
      {
        title: "Multi-Business Management Hub",
        description:
          "One tenant account can run multiple business profiles, each with fully separated data, transactions, stock, staff, and financial reports.",
        items: [
          {
            icon: Building2,
            title: "Multiple Business Profiles",
            description:
              'Run several businesses under one account (e.g. "Kedai Kopi 90", "Ayam Geprek Express", "Laundry Clean") without mixing their data.',
          },
          {
            icon: Layers,
            title: "Isolated Data Per Business",
            description:
              "Each business keeps its own transactions, stock, staff, and financial reports — nothing bleeds into another.",
          },
        ],
      },
      {
        title: "Stall Discovery, Compare & Simulation Engine",
        description:
          "Not required for every tenant — but built for anyone looking for a physical stall.",
        items: [
          {
            icon: Search,
            title: "Location Search & Filter",
            description:
              "Filter by radius, business type (F&B, Retail, Services), rental price, and supporting facilities.",
          },
          {
            icon: Layers,
            title: "Multi-Stall Compare",
            description:
              "Compare 2–3 stalls side-by-side on revenue estimate, break-even speed, competitor density, and buyer demographic fit.",
          },
          {
            icon: TrendingUp,
            title: "Stall Simulation",
            description:
              "Simulate business performance at a given stall under Conservative, Balanced, and Optimistic scenarios.",
          },
        ],
      },
      {
        title: "Built-in POS & Retail Operations",
        items: [
          {
            icon: ShoppingCart,
            title: "Digital Cashier (POS)",
            description:
              "Take orders, print or send digital receipts, calculate change, and accept QRIS/cash payments.",
          },
          {
            icon: PackageSearch,
            title: "Stock & Product Records",
            description:
              "Manage variants, selling price, cost of goods (HPP), and automatic low-stock alerts on raw materials.",
          },
          {
            icon: Users,
            title: "Staff Management",
            description:
              "Add cashier or staff accounts with restricted access — no visibility into profit/loss reports.",
          },
        ],
      },
      {
        title: "Smart Supplier Marketplace",
        description:
          "Context-aware — appears right inside each business's dashboard.",
        items: [
          {
            icon: Store,
            title: "Auto-Matched Supplier Tab",
            description:
              "Every business dashboard has a Supplier Marketplace tab filtered to that business's needs automatically.",
          },
          {
            icon: Sparkles,
            title: "Automatic Recommendations",
            description:
              "A coffee business gets matched with coffee bean, cup, and UHT milk suppliers — no manual searching required.",
          },
          {
            icon: Zap,
            title: "Order & Reorder In-App",
            description:
              "Order raw materials directly from the POS dashboard without switching to another app.",
          },
        ],
      },
      {
        title: "Business Intelligence (BI) Analytics",
        items: [
          {
            icon: Activity,
            title: "Free Diagnostic Analytics",
            description:
              "Daily revenue trend charts, transaction counts, and an overall Business Health Score.",
            tier: "free",
          },
          {
            icon: Compass,
            title: "Premium Prescriptive Analytics",
            description:
              "Operational recommendations — restock suggestions, optimal opening hours, slow-moving vs high-margin product evaluation.",
            tier: "premium",
          },
        ],
      },
    ],
  },

  owner: {
    label: "Stall Owner",
    badge: "For Stall Owners",
    headline: "Manage a Portfolio, Not Just Rent",
    color: "owner",
    description:
      "Owners are portfolio managers first. Lapakita gives certainty of income, minimizes vacancy, and keeps the rental process free of disputes.",
    groups: [
      {
        title: "Property Portfolio Dashboard",
        items: [
          {
            icon: LayoutDashboard,
            title: "Visual Asset Summary",
            description:
              "See Active stalls, Vacant stalls, and Alerted stalls (awaiting contract or vacancy action) at a glance.",
          },
          {
            icon: TrendingUp,
            title: "Payout & Projection Overview",
            description:
              "Track total monthly payouts already disbursed alongside projected incoming revenue.",
          },
        ],
      },
      {
        title: "Pending Contract Review & Tenant Vetting",
        items: [
          {
            icon: ClipboardCheck,
            title: "Rental Application Queue",
            description:
              "Review every incoming rental request from prospective tenants in one list.",
          },
          {
            icon: UserCheck,
            title: "Tenant Reputation Profile",
            description:
              "See a tenant's rental history and rating before hitting Approve or Reject.",
          },
          {
            icon: Lock,
            title: "Price-Locked Contracts",
            description:
              "Terms, price, and deposit are locked — no unilateral price speculation later.",
          },
        ],
      },
      {
        title: "Automated Billing & Payment Alerts",
        items: [
          {
            icon: Receipt,
            title: "Real-Time Billing Status",
            description:
              "The system automatically manages the daily due-date cycle for every tenant.",
          },
          {
            icon: AlertTriangle,
            title: "Late Fee Alerts",
            description:
              "Transparent notifications when a tenant is late, with a day-based graduated late fee — never a sudden fine.",
          },
          {
            icon: DoorOpen,
            title: "Graceful Exit & Eviction Management",
            description:
              "Automated warnings and workflow for voluntary exits or extreme non-payment leading to contract termination.",
          },
        ],
      },
      {
        title: "Photo-Verified Handover & Inspection",
        items: [
          {
            icon: KeyRound,
            title: "Request Key Protocol",
            description:
              "Physical key handover is verified through timestamped photo evidence, preventing one-sided claims.",
          },
          {
            icon: ScanSearch,
            title: "Deposit Resolution",
            description:
              "Damage claims at check-out require photo evidence before any remaining deposit is returned to the tenant.",
          },
        ],
      },
      {
        title: "Stall Strategy Analytics (BI)",
        items: [
          {
            icon: Building2,
            title: "Vacancy Cost Modeling",
            description:
              "Calculates the exact daily loss from a vacant unit and recommends ideal rent price or contract duration to speed up occupancy.",
            tier: "premium",
          },
          {
            icon: Radar,
            title: "Tenant Mix & Demand Signals",
            description:
              "See which business categories tenants are searching for most in your property's area.",
          },
        ],
      },
    ],
  },

  supplier: {
    label: "Supplier",
    badge: "For Suppliers",
    headline: "Get Matched With UMKM Ready to Order",
    color: "supplier",
    description:
      "Supplier features center on direct B2B matchmaking — not just analytics — connecting suppliers with SMEs ready to become loyal, recurring customers.",
    groups: [
      {
        title: "Direct SME Matchmaking & Marketplace Distribution",
        description: "The core feature of the supplier module.",
        items: [
          {
            icon: Handshake,
            title: "Auto-Placed Catalog",
            description:
              "Your product catalog appears directly on the Marketplace tab of relevant tenant dashboards.",
          },
          {
            icon: Megaphone,
            title: "No Ad Spend Required",
            description:
              "The system brings your products to tenants who already need that raw material — no paid ads necessary.",
          },
        ],
      },
      {
        title: "Subscriber & Recurring Order Engine",
        items: [
          {
            icon: Repeat,
            title: "B2B Subscription System",
            description:
              'Tenants can mark you as their "Primary Supplier" for a given ingredient or item.',
          },
          {
            icon: Zap,
            title: "1-Click Reorder",
            description:
              "When a tenant's POS stock runs low, they can reorder from their subscribed supplier in one click.",
          },
          {
            icon: TrendingUp,
            title: "Predictable Recurring Revenue",
            description:
              "Subscriber relationships translate into steady, forecastable monthly revenue.",
          },
        ],
      },
      {
        title: "Order Management & Fulfillment Operations",
        items: [
          {
            icon: ClipboardList,
            title: "Incoming Order List",
            description:
              "See recent orders across tenants with item details, business/stall address, and delivery status.",
          },
          {
            icon: Truck,
            title: "B2B Delivery Notes",
            description:
              "Print shipping notes and integrate with delivery fulfillment.",
          },
        ],
      },
      {
        title: "Catalog & Stock Control",
        items: [
          {
            icon: Package,
            title: "Product & Warehouse Management",
            description:
              "Manage your raw material or equipment catalog, minimum order quantities, tiered pricing, and warehouse stock levels.",
          },
        ],
      },
      {
        title: "Demand & Inventory Intelligence",
        items: [
          {
            icon: Radar,
            title: "Subscriber Demand Insight",
            description:
              'Read stock-need trends across your subscriber network — e.g. "your subscribers may need 100kg of coffee beans next week" based on their POS sales volume.',
          },
          {
            icon: Sparkles,
            title: "Opportunity Signals",
            description:
              "Identify raw materials with surging demand among UMKM tenants that aren't yet in your catalog.",
            tier: "premium",
          },
        ],
      },
    ],
  },
};

export const ROLE_ORDER: Role[] = ["tenant", "owner", "supplier"];
