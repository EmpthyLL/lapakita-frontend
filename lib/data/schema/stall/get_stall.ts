import {
  DEPOSIT_RANGE,
  FLOOR_COUNT_RANGE,
  GENERAL_RENT_RANGE,
  PaymentCycle,
  RADIUS_PRESETS,
  STALL_PLACEMENT_OPTIONS,
  STALL_PROPERTY_TYPES,
  STALL_SIZE_RANGE,
  StallPlacement,
  StallPropertyTypeValue,
} from "@/components/common/search/SearchConstants";
import z from "zod";

// Array nilai enum dari SearchConstants untuk validasi Zod
const PROPERTY_TYPE_VALUES = STALL_PROPERTY_TYPES.map((t) => t.value) as [
  StallPropertyTypeValue,
  ...StallPropertyTypeValue[],
];

const PLACEMENT_VALUES = STALL_PLACEMENT_OPTIONS.map((p) => p.value) as [
  StallPlacement,
  ...StallPlacement[],
];

// ─── 1. Landmark & Radius Schema ─────────────────────────────────────────────
export const landmarkRadiusEntrySchema = z.object({
  id: z.string(),
  landmark: z.string().nullable().optional(),
  radius: z.string().default(RADIUS_PRESETS[1]),
});

export type LandmarkRadiusEntryValue = z.infer<
  typeof landmarkRadiusEntrySchema
>;

// ─── 2. Full Search Filter Schema ────────────────────────────────────────────
export const stallSearchFilterSchema = z.object({
  // Main Bar
  location: z.string().optional().default(""),
  businessType: z.string().optional().default(""),

  // Mode Hero Specific
  singleLandmark: z.string().optional().default("any"),
  radius: z.string().optional().default(RADIUS_PRESETS[1]),

  // Space Filters (Left Sidebar)
  landmarkEntries: z
    .array(landmarkRadiusEntrySchema)
    .default([{ id: "default", landmark: null, radius: RADIUS_PRESETS[1] }]),
  propertyType: z.enum([...PROPERTY_TYPE_VALUES, ""]).default(""),
  placement: z.enum([...PLACEMENT_VALUES, ""]).default(""),
  floorCountRange: z
    .tuple([z.number(), z.number()])
    .default([FLOOR_COUNT_RANGE.min, FLOOR_COUNT_RANGE.min]),
  sizeRange: z
    .tuple([z.number(), z.number()])
    .default([STALL_SIZE_RANGE.min, STALL_SIZE_RANGE.max]),

  // Budget & ROI Filters (Right Sidebar)
  bepMonths: z.string().default("12"),
  customBepMonths: z.number().nullable().optional().default(null),
  capital: z.number().nonnegative().default(15000000),
  paymentCycle: z
    .enum(["month", "quarter", "semester", "year", ""])
    .default(""),
  rentRange: z
    .tuple([z.number(), z.number()])
    .default([GENERAL_RENT_RANGE.min, GENERAL_RENT_RANGE.max]),
  depositRange: z
    .tuple([z.number(), z.number()])
    .default([DEPOSIT_RANGE.min, DEPOSIT_RANGE.max]),

  // Terms & Facilities Filters (Right Sidebar)
  startDate: z.string().optional().default(""),
  customStartDay: z.string().optional().default(""),
  minLeasePeriod: z.string().optional().default(""),
  customLeaseMonths: z.string().optional().default(""),
  facilities: z.array(z.string()).default([]),
});

export type StallSearchFilterValues = z.infer<typeof stallSearchFilterSchema>;

// ─── 3. Clean Payload Output Schema (Siap dikirim ke API/URL Params) ─────────
export const stallSearchApiPayloadSchema = z.object({
  location: z.string().optional(),
  businessType: z.string().optional(),
  propertyType: z.enum(PROPERTY_TYPE_VALUES).optional(),
  placement: z.enum(PLACEMENT_VALUES).optional(),
  minFloors: z.number().optional(),
  maxFloors: z.number().optional(),
  minSize: z.number().optional(),
  maxSize: z.number().optional(),
  bepMonths: z.number().optional(),
  capital: z.number().optional(),
  paymentCycle: z.enum(["month", "quarter", "semester", "year"]).optional(),
  minRent: z.number().optional(),
  maxRent: z.number().optional(),
  minDeposit: z.number().optional(),
  maxDeposit: z.number().optional(),
  startDate: z.string().optional(),
  minLeasePeriod: z.string().optional(),
  facilities: z.array(z.string()).optional(),
  landmarks: z
    .array(
      z.object({
        name: z.string(),
        radiusKm: z.number(),
      }),
    )
    .optional(),
});

export type StallSearchApiPayload = z.infer<typeof stallSearchApiPayloadSchema>;

export interface StallLocationSummary {
  area: string; // e.g. "Margonda" or "Orchard"
  city: string; // e.g. "Depok" or "Central Singapore"
  countryCode?: string; // e.g. "ID", "SG"
}

export interface Stall {
  id: string;
  title: string;
  imageUrl: string;
  location: StallLocationSummary; // Lokasi ringkas khusus Card
  propertyType: StallPropertyTypeValue; // e.g. "mall-island", "shophouse"
  sizeSqm: number;
  cheapestPriceFormatted: string;
  cheapestPricePeriod: PaymentCycle; // "month" | "quarter" | "semester" | "year"
  rating: number;
  reviewCount: number;
}

export const MOCK_STALL_LIST: Stall[] = [
  {
    id: "stl_depok_mrg_001",
    title: "Kios Ground Floor Plaza Margonda - Main Corridor",
    imageUrl:
      "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600&h=400&fit=crop",
    location: {
      area: "Margonda",
      city: "Depok",
      countryCode: "ID",
    },
    propertyType: "mall-island",
    sizeSqm: 12,
    cheapestPriceFormatted: "Rp 2.500.000",
    cheapestPricePeriod: "month",
    rating: 4.8,
    reviewCount: 14,
  },
  {
    id: "stl_jkt_tah_002",
    title: "Lapak Busana Blok B Pasar Tanah Abang",
    imageUrl:
      "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=600&h=400&fit=crop",
    location: {
      area: "Tanah Abang",
      city: "Central Jakarta",
      countryCode: "ID",
    },
    propertyType: "traditional-market",
    sizeSqm: 8,
    cheapestPriceFormatted: "Rp 22.000.000",
    cheapestPricePeriod: "year",
    rating: 4.9,
    reviewCount: 28,
  },
  {
    id: "stl_bdg_dago_003",
    title: "Space Ruko Lantai 1 Akses Utama Kampus ITB Dago",
    imageUrl:
      "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&h=400&fit=crop",
    location: {
      area: "Dago",
      city: "Bandung",
      countryCode: "ID",
    },
    propertyType: "shophouse",
    sizeSqm: 36,
    cheapestPriceFormatted: "Rp 18.000.000",
    cheapestPricePeriod: "semester",
    rating: 4.7,
    reviewCount: 9,
  },
  {
    id: "stl_jks_psm_004",
    title: "Container Booth Street Food Kuliner Pasar Minggu",
    imageUrl:
      "https://images.unsplash.com/photo-1578916171728-46686eac8d58?w=600&h=400&fit=crop",
    location: {
      area: "Pasar Minggu",
      city: "South Jakarta",
      countryCode: "ID",
    },
    propertyType: "street-kiosk",
    sizeSqm: 6,
    cheapestPriceFormatted: "Rp 5.000.000",
    cheapestPricePeriod: "quarter",
    rating: 4.6,
    reviewCount: 19,
  },
  {
    id: "stl_sbr_sub_005",
    title: "Counter Food Court Area Utama Tunjungan Plaza",
    imageUrl:
      "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=600&h=400&fit=crop",
    location: {
      area: "Tunjungan",
      city: "Surabaya",
      countryCode: "ID",
    },
    propertyType: "food-court-counter",
    sizeSqm: 15,
    cheapestPriceFormatted: "Rp 5.500.000",
    cheapestPricePeriod: "month",
    rating: 5.0,
    reviewCount: 31,
  },
  {
    id: "stl_bks_tmr_006",
    title: "Kios Toko Sembako & Kelontong Kompleks Depsos",
    imageUrl:
      "https://images.unsplash.com/photo-1604719312566-8912e9227c6a?w=600&h=400&fit=crop",
    location: {
      area: "Bekasi Timur",
      city: "Bekasi",
      countryCode: "ID",
    },
    propertyType: "traditional-market",
    sizeSqm: 18,
    cheapestPriceFormatted: "Rp 2.200.000",
    cheapestPricePeriod: "month",
    rating: 4.5,
    reviewCount: 6,
  },
  {
    id: "stl_tng_bsd_007",
    title: "Outdoor Courtyard Spot Food Truck Breeze BSD",
    imageUrl:
      "https://images.unsplash.com/photo-1565123409695-7b5ef63a2efb?w=600&h=400&fit=crop",
    location: {
      area: "BSD City",
      city: "Tangerang Selatan",
      countryCode: "ID",
    },
    propertyType: "food-truck-spot",
    sizeSqm: 20,
    cheapestPriceFormatted: "Rp 3.000.000",
    cheapestPricePeriod: "month",
    rating: 4.8,
    reviewCount: 15,
  },
  {
    id: "stl_ygy_ugm_008",
    title: "Kios Garasi Komersial Jalan Kaliurang KM 5",
    imageUrl:
      "https://images.unsplash.com/photo-1521017432531-fbd92d768814?w=600&h=400&fit=crop",
    location: {
      area: "Jakal / UGM",
      city: "Sleman",
      countryCode: "ID",
    },
    propertyType: "garage-driveway",
    sizeSqm: 24,
    cheapestPriceFormatted: "Rp 7.500.000",
    cheapestPricePeriod: "quarter",
    rating: 4.9,
    reviewCount: 22,
  },
];
