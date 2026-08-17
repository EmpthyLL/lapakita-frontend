"use client";

import { formatCurrency } from "@/lib/utils";
import { Sparkles, Target } from "lucide-react";
import * as React from "react";
import { Autocomplete } from "../input/Autocomplete";
import { NumberInput } from "../input/NumberInput";
import { RangeInput } from "../input/RangeInput";
import { SegmentedToggle } from "../input/SegmentedToggle";
import { getCalculatedRangesForFilters } from "./BusinessTypeCalc";
import {
  BEP_PRESETS_MONTHS,
  DEPOSIT_RANGE,
  GENERAL_RENT_RANGE,
  PAYMENT_CYCLE_OPTIONS,
  RENT_RANGE_BY_CYCLE,
  type PaymentCycle,
} from "./SearchConstants";

const PRESET_VALUES = BEP_PRESETS_MONTHS.map(String);

const BEP_OPTIONS = [
  ...BEP_PRESETS_MONTHS.map((m) => ({
    value: String(m),
    label: `${m} months`,
  })),
  { value: "custom", label: "Custom" },
];

interface StallSearchBudgetFiltersProps {
  businessTypeLabel: string | null;
  bepMonths: string;
  onBepMonthsChange: (value: string) => void;
  customBepMonths: number | null;
  onCustomBepMonthsChange: (value: number | null) => void;
  capital: number;
  onCapitalChange: (value: number) => void;

  paymentCycle: PaymentCycle | "";
  onPaymentCycleChange: (value: PaymentCycle | "") => void;
  rentRange: [number, number];
  onRentRangeChange: (value: [number, number]) => void;

  depositRange: [number, number];
  onDepositRangeChange: (value: [number, number]) => void;
}

export function StallSearchBudgetFilters({
  businessTypeLabel,
  bepMonths,
  onBepMonthsChange,
  customBepMonths,
  onCustomBepMonthsChange,
  capital,
  onCapitalChange,
  paymentCycle,
  onPaymentCycleChange,
  rentRange,
  onRentRangeChange,
  depositRange,
  onDepositRangeChange,
}: StallSearchBudgetFiltersProps) {
  // Sync otomatis jika nilai bepMonths dari luar merupakan angka custom (bukan opsi preset)
  React.useEffect(() => {
    if (
      bepMonths &&
      bepMonths !== "custom" &&
      !PRESET_VALUES.includes(bepMonths)
    ) {
      const numVal = Number(bepMonths);
      if (!isNaN(numVal)) {
        onCustomBepMonthsChange(numVal);
        onBepMonthsChange("custom");
      }
    }
  }, [bepMonths, onBepMonthsChange, onCustomBepMonthsChange]);

  // 1. INITIAL & ON-CHANGE RECALCULATION:
  // Menghitung & merekomendasikan range ideal saat Capital, BEP, atau Payment Cycle berubah
  React.useEffect(() => {
    const { rentRange: newRent, depositRange: newDeposit } =
      getCalculatedRangesForFilters(
        capital,
        bepMonths,
        customBepMonths,
        paymentCycle,
      );

    onRentRangeChange(newRent);
    onDepositRangeChange(newDeposit);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [capital, bepMonths, customBepMonths, paymentCycle]);

  // Batas slider fisik (min/max/step) tetap menggunakan konstanta terikat cycle
  const activeRentLimit = paymentCycle
    ? RENT_RANGE_BY_CYCLE[paymentCycle]
    : GENERAL_RENT_RANGE;

  function handleCycleChange(next: string) {
    onPaymentCycleChange((next as PaymentCycle) || "");
  }

  function handleBepSelect(selectedVal: string) {
    if (selectedVal === "custom") {
      onBepMonthsChange("custom");
    } else {
      onBepMonthsChange(selectedVal);
      onCustomBepMonthsChange(null);
    }
  }

  return (
    <div className="space-y-5">
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

      {/* Target BEP Filter */}
      <div className="rounded-2xl border-2 border-primary/30 bg-linear-to-br from-primary/10 via-primary/5 to-transparent p-3">
        <div className="mb-2 flex items-center gap-2">
          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary text-white">
            <Target className="h-3.5 w-3.5" />
          </span>
          <div>
            <p className="text-xs font-bold text-foreground">
              Target Break-Even Period
            </p>
            <p className="text-[10px] font-medium text-primary">Quick filter</p>
          </div>
        </div>
        <Autocomplete
          value={bepMonths}
          onSelect={(v) => handleBepSelect(String(v))}
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

      {/* Capital Input */}
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

      {/* Payment Cycle */}
      <div>
        <p className="mb-2 text-xs font-semibold text-muted-foreground">
          Payment Cycle
        </p>
        <SegmentedToggle
          value={paymentCycle}
          onChange={handleCycleChange}
          options={PAYMENT_CYCLE_OPTIONS}
        />
      </div>

      {/* Slider Rent Range — Pengguna bebas menggeser tanpa ter-reset otomatis */}
      <RangeInput
        label="Rent Budget"
        min={activeRentLimit.min}
        max={activeRentLimit.max}
        step={activeRentLimit.step}
        value={rentRange}
        onChange={onRentRangeChange}
        formatValue={(n) => formatCurrency(n, "Rp ")}
        prefix="Rp "
      />

      {/* Slider Deposit Range — Pengguna bebas menggeser */}
      <RangeInput
        label="Deposit"
        min={DEPOSIT_RANGE.min}
        max={DEPOSIT_RANGE.max}
        step={DEPOSIT_RANGE.step}
        value={depositRange}
        onChange={onDepositRangeChange}
        formatValue={(n) => formatCurrency(n, "Rp ")}
        prefix="Rp "
      />
    </div>
  );
}
