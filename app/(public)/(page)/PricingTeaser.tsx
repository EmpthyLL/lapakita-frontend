import { Button } from "@/components/ui/button";
import { ArrowRight, Check, Sparkles } from "lucide-react";
import Link from "next/link";

export interface PricingTeaserTier {
  name: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  featured: boolean;
  ctaText: string;
  buttonVariant: "default" | "outline" | "custom-featured";
}

const TIERS: PricingTeaserTier[] = [
  {
    name: "Free Forever",
    price: "Rp 0",
    period: "/ month",
    description:
      "Core operations & basic management tools with zero monthly cost.",
    features: [
      "Built-in POS Cashier & Digital Receipts",
      "Landmark, Radius & Target ROI Search",
      "Price-Locked Digital Lease Contracts",
      "Basic Diagnostic Health Overview",
      "Direct B2B Supplier Marketplace Access",
    ],
    featured: false,
    ctaText: "Start Free Now",
    buttonVariant: "outline",
  },
  {
    name: "Single Role",
    price: "Rp 55K",
    period: "/ month",
    description: "Full premium analytics pass for one role of your choice.",
    features: [
      "Everything in Free Forever tier",
      "Tenant: Multi-Timeline Business Forecast (3 Scenarios)",
      "Tenant: Prescriptive Operational Co-Pilot",
      "Owner: Daily Vacancy Loss Tracker & Pricing Strategy",
      "Supplier: Subscriber Demand Signals & Opportunity Gaps",
    ],
    featured: false,
    ctaText: "Choose Single Role",
    buttonVariant: "default", // Default Button (Primary Solid)
  },
  {
    name: "All-Access Bundle",
    price: "Rp 125K",
    period: "/ month",
    description:
      "Unlocks every premium feature across all 3 roles simultaneously.",
    features: [
      "Everything in Single Role plan",
      "Tenant + Owner + Supplier Premium Passes Included",
      "Unified Dashboard Role Switcher",
      "Priority Customer Support Access",
      "Prepaid Active Pass (No Auto-Debit Traps)",
    ],
    featured: true,
    ctaText: "Get All-Access Pass",
    buttonVariant: "custom-featured", // Custom Outline di atas Gradient Card
  },
];

export function PricingTeaser() {
  return (
    <section className="py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-sm font-semibold uppercase tracking-wider text-primary">
            Simple & Fair Pricing
          </span>
          <h2 className="font-heading mt-3 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Start Free. Upgrade Only When You Need To.
          </h2>
          <p className="mt-4 text-muted-foreground">
            Prepaid Active Pass model — no forced auto-debit, no hidden fees.
            Renew, switch, or let it expire on your own terms.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
          {TIERS.map((tier) => (
            <div
              key={tier.name}
              className={
                tier.featured
                  ? "relative flex flex-col justify-between overflow-hidden rounded-3xl bg-gradient-brand p-8 text-white shadow-xl shadow-primary/20 ring-2 ring-primary"
                  : "flex flex-col justify-between rounded-3xl border border-border bg-card p-8 shadow-xs"
              }
            >
              <div>
                {tier.featured && (
                  <span className="mb-4 inline-flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1 text-xs font-bold uppercase tracking-wider text-white backdrop-blur-md">
                    <Sparkles className="h-3.5 w-3.5" />
                    Most Popular & Best Value
                  </span>
                )}

                <h3
                  className={
                    tier.featured
                      ? "text-xl font-bold text-white"
                      : "text-xl font-bold text-foreground"
                  }
                >
                  {tier.name}
                </h3>

                <div className="mt-3 flex items-baseline gap-1">
                  <span
                    className={
                      tier.featured
                        ? "text-4xl font-extrabold text-white"
                        : "text-4xl font-extrabold text-foreground"
                    }
                  >
                    {tier.price}
                  </span>
                  <span
                    className={
                      tier.featured
                        ? "text-sm text-white/80"
                        : "text-sm text-muted-foreground"
                    }
                  >
                    {tier.period}
                  </span>
                </div>

                <p
                  className={
                    tier.featured
                      ? "mt-3 text-sm text-white/85"
                      : "mt-3 text-sm text-muted-foreground"
                  }
                >
                  {tier.description}
                </p>

                <div
                  className={
                    tier.featured
                      ? "my-6 border-t border-white/20"
                      : "my-6 border-t border-border"
                  }
                />

                <ul className="space-y-3 text-sm">
                  {tier.features.map((feat) => (
                    <li key={feat} className="flex items-start gap-2.5">
                      <Check
                        className={
                          tier.featured
                            ? "mt-0.5 h-4 w-4 shrink-0 text-white"
                            : "mt-0.5 h-4 w-4 shrink-0 text-primary"
                        }
                      />
                      <span
                        className={
                          tier.featured ? "text-white/90" : "text-foreground"
                        }
                      >
                        {feat}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-8 pt-4">
                {tier.buttonVariant === "custom-featured" ? (
                  <Button
                    asChild
                    variant="outline"
                    className="w-full border-white/40 bg-white/10 text-white hover:bg-white hover:text-primary font-bold transition-colors backdrop-blur-sm"
                  >
                    <Link href="/pricing">{tier.ctaText}</Link>
                  </Button>
                ) : (
                  <Button
                    asChild
                    variant={tier.buttonVariant}
                    className="w-full font-semibold"
                  >
                    <Link href="/pricing">{tier.ctaText}</Link>
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Button asChild variant="outline" size="lg">
            <Link href="/pricing" className="gap-2">
              Compare Full Feature Matrix & FAQs
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
