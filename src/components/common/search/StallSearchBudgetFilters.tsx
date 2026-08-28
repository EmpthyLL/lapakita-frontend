"use client";

import { useDebounce } from "@/hooks/use-debounce";
import { BusinessType } from "@/lib/data/schema/master/business_type";
import { formatCurrency } from "@/lib/utils";
import { CalendarDays, Sparkles, Target } from "lucide-react";
import { useTranslations } from "next-intl";
import * as React from "react";
import { Autocomplete } from "../input/Autocomplete";
import { NumberInput } from "../input/NumberInput";
import { RangeInput } from "../input/RangeInput";
import { SegmentedToggle } from "../input/SegmentedToggle";
import {
  BEP_PRESETS_MONTHS,
  DEPOSIT_RANGE,
  PAYMENT_CYCLE_OPTIONS,
  RENT_RANGE_BY_CYCLE,
  getAllowedRentRange,
} from "./constants/range";
import { PaymentCycle, StallPermanenceType } from "./constants/types";
import { getCalculatedRangesForFilters } from "./util/BusinessTypeCalc";

const PRESET_VALUES = BEP_PRESETS_MONTHS.map(String);

interface StallSearchBudgetFiltersProps {
  permanenceType: StallPermanenceType;
  businessTypeObj?: BusinessType | null;
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
  allowedPaymentCycles: PaymentCycle[];
}

export function StallSearchBudgetFilters({
  permanenceType,
  businessTypeObj,
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
  allowedPaymentCycles,
}: StallSearchBudgetFiltersProps) {
  const t = useTranslations("common.search.budget_filters");
  const isTemporary = permanenceType === "temporary";

  const bepOptions = [
    ...BEP_PRESETS_MONTHS.map((m) => ({
      value: String(m),
      label: `${m}${t("months_suffix")}`,
    })),
    { value: "custom", label: t("custom") },
  ];

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

  const debouncedCapital = useDebounce(capital, 450);
  const debouncedCustomBepMonths = useDebounce(customBepMonths, 450);

  React.useEffect(() => {
    const { rentRange: newRent, depositRange: newDeposit } =
      getCalculatedRangesForFilters(
        debouncedCapital,
        bepMonths,
        debouncedCustomBepMonths,
        paymentCycle,
        businessTypeObj,
        permanenceType,
      );

    onRentRangeChange(newRent);
    onDepositRangeChange(newDeposit);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    debouncedCapital,
    bepMonths,
    debouncedCustomBepMonths,
    paymentCycle,
    businessTypeObj,
    permanenceType,
  ]);

  const cycleOptions = PAYMENT_CYCLE_OPTIONS.filter((opt) =>
    allowedPaymentCycles.includes(opt.value),
  );

  const activeRentLimit = paymentCycle
    ? RENT_RANGE_BY_CYCLE[paymentCycle]
    : getAllowedRentRange(allowedPaymentCycles);

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
        {isTemporary ? (
          <span>{t("temporary_notice")}</span>
        ) : businessTypeLabel ? (
          <span>
            {t("tailored_notice", { businessType: businessTypeLabel })}
          </span>
        ) : (
          <span>{t("general_notice")}</span>
        )}
      </div>

      {isTemporary ? (
        <div className="rounded-2xl border-2 border-primary/30 bg-linear-to-br from-primary/10 via-primary/5 to-transparent p-3">
          <div className="mb-2 flex items-center gap-2">
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary text-white">
              <CalendarDays className="h-3.5 w-3.5" />
            </span>
            <div>
              <p className="text-xs font-bold text-foreground">
                {t("daily_revenue_target")}
              </p>
              <p className="text-[10px] font-medium text-primary">
                {t("daily_revenue_desc")}
              </p>
            </div>
          </div>
          <NumberInput
            prefix="Rp "
            decimalScale={0}
            placeholder="e.g. Rp 3,000,000"
            value={capital}
            onValueChange={(v) => onCapitalChange(v.floatValue ?? 0)}
            className="mt-2 h-10"
          />
        </div>
      ) : (
        <>
          <div className="rounded-2xl border-2 border-primary/30 bg-linear-to-br from-primary/10 via-primary/5 to-transparent p-3">
            <div className="mb-2 flex items-center gap-2">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary text-white">
                <Target className="h-3.5 w-3.5" />
              </span>
              <div>
                <p className="text-xs font-bold text-foreground">
                  {t("target_bep_period")}
                </p>
                <p className="text-[10px] font-medium text-primary">
                  {t("quick_filter")}
                </p>
              </div>
            </div>
            <Autocomplete
              value={bepMonths}
              onSelect={(v) => handleBepSelect(String(v))}
              options={bepOptions}
              placeholder={t("pick_bep_placeholder")}
              mode="solid"
              className="mt-2"
            />
            {bepMonths === "custom" && (
              <NumberInput
                suffix={t("months_suffix")}
                decimalScale={0}
                placeholder={`e.g. 9${t("months_suffix")}`}
                value={customBepMonths ?? ""}
                onValueChange={(v) =>
                  onCustomBepMonthsChange(v.floatValue ?? null)
                }
                className="mt-2 h-9 py-2 text-sm"
              />
            )}
          </div>

          <div>
            <p className="mb-2 text-xs font-semibold text-muted-foreground">
              {t("available_capital")}
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
        </>
      )}

      <div>
        <p className="mb-2 text-xs font-semibold text-muted-foreground">
          {t("payment_cycle")}
        </p>
        <SegmentedToggle
          value={paymentCycle}
          onChange={handleCycleChange}
          options={cycleOptions}
        />
      </div>

      <RangeInput
        label={t("rent")}
        min={activeRentLimit.min}
        max={activeRentLimit.max}
        step={activeRentLimit.step}
        value={rentRange}
        onChange={onRentRangeChange}
        formatValue={(n) => formatCurrency(n, "Rp ")}
        prefix="Rp "
      />

      <RangeInput
        label={t("deposit")}
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
