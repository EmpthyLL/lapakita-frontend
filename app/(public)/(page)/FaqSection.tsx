"use client";

import { FAQAccordion, FaqItem } from "@/components/common/FAQAccordion";
import { Button } from "@/components/ui/button";
import { HelpCircle, MessageCircleQuestion } from "lucide-react";
import Link from "next/link";

const FAQS: FaqItem[] = [
  {
    question: "What is Lapakita and how does it work?",
    answer:
      "Lapakita is a digital operating platform for SMEs. It connects tenants looking for spaces, stall owners managing rentals, and B2B suppliers fulfilling raw material needs — providing tailored dashboards for every role in one unified system.",
  },
  {
    question: "How do I search and rent a stall as a tenant?",
    answer:
      "Use our discovery filters to search by city, landmark (campuses, schools, office districts), radius, and physical facilities. You can also filter by your available capital, business category, and target break-even period to surface stalls with matching rent economics.",
    roleType: "primary",
  },
  {
    question: "Can I use Lapakita's POS without renting a physical stall?",
    answer:
      "Yes, absolutely! Businesses operating from home, online stores, cloud kitchens, or third-party rentals are completely welcome to use our built-in POS, inventory tracking, staff cashier access, and supplier marketplace.",
    roleType: "primary",
  },
  {
    question: "How do I list my stall as a property owner?",
    answer:
      "Register an account, open the Owner Dashboard, and publish your stall listing with photos, rent prices, and available facilities. You can review tenant applications and profile ratings before approving any lease contract.",
    roleType: "owner",
  },
  {
    question: "How are rent payments and security deposits managed?",
    answer:
      "Rent collection is tracked automatically with clear visual due-date alerts. Security deposits are held safely in a neutral Escrow Payment Gateway account and are strictly reserved for verified physical property damage or lost key reproductions upon exit.",
    roleType: "owner",
  },
  {
    question: "How to become a supplier on Lapakita?",
    answer:
      "Sign up or switch your role to Supplier from your profile menu, complete a quick verification, and upload your B2B product catalog with MOQ rules and tiered pricing. Your items will automatically appear in the procurement dashboards of relevant tenant businesses.",
    roleType: "supplier",
  },
  {
    question: "How does the B2B Supplier marketplace work?",
    answer:
      "Suppliers showcase their wholesale catalogs directly inside the procurement dashboards of matching tenant businesses without paying for ads. Tenants can designate primary suppliers for seamless 1-click inventory reordering.",
    roleType: "supplier",
  },
  {
    question: "What are the pricing options for Premium features?",
    answer:
      "Browsing stalls, basic POS, and core diagnostic health analytics are free. For advanced features (like 3-Scenario Forecasts, Co-Pilot Insights, or Vacancy Trackers), you can pick a Single-Role Plan at Rp 55,000/month (Rp 495,000/year) or an All-Access Ecosystem Bundle at Rp 125,000/month (Rp 1,125,000/year).",
  },
  {
    question: "Can I switch between roles with a single account?",
    answer:
      "Yes! A single Lapakita account allows you to operate as a Tenant, Stall Owner, and Supplier simultaneously. Simply use the Role Switcher menu in your profile to jump between dashboards without logging out.",
  },
];

export function FaqSection() {
  return (
    <section id="faq" className="py-20 sm:py-28">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-secondary">
            <HelpCircle className="h-6 w-6 text-primary" />
          </div>
          <span className="text-sm font-semibold uppercase tracking-wider text-primary">
            FAQ
          </span>
          <h2 className="font-heading mt-3 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Frequently Asked Questions
          </h2>
          <p className="mt-4 text-muted-foreground">
            Everything you need to know about renting, listing, and supplying on
            Lapakita.
          </p>
        </div>

        <FAQAccordion items={FAQS} />

        <div className="mt-12 flex flex-col items-center gap-4 rounded-2xl border border-border bg-secondary/40 p-6 text-center sm:flex-row sm:justify-between sm:text-left">
          <div className="flex items-center gap-3">
            <MessageCircleQuestion className="h-8 w-8 shrink-0 text-primary" />
            <div>
              <p className="text-sm font-semibold text-foreground">
                Still have questions?
              </p>
              <p className="text-sm text-muted-foreground">
                Our team is happy to help you get started.
              </p>
            </div>
          </div>
          <Button
            asChild
            className="bg-primary text-primary-foreground hover:bg-primary/90"
          >
            <Link href="/contact">Contact Us</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
