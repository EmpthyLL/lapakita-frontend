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
import { VariantColor } from "@/types";

interface FaqItem {
  question: string;
  answer: string;
  roleType?: VariantColor;
}

const FAQS: FaqItem[] = [
  {
    question: "What is Lapakita and how does it work?",
    answer:
      "Lapakita is an ecosystem platform for local businesses that connects Tenants (SME operators), Stall Owners, and B2B Suppliers. It provides digital contracts, escrow deposit protection, POS tools, and business intelligence — all accessible from a single account.",
  },
  {
    question: "How do I find and rent a stall as a tenant?",
    answer:
      "Search for available stalls on the Find Stalls page using filters like business type, spatial facilities, monthly budget, and radius. Compare options side-by-side or run financial simulations before submitting a digital lease request to the owner.",
    roleType: "primary",
  },
  {
    question: "Can I use Lapakita POS if I don't rent a stall?",
    answer:
      "Yes! Non-stall businesses are fully welcome. Whether you operate a home-based cloud kitchen, an online store, or rent outside Lapakita, you can use our built-in POS, inventory management, and B2B supplier marketplace freely.",
    roleType: "primary",
  },
  {
    question: "How do I list my stall and screen tenants as an owner?",
    answer:
      "Switch your active role to Stall Owner, publish your stall listing with photos, spatial utilities, and pricing. When tenants apply, you can inspect their profile ratings and business compatibility before approving or rejecting contracts.",
    roleType: "owner",
  },
  {
    question: "How are rent payments and security deposits handled?",
    answer:
      "Monthly rent is paid directly via secure online payment gateway. Security deposits are held safely in a neutral escrow account (not in the owner's personal account) to protect both parties against damages or unreturned key replacement costs.",
    roleType: "owner",
  },
  {
    question: "How does the B2B Supplier Marketplace work?",
    answer:
      "Suppliers showcase their wholesale catalogs directly inside the procurement dashboard of relevant SME tenants. When a tenant's POS inventory runs low, they can reorder raw materials from their primary suppliers in a single click.",
    roleType: "supplier",
  },
  {
    question: "Is Lapakita free to use?",
    answer:
      "Creating an account, browsing stalls, using basic POS, and diagnostic analytics are 100% free. Optional Premium Subscriptions (Rp 250,000/month) unlock prescriptive business intelligence co-pilots, vacancy cost modeling, and market demand insights.",
  },
  {
    question: "Can I switch between roles with a single account?",
    answer:
      "Yes. A single verified account lets you switch seamlessly between Tenant, Stall Owner, and Supplier roles via the account menu without logging out or creating separate logins.",
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
