import type { LucideIcon } from "lucide-react";
import { Building2, Clock, Mail, MessageCircle } from "lucide-react";

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

export const PERSONA_OPTIONS: { value: PersonaValue; label: string }[] = [
  { value: "tenant", label: "Tenant" },
  { value: "owner", label: "Stall Owner" },
  { value: "supplier", label: "Supplier" },
  { value: "general", label: "General / Just Browsing" },
];

export interface InquiryOption {
  value: string;
  label: string;
}

/** Inquiry types are scoped per persona — each role only sees questions relevant to them. */
export const INQUIRY_OPTIONS_BY_PERSONA: Record<PersonaValue, InquiryOption[]> =
  {
    tenant: [
      { value: "rental", label: "Rental / Lease Issue" },
      { value: "pos", label: "POS Support" },
      { value: "deposit", label: "Deposit Refund" },
      { value: "billing", label: "Billing & Subscription" },
      { value: "other", label: "Other" },
    ],
    owner: [
      { value: "listing", label: "Stall Listing Help" },
      { value: "tenant-dispute", label: "Tenant Dispute" },
      { value: "deposit-claim", label: "Deposit Claim" },
      { value: "payout", label: "Payout Issue" },
      { value: "billing", label: "Billing & Subscription" },
      { value: "other", label: "Other" },
    ],
    supplier: [
      { value: "catalog", label: "Catalog & Listing Help" },
      { value: "order", label: "Order / Fulfillment Issue" },
      { value: "payment", label: "Payment Issue" },
      { value: "billing", label: "Billing & Subscription" },
      { value: "other", label: "Other" },
    ],
    general: [
      { value: "partnership", label: "Partnership" },
      { value: "press", label: "Press & Media" },
      { value: "feedback", label: "General Feedback" },
      { value: "other", label: "Other" },
    ],
  };
