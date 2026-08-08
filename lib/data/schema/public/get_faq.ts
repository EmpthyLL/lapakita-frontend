import { RoleAndAll } from "@/types";

export interface ComprehensiveFaqItem {
  id: string;
  question: string;
  answer: string;
}

export interface FaqSubTopic {
  title: string;
  items: ComprehensiveFaqItem[];
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
      "Learn about Lapakita's ecosystem, unified accounts, and security basics.",
    subTopics: [
      {
        title: "Platform Fundamentals",
        items: [
          {
            id: "gen-1",
            question: "What is Lapakita?",
            answer:
              "Lapakita is an all-in-one digital operating platform designed specifically for micro, small, and medium enterprises (SMEs/UMKM). It unifies physical stall rentals, Point of Sale (POS) operations, business analytics, and a B2B supplier marketplace into a single ecosystem.",
          },
          {
            id: "gen-2",
            question: "How does the single account multi-role system work?",
            answer:
              "You only need one email and phone number to register. From your profile menu, you can toggle between Tenant, Stall Owner, and Supplier modes. Each role has its own isolated dashboard, settings, and workflows, eliminating the need for multiple accounts.",
          },
          {
            id: "gen-3",
            question: "Is there a mobile app or is it web-based?",
            answer:
              "Lapakita is built as a responsive web platform that runs seamlessly on mobile browsers, tablets, and desktop computers. You can easily process POS transactions on a phone or manage property portfolios on a desktop.",
          },
        ],
      },
      {
        title: "Pricing & Subscriptions",
        items: [
          {
            id: "gen-4",
            question: "Is Lapakita free to use?",
            answer:
              "Yes! Basic stall discovery, lease applications, basic POS cashier operations, and diagnostic business health overviews are completely free for all users.",
          },
          {
            id: "gen-5",
            question: "What is included in the Premium Subscription?",
            answer:
              "For Rp 125,000/month or Rp 1,125,000/year (billed annually), Premium unlocks our 3-Scenario Financial Forecast, Prescriptive Operational Co-Pilot, Vacancy Loss Tracker, and B2B Subscriber Demand Signals across all your active roles.",
          },
          {
            id: "gen-6",
            question: "How does Lapakita earn revenue if the base app is free?",
            answer:
              "We maintain a fair business model. Our revenue comes from optional Premium Subscriptions, a small percentage transaction fee on active stall rent collection, and lightweight administrative processing fees on supplier orders.",
          },
        ],
      },
      {
        title: "Identity & Security",
        items: [
          {
            id: "gen-7",
            question:
              "Do I need to upload an ID card (KTP) during registration?",
            answer:
              "No. Registration requires only your name, email, phone number, and password. Verification (KYC) is requested gradually — only when you are ready to sign a binding lease contract, list a stall, or register as a supplier.",
          },
          {
            id: "gen-8",
            question: "Is my business data safe with Lapakita?",
            answer:
              "We enforce strict data privacy. Your POS sales ledgers and financial profits are confidential to your business account. Stall owners cannot view your net revenue, and data is never sold to third-party advertisers.",
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
        title: "Non-Stall & POS Operations",
        items: [
          {
            id: "ten-1",
            question:
              "Can I use Lapakita if I don't rent a physical stall from the platform?",
            answer:
              "Yes! Home-based businesses, cloud kitchens, online stores, or businesses renting spaces elsewhere can fully use our POS cashier, product/inventory management, staff access, and supplier marketplace.",
          },
          {
            id: "ten-2",
            question: "How do restricted cashier accounts work?",
            answer:
              "You can create staff credentials for your cashiers. Staff members can process customer orders, issue receipts, and log cash/QRIS payments, but they cannot access financial profit reports or cost breakdowns.",
          },
        ],
      },
      {
        title: "Stall Discovery & Budget Matching",
        items: [
          {
            id: "ten-3",
            question: "How does the Landmark & Radius search work?",
            answer:
              "You can search by city or street, or pair a specific landmark (such as a university, school, or office complex) with a custom radius distance (e.g., within 3 km) to find nearby available stalls.",
          },
          {
            id: "ten-4",
            question: "What is the Budget & ROI Match filter?",
            answer:
              "Instead of guessing, you can input your total capital, business category, and target break-even period (e.g., 6 months). Our search engine filters and highlights stalls with monthly rent prices that mathematically align with your budget goals.",
          },
          {
            id: "ten-5",
            question: "Can I inspect the stall before signing a lease?",
            answer:
              "We highly recommend visiting the location in person to verify physical facilities, street access, and neighborhood conditions before submitting an application or signing the digital contract.",
          },
        ],
      },
      {
        title: "Contracts & Security Deposits",
        items: [
          {
            id: "ten-6",
            question: "What happens once the owner approves my lease request?",
            answer:
              "A digital contract is created with price-locked terms. Once you make the first month's rent payment and security deposit through the Payment Gateway, the lease becomes active.",
          },
          {
            id: "ten-7",
            question: "Where does my security deposit go?",
            answer:
              "Your deposit is stored safely in a neutral Escrow Payment Gateway account — not in the owner's personal bank account. It is fully refunded to your registered bank account upon lease completion, provided there are no unreturned key fees or physical property damages.",
          },
          {
            id: "ten-8",
            question: "What if I lose my physical keys during the lease?",
            answer:
              "You are free to duplicate keys independently at local locksmiths at your own expense. If all keys are lost, you can submit an in-app key replacement request to the owner; the key reproduction fee will be deducted from your deposit.",
          },
        ],
      },
      {
        title: "Financial Forecasting & Analytics",
        items: [
          {
            id: "ten-9",
            question: "How does the Multi-Timeline Business Forecast work?",
            answer:
              "Our forecast engine projects your margins, cash flow, and break-even targets across 1-week, 1-month, 6-month, and 1-year timelines. It uses your POS sales history or custom financial presets across Conservative, Balanced, and Optimistic market scenarios.",
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
        title: "Listings & Tenant Screening",
        items: [
          {
            id: "own-1",
            question: "How do I list a stall on Lapakita?",
            answer:
              "From your Owner Dashboard, click 'Add Stall', upload clear photos of the space, select available facilities (electrical kVA, water, seating), set landmark locations, and define monthly rent and deposit amounts.",
          },
          {
            id: "own-2",
            question: "Can I review applicants before accepting them?",
            answer:
              "Yes. When a tenant applies, you can inspect their profile rating, previous rental reviews, and proposed business category before clicking 'Approve' or 'Reject'.",
          },
          {
            id: "own-3",
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
            id: "own-4",
            question: "How do I receive monthly rent payouts?",
            answer:
              "Rent payments made by tenants via the Payment Gateway are disbursed automatically to your registered Indonesian bank account after platform fee deduction.",
          },
          {
            id: "own-5",
            question: "What happens if a tenant is late on rent?",
            answer:
              "The system tracks payment due dates. Once a deadline passes, a red Overdue badge appears on your dashboard. You retain full manual discretion to grant a grace period, issue reminders, or terminate the contract.",
          },
          {
            id: "own-6",
            question: "How are non-paying or stubborn tenants handled?",
            answer:
              "Lapakita does not dispatch physical eviction teams. If a tenant fails to pay after grace periods, you can terminate the contract in-app and approach the stall directly to request move-out and reclaim your property.",
          },
        ],
      },
      {
        title: "Key Management & Property Damage Claims",
        items: [
          {
            id: "own-7",
            question: "Do I need to install smart locks or QR access hardware?",
            answer:
              "No expensive hardware is required. You can hand over physical keys directly to the tenant at the start of the lease.",
          },
          {
            id: "own-8",
            question:
              "Should I replace the door lock between different tenants?",
            answer:
              "We strongly recommend replacing the lock cylinder/knob set between tenancies for security hygiene. If you choose to reuse old lock sets, you accept inherent security risks regarding potential duplicate keys.",
          },
          {
            id: "own-9",
            question:
              "How do I claim funds from the security deposit for damages?",
            answer:
              "Upon tenant exit, submit a damage claim via your dashboard with itemized repair costs and timestamped photo evidence. Once verified or agreed upon by the tenant, the claim amount is disbursed from escrow to your bank account.",
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
        title: "Marketplace Matchmaking & Catalog",
        items: [
          {
            id: "sup-1",
            question: "How do tenant businesses find my products?",
            answer:
              "Lapakita automatically showcases your product catalog directly inside the procurement dashboard of active SME tenants whose business category matches your wholesale goods. No ad spend is required.",
          },
          {
            id: "sup-2",
            question:
              "Can I set Minimum Order Quantities (MOQ) and tiered pricing?",
            answer:
              "Yes. You can configure MOQ requirements per product and set volume-based discount tiers (e.g., 1-10 units at normal price, 10+ units at a discounted wholesale rate).",
          },
        ],
      },
      {
        title: "Orders, Reorders & Disputes",
        items: [
          {
            id: "sup-3",
            question: "How does the 1-Click Reorder feature work?",
            answer:
              "Tenants who tag you as their 'Primary Supplier' can trigger instant reorder requests directly from their POS inventory alerts, giving you predictable recurring orders.",
          },
          {
            id: "sup-4",
            question:
              "How are delivery disputes or product defect issues handled?",
            answer:
              "Supplier transactions follow a direct peer-to-peer marketplace model. Buyers and suppliers resolve order discrepancies via direct chat. Buyers retain the right to leave public star ratings and product reviews on your catalog.",
          },
          {
            id: "sup-5",
            question: "How do I receive payments for fulfilled orders?",
            answer:
              "Payments processed through the checkout gateway are disbursed directly to your registered bank account upon order fulfillment confirmation.",
          },
        ],
      },
    ],
  },
];
