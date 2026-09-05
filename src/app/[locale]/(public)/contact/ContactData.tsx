import type { LucideIcon } from "lucide-react";
import {
  Briefcase,
  Building2,
  Clock,
  HelpCircle,
  Mail,
  MessageCircle,
} from "lucide-react";

export interface ContactInfoItem {
  icon: LucideIcon;
  label: string;
  value: string;
  href?: string;
}

export const CONTACT_INFO: ContactInfoItem[] = [
  { icon: Building2, label: "Head Office", value: "Jakarta, Indonesia" },
  {
    icon: Mail,
    label: "Direct Email",
    value: "support@lapakita.com",
    href: "mailto:support@lapakita.com",
  },
  {
    icon: MessageCircle,
    label: "WhatsApp Support",
    value: "+62 812-3456-7890",
    href: "https://wa.me/6281234567890",
  },
  {
    icon: Clock,
    label: "Operating Hours",
    value: "Mon – Fri, 09:00 – 18:00 WIB",
  },
];

export type PersonaValue = "tenant" | "owner" | "supplier" | "general";

export const PERSONA_OPTIONS: {
  value: PersonaValue;
  label: string;
  description: string;
  icon: LucideIcon;
}[] = [
  {
    value: "tenant",
    label: "Tenant / Business",
    description: "Stall leasing, POS systems, cashier, & transactions",
    icon: HelpCircle,
  },
  {
    value: "owner",
    label: "Stall Owner",
    description: "Property listings, tenant vetting, & deposits",
    icon: Building2,
  },
  {
    value: "supplier",
    label: "Supplier / B2B",
    description: "Wholesale catalog, stock, orders, & payments",
    icon: Briefcase,
  },
  {
    value: "general",
    label: "General / Media",
    description: "General inquiries, press coverage, & feedback",
    icon: Mail,
  },
];

export interface InquiryOption {
  value: string;
  label: string;
  description?: string;
}

export const INQUIRY_OPTIONS_BY_PERSONA: Record<PersonaValue, InquiryOption[]> =
  {
    tenant: [
      { value: "rental_inquiry", label: "Stall Search & Rental Application" },
      { value: "bazaar_event", label: "Bazaar / Pop-up Event Registration" },
      {
        value: "lease_contract",
        label: "Lease Contract & Start Date Issues",
      },
      {
        value: "pos_cashier",
        label: "POS Machine & Staff Cashier Account Support",
      },
      { value: "deposit_refund", label: "Escrow Deposit Refund" },
      { value: "billing_subscription", label: "Pro Subscription Billing" },
      { value: "supplier_order", label: "Supplier Raw Material Order Issues" },
      { value: "other_tenant", label: "Other (Tenant Issues)" },
    ],
    owner: [
      {
        value: "stall_listing",
        label: "Stall Listing & Verification Help",
      },
      {
        value: "bazaar_creation",
        label: "Bazaar / Festival Event Slot Creation",
      },
      {
        value: "tenant_vetting",
        label: "Tenant Approval / Rejection",
      },
      {
        value: "deposit_claim",
        label: "Property Damage / Lost Key Claims",
      },
      {
        value: "payout_disbursement",
        label: "Bank Rent Payout Issues",
      },
      { value: "billing_subscription", label: "Pro Subscription Billing" },
      { value: "other_owner", label: "Other (Owner Issues)" },
    ],
    supplier: [
      {
        value: "catalog_approval",
        label: "B2B Product Catalog Upload & Verification",
      },
      { value: "moq_pricing", label: "MOQ Setup & Wholesale Pricing Tiers" },
      {
        value: "order_fulfillment",
        label: "Order & Digital Delivery Slip Issues",
      },
      {
        value: "payout_disbursement",
        label: "Sales Payout Disbursement Issues",
      },
      { value: "buyer_dispute", label: "Order Disputes / Product Complaints" },
      { value: "billing_subscription", label: "Pro Subscription Billing" },
      { value: "other_supplier", label: "Other (Supplier Issues)" },
    ],
    general: [
      { value: "press_media", label: "Press, News, & Media Coverage" },
      { value: "career_job", label: "Careers & Recruitment Information" },
      {
        value: "feedback_suggestion",
        label: "Platform Feedback & Suggestions",
      },
      { value: "other_general", label: "Other (General Inquiries)" },
    ],
  };

export const PARTNERSHIP_OPTIONS: InquiryOption[] = [
  {
    value: "property_developer",
    label: "Property Manager / Developer",
    description:
      "Collective management integration for shophouses, modern markets, or food courts",
  },
  {
    value: "event_organizer",
    label: "Event Organizer (EO)",
    description:
      "Culinary festival execution, pop-up bazaars, & booth management",
  },
  {
    value: "b2b_distributor",
    label: "Main Distributor / FMCG Producer",
    description:
      "Large-scale raw material supply chain partnerships for MSME networks",
  },
  {
    value: "financial_bank",
    label: "Banking / Payment Gateway",
    description:
      "Escrow settlement, merchant acquiring, QRIS, & payout processing solutions",
  },
  {
    value: "sme_community",
    label: "MSME Community & Institution",
    description: "Digitalization training, workshops, & mentoring programs",
  },
  {
    value: "other_partner",
    label: "Other Forms of Partnership",
    description:
      "Branding collaboration, sponsorships, or customized strategic proposals",
  },
];
