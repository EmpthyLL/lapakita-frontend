"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Check, Sparkles } from "lucide-react";
import Link from "next/link";
import { BillingCycle } from "./BillingToggle";

interface PricingCard {
  id: "free" | "single" | "bundle";
  badge?: string;
  name: string;
  priceMonthly: number;
  priceAnnually: number;
  savingsAnnually?: string;
  description: string;
  features: string[];
  cta: string;
  href: string;
  variant: "outline" | "role" | "featured";
}

const CARDS: PricingCard[] = [
  {
    id: "free",
    name: "Free Forever",
    priceMonthly: 0,
    priceAnnually: 0,
    description: "Core operations & basic features for anyone getting started.",
    features: [
      "Unlimited POS cashier & digital receipts",
      "Multi-business profiles for Tenants",
      "Portfolio & tenant vetting for Owners",
      "Catalog placement & order management for Suppliers",
    ],
    cta: "Start Free Now",
    href: "/register",
    variant: "outline",
  },
  {
    id: "single",
    name: "Single Role",
    priceMonthly: 55_000,
    priceAnnually: 495_000,
    savingsAnnually: "Save Rp 165,000",
    description:
      "Full premium access for just one role — Tenant, Owner, or Supplier.",
    features: [
      "Tenant: Multi-Timeline Forecast & Co-Pilot",
      "Owner: Vacancy Loss Tracker & Pricing Recommendations",
      "Supplier: Demand Signals & Opportunity Gaps",
      "Choose your role at checkout",
    ],
    cta: "Choose Single Role",
    href: "/pricing/checkout?plan=single",
    variant: "role",
  },
  {
    id: "bundle",
    badge: "Most Popular",
    name: "All-Access Bundle",
    priceMonthly: 125_000,
    priceAnnually: 1_125_000,
    savingsAnnually: "Save Rp 375,000",
    description: "Unlocks premium across all three roles under one account.",
    features: [
      "Every Tenant, Owner & Supplier premium feature",
      "Unified billing under one account",
      "Priority customer support",
      "Best value for multi-role entrepreneurs",
    ],
    cta: "Get All-Access Pass",
    href: "/pricing/checkout?plan=bundle",
    variant: "featured",
  },
];

function formatPrice(value: number) {
  if (value === 0) return "Rp 0";
  return `Rp ${value.toLocaleString("id-ID")}`;
}

export function PricingCards({ billingCycle }: { billingCycle: BillingCycle }) {
  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      {CARDS.map((card) => {
        const price =
          billingCycle === "monthly" ? card.priceMonthly : card.priceAnnually;
        const period = billingCycle === "monthly" ? "/ month" : "/ year";
        const isFeatured = card.variant === "featured";

        return (
          <div
            key={card.id}
            className={cn(
              "relative flex flex-col rounded-3xl border p-6 sm:p-8",
              isFeatured
                ? "border-transparent bg-gradient-brand text-white shadow-xl shadow-primary/20"
                : "border-border bg-card shadow-sm",
            )}
          >
            {isFeatured && (
              <div
                className="pointer-events-none absolute inset-0 rounded-3xl opacity-[0.12]"
                style={{
                  backgroundImage:
                    "radial-gradient(circle at 20% 20%, white 1px, transparent 1px), radial-gradient(circle at 80% 70%, white 1px, transparent 1px)",
                  backgroundSize: "40px 40px",
                }}
              />
            )}

            {card.badge && (
              <span className="relative mb-4 inline-flex w-fit items-center gap-1 rounded-full bg-white/20 px-3 py-1 text-xs font-bold uppercase tracking-wide text-white backdrop-blur">
                <Sparkles className="h-3 w-3" />
                {card.badge}
              </span>
            )}

            <h3
              className={cn(
                "relative text-lg font-semibold",
                isFeatured ? "text-white" : "text-foreground",
              )}
            >
              {card.name}
            </h3>

            <div className="relative mt-3 flex items-baseline gap-1.5">
              <span
                className={cn(
                  "text-4xl font-bold tracking-tight",
                  isFeatured ? "text-white" : "text-foreground",
                )}
              >
                {formatPrice(price)}
              </span>
              <span
                className={cn(
                  "text-sm",
                  isFeatured ? "text-white/70" : "text-muted-foreground",
                )}
              >
                {period}
              </span>
            </div>

            {billingCycle === "annually" && card.savingsAnnually && (
              <span
                className={cn(
                  "relative mt-1 text-xs font-medium",
                  isFeatured ? "text-white/80" : "text-owner",
                )}
              >
                {card.savingsAnnually}
              </span>
            )}

            <p
              className={cn(
                "relative mt-4 text-sm",
                isFeatured ? "text-white/85" : "text-muted-foreground",
              )}
            >
              {card.description}
            </p>

            <ul className="relative mt-6 flex-1 space-y-3">
              {card.features.map((feature) => (
                <li key={feature} className="flex items-start gap-2 text-sm">
                  <Check
                    className={cn(
                      "mt-0.5 h-4 w-4 shrink-0",
                      isFeatured ? "text-white" : "text-primary",
                    )}
                  />
                  <span
                    className={
                      isFeatured ? "text-white/90" : "text-foreground/90"
                    }
                  >
                    {feature}
                  </span>
                </li>
              ))}
            </ul>

            <Button
              asChild
              size="lg"
              className={cn(
                "relative mt-8 w-full font-bold transition-colors",
                isFeatured
                  ? "border border-white/40 bg-white/10 text-white backdrop-blur-xs hover:bg-white hover:text-primary"
                  : card.variant === "role"
                    ? "bg-primary text-primary-foreground hover:bg-primary/90"
                    : "border border-border bg-transparent text-foreground hover:bg-secondary",
              )}
              variant={card.variant === "role" ? "default" : "outline"}
            >
              <Link href={card.href}>
                {isFeatured && <Sparkles className="mr-1.5 h-4 w-4" />}
                {card.cta}
              </Link>
            </Button>
          </div>
        );
      })}
    </div>
  );
}
