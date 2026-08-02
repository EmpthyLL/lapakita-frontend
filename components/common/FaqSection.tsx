"use client";

import { HelpCircle, MessageCircleQuestion } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface FaqItem {
  question: string;
  answer: string;
  roleType?: "primary" | "owner" | "supplier";
}

const FAQS: FaqItem[] = [
  {
    question: "What is Lapakita and how does it work?",
    answer:
      "Lapakita is a platform that connects three roles in the stall economy: tenants looking for space, stall owners renting them out, and suppliers fulfilling inventory needs. Each role gets its own dashboard, tools, and data — all in one ecosystem.",
  },
  {
    question: "How do I find and rent a stall as a tenant?",
    answer:
      "Use the search filter on the homepage to narrow down by location, radius, and business category. Every listing shows footfall data and a turnover forecast so you can compare options before contacting the owner or submitting a rental request.",
    roleType: "primary",
  },
  {
    question: "Does Lapakita include a point-of-sale (POS) system?",
    answer:
      "Yes. Once you rent a stall through Lapakita, a built-in POS is activated automatically — no separate app or setup needed. You get daily sales reports right inside your tenant dashboard.",
    roleType: "primary",
  },
  {
    question: "How do I list my stall as an owner?",
    answer:
      "Sign up and switch your role to Stall Owner from the account menu, then publish your listing with photos, pricing, and location. You'll be able to screen tenant applications and track occupancy from the Owner Dashboard.",
    roleType: "owner",
  },
  {
    question: "Is rent collection handled automatically?",
    answer:
      "Yes, once a tenant is confirmed, monthly rent collection is automated through the platform, and you'll get occupancy performance reports to help with pricing decisions each period.",
    roleType: "owner",
  },
  {
    question: "How does the supplier side of Lapakita work?",
    answer:
      "Suppliers can register to receive direct orders from tenants who are actively stocking up. Demand forecasting tools help you anticipate restocking needs across the stalls connected to your account.",
    roleType: "supplier",
  },
  {
    question: "Is there a fee to use Lapakita?",
    answer:
      "Creating an account and browsing stalls is free for tenants. Owners and suppliers may have service fees depending on the plan — check the Pricing page for current details.",
  },
  {
    question: "Can I switch between roles with one account?",
    answer:
      "Yes. A single account can hold multiple roles. Use the Switch Role option in your profile menu to move between Tenant, Stall Owner, and Supplier dashboards without logging out.",
  },
];

function RoleDot({ roleType }: { roleType?: FaqItem["roleType"] }) {
  if (!roleType) return null;
  return (
    <span
      className="h-1.5 w-1.5 shrink-0 rounded-full"
      style={{ backgroundColor: `var(--${roleType})` }}
    />
  );
}

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

        <Accordion className="mt-12 w-full">
          {FAQS.map((faq, index) => (
            <AccordionItem
              key={faq.question}
              value={`item-${index}`}
              className="border-border"
            >
              <AccordionTrigger className="text-left text-sm font-semibold text-foreground hover:no-underline sm:text-base">
                <span className="flex items-center gap-2.5">
                  <RoleDot roleType={faq.roleType} />
                  {faq.question}
                </span>
              </AccordionTrigger>
              <AccordionContent className="text-sm text-muted-foreground">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

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
