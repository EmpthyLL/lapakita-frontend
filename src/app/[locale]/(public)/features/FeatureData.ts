import { Role } from "@/types";
import type { LucideIcon } from "lucide-react";
import {
  Activity,
  BadgeAlert,
  Building,
  Building2,
  Calculator,
  CalendarClock,
  ClipboardCheck,
  ClipboardList,
  Compass,
  EyeOff,
  Gauge,
  Handshake,
  History,
  Key,
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
  Tent,
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
      "Tenants are business operators first, stall renters second. Whether you're running a physical stall, market booth, pop-up event, or home-based business, you get the same powerful tools.",
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
        title: "Stall & Event Spot Discovery",
        items: [
          {
            icon: Key,
            title: "Operational Permanence Search Tabs",
            description:
              "Filter spaces by 3 distinct operational levels: Permanent (24/7 access), Semi-Permanent (malls, traditional markets, food courts), or Temporary (pop-up bazaar booths & street vendor spots).",
          },
          {
            icon: MapPin,
            title: "Landmark & Radius Search",
            description:
              "Search by city or street, or pair a landmark (campuses, schools, office districts) with a custom radius distance to find nearby stalls.",
          },
          {
            icon: SlidersHorizontal,
            title: "Multi-Filter Specs, Size & Facilities",
            description:
              "Filter spaces by property type (Shophouse, Mall Island, Open Market Stall, Food Court), placement (Indoor, Semi-Outdoor, Outdoor), floor size (sqm), and essential facilities.",
          },
          {
            icon: Target,
            title: "Budget & Target ROI Match",
            description:
              "Input your business type, capital, and target break-even period — or target daily revenue for bazaars — to surface stalls whose rent math fits your goals.",
          },
          {
            icon: Tent,
            title: "Pop-Up & Bazaar Event Booking",
            description:
              "Discover and apply for short-term festival booths or food truck spots with transparent registration windows, slot counts, and fixed event schedules.",
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
        title: "Business Intelligence & Forecast Analytics",
        items: [
          {
            icon: Activity,
            title: "Diagnostic Health Overview",
            description:
              "A daily and weekly snapshot of your revenue trend, transaction volume, and slow-moving items.",
            tier: "free",
          },
          {
            icon: Calculator,
            title: "Multi-Timeline Business Forecast",
            description:
              "Project revenue, margins, and cash flow across 1-week, 1-month, 6-month, and 1-year horizons using historical POS data or custom financial presets under Conservative, Balanced, and Optimistic scenarios.",
            tier: "premium",
          },
          {
            icon: History,
            title: "Persistent Report Archive",
            description:
              "All generated forecast reports are automatically stored as structured history. Access and re-download your past analysis anytime, even if your account reverts to the Free tier.",
            tier: "free",
          },
          {
            icon: Compass,
            title: "Prescriptive Operational Co-Pilot",
            description:
              "Contextual recommendations built from your live POS data — when to adjust operating hours, which products to bundle, and optimal restock timing.",
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
      "Owners manage a portfolio, not just a lease. Focus on occupancy, payment certainty, and keeping the process dispute-free across permanent, market, and event spaces.",
    groups: [
      {
        title: "Portfolio Dashboard",
        items: [
          {
            icon: LayoutDashboard,
            title: "Real-Time Occupancy Overview",
            description:
              "See which stalls are occupied, vacant, or active in short-term events across your whole portfolio at a glance.",
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
        title: "Tenant Vetting & Flexible Leasing",
        items: [
          {
            icon: UserCheck,
            title: "Tenant Profile & Rating Review",
            description:
              "Check a prospective tenant's rental history, business type, and rating before approving their application.",
          },
          {
            icon: ClipboardCheck,
            title: "Approve or Reject in One Queue",
            description:
              "Review incoming applications for permanent stalls, managed complex kiosks, or bazaar booths and manage approvals from a single queue.",
          },
          {
            icon: Lock,
            title: "Price-Locked Lease Terms",
            description:
              "Once approved, rent and deposit terms are locked into the contract — no changing terms mid-lease.",
          },
          {
            icon: ShieldCheck,
            title: "Custom Rules & Anti-Spam Commitment",
            description:
              "Configure flexible start dates, minimum lease terms, operating days, and payment cycles. Serial ghosters must place a 35% refundable deposit commitment when applying.",
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
              "Clear, non-intrusive indicators that highlight missed due dates without premature alerts.",
          },
          {
            icon: Vault,
            title: "Escrow-Held Security Deposit",
            description:
              "Deposits sit safely in a neutral escrow account for the length of the lease — protecting both owner and tenant.",
          },
          {
            icon: ScanSearch,
            title: "Photo-Evidence Damage Claims",
            description:
              "Claiming part of a deposit for damage requires timestamped photo evidence attached directly to the claim.",
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
              "Track exactly how much a vacant stall is costing you day by day in real numbers.",
            tier: "premium",
          },
          {
            icon: History,
            title: "Vacancy & Yield History Archive",
            description:
              "Generated vacancy loss and rental yield reports remain accessible in your historical report archive permanently.",
            tier: "free",
          },
          {
            icon: Percent,
            title: "Contextual Pricing & Lease Recommendations",
            description:
              "Live co-pilot recommendations suggesting rent adjustments, optimal lease durations, and deposit terms to minimize vacancy.",
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
      "Suppliers are positioned as supply chain partners, matched directly with UMKM tenants ready to become loyal, recurring buyers.",
    groups: [
      {
        title: "Direct SME Matchmaking",
        items: [
          {
            icon: Handshake,
            title: "In-Dashboard Catalog Placement",
            description:
              "Your catalog shows up automatically on the purchasing page of tenants operating within your target business categories.",
          },
          {
            icon: Megaphone,
            title: "Zero Advertising Spend",
            description:
              "Reach active business operators who need your raw materials — no ad budget required to be seen.",
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
              'Tenants can set you as their "Primary Supplier" for specific ingredients or inventory items.',
          },
          {
            icon: Zap,
            title: "1-Click Inventory Reorder",
            description:
              "When a tenant's stock runs low, restocking from your catalog takes a single click from their cashier dashboard.",
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
              "Manage incoming orders, item breakdowns, and delivery destinations in one place.",
          },
          {
            icon: Truck,
            title: "Digital Delivery Notes",
            description:
              "Generate digital delivery notes automatically upon order fulfillment.",
          },
          {
            icon: Package,
            title: "Catalog & MOQ Rules",
            description:
              "Configure tiered wholesale pricing and minimum order quantities per product.",
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
              "Track overall sales volume and identify fast-moving products across your customer base.",
            tier: "free",
          },
          {
            icon: Radar,
            title: "Subscriber Demand Signals",
            description:
              "Read aggregated demand across your subscriber network — predicting weekly ingredient consumption across all active buyers.",
            tier: "premium",
          },
          {
            icon: Sparkle,
            title: "Market Opportunity Gap Analysis",
            description:
              "Spot raw material categories in high local tenant demand that are under-supplied in your catalog.",
            tier: "premium",
          },
          {
            icon: History,
            title: "Market Opportunity Report Archive",
            description:
              "Generated opportunity gap and market demand reports are archived permanently for future reference.",
            tier: "free",
          },
        ],
      },
    ],
  },
};

export const ROLE_ORDER: Role[] = ["tenant", "owner", "supplier"];
