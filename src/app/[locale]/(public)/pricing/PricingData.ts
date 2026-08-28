import { FaqItem } from "@/components/common/FAQAccordion";
import type { Role } from "@/types";

export interface PricingFeatureRow {
  feature: string;
  free: boolean;
  premium: boolean;
  /** Override the default "Included" label for a non-boolean distinction, e.g. "Basic" vs "Advanced". */
  freeLabel?: string;
  premiumLabel?: string;
}

export const PRICING_FEATURE_TABLES: Record<Role, PricingFeatureRow[]> = {
  tenant: [
    { feature: "POS Cashier & Digital Receipts", free: true, premium: true },
    { feature: "Multi-Business Profiles", free: true, premium: true },
    { feature: "Staff Cashier Accounts", free: true, premium: true },
    { feature: "Landmark & Radius Search", free: true, premium: true },
    { feature: "Budget & Target ROI Matcher", free: true, premium: true },
    {
      feature: "Diagnostic Health Overview",
      free: true,
      premium: true,
      freeLabel: "Basic",
      premiumLabel: "Advanced",
    },
    {
      feature: "Multi-Timeline Business Forecast (3 Scenarios)",
      free: false,
      premium: true,
    },
    {
      feature: "Prescriptive Operational Co-Pilot",
      free: false,
      premium: true,
    },
  ],
  owner: [
    { feature: "Portfolio Occupancy Overview", free: true, premium: true },
    { feature: "Tenant Vetting & Approval Queue", free: true, premium: true },
    { feature: "Price-Locked Lease Contracts", free: true, premium: true },
    {
      feature: "Escrow Security Deposit Protection",
      free: true,
      premium: true,
    },
    {
      feature: "Manual Relisting & Cleaning Control",
      free: true,
      premium: true,
    },
    {
      feature: "Custom Lease Rules & Deposit Settings",
      free: true,
      premium: true,
    },
    { feature: "Red Overdue Payment Alerts", free: true, premium: true },
    { feature: "Daily Vacancy Loss Calculation", free: false, premium: true },
    {
      feature: "Occupancy & Pricing Strategy Recommendations",
      free: false,
      premium: true,
    },
  ],
  supplier: [
    {
      feature: "In-Dashboard SME Catalog Placement",
      free: true,
      premium: true,
    },
    { feature: "Zero Advertising Spend Exposure", free: true, premium: true },
    { feature: "Primary Supplier Designation", free: true, premium: true },
    { feature: "1-Click Restock Reorders", free: true, premium: true },
    {
      feature: "B2B Order Management & Digital Delivery Notes",
      free: true,
      premium: true,
    },
    {
      feature: "MOQ & Tiered Wholesale Pricing Control",
      free: true,
      premium: true,
    },
    {
      feature: "Order Velocity & Top Sales Analytics",
      free: true,
      premium: true,
    },
    {
      feature: "Subscriber Demand Signals (Consolidated Demand)",
      free: false,
      premium: true,
    },
    {
      feature: "Market Opportunity Gaps (Local Demand Signals)",
      free: false,
      premium: true,
    },
  ],
};

export const ROLE_LABELS: Record<Role, string> = {
  tenant: "For Tenants",
  owner: "For Stall Owners",
  supplier: "For B2B Suppliers",
};

export const PRICING_FAQS: FaqItem[] = [
  {
    question: "Will I be automatically charged every month?",
    answer:
      "No. Lapakita uses a prepaid Active Pass model. There are no forced auto-debits or recurring subscription traps. You simply pay for 30 days (or 1 year) of premium access, and when your pass expires, you decide whether to renew, switch plans, or continue on the Free tier.",
  },
  {
    question: "Can I switch my active plan in the middle of a billing period?",
    answer:
      "Your selected plan remains active until its expiration date. Once your current pass completes its duration (e.g., at the end of the 30-day period), you can freely choose a different single-role plan or upgrade to the All-Access Ecosystem Bundle.",
  },
  {
    question: "What happens when my Premium pass expires?",
    answer:
      "Your account simply transitions back to the Free tier. None of your POS records, stall listings, catalog items, or historical contract data will be deleted or locked. You only lose access to advanced analytics tools until you purchase a new pass.",
  },
  {
    question:
      "What is the difference between Single-Role and All-Access passes?",
    answer:
      "The Single-Role Pass (Rp 55,000/month) unlocks advanced features specifically for one persona — either Tenant, Stall Owner, or B2B Supplier. The All-Access Bundle (Rp 125,000/month) unlocks all premium features across all three roles simultaneously under a single account.",
  },
  {
    question: "Are there any hidden transaction fees on the Free plan?",
    answer:
      "No. Basic POS operations, stall browsing, tenant vetting, and catalog placements are completely free. Standard payment processing fees apply strictly to completed digital rent payments or wholesale orders via our secure payment gateway.",
  },
  {
    question: "Can I upgrade from Billed Monthly to Billed Annually?",
    answer:
      "Yes. Once your current monthly pass expires, you can select the Billed Annually option at checkout to enjoy the discounted rate (Rp 495,000/year for Single-Role or Rp 1,125,000/year for All-Access).",
  },
];
