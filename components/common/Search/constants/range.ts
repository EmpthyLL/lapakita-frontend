import {
  AttendanceRequirementValue,
  BEPMonths,
  CancellationPolicyValue,
  DayOfMonthValue,
  EventOperatingDaysValue,
  EventStartDayValue,
  LeaseDaysValue,
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
  day: { min: 20_000, max: 2_000_000, step: 10_000 },
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
  min: 100_000,
  max: 10_000_000,
  step: 50_000,
} as const;

export const DEFAULT_CAPITAL_BY_PERMANENCE: Record<
  StallPermanenceType,
  number
> = {
  permanent: 35_000_000,
  "semi-permanent": 15_000_000,
  temporary: 3_000_000,
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

// OPSI TANGGAL MULAI SEWA: PERMANENT & SEMI-PERMANENT
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

// Opsi Pilihan Tanggal Bulanan (1 - 28) untuk Custom Permanent
export const DAY_OF_MONTH_OPTIONS: { value: DayOfMonthValue; label: string }[] =
  Array.from({ length: 28 }, (_, i) => ({
    value: i + 1,
    label: `Day ${i + 1}`,
  }));

// Opsi Pilihan Hari Event (Day 1 s/d Day 30) untuk Custom Temporary Event
export const EVENT_DAY_OPTIONS: { value: EventStartDayValue; label: string }[] =
  Array.from({ length: 30 }, (_, i) => ({
    value: `day_${i + 1}`,
    label: `Event Day ${i + 1}`,
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

// Minimum Durasi Sewa Harian (1 - 30 Hari) untuk Temporary Event Custom Input
export const LEASE_DAYS_OPTIONS: {
  value: LeaseDaysValue;
  label: string;
}[] = Array.from({ length: 30 }, (_, i) => {
  const day = i + 1;
  return {
    value: day,
    label: `${day} day${day > 1 ? "s" : ""}`,
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

export interface FilterOption<T = string> {
  value: T;
  label: string;
  description?: string;
}

// 1. Pola Hari Operasional Event
export const EVENT_OPERATING_DAYS_OPTIONS: FilterOption<EventOperatingDaysValue>[] =
  [
    { value: "everyday", label: "Everyday (Full Week)" },
    { value: "weekends", label: "Weekends Only (Fri–Sun)" },
    { value: "weekdays", label: "Weekdays Only (Mon–Thu)" },
    { value: "flexible", label: "Custom / Intermittent Days" },
  ];

// 2. Ketentuan Kehadiran Stall
export const ATTENDANCE_REQUIREMENT_OPTIONS: FilterOption<AttendanceRequirementValue>[] =
  [
    {
      value: "mandatory_full",
      label: "Mandatory Full Attendance",
      description: "Must open every day during event period",
    },
    {
      value: "flexible_days",
      label: "Flexible Days Choice",
      description: "Pick specific active days (e.g., weekend only)",
    },
  ];

// 3. Kebijakan Batal / Early Exit
export const CANCELLATION_POLICY_OPTIONS: FilterOption<CancellationPolicyValue>[] =
  [
    {
      value: "pro_rata",
      label: "Pro-Rata Pay Per Used Day",
      description: "Pay only for active days if you leave early",
    },
    {
      value: "deposit_refundable",
      label: "Deposit Refundable",
      description: "Deposit returned upon early cancellation notice",
    },
    {
      value: "non_refundable",
      label: "Strict (Non-Refundable)",
      description: "Full period payment locked",
    },
  ];
