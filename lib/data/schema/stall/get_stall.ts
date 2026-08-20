import {
  PaymentCycle,
  StallPropertyTypeValue,
} from "@/components/common/search/constants/types";
import z from "zod";

/* ─── 1. DISCRIMINATED INTERFACES FOR STALL ENTITY ─── */

export interface StallLocationSummary {
  area: string;
  city: string;
  countryCode: string;
}

export interface BaseStall {
  id: string;
  title: string;
  imageUrl: string;
  location: StallLocationSummary;
  propertyType: StallPropertyTypeValue;
  cheapestPriceFormatted: string;
  cheapestPricePeriod: PaymentCycle;
  rating: number;
  reviewCount: number;
}

// 1. Permanent: Fokus pada Ruang & Fisik Bangunan Mandiri
export interface PermanentStall extends BaseStall {
  permanenceType: "permanent";
  space: {
    sizeSqm: number;
    floorCount: number;
  };
}

// 2. Semi-Permanent: Terikat Jam Operasional Kompleks/Gedung Induk
export interface SemiPermanentStall extends BaseStall {
  permanenceType: "semi-permanent";
  operatingHours: {
    open: string; // e.g. "10:00"
    close: string; // e.g. "22:00"
  };
}

// 3. Temporary: Terikat Jadwal Event & Window Pendaftaran
export interface TemporaryStall extends BaseStall {
  permanenceType: "temporary";
  event: {
    registrationDeadlineDays: number; // Deadline pendaftaran (H-X)
    durationDays: number; // Durasi event berlangsung
  };
}

// Union Type Utama untuk Entity Lapak
export type Stall = PermanentStall | SemiPermanentStall | TemporaryStall;

/* ─── 2. SEARCH FILTER VALIDATOR SCHEMA (Sederhana & Ringkas) ─── */

export const stallSearchFilterSchema = z.object({
  location: z.string().optional().default(""),
  businessType: z.string().optional().default(""),
  permanenceType: z.string().optional().default(""),
  propertyType: z.string().optional().default(""),
  placement: z.string().optional().default(""),
  capital: z.number().optional().default(15000000),
  paymentCycle: z.string().optional().default(""),
  rentRange: z.tuple([z.number(), z.number()]).optional(),
  depositRange: z.tuple([z.number(), z.number()]).optional(),
  facilities: z.array(z.string()).optional().default([]),
  landmarkEntries: z
    .array(
      z.object({
        id: z.string(),
        landmark: z.string().nullable().optional(),
        radius: z.string().optional(),
      }),
    )
    .optional()
    .default([]),
});

export type StallSearchFilterValues = z.infer<typeof stallSearchFilterSchema>;

/* ─── 3. MASTER MOCK STALL LIST (Di-keep & Ditambah) ─── */

export const MOCK_STALL_LIST: Stall[] = [
  // ── 1. PERMANENT STALLS (Ada `space`: size & floor) ──
  {
    id: "stl_bdg_dago_001",
    title: "Ruko Dago Commercial Space - Ground Floor Main Road",
    imageUrl:
      "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&h=400&fit=crop",
    location: { area: "Dago", city: "Bandung", countryCode: "ID" },
    propertyType: "shophouse",
    permanenceType: "permanent",
    space: { sizeSqm: 45, floorCount: 1 },
    cheapestPriceFormatted: "Rp 7.500.000",
    cheapestPricePeriod: "month",
    rating: 4.9,
    reviewCount: 22,
  },
  {
    id: "stl_ygy_ugm_002",
    title: "Kios Garasi Komersial Jalan Kaliurang KM 5",
    imageUrl:
      "https://images.unsplash.com/photo-1521017432531-fbd92d768814?w=600&h=400&fit=crop",
    location: { area: "Jakal / UGM", city: "Sleman", countryCode: "ID" },
    propertyType: "garage-driveway",
    permanenceType: "permanent",
    space: { sizeSqm: 24, floorCount: 1 },
    cheapestPriceFormatted: "Rp 2.500.000",
    cheapestPricePeriod: "month",
    rating: 4.9,
    reviewCount: 19,
  },
  {
    id: "stl_jks_psm_003",
    title: "Container Kiosk Hook Jalan Raya Pasar Minggu",
    imageUrl:
      "https://images.unsplash.com/photo-1578916171728-46686eac8d58?w=600&h=400&fit=crop",
    location: {
      area: "Pasar Minggu",
      city: "Jakarta Selatan",
      countryCode: "ID",
    },
    propertyType: "street-kiosk",
    permanenceType: "permanent",
    space: { sizeSqm: 8, floorCount: 1 },
    cheapestPriceFormatted: "Rp 1.800.000",
    cheapestPricePeriod: "month",
    rating: 4.6,
    reviewCount: 15,
  },
  {
    id: "stl_mdn_stb_004",
    title: "Ruko Strategis Korridor Komersial Setiabudi Medan",
    imageUrl:
      "https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&h=400&fit=crop",
    location: { area: "Setiabudi", city: "Medan", countryCode: "ID" },
    propertyType: "shophouse",
    permanenceType: "permanent",
    space: { sizeSqm: 120, floorCount: 2 },
    cheapestPriceFormatted: "Rp 50.000.000",
    cheapestPricePeriod: "year",
    rating: 4.8,
    reviewCount: 11,
  },
  {
    id: "stl_dps_cng_005",
    title: "Converted Garage Cafe Space Main Street Canggu",
    imageUrl:
      "https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=600&h=400&fit=crop",
    location: { area: "Canggu", city: "Badung / Bali", countryCode: "ID" },
    propertyType: "garage-driveway",
    permanenceType: "permanent",
    space: { sizeSqm: 32, floorCount: 1 },
    cheapestPriceFormatted: "Rp 12.000.000",
    cheapestPricePeriod: "month",
    rating: 5.0,
    reviewCount: 34,
  },
  {
    id: "stl_mrg_kda_017",
    title: "Ruko Komersial 3 Lantai Utama Margonda Raya Depok",
    imageUrl:
      "https://images.unsplash.com/photo-1582037928769-181f2644ecb7?w=600&h=400&fit=crop",
    location: { area: "Margonda", city: "Depok", countryCode: "ID" },
    propertyType: "shophouse",
    permanenceType: "permanent",
    space: { sizeSqm: 150, floorCount: 3 },
    cheapestPriceFormatted: "Rp 85.000.000",
    cheapestPricePeriod: "year",
    rating: 4.9,
    reviewCount: 16,
  },

  // ── 2. SEMI-PERMANENT STALLS (Ada `operatingHours`: open & close) ──
  {
    id: "stl_depok_mrg_006",
    title: "Kios Ground Floor Plaza Margonda - Main Corridor",
    imageUrl:
      "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600&h=400&fit=crop",
    location: { area: "Margonda", city: "Depok", countryCode: "ID" },
    propertyType: "mall-island",
    permanenceType: "semi-permanent",
    operatingHours: { open: "10:00", close: "22:00" },
    cheapestPriceFormatted: "Rp 3.500.000",
    cheapestPricePeriod: "month",
    rating: 4.8,
    reviewCount: 14,
  },
  {
    id: "stl_jkt_tah_007",
    title: "Lapak Busana Blok B Pasar Tanah Abang",
    imageUrl:
      "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=600&h=400&fit=crop",
    location: { area: "Tanah Abang", city: "Jakarta Pusat", countryCode: "ID" },
    propertyType: "traditional-market-shop",
    permanenceType: "semi-permanent",
    operatingHours: { open: "08:00", close: "16:00" },
    cheapestPriceFormatted: "Rp 22.000.000",
    cheapestPricePeriod: "year",
    rating: 4.9,
    reviewCount: 28,
  },
  {
    id: "stl_sbr_sub_008",
    title: "Counter Food Court Area Utama Tunjungan Plaza",
    imageUrl:
      "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=600&h=400&fit=crop",
    location: { area: "Tunjungan", city: "Surabaya", countryCode: "ID" },
    propertyType: "food-court-counter",
    permanenceType: "semi-permanent",
    operatingHours: { open: "10:00", close: "22:00" },
    cheapestPriceFormatted: "Rp 5.500.000",
    cheapestPricePeriod: "month",
    rating: 5.0,
    reviewCount: 31,
  },
  {
    id: "stl_smg_pnd_009",
    title: "Los Pasar Sayur & Buah Basah Pasar Johar",
    imageUrl:
      "https://images.unsplash.com/photo-1604719312566-8912e9227c6a?w=600&h=400&fit=crop",
    location: { area: "Johar", city: "Semarang", countryCode: "ID" },
    propertyType: "open-market-stall",
    permanenceType: "semi-permanent",
    operatingHours: { open: "03:00", close: "12:00" },
    cheapestPriceFormatted: "Rp 800.000",
    cheapestPricePeriod: "month",
    rating: 4.5,
    reviewCount: 8,
  },
  {
    id: "stl_bks_tmr_010",
    title: "Kios Toko Sembako & Kelontong Kompleks Pasar Baru",
    imageUrl:
      "https://images.unsplash.com/photo-1578916171728-46686eac8d58?w=600&h=400&fit=crop",
    location: { area: "Bekasi Timur", city: "Bekasi", countryCode: "ID" },
    propertyType: "traditional-market-shop",
    permanenceType: "semi-permanent",
    operatingHours: { open: "06:00", close: "18:00" },
    cheapestPriceFormatted: "Rp 2.200.000",
    cheapestPricePeriod: "month",
    rating: 4.5,
    reviewCount: 6,
  },
  {
    id: "stl_jkt_cll_011",
    title: "Island Corridor Kiosk Central Park Mall GF",
    imageUrl:
      "https://images.unsplash.com/photo-1567449303078-57ad995bd301?w=600&h=400&fit=crop",
    location: { area: "Grogol", city: "Jakarta Barat", countryCode: "ID" },
    propertyType: "mall-island",
    permanenceType: "semi-permanent",
    operatingHours: { open: "10:00", close: "22:00" },
    cheapestPriceFormatted: "Rp 8.000.000",
    cheapestPricePeriod: "month",
    rating: 4.9,
    reviewCount: 42,
  },
  {
    id: "stl_bdg_paskal_018",
    title: "Food Court Stall 23 Paskal Hyper Square Food Market",
    imageUrl:
      "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600&h=400&fit=crop",
    location: { area: "Pasirkaliki", city: "Bandung", countryCode: "ID" },
    propertyType: "food-court-counter",
    permanenceType: "semi-permanent",
    operatingHours: { open: "11:00", close: "23:00" },
    cheapestPriceFormatted: "Rp 4.800.000",
    cheapestPricePeriod: "month",
    rating: 4.8,
    reviewCount: 20,
  },

  // ── 3. TEMPORARY STALLS (Ada `event`: registrationDeadline & duration) ──
  {
    id: "stl_tng_bsd_012",
    title: "Outdoor Courtyard Spot Food Truck Breeze BSD (Kontrak Bulanan)",
    imageUrl:
      "https://images.unsplash.com/photo-1565123409695-7b5ef63a2efb?w=600&h=400&fit=crop",
    location: {
      area: "BSD City",
      city: "Tangerang Selatan",
      countryCode: "ID",
    },
    propertyType: "food-truck-spot",
    permanenceType: "temporary",
    event: { registrationDeadlineDays: 5, durationDays: 90 }, // Event/spot 3 bulan
    cheapestPriceFormatted: "Rp 3.000.000",
    cheapestPricePeriod: "month", // Sewa Bulanan
    rating: 4.8,
    reviewCount: 15,
  },
  {
    id: "stl_jkt_sny_013",
    title: "Pop-Up Booth A-12 Festival Ramadan Senayan",
    imageUrl:
      "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600&h=400&fit=crop",
    location: { area: "Senayan", city: "Jakarta Pusat", countryCode: "ID" },
    propertyType: "bazaar-booth",
    permanenceType: "temporary",
    event: { registrationDeadlineDays: 7, durationDays: 14 }, // Event 2 Minggu
    cheapestPriceFormatted: "Rp 250.000",
    cheapestPricePeriod: "day", // Sewa Harian
    rating: 4.7,
    reviewCount: 9,
  },
  {
    id: "stl_bdg_sri_014",
    title: "Street Vendor Spot Lapak Kakilima Kuliner Saparua",
    imageUrl:
      "https://images.unsplash.com/photo-1509315811355-57bd3b77a155?w=600&h=400&fit=crop",
    location: { area: "Saparua", city: "Bandung", countryCode: "ID" },
    propertyType: "street-vendor-spot",
    permanenceType: "temporary",
    event: { registrationDeadlineDays: 2, durationDays: 30 },
    cheapestPriceFormatted: "Rp 45.000",
    cheapestPricePeriod: "day", // Sewa Harian
    rating: 4.4,
    reviewCount: 12,
  },
  {
    id: "stl_sbr_fbr_015",
    title: "Bazaar Exhibition Booth Grand City Convex Surabaya",
    imageUrl:
      "https://images.unsplash.com/photo-1511578314322-379afb476865?w=600&h=400&fit=crop",
    location: { area: "Gubeng", city: "Surabaya", countryCode: "ID" },
    propertyType: "bazaar-booth",
    permanenceType: "temporary",
    event: { registrationDeadlineDays: 5, durationDays: 3 },
    cheapestPriceFormatted: "Rp 350.000",
    cheapestPricePeriod: "day", // Sewa booth pameran harian
    rating: 4.9,
    reviewCount: 18,
  },
  {
    id: "stl_ygy_mly_016",
    title: "Spot Lapak Temporary Tenda Kuliner Malam Malioboro",
    imageUrl:
      "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&h=400&fit=crop",
    location: { area: "Malioboro", city: "Yogyakarta", countryCode: "ID" },
    propertyType: "street-vendor-spot",
    permanenceType: "temporary",
    event: { registrationDeadlineDays: 3, durationDays: 30 },
    cheapestPriceFormatted: "Rp 50.000",
    cheapestPricePeriod: "day", // Lapak kuliner malam harian
    rating: 4.7,
    reviewCount: 25,
  },
  {
    id: "stl_jkt_jipexpo_019",
    title: "Booth Hall B Jakarta Fair PRJ Kemayoran (1 Bulan Full)",
    imageUrl:
      "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&h=400&fit=crop",
    location: { area: "Kemayoran", city: "Jakarta Pusat", countryCode: "ID" },
    propertyType: "bazaar-booth",
    permanenceType: "temporary",
    event: { registrationDeadlineDays: 14, durationDays: 30 }, // Event 1 Bulan
    cheapestPriceFormatted: "Rp 12.500.000",
    cheapestPricePeriod: "month", // Sewa Paket Bulanan Event
    rating: 5.0,
    reviewCount: 52,
  },
];
