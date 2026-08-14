"use client";

import type { PaymentCycle } from "@/components/common/search/SearchConstants";
import { Button } from "@/components/ui/button";
import type { MultiPeriodPricing } from "@/lib/data/schema/stall/get_stall_detail";
import { cn, formatCurrency } from "@/lib/utils";
import { CalendarDays, ShieldCheck } from "lucide-react";
import { useState } from "react";

const CYCLE_LABEL: Record<PaymentCycle, string> = {
  month: "Monthly",
  quarter: "Quarterly",
  semester: "Semesterly",
  year: "Yearly",
};

const CYCLE_RATE_KEY: Record<PaymentCycle, keyof MultiPeriodPricing> = {
  month: "monthlyRate",
  quarter: "quarterlyRate",
  semester: "semesterlyRate",
  year: "yearlyRate",
};

export function StallPricingCard({ pricing }: { pricing: MultiPeriodPricing }) {
  const [cycle, setCycle] = useState<PaymentCycle>(
    pricing.allowedPaymentCycles[0],
  );
  const rate = pricing[CYCLE_RATE_KEY[cycle]] as number | undefined;

  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-sm lg:sticky lg:top-24">
      <div className="flex items-baseline gap-1.5">
        <span className="text-2xl font-bold text-primary">
          Rp {rate ? formatCurrency(rate) : "—"}
        </span>
        <span className="text-sm text-muted-foreground">/ {cycle}</span>
      </div>

      <div className="mt-4 flex flex-wrap gap-1.5">
        {pricing.allowedPaymentCycles.map((c) => (
          <button
            key={c}
            type="button"
            onClick={() => setCycle(c)}
            className={cn(
              "rounded-full px-3 py-1 text-xs font-medium transition-colors",
              cycle === c
                ? "bg-primary text-primary-foreground"
                : "border border-border bg-secondary/50 text-muted-foreground hover:border-primary/40 hover:text-foreground",
            )}
          >
            {CYCLE_LABEL[c]}
          </button>
        ))}
      </div>

      <div className="mt-5 space-y-2 border-t border-border pt-4 text-sm">
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-1.5 text-muted-foreground">
            <ShieldCheck className="h-4 w-4" />
            Security Deposit
          </span>
          <span className="font-medium text-foreground">
            Rp {formatCurrency(pricing.securityDeposit)}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-1.5 text-muted-foreground">
            <CalendarDays className="h-4 w-4" />
            Payment Cycle
          </span>
          <span className="font-medium text-foreground">
            {CYCLE_LABEL[cycle]}
          </span>
        </div>
      </div>

      <Button
        size="lg"
        className="mt-5 w-full bg-primary text-primary-foreground hover:bg-primary/90"
      >
        Apply to Lease
      </Button>
      <p className="mt-2 text-center text-xs text-muted-foreground">
        Deposit held safely in escrow — price locked upon approval.
      </p>
    </div>
  );
}
