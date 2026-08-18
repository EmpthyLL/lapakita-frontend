import {
  DEFAULT_ASSUMED_CAPITAL,
  PaymentCycle,
} from "@/components/common/search/SearchConstants";

export interface CycleRange {
  minRent: number;
  maxRent: number;
  minDeposit: number;
  maxDeposit: number;
}

export type MultiCycleRanges = Record<PaymentCycle, CycleRange>;

/**
 * Persentase alokasi modal yang disanggupi untuk sewa per bulan.
 * - BEP Cepat (1-3 bln): Budget sewa bulanan harus MURAH (5% - 10% dari modal) agar tidak membebani operasional.
 * - BEP Lama (>12 bln): Budget sewa bulanan bisa LEBIH MAHAL (20% - 35% dari modal) karena modal diputar jangka panjang.
 */
export function getDynamicRentRatio(bepMonths: number): {
  minRatio: number;
  maxRatio: number;
} {
  const safeBep = Math.max(1, bepMonths);

  // 1-3 Bulan BEP: Harus murah per bulan agar cepat balik modal (5% - 10%)
  if (safeBep <= 3) return { minRatio: 0.05, maxRatio: 0.1 };

  // 4-6 Bulan BEP: Moderate (10% - 15%)
  if (safeBep <= 6) return { minRatio: 0.1, maxRatio: 0.15 };

  // 7-12 Bulan BEP: Standard (15% - 25%)
  if (safeBep <= 12) return { minRatio: 0.15, maxRatio: 0.25 };

  // > 12 Bulan BEP: Bisa sewa tempat lebih mahal / kelas atas (20% - 35%)
  return { minRatio: 0.2, maxRatio: 0.35 };
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

  // Biaya sewa bulanan dasar murni dari persentase alokasi modal
  const baseMonthlyMin = safeCapital * minRatio;
  const baseMonthlyMax = safeCapital * maxRatio;

  // Deposit murni dihitung dari 1x s/d 1.5x sewa bulanan dasar (dibayar sekali di awal, tanpa diskon)
  const minDeposit = roundToNearest50k(baseMonthlyMin * 1.0);
  const maxDeposit = roundToNearest50k(baseMonthlyMax * 1.5);

  // Konfigurasi Diskon Sewa Jangka Panjang (Hanya berlaku untuk nilai sewa nominal)
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

    // Total sewa nominal untuk periode tersebut (sudah termasuk diskon komitmen)
    const rawMinRent = baseMonthlyMin * months * discountMultiplier;
    const rawMaxRent = baseMonthlyMax * months * discountMultiplier;

    result[cycle] = {
      minRent: roundToNearest50k(rawMinRent),
      maxRent: roundToNearest50k(rawMaxRent),
      minDeposit, // Deposit konsisten untuk semua cycle
      maxDeposit,
    };
  });

  return result;
}

/**
 * Helper terpusat untuk menentukan [rentRange] & [depositRange] hasil kalkulasi.
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

  // Jika Payment Cycle belum dipilih, gunakan acuan bulanan (month)
  return {
    rentRange: [calculated.month.minRent, calculated.month.maxRent],
    depositRange: [calculated.month.minDeposit, calculated.month.maxDeposit],
  };
}
