import {
  DEFAULT_ASSUMED_CAPITAL,
  PaymentCycle,
} from "@/components/common/search/SearchConstants";
import { BUSINESS_TYPE_MAP } from "@/lib/data/schema/master/business_type";

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

const ABSOLUTE_MIN_MONTHLY_RENT = 300_000;
const ABSOLUTE_MIN_DEPOSIT = 300_000;

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

export function calculateMultiCycleRanges(
  capital: number,
  bepMonths: number,
  profile: IndustryFinancialProfile = DEFAULT_INDUSTRY_PROFILE,
): MultiCycleRanges {
  const safeCapital = capital > 0 ? capital : DEFAULT_ASSUMED_CAPITAL;
  const safeBep = bepMonths > 0 ? bepMonths : 6;

  const estimatedMonthlyRevenueNeeded =
    safeCapital / (safeBep * profile.grossMarginRatio);

  let baseMonthlyMin =
    estimatedMonthlyRevenueNeeded * (profile.rentToRevenueRatio * 0.75);
  let baseMonthlyMax =
    estimatedMonthlyRevenueNeeded * (profile.rentToRevenueRatio * 1.25);

  baseMonthlyMin = Math.max(baseMonthlyMin, ABSOLUTE_MIN_MONTHLY_RENT);
  baseMonthlyMax = Math.max(baseMonthlyMax, baseMonthlyMin * 1.2);

  const cycleConfig: Record<
    PaymentCycle,
    { months: number; discount: number }
  > = {
    month: { months: 1, discount: 0.0 },
    quarter: { months: 3, discount: 0.03 },
    semester: { months: 6, discount: 0.07 },
    year: { months: 12, discount: 0.12 },
  };

  const result = {} as MultiCycleRanges;

  const rawMinDeposit = Math.max(baseMonthlyMin * 1.0, ABSOLUTE_MIN_DEPOSIT);
  const rawMaxDeposit = Math.max(baseMonthlyMax * 1.25, rawMinDeposit * 1.2);
  const [minDeposit, maxDeposit] = ensureMinGap(
    roundToNearest50k(rawMinDeposit),
    roundToNearest50k(rawMaxDeposit),
  );

  (Object.keys(cycleConfig) as PaymentCycle[]).forEach((cycle) => {
    const { months, discount } = cycleConfig[cycle];
    const discountMultiplier = 1 - discount;

    const rawMinRent = baseMonthlyMin * months * discountMultiplier;
    const rawMaxRent = baseMonthlyMax * months * discountMultiplier;

    const [minRent, maxRent] = ensureMinGap(
      roundToNearest50k(rawMinRent),
      roundToNearest50k(rawMaxRent),
      roundToNearest50k(50_000 * months),
    );

    result[cycle] = { minRent, maxRent, minDeposit, maxDeposit };
  });

  return result;
}

export function getCalculatedRangesForFilters(
  capital: number,
  bepMonths: number | string,
  customBepMonths: number | null,
  paymentCycle: PaymentCycle | "",
  businessType?: string,
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

  const calculated = calculateMultiCycleRanges(capital, activeBep, profile);

  if (paymentCycle && calculated[paymentCycle]) {
    const data = calculated[paymentCycle];
    return {
      rentRange: [data.minRent, data.maxRent],
      depositRange: [data.minDeposit, data.maxDeposit],
    };
  }

  return {
    rentRange: [calculated.month.minRent, calculated.month.maxRent],
    depositRange: [calculated.month.minDeposit, calculated.month.maxDeposit],
  };
}

export function getPresetWithCalculatedRanges(
  typeId: string,
  capital?: number,
  bepMonths?: number,
) {
  const typeDef = BUSINESS_TYPE_MAP[typeId];
  if (!typeDef) return null;

  const activeCapital = capital ?? typeDef.defaultCapital;
  const activeBEP = bepMonths ?? typeDef.defaultBEPMonths;

  const cycleRanges: MultiCycleRanges = calculateMultiCycleRanges(
    activeCapital,
    activeBEP,
    {
      grossMarginRatio: typeDef.avgGrossMarginRatio,
      rentToRevenueRatio: typeDef.industryRentToRevenueRatio,
    },
  );

  return { ...typeDef, activeCapital, activeBEP, cycleRanges };
}
