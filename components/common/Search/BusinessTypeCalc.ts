import {
  DEFAULT_ASSUMED_CAPITAL,
  PaymentCycle,
} from "@/components/common/search/SearchConstants";

// Baseline modal default yang lebih realistis untuk pasar usaha komersial

export interface CycleRange {
  minRent: number;
  maxRent: number;
  minDeposit: number;
  maxDeposit: number;
}

export type MultiCycleRanges = Record<PaymentCycle, CycleRange>;

/**
 * Rasio alokasi biaya sewa terhadap modal yang disesuaikan dengan realitas UMKM (15% - 40%).
 */
export function getDynamicRentRatio(bepMonths: number): {
  minRatio: number;
  maxRatio: number;
} {
  const safeBep = Math.max(1, bepMonths);

  // 1-3 Bulan BEP: Tight Allocation (15% - 25% modal)
  if (safeBep <= 3) return { minRatio: 0.15, maxRatio: 0.25 };

  // 4-6 Bulan BEP: Moderate Allocation (20% - 30% modal)
  if (safeBep <= 6) return { minRatio: 0.2, maxRatio: 0.3 };

  // 7-12 Bulan BEP: Standard Allocation (25% - 35% modal)
  if (safeBep <= 12) return { minRatio: 0.25, maxRatio: 0.35 };

  // > 12 Bulan BEP: Expansion Allocation (30% - 40% modal)
  return { minRatio: 0.3, maxRatio: 0.4 };
}

// Helper pembulatan ke kelipatan Rp 50.000 terdekat agar angka di UI rapi
function roundToNearest50k(val: number): number {
  return Math.round(val / 50_000) * 50_000;
}

export function calculateMultiCycleRanges(
  capital: number,
  bepMonths: number,
): MultiCycleRanges {
  const safeCapital = capital > 0 ? capital : DEFAULT_ASSUMED_CAPITAL;
  const safeBep = bepMonths > 0 ? bepMonths : 6;

  const { minRatio, maxRatio } = getDynamicRentRatio(safeBep);

  // Alokasi sewa bulanan dasar
  const baseMonthlyMin = (safeCapital * minRatio) / safeBep;
  const baseMonthlyMax = (safeCapital * maxRatio) / safeBep;

  // Faktor Pengali Siklus + Diskon Sewa Jangka Panjang (Bulk Lease Discount)
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

  (Object.keys(cycleConfig) as PaymentCycle[]).forEach((cycle) => {
    const { months, discount } = cycleConfig[cycle];
    const discountMultiplier = 1 - discount;

    const rawMinRent = baseMonthlyMin * months * discountMultiplier;
    const rawMaxRent = baseMonthlyMax * months * discountMultiplier;

    const minRent = roundToNearest50k(rawMinRent);
    const maxRent = roundToNearest50k(rawMaxRent);

    // Deposit Security (1x dari nilai sewa bulanan setara)
    const singleMonthEquivalentMin = minRent / months;
    const singleMonthEquivalentMax = maxRent / months;

    const minDeposit = roundToNearest50k(singleMonthEquivalentMin * 1.0);
    const maxDeposit = roundToNearest50k(singleMonthEquivalentMax * 1.5);

    result[cycle] = {
      minRent,
      maxRent,
      minDeposit,
      maxDeposit,
    };
  });

  return result;
}

/**
 * Helper terpusat untuk menentukan [rentRange] & [depositRange] hasil kalkulasi.
 * Dipanggil dari luar komponen UI filter.
 */
export function getCalculatedRangesForFilters(
  capital: number,
  bepMonths: number | string,
  customBepMonths: number | null,
  paymentCycle: PaymentCycle | "",
): {
  rentRange: [number, number];
  depositRange: [number, number];
} {
  const activeBep =
    bepMonths === "custom" ? (customBepMonths ?? 6) : Number(bepMonths) || 6;

  const calculated = calculateMultiCycleRanges(capital, activeBep);

  if (paymentCycle && calculated[paymentCycle]) {
    const data = calculated[paymentCycle];
    return {
      rentRange: [data.minRent, data.maxRent],
      depositRange: [data.minDeposit, data.maxDeposit],
    };
  }

  // Jika Payment Cycle kosong (""), gunakan range bulanan (month) sebagai acuan visual default
  return {
    rentRange: [calculated.month.minRent, calculated.month.maxRent],
    depositRange: [calculated.month.minDeposit, calculated.month.maxDeposit],
  };
}
