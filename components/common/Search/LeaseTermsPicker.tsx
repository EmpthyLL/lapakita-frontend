"use client";

import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Autocomplete } from "../input/Autocomplete";
import {
  DAY_OF_MONTH_OPTIONS,
  LEASE_MONTHS_OPTIONS,
  MIN_LEASE_PERIOD_PRESETS,
  PAYMENT_CYCLE_OPTIONS,
  START_DATE_PRESETS,
  type PaymentCycle,
} from "./SearchConstants";

const START_DATE_OPTIONS = [
  ...START_DATE_PRESETS,
  { value: "custom", label: "Custom day" },
];

interface LeaseTermsPickerProps {
  startDate: string;
  onStartDateChange: (value: string) => void;
  customStartDay: string;
  onCustomStartDayChange: (value: string) => void;

  minLeasePeriod: string;
  onMinLeasePeriodChange: (value: string) => void;
  customLeaseMonths: string;
  onCustomLeaseMonthsChange: (value: string) => void;

  paymentCycle: PaymentCycle | "";
  onPaymentCycleChange: (value: PaymentCycle) => void;
}

export function LeaseTermsPicker({
  startDate,
  onStartDateChange,
  customStartDay,
  onCustomStartDayChange,
  minLeasePeriod,
  onMinLeasePeriodChange,
  customLeaseMonths,
  onCustomLeaseMonthsChange,
  paymentCycle,
  onPaymentCycleChange,
}: LeaseTermsPickerProps) {
  return (
    <div className="space-y-5">
      <div>
        <p className="mb-2 text-xs font-semibold text-muted-foreground">
          Desired Start Date
        </p>
        <Autocomplete
          value={startDate}
          onSelect={(v) => onStartDateChange(String(v))}
          options={START_DATE_OPTIONS}
          placeholder="Any start date"
          mode="solid"
        />
        {startDate === "custom" && (
          <Autocomplete
            value={customStartDay}
            onSelect={(v) => onCustomStartDayChange(String(v))}
            options={DAY_OF_MONTH_OPTIONS}
            placeholder="Pick a day (1–28)"
            mode="solid"
            className="mt-2"
          />
        )}
      </div>

      <div>
        <p className="mb-2 text-xs font-semibold text-muted-foreground">
          Minimum Lease Period
        </p>
        <Autocomplete
          value={minLeasePeriod}
          onSelect={(v) => onMinLeasePeriodChange(String(v))}
          options={MIN_LEASE_PERIOD_PRESETS}
          placeholder="Any lease period"
          mode="solid"
        />
        {minLeasePeriod === "custom" && (
          <Autocomplete
            value={customLeaseMonths}
            onSelect={(v) => onCustomLeaseMonthsChange(String(v))}
            options={LEASE_MONTHS_OPTIONS}
            placeholder="Pick months (1–12)"
            mode="solid"
            className="mt-2"
          />
        )}
      </div>

      <div>
        <p className="mb-2 text-xs font-semibold text-muted-foreground">
          Payment Cycle
        </p>
        <ToggleGroup
          type="single"
          value={paymentCycle}
          onValueChange={(v) => v && onPaymentCycleChange(v as PaymentCycle)}
          className="flex w-full flex-wrap rounded-lg border border-border bg-secondary/40 p-1"
        >
          {PAYMENT_CYCLE_OPTIONS.map((opt) => (
            <ToggleGroupItem
              key={opt.value}
              value={opt.value}
              className="flex-1 rounded-md px-3 py-1.5 text-xs font-medium data-[state=on]:bg-primary data-[state=on]:text-primary-foreground"
            >
              {opt.label}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
      </div>
    </div>
  );
}
