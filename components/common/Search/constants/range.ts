import {
  BEPMonths,
  DayOfMonthValue,
  LeaseMonthsValue,
  LeasePeriodOption,
  PaymentCycle,
  PaymentCycleOption,
  RadiusPreset,
  RentRangeConfig,
  StallPermanenceType,
  StartDateOption,
} from "./types";

export const BEP_PRESETS_MONTHS: readonly BEPMonths[] = [3, 6, 12, 18, 24];

export const GENERAL_RENT_RANGE: RentRangeConfig = {
  min: 300_000,
  max: 50_000_000,
  step: 250_000,
};

export const RENT_RANGE_BY_CYCLE: Record<PaymentCycle, RentRangeConfig> = {
  day: { min: 50_000, max: 2_000_000, step: 25_000 },
  month: { min: 300_000, max: 10_000_000, step: 50_000 },
  quarter: { min: 900_000, max: 25_000_000, step: 250_000 },
  semester: { min: 1_800_000, max: 45_000_000, step: 500_000 },
  year: { min: 3_500_000, max: 80_000_000, step: 1_000_000 },
};

export function getAllowedRentRange(
  allowedCycles: PaymentCycle[],
): RentRangeConfig {
  if (allowedCycles.length === 0) return GENERAL_RENT_RANGE;

  const configs = allowedCycles.map((c) => RENT_RANGE_BY_CYCLE[c]);
  const min = Math.min(...configs.map((c) => c.min));
  const max = Math.max(...configs.map((c) => c.max));
  const step = Math.min(...configs.map((c) => c.step));

  return { min, max, step };
}

export function getRentRangeConfig(cycle: PaymentCycle | ""): RentRangeConfig {
  if (!cycle) return GENERAL_RENT_RANGE;
  return RENT_RANGE_BY_CYCLE[cycle];
}

export const DEPOSIT_RANGE = {
  min: 500_000,
  max: 10_000_000,
  step: 100_000,
} as const;

export const DEFAULT_CAPITAL_BY_PERMANENCE: Record<
  StallPermanenceType,
  number
> = {
  permanent: 35_000_000, // Ruko / Kios Mandiri
  "semi-permanent": 15_000_000, // Mall / Foodcourt / Pasar
  temporary: 3_000_000, // Bazaar / Pop-up Spot (Target Omset Harian / Modal Stok Event)
};

export const DEFAULT_ASSUMED_CAPITAL = DEFAULT_CAPITAL_BY_PERMANENCE.permanent;
export const DEFAULT_BEP_MONTHS: BEPMonths = 6;

export const RADIUS_PRESETS: readonly RadiusPreset[] = [
  "1 km",
  "3 km",
  "5 km",
  "10 km",
];

export const RADIUS_RANGE = { min: 0.5, max: 50, step: 0.5 } as const;

export const START_DATE_PRESETS: StartDateOption[] = [
  { value: 1, label: "1st of the month" },
  { value: 15, label: "15th of the month" },
  { value: "eom", label: "End of month" },
];

export const MIN_LEASE_PERIOD_PRESETS: LeasePeriodOption[] = [
  { value: "1m", label: "1 month", months: 1 },
  { value: "3m", label: "3 months", months: 3 },
  { value: "6m", label: "6 months", months: 6 },
  { value: "12m", label: "12 months", months: 12 },
  { value: "custom", label: "Custom", months: null },
];

export const PAYMENT_CYCLE_OPTIONS: PaymentCycleOption[] = [
  { value: "day", label: "Daily" },
  { value: "month", label: "Monthly" },
  { value: "quarter", label: "Quarterly" },
  { value: "semester", label: "Semesterly" },
  { value: "year", label: "Yearly" },
];

export const DAY_OF_MONTH_OPTIONS: { value: DayOfMonthValue; label: string }[] =
  Array.from({ length: 28 }, (_, i) => ({
    value: i + 1,
    label: `Day ${i + 1}`,
  }));

export const LEASE_MONTHS_OPTIONS: {
  value: LeaseMonthsValue;
  label: string;
}[] = Array.from({ length: 12 }, (_, i) => {
  const month = i + 1;
  return {
    value: month,
    label: `${month} month${month > 1 ? "s" : ""}`,
  };
});

export const FLOOR_COUNT_RANGE = { min: 1, max: 4, step: 1 } as const;
export const STALL_SIZE_RANGE = { min: 2, max: 100, step: 1 } as const;

export const OPERATING_HOURS_PRESETS = [
  { openingTime: "08:00", closingTime: "17:00", label: "08:00 – 17:00" },
  { openingTime: "10:00", closingTime: "22:00", label: "10:00 – 22:00" },
  { openingTime: "09:00", closingTime: "21:00", label: "09:00 – 21:00" },
] as const;

export const REGISTRATION_DEADLINE_PRESETS = [1, 2, 3, 5, 7, 14] as const;
export const EVENT_DURATION_PRESETS = [1, 2, 3, 5, 7, 14, 30] as const;
