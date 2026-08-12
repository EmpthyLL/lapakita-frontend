"use client";

import { Slider } from "@/components/ui/slider";
import { Sparkles, Target } from "lucide-react";
import { Autocomplete } from "../input/Autocomplete";
import { NumberInput } from "../input/NumberInput";
import {
  BEP_PRESETS_MONTHS,
  DEPOSIT_RANGE,
  formatIDR,
  RENT_RANGE,
} from "./SearchConstants";

const BEP_OPTIONS = [
  ...BEP_PRESETS_MONTHS.map((m) => ({
    value: String(m),
    label: `${m} months`,
  })),
  { value: "custom", label: "Custom" },
];

interface StallSearchBudgetFiltersProps {
  /** null when no business type is selected — shows "General assumption" instead */
  businessTypeLabel: string | null;
  bepMonths: string;
  onBepMonthsChange: (value: string) => void;
  customBepMonths: number | null;
  onCustomBepMonthsChange: (value: number | null) => void;
  capital: number;
  onCapitalChange: (value: number) => void;
  rentRange: [number, number];
  onRentRangeChange: (value: [number, number]) => void;
  depositRange: [number, number];
  onDepositRangeChange: (value: [number, number]) => void;
}

function MinMaxInput({
  label,
  min,
  max,
  value,
  onChange,
}: {
  label: string;
  min: number;
  max: number;
  value: [number, number];
  onChange: (value: [number, number]) => void;
}) {
  function handleMinChange(next: number | undefined) {
    const parsed = Math.max(min, next ?? min);
    onChange([Math.min(parsed, value[1]), value[1]]);
  }

  function handleMaxChange(next: number | undefined) {
    const parsed = Math.min(max, next ?? max);
    onChange([value[0], Math.max(parsed, value[0])]);
  }

  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <p className="text-xs font-semibold text-muted-foreground">{label}</p>
        <span className="text-[11px] text-muted-foreground">
          {formatIDR(value[0])} – {formatIDR(value[1])}
        </span>
      </div>
      <Slider
        min={min}
        max={max}
        step={RENT_RANGE.step}
        value={value}
        onValueChange={(v) => onChange(v as [number, number])}
        className="mb-3"
      />
      <div className="flex items-center gap-2">
        <NumberInput
          prefix="Rp "
          decimalScale={0}
          placeholder="Min"
          value={value[0]}
          onValueChange={(v) => handleMinChange(v.floatValue)}
          className="h-9 py-2 text-sm"
        />
        <span className="text-muted-foreground">–</span>
        <NumberInput
          prefix="Rp "
          decimalScale={0}
          placeholder="Max"
          value={value[1]}
          onValueChange={(v) => handleMaxChange(v.floatValue)}
          className="h-9 py-2 text-sm"
        />
      </div>
    </div>
  );
}

export function StallSearchBudgetFilters({
  businessTypeLabel,
  bepMonths,
  onBepMonthsChange,
  customBepMonths,
  onCustomBepMonthsChange,
  capital,
  onCapitalChange,
  rentRange,
  onRentRangeChange,
  depositRange,
  onDepositRangeChange,
}: StallSearchBudgetFiltersProps) {
  return (
    <div className="space-y-5">
      {/* Context banner — tells the user where these numbers come from */}
      <div
        className={
          businessTypeLabel
            ? "flex items-start gap-2 rounded-lg bg-primary/10 px-3 py-2 text-[11px] font-medium text-primary"
            : "flex items-start gap-2 rounded-lg bg-secondary/50 px-3 py-2 text-[11px] text-muted-foreground"
        }
      >
        <Sparkles className="mt-0.5 h-3.5 w-3.5 shrink-0" />
        {businessTypeLabel ? (
          <span>
            Recommendations tailored for {businessTypeLabel} — adjust anything
            below.
          </span>
        ) : (
          <span>
            Showing general assumptions. Pick a business type above for tailored
            numbers.
          </span>
        )}
      </div>

      {/* BEP ditonjolkan karena fitur paling penting */}
      <div className="rounded-2xl border-2 border-primary/30 bg-linear-to-br from-primary/10 via-primary/5 to-transparent p-3">
        <div className="mb-2 flex items-center gap-2">
          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary text-white">
            <Target className="h-3.5 w-3.5" />
          </span>
          <div>
            <p className="text-xs font-bold text-foreground">
              Target Break-Even Period
            </p>
            <p className="text-[10px] font-medium text-primary">
              Most-used filter
            </p>
          </div>
        </div>
        <Autocomplete
          value={bepMonths}
          onSelect={(v) => onBepMonthsChange(String(v))}
          options={BEP_OPTIONS}
          placeholder="Pick a target BEP"
          mode="solid"
          className="mt-2"
        />

        {bepMonths === "custom" && (
          <NumberInput
            suffix=" months"
            decimalScale={0}
            placeholder="e.g. 9 months"
            value={customBepMonths ?? ""}
            onValueChange={(v) => onCustomBepMonthsChange(v.floatValue ?? null)}
            className="mt-2 h-9 py-2 text-sm"
          />
        )}
      </div>

      <div>
        <p className="mb-2 text-xs font-semibold text-muted-foreground">
          Available Capital
        </p>
        <NumberInput
          prefix="Rp "
          decimalScale={0}
          placeholder="e.g. Rp 15,000,000"
          value={capital}
          onValueChange={(v) => onCapitalChange(v.floatValue ?? 0)}
          className="h-10"
        />
      </div>

      <MinMaxInput
        label="Monthly Rent"
        min={RENT_RANGE.min}
        max={RENT_RANGE.max}
        value={rentRange}
        onChange={onRentRangeChange}
      />

      <MinMaxInput
        label="Security Deposit"
        min={DEPOSIT_RANGE.min}
        max={DEPOSIT_RANGE.max}
        value={depositRange}
        onChange={onDepositRangeChange}
      />
    </div>
  );
}
