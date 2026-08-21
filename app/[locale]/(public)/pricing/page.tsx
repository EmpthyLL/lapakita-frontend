"use client";

import { RoleFilterProvider } from "@/components/providers/role_provider";
import { Suspense, useState } from "react";
import { BillingCycle, BillingToggle } from "./BillingToggle";
import { PricingBreakdown } from "./PricingBreakdown";
import { PricingCards } from "./PricingCards";
import { PricingFaq } from "./PricingFaq";
import { PricingTrust } from "./PricingTrust";

function PricingHero() {
  const [billingCycle, setBillingCycle] = useState<BillingCycle>("monthly");

  return (
    <>
      <section className="relative overflow-hidden bg-background">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(90deg, var(--border) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />
        <div className="relative mx-auto flex max-w-4xl flex-col items-center px-4 py-20 text-center sm:px-6 sm:py-24 lg:px-8">
          <span className="inline-flex items-center rounded-full bg-primary-secondary px-3 py-1 text-xs font-semibold uppercase tracking-wider text-primary">
            Transparent Pricing
          </span>
          <h1 className="font-heading mt-5 max-w-3xl text-balance text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
            Fair Plans for Every Stage of Your Business
          </h1>
          <p className="mt-5 max-w-2xl text-pretty text-muted-foreground sm:text-lg">
            Start 100% free with core tools. Upgrade only when you need advanced
            financial forecasting and operational intelligence.
          </p>
          <div className="mt-8">
            <BillingToggle
              value={billingCycle}
              onValueChange={setBillingCycle}
            />
          </div>
        </div>
      </section>

      <section className="pb-20 sm:pb-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <PricingCards billingCycle={billingCycle} />
        </div>
      </section>
    </>
  );
}

export default function PricingPage() {
  return (
    <Suspense fallback={null}>
      <RoleFilterProvider paramKey="role">
        <PricingHero />
        <PricingBreakdown />
        <PricingTrust />
        <PricingFaq />
      </RoleFilterProvider>
    </Suspense>
  );
}
