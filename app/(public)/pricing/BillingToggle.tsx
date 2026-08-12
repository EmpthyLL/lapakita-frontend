"use client";

import { cn } from "@/lib/utils";

export type BillingCycle = "monthly" | "annually";

interface BillingToggleProps {
  value: BillingCycle;
  onValueChange: (value: BillingCycle) => void;
}

export function BillingToggle({ value, onValueChange }: BillingToggleProps) {
  return (
    <div className="inline-flex items-center gap-1 rounded-2xl border border-border bg-card p-1.5 shadow-sm">
      <button
        type="button"
        onClick={() => onValueChange("monthly")}
        className={cn(
          "rounded-xl px-4 py-2 text-sm font-medium transition-all",
          value === "monthly"
            ? "bg-primary text-primary-foreground shadow-sm"
            : "text-muted-foreground hover:text-foreground",
        )}
      >
        Monthly
      </button>
      <button
        type="button"
        onClick={() => onValueChange("annually")}
        className={cn(
          "flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all",
          value === "annually"
            ? "bg-primary text-primary-foreground shadow-sm"
            : "text-muted-foreground hover:text-foreground",
        )}
      >
        Billed Annually
        <span
          className={cn(
            "rounded-full px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide",
            value === "annually"
              ? "bg-white/20 text-white"
              : "bg-owner-secondary text-owner",
          )}
        >
          Save 25%
        </span>
      </button>
    </div>
  );
}
