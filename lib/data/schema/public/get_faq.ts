import { FaqItem } from "@/components/common/FAQAccordion";
import { TocItem } from "@/components/common/TOCList";
import { RoleAndAll } from "@/types";

export interface FaqSubTopic extends TocItem {
  items: FaqItem[];
}

export interface FaqCategory {
  id: RoleAndAll;
  label: string;
  description: string;
  subTopics: FaqSubTopic[];
}

export const COMPREHENSIVE_FAQS: FaqCategory[] = [
  {
    id: "all",
    label: "General & Platform",
    description:
      "Learn about Lapakita's ecosystem, single account multi-role, and pricing plans.",
    subTopics: [
      {
        title: "Platform Fundamentals",
        items: [
          {
            question: "What is Lapakita?",
            answer:
              "Lapakita is an all-in-one digital operating platform designed specifically for micro, small, and medium enterprises (SMEs/UMKM). It unifies physical stall rentals across permanent, semi-permanent, and temporary bazaar spaces, Point of Sale (POS) operations, financial business analytics, and a B2B supplier marketplace into a single ecosystem.",
          },
          {
            question: "How does the single account multi-role system work?",
            answer:
              "You only need one email and phone number to register. From your profile menu, you can toggle between Tenant, Stall Owner, and Supplier modes. Each role has its own isolated dashboard, settings, and workflows, eliminating the need for multiple accounts.",
          },
          {
            question: "Is Lapakita a mobile app or web platform?",
            answer:
              "Lapakita is built as a responsive web application optimized for smartphones, tablets, and desktop computers. Cashiers can easily process transactions on mobile phones while property owners manage portfolios on desktops.",
          },
        ],
      },
      {
        title: "Pricing, Plans & Subscriptions",
        items: [
          {
            question: "Is Lapakita free to use?",
            answer:
              "Yes! Basic stall discovery, lease applications, POS cashier operations, inventory management, and diagnostic health overviews are completely free for all users.",
          },
          {
            question:
              "What is the difference between Single-Role and All-Access Plans?",
            answer:
              "Our Single-Role Plan is Rp 55,000/month (or Rp 495,000/year) and unlocks premium features for just one role (e.g. Tenant only). The All-Access Ecosystem Bundle is Rp 125,000/month (or Rp 1,125,000/year) and unlocks premium analytics across all three roles simultaneously.",
          },
          {
            question: "How does Lapakita earn money if base features are free?",
            answer:
              "We maintain a transparent business model. Revenue comes from optional Premium Subscriptions, a small percentage transaction fee on active stall rent collection, and lightweight administrative processing fees on supplier orders.",
          },
        ],
      },
      {
        title: "Account Security & Verification",
        items: [
          {
            question:
              "Do I need to upload an ID card (KTP) during registration?",
            answer:
              "No. Registration requires only your name, email, phone number, and password. ID verification (KYC) is requested gradually — only when you are ready to sign a binding lease contract, list a stall, or register as a supplier.",
          },
          {
            question: "Is my business revenue data kept private?",
            answer:
              "We enforce strict data privacy. Your POS sales ledgers and financial profits are strictly confidential to your business account. Stall owners cannot view your net revenue, and data is never sold to third-party advertisers.",
          },
        ],
      },
    ],
  },

  {
    id: "tenant",
    label: "Tenant & Business",
    description:
      "Guides for business operators running POS, finding stalls, and analyzing finances.",
    subTopics: [
      {
        title: "POS & Non-Stall Business Operations",
        items: [
          {
            question:
              "Can I use Lapakita if I don't rent a physical stall from the platform?",
            answer:
              "Yes! Home-based businesses, cloud kitchens, online stores, or businesses renting spaces elsewhere can fully use our POS cashier, product/inventory management, staff access, and supplier marketplace.",
          },
          {
            question: "How do restricted cashier accounts work?",
            answer:
              "You can create staff credentials for your cashiers. Staff members can process customer orders, issue receipts, and log cash/QRIS payments, but they cannot access financial profit reports or cost breakdowns.",
          },
        ],
      },
      {
        title: "Stall Search, Permanence & Target ROI Filter",
        items: [
          {
            question: "How do the Operational Permanence Search Tabs work?",
            answer:
              "You can filter spaces by 3 operational levels: Permanent (standalone shophouses with 24/7 access & sqm physical specs), Semi-Permanent (mall shops, food courts, and traditional market stalls bound by parent complex operating hours), and Temporary (short-term bazaar booths, food truck spots, and street vendor spots).",
          },
          {
            question: "How does the Landmark & Radius search work?",
            answer:
              "You can search by city or street, or pair a specific landmark (such as a university, school, or office complex) with a custom radius distance (e.g., within 3 km) to find nearby available stalls.",
          },
          {
            question: "What is the Budget & Target ROI Match filter?",
            answer:
              "For Permanent & Semi-Permanent stalls, input your total capital, business preset, and target BEP months to filter mathematically viable rents. For Temporary Bazaar spots, input your Target Daily Revenue to surface daily or monthly event rates that match your sales goals.",
          },
          {
            question: "Can I inspect the stall before signing a lease?",
            answer:
              "We highly recommend visiting the location in person to verify physical facilities, street access, and neighborhood conditions before submitting an application or signing the digital contract.",
          },
        ],
      },
      {
        title: "Lease Contracts, Keys & Deposits",
        items: [
          {
            question: "What happens once the owner approves my lease request?",
            answer:
              "A digital contract is created with price-locked terms. Once you make the initial rent payment and security deposit through the Payment Gateway on or before your selected start date, the lease becomes active.",
          },
          {
            question: "Where does my security deposit go?",
            answer:
              "Your deposit is stored safely in a neutral Escrow Payment Gateway account — not in the owner's personal bank account. It is fully refunded to your registered bank account upon lease completion, provided there are no unreturned key fees or physical property damages.",
          },
          {
            question: "How do lease rules work for Temporary Bazaar Events?",
            answer:
              "Temporary spots do not use monthly lease terms. Instead, they define minimum lease days, event operating days (e.g., Everyday vs. Weekends Only), attendance requirements (Mandatory Full vs. Flexible), and clear cancellation policies (Pro-Rata, Deposit Refundable, or Strict Non-Refundable).",
          },
          {
            question: "What if I lose my physical keys during the lease?",
            answer:
              "You are free to duplicate keys independently at local locksmiths. If all keys are lost, the owner replaces the lock cylinder; you pay strictly for the cost of the new key duplicated for your use.",
          },
        ],
      },
      {
        title: "Financial Forecasts & Analytics",
        items: [
          {
            question: "How does the Multi-Timeline Business Forecast work?",
            answer:
              "Our forecast engine projects your margins, cash flow, and break-even targets across 1-week, 1-month, 6-month, and 1-year timelines. It uses your POS sales history or custom financial presets across Conservative, Balanced, and Optimistic market scenarios.",
          },
          {
            question: "What is the Prescriptive Operational Co-Pilot?",
            answer:
              "It provides actionable recommendations based on your actual POS data — such as suggesting opening hour expansions, discount strategies for high-margin items, or automated restock reminders.",
          },
        ],
      },
    ],
  },

  {
    id: "owner",
    label: "Stall Owner",
    description:
      "Information for property owners managing listings, tenants, and escrow deposits.",
    subTopics: [
      {
        title: "Listing Stalls & Tenant Vetting",
        items: [
          {
            question: "How do I list a stall or event spot on Lapakita?",
            answer:
              "From your Owner Dashboard, click 'Add Stall', select the permanence type (Permanent, Semi-Permanent, or Temporary), fill in specific attributes (such as sqm size for Permanent, opening hours for Semi-Permanent, or event schedule & slots for Temporary), upload clear photos, and define rent rates.",
          },
          {
            question: "Can I review applicants before accepting them?",
            answer:
              "Yes. When a tenant applies, you can inspect their profile rating, previous rental reviews, and proposed business category before clicking 'Approve' or 'Reject'.",
          },
          {
            question: "Can I change the rent price during an active lease?",
            answer:
              "No. Once a lease is approved and signed, the rent and deposit terms are locked for the duration of that contract. You may update listing prices for future tenancies once the current lease expires.",
          },
        ],
      },
      {
        title: "Payments, Overdues & Evictions",
        items: [
          {
            question: "How do I receive rent payouts?",
            answer:
              "Rent payments made by tenants via the Payment Gateway are disbursed automatically to your registered bank account after platform fee deduction.",
          },
          {
            question: "What happens if a tenant is late on rent?",
            answer:
              "The system tracks payment due dates. Once a deadline passes, a red Overdue badge appears on your dashboard. You retain full manual discretion to grant a grace period, issue reminders, or terminate the contract.",
          },
          {
            question: "How are non-paying tenants handled?",
            answer:
              "Lapakita does not dispatch physical eviction teams. If a tenant fails to pay after grace periods, you can terminate the contract in-app and approach the stall directly to request move-out and reclaim your property.",
          },
        ],
      },
      {
        title: "Key Control & Property Damage Claims",
        items: [
          {
            question: "Do I need to install smart locks or QR access hardware?",
            answer:
              "No expensive hardware is required. You can hand over physical keys directly to the tenant at the start of the lease.",
          },
          {
            question:
              "Should I replace the door lock between different tenants?",
            answer:
              "We strongly recommend replacing the lock cylinder/knob set between tenancies for security hygiene. Stall Owners accept all security risks regarding potential duplicate keys if they choose to reuse old lock sets.",
          },
          {
            question:
              "How do I claim funds from the security deposit for damages?",
            answer:
              "Upon tenant exit, submit a damage claim via your dashboard with itemized repair costs and timestamped photo evidence. Once verified or agreed upon by the tenant, the claim amount is disbursed from escrow to your bank account.",
          },
        ],
      },
      {
        title: "Property Portfolio Analytics",
        items: [
          {
            question: "What is the Vacancy Loss Tracker?",
            answer:
              "It calculates the exact financial loss accumulating during vacant periods day by day, giving you clear visibility into overall portfolio performance.",
          },
        ],
      },
    ],
  },

  {
    id: "supplier",
    label: "Supplier & B2B",
    description:
      "Details for wholesalers and distributors connecting with SME buyers.",
    subTopics: [
      {
        title: "Marketplace Matchmaking & Catalog Rules",
        items: [
          {
            question: "How do tenant businesses find my products?",
            answer:
              "Lapakita automatically showcases your product catalog directly inside the procurement dashboard of active SME tenants whose business category matches your wholesale goods. No ad spend is required.",
          },
          {
            question:
              "Can I set Minimum Order Quantities (MOQ) and tiered pricing?",
            answer:
              "Yes. You can configure MOQ requirements per product and set volume-based discount tiers (e.g., 1-10 units at normal price, 10+ units at a discounted wholesale rate).",
          },
        ],
      },
      {
        title: "Orders, Reorders & Delivery Disputes",
        items: [
          {
            question: "How does the 1-Click Reorder feature work?",
            answer:
              "Tenants who tag you as their 'Primary Supplier' can trigger instant reorder requests directly from their POS inventory alerts, giving you predictable recurring orders.",
          },
          {
            question:
              "How are delivery disputes or product defect issues handled?",
            answer:
              "Supplier transactions follow a direct peer-to-peer marketplace model. Buyers and suppliers resolve order discrepancies via direct chat. Buyers retain the right to leave public star ratings and product reviews on your catalog.",
          },
          {
            question: "How do I receive payments for fulfilled orders?",
            answer:
              "Payments processed through the checkout gateway are disbursed directly to your registered bank account upon order fulfillment confirmation.",
          },
        ],
      },
      {
        title: "Demand & Supply Analytics",
        items: [
          {
            question: "What are Subscriber Demand Signals?",
            answer:
              "It aggregates privacy-safe demand patterns from your subscriber base (e.g., predicted weekly coffee bean consumption) so you can optimize warehouse inventory before peak demand.",
          },
        ],
      },
    ],
  },
];
