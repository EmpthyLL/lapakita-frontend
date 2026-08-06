"use client";

import { ChevronDown, ChevronUp } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";
import {
  BEP_PRESETS_MONTHS,
  RENT_RANGE,
  DEPOSIT_RANGE,
  formatIDR,
} from "./SearchConstants";

interface StallSearchAdvancedFiltersProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  bepMonths: number;
  onBepMonthsChange: (value: number) => void;
  capital: string;
  onCapitalChange: (value: string) => void;
  rentRange: [number, number];
  onRentRangeChange: (value: [number, number]) => void;
  depositRange: [number, number];
  onDepositRangeChange: (value: [number, number]) => void;
}

export function StallSearchAdvancedFilters({
  open,
  onOpenChange,
  bepMonths,
  onBepMonthsChange,
  capital,
  onCapitalChange,
  rentRange,
  onRentRangeChange,
  depositRange,
  onDepositRangeChange,
}: StallSearchAdvancedFiltersProps) {
  return (
    <div className="mt-6 border-t border-border pt-4">
      <button
        type="button"
        onClick={() => onOpenChange(!open)}
        className="flex w-full items-center justify-between text-sm font-semibold text-foreground"
      >
        Budget & Financial Filters
        {open ? (
          <ChevronUp className="h-4 w-4" />
        ) : (
          <ChevronDown className="h-4 w-4" />
        )}
      </button>

      {open && (
        <div className="mt-5 grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Target Break-Even Period
            </p>
            <div className="flex flex-wrap gap-1.5">
              {BEP_PRESETS_MONTHS.map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => onBepMonthsChange(m)}
                  className={cn(
                    "rounded-full px-3 py-1 text-xs font-medium transition-colors",
                    bepMonths === m
                      ? "bg-primary text-primary-foreground"
                      : "border border-border bg-secondary/50 text-muted-foreground hover:border-primary/40 hover:text-foreground",
                  )}
                >
                  {m} months
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Available Capital
            </p>
            <Input
              value={capital}
              onChange={(e) => onCapitalChange(e.target.value)}
              placeholder="e.g. Rp 15.000.000"
              className="h-10"
            />
          </div>

          <div>
            <div className="mb-2 flex items-center justify-between">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Monthly Rent
              </p>
              <span className="text-xs text-muted-foreground">
                {formatIDR(rentRange[0])} – {formatIDR(rentRange[1])}
              </span>
            </div>
            <Slider
              min={RENT_RANGE.min}
              max={RENT_RANGE.max}
              step={RENT_RANGE.step}
              value={rentRange}
              onValueChange={(v) => onRentRangeChange(v as [number, number])}
            />
          </div>

          <div>
            <div className="mb-2 flex items-center justify-between">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Security Deposit
              </p>
              <span className="text-xs text-muted-foreground">
                {formatIDR(depositRange[0])} – {formatIDR(depositRange[1])}
              </span>
            </div>
            <Slider
              min={DEPOSIT_RANGE.min}
              max={DEPOSIT_RANGE.max}
              step={DEPOSIT_RANGE.step}
              value={depositRange}
              onValueChange={(v) => onDepositRangeChange(v as [number, number])}
            />
          </div>
        </div>
      )}
    </div>
  );
}
