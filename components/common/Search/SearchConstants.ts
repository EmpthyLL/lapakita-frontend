import { LucideIcon, MapPin, SlidersHorizontal, Target } from "lucide-react";

export const BEP_PRESETS_MONTHS = [3, 6, 12, 18, 24];

export const RENT_RANGE = { min: 500_000, max: 20_000_000, step: 100_000 };
// deposit minimum sekarang 500rb, bukan 0
export const DEPOSIT_RANGE = { min: 500_000, max: 10_000_000, step: 100_000 };

export const RADIUS_PRESETS = ["1 km", "3 km", "5 km", "10 km"];
export const RADIUS_RANGE = { min: 0.5, max: 50, step: 0.5 };

export function formatIDR(value: number) {
  if (value >= 1_000_000) {
    return `Rp ${(value / 1_000_000).toFixed(value % 1_000_000 === 0 ? 0 : 1)}jt`;
  }
  return `Rp ${value.toLocaleString("id-ID")}`;
}

export interface SearchInfoItem {
  icon: LucideIcon;
  highlight: string;
  label: string;
}

export const SEARCH_CAPABILITIES: SearchInfoItem[] = [
  {
    icon: MapPin,
    highlight: "Landmark & Radius",
    label: "Search near campus, schools & offices",
  },
  {
    icon: SlidersHorizontal,
    highlight: "Multi-Filter Utility",
    label: "Power, water, kitchen & rent range",
  },
  {
    icon: Target,
    highlight: "Budget & ROI Match",
    label: "Calculate rent fit by capital & BEP target",
  },
];

export interface StartDateOption {
  value: string;
  label: string;
}

export const START_DATE_PRESETS: StartDateOption[] = [
  { value: "1", label: "1st of the month" },
  { value: "15", label: "15th of the month" },
  { value: "eom", label: "End of month" },
];

export interface LeasePeriodOption {
  value: string;
  label: string;
  months: number | null; // null = custom
}

export const MIN_LEASE_PERIOD_PRESETS: LeasePeriodOption[] = [
  { value: "1m", label: "1 month", months: 1 },
  { value: "3m", label: "3 months", months: 3 },
  { value: "6m", label: "6 months", months: 6 },
  { value: "12m", label: "12 months", months: 12 },
  { value: "custom", label: "Custom", months: null },
];

export type PaymentCycle = "monthly" | "quarterly" | "semesterly" | "yearly";

export interface PaymentCycleOption {
  value: PaymentCycle;
  label: string;
}

export const PAYMENT_CYCLE_OPTIONS: PaymentCycleOption[] = [
  { value: "monthly", label: "Monthly" },
  { value: "quarterly", label: "Quarterly" },
  { value: "semesterly", label: "Semesterly" },
  { value: "yearly", label: "Yearly" },
];

// English labels, dipakai lewat Autocomplete
export const DAY_OF_MONTH_OPTIONS: { value: string; label: string }[] =
  Array.from({ length: 28 }, (_, i) => {
    const day = i + 1;
    return { value: String(day), label: `Day ${day}` };
  });

export const LEASE_MONTHS_OPTIONS: { value: string; label: string }[] =
  Array.from({ length: 12 }, (_, i) => {
    const month = i + 1;
    return {
      value: String(month),
      label: `${month} month${month > 1 ? "s" : ""}`,
    };
  });
