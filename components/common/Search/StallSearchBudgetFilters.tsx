"use client";

import { NumberInput } from "@/components/ui/number-input";
import { Slider } from "@/components/ui/slider";
import { Target } from "lucide-react";
import { Autocomplete } from "../Autocomplete";
import {
  BEP_PRESETS_MONTHS,
  DEPOSIT_RANGE,
  formatIDR,
  RENT_RANGE,
} from "./SearchConstants";

const BEP_OPTIONS = BEP_PRESETS_MONTHS.map((m) => ({
  value: String(m),
  label: `${m} months`,
}));

interface StallSearchBudgetFiltersProps {
  bepMonths: number;
  onBepMonthsChange: (value: number) => void;
  capital: number | null;
  onCapitalChange: (value: number | null) => void;
  rentRange: [number, number];
  onRentRangeChange: (value: [number, number]) => void;
  depositRange: [number, number];
  onDepositRangeChange: (value: [number, number]) => void;
}

// Dipakai buat rent & deposit — sama pattern, sama validasi min ≤ max
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
          noSeparated={false}
          decimalScale={0}
          placeholder="Min"
          value={value[0]}
          onValueChange={(v) => handleMinChange(v.floatValue)}
          className="h-9 py-2 text-sm"
        />
        <span className="text-muted-foreground">–</span>
        <NumberInput
          prefix="Rp "
          noSeparated={false}
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
  bepMonths,
  onBepMonthsChange,
  capital,
  onCapitalChange,
  rentRange,
  onRentRangeChange,
  depositRange,
  onDepositRangeChange,
}: StallSearchBudgetFiltersProps) {
  return (
    <div className="space-y-5">
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
          value={String(bepMonths)}
          onSelect={(v) => onBepMonthsChange(Number(v))}
          options={BEP_OPTIONS}
          placeholder="Pick a target BEP"
          mode="solid"
          className="mt-2"
        />
      </div>

      <div>
        <p className="mb-2 text-xs font-semibold text-muted-foreground">
          Available Capital
        </p>
        <NumberInput
          prefix="Rp "
          decimalScale={0}
          placeholder="e.g. Rp 15,000,000"
          value={capital ?? ""}
          onValueChange={(v) => onCapitalChange(v.floatValue ?? null)}
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
