import {
  DEPOSIT_RANGE,
  FLOOR_COUNT_RANGE,
  GENERAL_RENT_RANGE,
  LandmarkCategoryValue,
  PaymentCycle,
  RADIUS_PRESETS,
  STALL_PLACEMENT_OPTIONS,
  STALL_PROPERTY_TYPES,
  STALL_SIZE_RANGE,
  StallPermanenceType,
  StallPlacement,
  StallPropertyTypeValue,
} from "@/components/common/search/util/SearchConstants";
import z from "zod";

// Array Enum values untuk validasi Zod
const PROPERTY_TYPE_VALUES = STALL_PROPERTY_TYPES.map((t) => t.value) as [
  StallPropertyTypeValue,
  ...StallPropertyTypeValue[],
];

const PLACEMENT_VALUES = STALL_PLACEMENT_OPTIONS.map((p) => p.value) as [
  StallPlacement,
  ...StallPlacement[],
];

const PERMANENCE_VALUES: [StallPermanenceType, ...StallPermanenceType[]] = [
  "permanent",
  "semi-permanent",
  "temporary",
];

const PAYMENT_CYCLE_VALUES: [PaymentCycle, ...PaymentCycle[]] = [
  "month",
  "quarter",
  "semester",
  "year",
];

/* ─── 1. Sub-Schemas ────────────────────────────────────────────────────────── */

export const landmarkRadiusEntrySchema = z.object({
  id: z.string(),
  landmark: z.string().nullable().optional(),
  radius: z.string().default(RADIUS_PRESETS[1]),
});

export type LandmarkRadiusEntryValue = z.infer<
  typeof landmarkRadiusEntrySchema
>;

export const stallLocationSummarySchema = z.object({
  area: z.string(),
  city: z.string(),
  countryCode: z.string().default("ID"),
});

export type StallLocationSummary = z.infer<typeof stallLocationSummarySchema>;

export const nearbyLandmarkSchema = z.object({
  categoryValue: z.string() as z.ZodType<LandmarkCategoryValue>,
  name: z.string(),
  distanceKm: z.number().positive(),
});

export type NearbyLandmark = z.infer<typeof nearbyLandmarkSchema>;

export const ownerProfileSummarySchema = z.object({
  id: z.string(),
  name: z.string(),
  contact: z.string(),
  avatarUrl: z.string().url(),
  rating: z.number().min(0).max(5),
  reviewCount: z.number().int().nonnegative(),
  joinedYear: z.string(),
});

export type OwnerProfileSummary = z.infer<typeof ownerProfileSummarySchema>;

/* ─── 2. Filter Form Schema (UI Inputs) ─────────────────────────────────────── */

export const stallSearchFilterSchema = z.object({
  location: z.string().optional().default(""),
  businessType: z.string().optional().default(""),
  permanenceType: z
    .enum([...PERMANENCE_VALUES, ""])
    .optional()
    .default(""),
  propertyType: z
    .enum([...PROPERTY_TYPE_VALUES, ""])
    .optional()
    .default(""),
  placement: z
    .enum([...PLACEMENT_VALUES, ""])
    .optional()
    .default(""),
  sizeRange: z
    .tuple([z.number(), z.number()])
    .default([STALL_SIZE_RANGE.min, STALL_SIZE_RANGE.max]),
  floorCountRange: z
    .tuple([z.number(), z.number()])
    .default([FLOOR_COUNT_RANGE.min, FLOOR_COUNT_RANGE.min]),
  capital: z.number().nonnegative().default(15000000),
  paymentCycle: z
    .enum([...PAYMENT_CYCLE_VALUES, ""])
    .optional()
    .default(""),
  rentRange: z
    .tuple([z.number(), z.number()])
    .default([GENERAL_RENT_RANGE.min, GENERAL_RENT_RANGE.max]),
  depositRange: z
    .tuple([z.number(), z.number()])
    .default([DEPOSIT_RANGE.min, DEPOSIT_RANGE.max]),
  facilities: z.array(z.string()).default([]),
  landmarkEntries: z
    .array(landmarkRadiusEntrySchema)
    .default([{ id: "default", landmark: null, radius: RADIUS_PRESETS[1] }]),
});

export type StallSearchFilterValues = z.infer<typeof stallSearchFilterSchema>;

/* ─── 3. Clean API Payload Output Schema ────────────────────────────────────── */

export const stallSearchApiPayloadSchema = z.object({
  location: z.string().optional(),
  businessType: z.string().optional(),
  permanenceType: z.enum(PERMANENCE_VALUES).optional(),
  propertyType: z.enum(PROPERTY_TYPE_VALUES).optional(),
  placement: z.enum(PLACEMENT_VALUES).optional(),
  minFloors: z.number().optional(),
  maxFloors: z.number().optional(),
  minSize: z.number().optional(),
  maxSize: z.number().optional(),
  capital: z.number().optional(),
  paymentCycle: z.enum(PAYMENT_CYCLE_VALUES).optional(),
  minRent: z.number().optional(),
  maxRent: z.number().optional(),
  minDeposit: z.number().optional(),
  maxDeposit: z.number().optional(),
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

/* ─── 4. Stall Card Listing Entity Schema ──────────────────────────────────── */

export const stallCardSchema = z.object({
  id: z.string(),
  title: z.string(),
  imageUrl: z.string().url(),
  location: stallLocationSummarySchema,
  propertyType: z.enum(PROPERTY_TYPE_VALUES),
  permanenceType: z.enum(PERMANENCE_VALUES),
  sizeSqm: z.number().positive(),
  cheapestPriceFormatted: z.string(),
  cheapestPricePeriod: z.enum(PAYMENT_CYCLE_VALUES),
  rating: z.number().min(0).max(5),
  reviewCount: z.number().int().nonnegative(),
});

export type Stall = z.infer<typeof stallCardSchema>;

export const MOCK_STALL_LIST: Stall[] = [
  // ── PERMANENT / INDEPENDENT (MANDIRI) ──
  {
    id: "stl_bdg_dago_001",
    title: "Ruko Dago Commercial Space - Ground Floor Main Road",
    imageUrl:
      "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&h=400&fit=crop",
    location: { area: "Dago", city: "Bandung", countryCode: "ID" },
    propertyType: "shophouse",
    permanenceType: "permanent",
    sizeSqm: 45,
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
    sizeSqm: 24,
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
    sizeSqm: 8,
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
    sizeSqm: 60,
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
    sizeSqm: 32,
    cheapestPriceFormatted: "Rp 12.000.000",
    cheapestPricePeriod: "month",
    rating: 5.0,
    reviewCount: 34,
  },

  // ── SEMI-PERMANENT / MANAGED COMPLEX (TERIKAT JAM INDUK) ──
  {
    id: "stl_depok_mrg_006",
    title: "Kios Ground Floor Plaza Margonda - Main Corridor",
    imageUrl:
      "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600&h=400&fit=crop",
    location: { area: "Margonda", city: "Depok", countryCode: "ID" },
    propertyType: "mall-island",
    permanenceType: "semi-permanent",
    sizeSqm: 12,
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
    sizeSqm: 8,
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
    sizeSqm: 15,
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
    sizeSqm: 6,
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
    sizeSqm: 18,
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
    sizeSqm: 10,
    cheapestPriceFormatted: "Rp 8.000.000",
    cheapestPricePeriod: "month",
    rating: 4.9,
    reviewCount: 42,
  },

  // ── TEMPORARY / POP-UP EVENT (EVENT SHORT-TERM) ──
  {
    id: "stl_tng_bsd_012",
    title: "Outdoor Courtyard Spot Food Truck Breeze BSD",
    imageUrl:
      "https://images.unsplash.com/photo-1565123409695-7b5ef63a2efb?w=600&h=400&fit=crop",
    location: {
      area: "BSD City",
      city: "Tangerang Selatan",
      countryCode: "ID",
    },
    propertyType: "food-truck-spot",
    permanenceType: "temporary",
    sizeSqm: 20,
    cheapestPriceFormatted: "Rp 3.000.000",
    cheapestPricePeriod: "month",
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
    sizeSqm: 9,
    cheapestPriceFormatted: "Rp 2.500.000",
    cheapestPricePeriod: "month",
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
    sizeSqm: 6,
    cheapestPriceFormatted: "Rp 600.000",
    cheapestPricePeriod: "month",
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
    sizeSqm: 12,
    cheapestPriceFormatted: "Rp 4.000.000",
    cheapestPricePeriod: "month",
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
    sizeSqm: 8,
    cheapestPriceFormatted: "Rp 1.200.000",
    cheapestPricePeriod: "month",
    rating: 4.7,
    reviewCount: 25,
  },
];
