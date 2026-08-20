import { BUSINESS_TYPE_MAP } from "@/lib/data/schema/master/business_type";
import { DEFAULT_CAPITAL_BY_PERMANENCE } from "../constants/range";
import { PaymentCycle, StallPermanenceType } from "../constants/types";

export interface IndustryFinancialProfile {
  grossMarginRatio: number;
  rentToRevenueRatio: number;
}

export const DEFAULT_INDUSTRY_PROFILE: IndustryFinancialProfile = {
  grossMarginRatio: 0.55,
  rentToRevenueRatio: 0.15,
};

export interface CycleRange {
  minRent: number;
  maxRent: number;
  minDeposit: number;
  maxDeposit: number;
}

export type MultiCycleRanges = Record<PaymentCycle, CycleRange>;

const ABSOLUTE_MIN_DAILY_RENT = 20_000;
const ABSOLUTE_MIN_MONTHLY_RENT = 300_000;
const ABSOLUTE_MIN_DEPOSIT = 100_000;

function roundToNearest10k(val: number): number {
  return Math.round(val / 10_000) * 10_000;
}

function roundToNearest50k(val: number): number {
  return Math.round(val / 50_000) * 50_000;
}

function ensureMinGap(
  min: number,
  max: number,
  gap = 50_000,
): [number, number] {
  if (max - min < gap) {
    return [min, min + gap];
  }
  return [min, max];
}

/**
 * Kalkulasi Range Sewa Fleksibel
 * - Permanent / Semi-Permanent: Menggunakan Modal & BEP Months.
 * - Temporary: Menggunakan Target Omset Harian / Event Target.
 */
export function calculateMultiCycleRanges(
  capitalOrDailyTarget: number,
  bepMonths: number,
  profile: IndustryFinancialProfile = DEFAULT_INDUSTRY_PROFILE,
  permanenceType: StallPermanenceType = "permanent",
): MultiCycleRanges {
  let baseMonthlyMin = 0;
  let baseMonthlyMax = 0;
  let baseDailyMin = 0;
  let baseDailyMax = 0;

  const isTemporaryEvent = permanenceType === "temporary";

  if (isTemporaryEvent) {
    const dailyRevenueTarget =
      capitalOrDailyTarget > 0
        ? capitalOrDailyTarget
        : DEFAULT_CAPITAL_BY_PERMANENCE.temporary;

    baseDailyMin = dailyRevenueTarget * (profile.rentToRevenueRatio * 0.75);
    baseDailyMax = dailyRevenueTarget * (profile.rentToRevenueRatio * 1.25);

    baseDailyMin = Math.max(baseDailyMin, ABSOLUTE_MIN_DAILY_RENT);
    baseDailyMax = Math.max(baseDailyMax, baseDailyMin * 1.25);

    baseMonthlyMin = baseDailyMin * 30;
    baseMonthlyMax = baseDailyMax * 30;
  } else {
    const safeCapital =
      capitalOrDailyTarget > 0
        ? capitalOrDailyTarget
        : (DEFAULT_CAPITAL_BY_PERMANENCE[permanenceType] ?? 35_000_000);
    const safeBep = bepMonths > 0 ? bepMonths : 6;

    const estimatedMonthlyRevenueNeeded =
      safeCapital / (safeBep * profile.grossMarginRatio);

    baseMonthlyMin =
      estimatedMonthlyRevenueNeeded * (profile.rentToRevenueRatio * 0.75);
    baseMonthlyMax =
      estimatedMonthlyRevenueNeeded * (profile.rentToRevenueRatio * 1.25);

    baseMonthlyMin = Math.max(baseMonthlyMin, ABSOLUTE_MIN_MONTHLY_RENT);
    baseMonthlyMax = Math.max(baseMonthlyMax, baseMonthlyMin * 1.2);

    baseDailyMin = baseMonthlyMin / 30;
    baseDailyMax = baseMonthlyMax / 30;
  }

  const cycleConfig: Record<
    PaymentCycle,
    { months: number; discount: number; isDaily?: boolean }
  > = {
    day: { months: 1 / 30, discount: 0.0, isDaily: true },
    month: { months: 1, discount: 0.0 },
    quarter: { months: 3, discount: 0.03 },
    semester: { months: 6, discount: 0.07 },
    year: { months: 12, discount: 0.12 },
  };

  const result = {} as MultiCycleRanges;

  const rawMinDeposit = isTemporaryEvent
    ? Math.max(baseDailyMin * 2, ABSOLUTE_MIN_DEPOSIT)
    : Math.max(baseMonthlyMin * 0.5, ABSOLUTE_MIN_DEPOSIT);
  const rawMaxDeposit = Math.max(rawMinDeposit * 1.5, rawMinDeposit + 100_000);

  const [minDeposit, maxDeposit] = ensureMinGap(
    roundToNearest50k(rawMinDeposit),
    roundToNearest50k(rawMaxDeposit),
  );

  (Object.keys(cycleConfig) as PaymentCycle[]).forEach((cycle) => {
    const { months, discount, isDaily } = cycleConfig[cycle];
    const discountMultiplier = 1 - discount;

    if (isDaily) {
      const [minRent, maxRent] = ensureMinGap(
        roundToNearest10k(baseDailyMin),
        roundToNearest10k(baseDailyMax),
        10_000,
      );
      result[cycle] = {
        minRent,
        maxRent,
        minDeposit: roundToNearest10k(minDeposit / 5),
        maxDeposit: roundToNearest10k(maxDeposit / 5),
      };
    } else {
      const rawMinRent = baseMonthlyMin * months * discountMultiplier;
      const rawMaxRent = baseMonthlyMax * months * discountMultiplier;

      const [minRent, maxRent] = ensureMinGap(
        roundToNearest50k(rawMinRent),
        roundToNearest50k(rawMaxRent),
        roundToNearest50k(50_000 * months),
      );
      result[cycle] = { minRent, maxRent, minDeposit, maxDeposit };
    }
  });

  return result;
}

export function getCalculatedRangesForFilters(
  capitalOrDailyTarget: number,
  bepMonths: number | string,
  customBepMonths: number | null,
  paymentCycle: PaymentCycle | "",
  businessType?: string,
  permanenceType: StallPermanenceType = "permanent",
): {
  rentRange: [number, number];
  depositRange: [number, number];
} {
  const activeBep =
    bepMonths === "custom" ? (customBepMonths ?? 6) : Number(bepMonths) || 6;

  const preset = businessType ? BUSINESS_TYPE_MAP[businessType] : null;
  const profile = preset
    ? {
        grossMarginRatio: preset.avgGrossMarginRatio,
        rentToRevenueRatio: preset.industryRentToRevenueRatio,
      }
    : undefined;

  const calculated = calculateMultiCycleRanges(
    capitalOrDailyTarget,
    activeBep,
    profile,
    permanenceType,
  );

  const activeCycle =
    paymentCycle || (permanenceType === "temporary" ? "day" : "month");
  const data = calculated[activeCycle];

  return {
    rentRange: [data.minRent, data.maxRent],
    depositRange: [data.minDeposit, data.maxDeposit],
  };
}

export function getPresetWithCalculatedRanges(
  typeId: string,
  capitalOrDailyTarget?: number,
  bepMonths?: number,
  permanenceType: StallPermanenceType = "permanent",
) {
  const typeDef = BUSINESS_TYPE_MAP[typeId];
  if (!typeDef) return null;

  const activeInput =
    capitalOrDailyTarget && capitalOrDailyTarget > 0
      ? capitalOrDailyTarget
      : permanenceType === "temporary"
        ? DEFAULT_CAPITAL_BY_PERMANENCE.temporary
        : typeDef.defaultCapital;

  const activeBEP = bepMonths ?? typeDef.defaultBEPMonths;

  const cycleRanges: MultiCycleRanges = calculateMultiCycleRanges(
    activeInput,
    activeBEP,
    {
      grossMarginRatio: typeDef.avgGrossMarginRatio,
      rentToRevenueRatio: typeDef.industryRentToRevenueRatio,
    },
    permanenceType,
  );

  return { ...typeDef, activeInput, activeBEP, cycleRanges };
}
