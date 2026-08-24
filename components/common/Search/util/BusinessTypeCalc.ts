import { BusinessType } from "@/lib/data/schema/master/business_type";
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
const ABSOLUTE_MIN_MONTHLY_RENT = 200_000;
const ABSOLUTE_MIN_DEPOSIT = 50_000;

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
 * Permanence Pricing Multipliers:
 * Membedakan batas wajar sewa berdasarkan tipe fisik properti
 */
const PERMANENCE_PRICING_FACTOR: Record<StallPermanenceType, number> = {
  permanent: 1.0, // Baseline Ruko / Bangunan Mandiri Full Price
  "semi-permanent": 0.65, // Kios Pasar / Mall / Foodcourt
  temporary: 0.45, // Kakilima / Event / Pop-Up
};

/**
 * Kalkulasi Range Sewa Fleksibel Bertingkat Sesuai Tipe Permanensi
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
  const permanenceFactor = PERMANENCE_PRICING_FACTOR[permanenceType] ?? 1.0;

  if (isTemporaryEvent) {
    const dailyRevenueTarget =
      capitalOrDailyTarget > 0
        ? capitalOrDailyTarget
        : DEFAULT_CAPITAL_BY_PERMANENCE.temporary;

    baseDailyMin = dailyRevenueTarget * (profile.rentToRevenueRatio * 0.75);
    baseDailyMax = dailyRevenueTarget * (profile.rentToRevenueRatio * 1.25);

    baseDailyMin = Math.max(baseDailyMin, ABSOLUTE_MIN_DAILY_RENT);
    baseDailyMax = Math.max(baseDailyMax, baseDailyMin * 1.2);

    baseMonthlyMin = baseDailyMin * 30 * permanenceFactor;
    baseMonthlyMax = baseDailyMax * 30 * permanenceFactor;
  } else {
    const safeCapital =
      capitalOrDailyTarget > 0
        ? capitalOrDailyTarget
        : (DEFAULT_CAPITAL_BY_PERMANENCE[permanenceType] ?? 35_000_000);
    const safeBep = bepMonths > 0 ? bepMonths : 6;

    const estimatedMonthlyRevenueNeeded =
      safeCapital / (safeBep * profile.grossMarginRatio);

    baseMonthlyMin =
      estimatedMonthlyRevenueNeeded *
      (profile.rentToRevenueRatio * 0.75) *
      permanenceFactor;
    baseMonthlyMax =
      estimatedMonthlyRevenueNeeded *
      (profile.rentToRevenueRatio * 1.25) *
      permanenceFactor;

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
    : permanenceType === "semi-permanent"
      ? Math.max(baseMonthlyMin * 0.3, ABSOLUTE_MIN_DEPOSIT)
      : Math.max(baseMonthlyMin * 0.5, ABSOLUTE_MIN_DEPOSIT);

  const rawMaxDeposit = Math.max(rawMinDeposit * 1.3, rawMinDeposit + 50_000);

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
  businessTypeObj?: BusinessType | null,
  permanenceType: StallPermanenceType = "permanent",
): {
  rentRange: [number, number];
  depositRange: [number, number];
} {
  const activeBep =
    bepMonths === "custom" ? (customBepMonths ?? 6) : Number(bepMonths) || 6;

  const profile = businessTypeObj
    ? {
        grossMarginRatio: businessTypeObj.avg_gross_margin_ratio,
        rentToRevenueRatio: businessTypeObj.industry_rent_to_revenue_ratio,
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
  typeDef?: BusinessType | null,
  capitalOrDailyTarget?: number,
  bepMonths?: number,
  permanenceType: StallPermanenceType = "permanent",
) {
  if (!typeDef) return null;

  const activeInput =
    capitalOrDailyTarget && capitalOrDailyTarget > 0
      ? capitalOrDailyTarget
      : (DEFAULT_CAPITAL_BY_PERMANENCE[permanenceType] ??
        typeDef.default_capital);

  const activeBEP = bepMonths ?? typeDef.default_bep_months;

  const cycleRanges: MultiCycleRanges = calculateMultiCycleRanges(
    activeInput,
    activeBEP,
    {
      grossMarginRatio: typeDef.avg_gross_margin_ratio,
      rentToRevenueRatio: typeDef.industry_rent_to_revenue_ratio,
    },
    permanenceType,
  );

  return { ...typeDef, activeInput, activeBEP, cycleRanges };
}
