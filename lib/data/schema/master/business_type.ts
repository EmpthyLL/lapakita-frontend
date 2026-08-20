import {
  calculateMultiCycleRanges,
  MultiCycleRanges,
} from "@/components/common/search/util/BusinessTypeCalc";
import {
  FacilityValue,
  LandmarkCategoryValue,
  StallPermanenceType,
  StallPlacement,
  StallPropertyTypeValue,
} from "@/components/common/search/util/SearchConstants";

/* ─── 1. DISCRIMINATED PRESET CONFIGURATIONS ─── */

export interface BasePresetConfig {
  allowedPropertyTypes: StallPropertyTypeValue[];
  allowedPlacements: StallPlacement[];
  defaultPlacement: StallPlacement;
  facilities: FacilityValue[];
}

export interface PermanentPresetConfig extends BasePresetConfig {
  recommendedSizeSqm: { min: number; max: number };
  recommendedFloors: { min: number; max: number };
}

export interface SemiPermanentPresetConfig extends BasePresetConfig {
  defaultOpeningTime: string; // e.g. "10:00"
  defaultClosingTime: string; // e.g. "22:00"
}

export interface TemporaryPresetConfig extends BasePresetConfig {
  registrationWindowDaysBefore: number;
  typicalDurationDays: number;
}

export interface PermanencePresetsMap {
  permanent?: PermanentPresetConfig;
  "semi-permanent"?: SemiPermanentPresetConfig;
  temporary?: TemporaryPresetConfig;
}

export interface BusinessType {
  id: string;
  label: string;
  group: string; // Langsung menjadi properti string pada BusinessType

  // Baseline Financial Defaults
  defaultBEPMonths: number;
  defaultCapital: number;

  // Financial Feasibility Benchmarks
  avgGrossMarginRatio: number;
  industryRentToRevenueRatio: number;

  // Presets Per Permanence Tab
  permanencePresets: PermanencePresetsMap;

  // Target Location Tags
  landmarks: LandmarkCategoryValue[];
}

/* ─── 2. MASTER DATA (Flat Array) ─── */

export const BUSINESS_TYPES: BusinessType[] = [
  // F&B (Food & Beverages)
  {
    id: "bt_001",
    label: "Full-Service Restaurant",
    group: "F&B (Food & Beverages)",
    defaultBEPMonths: 12,
    defaultCapital: 60_000_000,
    avgGrossMarginRatio: 0.5,
    industryRentToRevenueRatio: 0.15,
    landmarks: ["office", "market", "residential", "culinary-center"],
    permanencePresets: {
      permanent: {
        allowedPropertyTypes: ["shophouse", "garage-driveway", "street-kiosk"],
        allowedPlacements: ["indoor", "semi-outdoor"],
        defaultPlacement: "indoor",
        recommendedSizeSqm: { min: 40, max: 120 },
        recommendedFloors: { min: 1, max: 2 },
        facilities: [
          "power",
          "high-power",
          "water",
          "drainage",
          "grease-trap",
          "ventilation",
          "air-conditioner",
          "seating",
          "toilet",
          "parking",
          "trash-area",
        ],
      },
      "semi-permanent": {
        allowedPropertyTypes: ["mall-shop", "food-court-counter"],
        allowedPlacements: ["indoor", "semi-outdoor"],
        defaultPlacement: "indoor",
        defaultOpeningTime: "10:00",
        defaultClosingTime: "22:00",
        facilities: [
          "power",
          "high-power",
          "water",
          "drainage",
          "grease-trap",
          "ventilation",
          "air-conditioner",
          "seating",
          "toilet",
          "parking",
          "trash-area",
          "cleaning-service",
        ],
      },
    },
  },
  {
    id: "bt_002",
    label: "Coffee Shop & Cafe",
    group: "F&B (Food & Beverages)",
    defaultBEPMonths: 9,
    defaultCapital: 35_000_000,
    avgGrossMarginRatio: 0.7,
    industryRentToRevenueRatio: 0.18,
    landmarks: ["office", "campus", "residential", "transit-station"],
    permanencePresets: {
      permanent: {
        allowedPropertyTypes: ["shophouse", "garage-driveway", "street-kiosk"],
        allowedPlacements: ["indoor", "semi-outdoor", "outdoor"],
        defaultPlacement: "indoor",
        recommendedSizeSqm: { min: 20, max: 60 },
        recommendedFloors: { min: 1, max: 2 },
        facilities: [
          "power",
          "high-power",
          "water",
          "drainage",
          "ventilation",
          "wifi",
          "seating",
          "toilet",
          "parking",
        ],
      },
      "semi-permanent": {
        allowedPropertyTypes: [
          "mall-shop",
          "mall-island",
          "food-court-counter",
        ],
        allowedPlacements: ["indoor", "semi-outdoor"],
        defaultPlacement: "indoor",
        defaultOpeningTime: "10:00",
        defaultClosingTime: "22:00",
        facilities: [
          "power",
          "high-power",
          "water",
          "drainage",
          "wifi",
          "seating",
          "trash-area",
        ],
      },
      temporary: {
        allowedPropertyTypes: [
          "bazaar-booth",
          "food-truck-spot",
          "street-vendor-spot",
        ],
        allowedPlacements: ["semi-outdoor", "outdoor"],
        defaultPlacement: "outdoor",
        registrationWindowDaysBefore: 7,
        typicalDurationDays: 3,
        facilities: ["power", "water", "trash-area", "seating"],
      },
    },
  },
  {
    id: "bt_003",
    label: "Bakery & Pastry Shop",
    group: "F&B (Food & Beverages)",
    defaultBEPMonths: 9,
    defaultCapital: 30_000_000,
    avgGrossMarginRatio: 0.55,
    industryRentToRevenueRatio: 0.15,
    landmarks: ["residential", "school", "market", "transit-station"],
    permanencePresets: {
      permanent: {
        allowedPropertyTypes: ["shophouse", "garage-driveway", "street-kiosk"],
        allowedPlacements: ["indoor"],
        defaultPlacement: "indoor",
        recommendedSizeSqm: { min: 15, max: 40 },
        recommendedFloors: { min: 1, max: 1 },
        facilities: [
          "power",
          "high-power",
          "water",
          "ventilation",
          "air-conditioner",
          "storage",
          "display-case",
          "toilet",
        ],
      },
      "semi-permanent": {
        allowedPropertyTypes: [
          "mall-shop",
          "mall-island",
          "traditional-market-shop",
        ],
        allowedPlacements: ["indoor", "semi-outdoor"],
        defaultPlacement: "indoor",
        defaultOpeningTime: "08:00",
        defaultClosingTime: "21:00",
        facilities: ["power", "display-case", "trash-area"],
      },
      temporary: {
        allowedPropertyTypes: ["bazaar-booth"],
        allowedPlacements: ["indoor", "semi-outdoor"],
        defaultPlacement: "indoor",
        registrationWindowDaysBefore: 5,
        typicalDurationDays: 3,
        facilities: ["power", "display-case", "trash-area"],
      },
    },
  },
  {
    id: "bt_004",
    label: "Quick-Service / Fast Food",
    group: "F&B (Food & Beverages)",
    defaultBEPMonths: 8,
    defaultCapital: 25_000_000,
    avgGrossMarginRatio: 0.5,
    industryRentToRevenueRatio: 0.15,
    landmarks: ["campus", "office", "market", "culinary-center"],
    permanencePresets: {
      permanent: {
        allowedPropertyTypes: ["shophouse", "street-kiosk", "garage-driveway"],
        allowedPlacements: ["indoor", "semi-outdoor"],
        defaultPlacement: "semi-outdoor",
        recommendedSizeSqm: { min: 15, max: 35 },
        recommendedFloors: { min: 1, max: 1 },
        facilities: [
          "power",
          "water",
          "drainage",
          "grease-trap",
          "ventilation",
          "trash-area",
          "parking",
        ],
      },
      "semi-permanent": {
        allowedPropertyTypes: [
          "food-court-counter",
          "mall-island",
          "traditional-market-shop",
        ],
        allowedPlacements: ["indoor", "semi-outdoor"],
        defaultPlacement: "semi-outdoor",
        defaultOpeningTime: "10:00",
        defaultClosingTime: "22:00",
        facilities: ["power", "water", "drainage", "trash-area"],
      },
      temporary: {
        allowedPropertyTypes: ["bazaar-booth", "street-vendor-spot"],
        allowedPlacements: ["semi-outdoor", "outdoor"],
        defaultPlacement: "outdoor",
        registrationWindowDaysBefore: 5,
        typicalDurationDays: 3,
        facilities: ["power", "water", "trash-area"],
      },
    },
  },
  {
    id: "bt_005",
    label: "Beverage & Snack Kiosk",
    group: "F&B (Food & Beverages)",
    defaultBEPMonths: 4,
    defaultCapital: 10_000_000,
    avgGrossMarginRatio: 0.65,
    industryRentToRevenueRatio: 0.16,
    landmarks: [
      "campus",
      "school",
      "residential",
      "transit-station",
      "transit-bus",
    ],
    permanencePresets: {
      permanent: {
        allowedPropertyTypes: ["street-kiosk", "garage-driveway"],
        allowedPlacements: ["semi-outdoor", "outdoor"],
        defaultPlacement: "semi-outdoor",
        recommendedSizeSqm: { min: 4, max: 12 },
        recommendedFloors: { min: 1, max: 1 },
        facilities: [
          "power",
          "water",
          "drainage",
          "trash-area",
          "display-case",
        ],
      },
      "semi-permanent": {
        allowedPropertyTypes: [
          "mall-island",
          "food-court-counter",
          "open-market-stall",
        ],
        allowedPlacements: ["indoor", "semi-outdoor"],
        defaultPlacement: "indoor",
        defaultOpeningTime: "10:00",
        defaultClosingTime: "22:00",
        facilities: [
          "power",
          "water",
          "drainage",
          "trash-area",
          "display-case",
        ],
      },
      temporary: {
        allowedPropertyTypes: ["bazaar-booth", "street-vendor-spot"],
        allowedPlacements: ["semi-outdoor", "outdoor"],
        defaultPlacement: "outdoor",
        registrationWindowDaysBefore: 3,
        typicalDurationDays: 3,
        facilities: ["power", "water", "trash-area"],
      },
    },
  },
  {
    id: "bt_006",
    label: "Street Food & Hawker Stall",
    group: "F&B (Food & Beverages)",
    defaultBEPMonths: 3,
    defaultCapital: 6_000_000,
    avgGrossMarginRatio: 0.6,
    industryRentToRevenueRatio: 0.12,
    landmarks: ["school", "campus", "residential", "transit-bus"],
    permanencePresets: {
      permanent: {
        allowedPropertyTypes: ["street-kiosk", "garage-driveway"],
        allowedPlacements: ["semi-outdoor", "outdoor"],
        defaultPlacement: "outdoor",
        recommendedSizeSqm: { min: 4, max: 12 },
        recommendedFloors: { min: 1, max: 1 },
        facilities: ["power", "water", "trash-area"],
      },
      "semi-permanent": {
        allowedPropertyTypes: ["open-market-stall"],
        allowedPlacements: ["semi-outdoor", "outdoor"],
        defaultPlacement: "outdoor",
        defaultOpeningTime: "16:00",
        defaultClosingTime: "23:00",
        facilities: ["power", "water", "trash-area"],
      },
      temporary: {
        allowedPropertyTypes: ["street-vendor-spot", "bazaar-booth"],
        allowedPlacements: ["outdoor"],
        defaultPlacement: "outdoor",
        registrationWindowDaysBefore: 2,
        typicalDurationDays: 2,
        facilities: ["power", "trash-area"],
      },
    },
  },
  {
    id: "bt_007",
    label: "Meat, Poultry & Seafood Retail",
    group: "F&B (Food & Beverages)",
    defaultBEPMonths: 5,
    defaultCapital: 12_000_000,
    avgGrossMarginRatio: 0.45,
    industryRentToRevenueRatio: 0.12,
    landmarks: ["market", "residential", "culinary-center"],
    permanencePresets: {
      permanent: {
        allowedPropertyTypes: ["shophouse", "street-kiosk"],
        allowedPlacements: ["indoor", "semi-outdoor"],
        defaultPlacement: "semi-outdoor",
        recommendedSizeSqm: { min: 10, max: 25 },
        recommendedFloors: { min: 1, max: 1 },
        facilities: ["power", "water", "drainage", "trash-area"],
      },
      "semi-permanent": {
        allowedPropertyTypes: ["traditional-market-shop", "open-market-stall"],
        allowedPlacements: ["semi-outdoor", "outdoor"],
        defaultPlacement: "semi-outdoor",
        defaultOpeningTime: "04:00",
        defaultClosingTime: "12:00",
        facilities: ["water", "drainage", "trash-area"],
      },
    },
  },
  {
    id: "bt_008",
    label: "Food Truck & Mobile Unit",
    group: "F&B (Food & Beverages)",
    defaultBEPMonths: 6,
    defaultCapital: 20_000_000,
    avgGrossMarginRatio: 0.55,
    industryRentToRevenueRatio: 0.15,
    landmarks: ["culinary-center", "campus", "office"],
    permanencePresets: {
      permanent: {
        allowedPropertyTypes: ["garage-driveway"],
        allowedPlacements: ["outdoor"],
        defaultPlacement: "outdoor",
        recommendedSizeSqm: { min: 12, max: 25 },
        recommendedFloors: { min: 1, max: 1 },
        facilities: ["power", "water", "trash-area", "parking"],
      },
      temporary: {
        allowedPropertyTypes: ["food-truck-spot"],
        allowedPlacements: ["outdoor"],
        defaultPlacement: "outdoor",
        registrationWindowDaysBefore: 5,
        typicalDurationDays: 3,
        facilities: ["power", "water", "trash-area", "parking"],
      },
    },
  },

  // Retail & Commerce
  {
    id: "bt_009",
    label: "Mini Market & Convenience Store",
    group: "Retail & Commerce",
    defaultBEPMonths: 12,
    defaultCapital: 60_000_000,
    avgGrossMarginRatio: 0.2,
    industryRentToRevenueRatio: 0.08,
    landmarks: ["residential", "office", "gas-station", "healthcare"],
    permanencePresets: {
      permanent: {
        allowedPropertyTypes: ["shophouse", "garage-driveway"],
        allowedPlacements: ["indoor"],
        defaultPlacement: "indoor",
        recommendedSizeSqm: { min: 40, max: 100 },
        recommendedFloors: { min: 1, max: 2 },
        facilities: [
          "power",
          "high-power",
          "water",
          "air-conditioner",
          "storage",
          "security",
          "cctv",
          "parking",
        ],
      },
      "semi-permanent": {
        allowedPropertyTypes: ["mall-shop"],
        allowedPlacements: ["indoor"],
        defaultPlacement: "indoor",
        defaultOpeningTime: "10:00",
        defaultClosingTime: "22:00",
        facilities: [
          "power",
          "high-power",
          "water",
          "air-conditioner",
          "storage",
          "security",
          "cctv",
        ],
      },
    },
  },
  {
    id: "bt_010",
    label: "Fresh Fruits, Vegetables & Spices",
    group: "Retail & Commerce",
    defaultBEPMonths: 4,
    defaultCapital: 8_000_000,
    avgGrossMarginRatio: 0.25,
    industryRentToRevenueRatio: 0.08,
    landmarks: ["market", "residential"],
    permanencePresets: {
      permanent: {
        allowedPropertyTypes: ["shophouse", "street-kiosk", "garage-driveway"],
        allowedPlacements: ["indoor", "semi-outdoor"],
        defaultPlacement: "semi-outdoor",
        recommendedSizeSqm: { min: 8, max: 20 },
        recommendedFloors: { min: 1, max: 1 },
        facilities: ["water", "drainage", "trash-area"],
      },
      "semi-permanent": {
        allowedPropertyTypes: ["traditional-market-shop", "open-market-stall"],
        allowedPlacements: ["semi-outdoor", "outdoor"],
        defaultPlacement: "semi-outdoor",
        defaultOpeningTime: "04:00",
        defaultClosingTime: "14:00",
        facilities: ["water", "drainage", "trash-area"],
      },
      temporary: {
        allowedPropertyTypes: ["street-vendor-spot"],
        allowedPlacements: ["outdoor"],
        defaultPlacement: "outdoor",
        registrationWindowDaysBefore: 1,
        typicalDurationDays: 1,
        facilities: ["trash-area"],
      },
    },
  },
  {
    id: "bt_011",
    label: "Fashion, Apparel & Accessory Boutique",
    group: "Retail & Commerce",
    defaultBEPMonths: 10,
    defaultCapital: 40_000_000,
    avgGrossMarginRatio: 0.45,
    industryRentToRevenueRatio: 0.14,
    landmarks: ["market", "office", "campus"],
    permanencePresets: {
      permanent: {
        allowedPropertyTypes: ["shophouse", "garage-driveway"],
        allowedPlacements: ["indoor"],
        defaultPlacement: "indoor",
        recommendedSizeSqm: { min: 15, max: 40 },
        recommendedFloors: { min: 1, max: 1 },
        facilities: [
          "power",
          "air-conditioner",
          "display-case",
          "storage",
          "security",
          "wifi",
        ],
      },
      "semi-permanent": {
        allowedPropertyTypes: [
          "mall-shop",
          "mall-island",
          "traditional-market-shop",
          "open-market-stall",
        ],
        allowedPlacements: ["indoor", "semi-outdoor"],
        defaultPlacement: "indoor",
        defaultOpeningTime: "10:00",
        defaultClosingTime: "21:00",
        facilities: ["power", "display-case", "security"],
      },
      temporary: {
        allowedPropertyTypes: ["bazaar-booth"],
        allowedPlacements: ["indoor", "semi-outdoor", "outdoor"],
        defaultPlacement: "indoor",
        registrationWindowDaysBefore: 5,
        typicalDurationDays: 3,
        facilities: ["power", "display-case"],
      },
    },
  },
  {
    id: "bt_012",
    label: "General Retail & Hobby Store",
    group: "Retail & Commerce",
    defaultBEPMonths: 9,
    defaultCapital: 25_000_000,
    avgGrossMarginRatio: 0.35,
    industryRentToRevenueRatio: 0.12,
    landmarks: ["residential", "market", "school"],
    permanencePresets: {
      permanent: {
        allowedPropertyTypes: ["shophouse", "street-kiosk", "garage-driveway"],
        allowedPlacements: ["indoor"],
        defaultPlacement: "indoor",
        recommendedSizeSqm: { min: 10, max: 30 },
        recommendedFloors: { min: 1, max: 1 },
        facilities: ["power", "display-case", "storage", "security", "cctv"],
      },
      "semi-permanent": {
        allowedPropertyTypes: [
          "mall-shop",
          "mall-island",
          "traditional-market-shop",
        ],
        allowedPlacements: ["indoor", "semi-outdoor"],
        defaultPlacement: "indoor",
        defaultOpeningTime: "10:00",
        defaultClosingTime: "21:00",
        facilities: ["power", "display-case", "security"],
      },
      temporary: {
        allowedPropertyTypes: ["bazaar-booth"],
        allowedPlacements: ["indoor", "semi-outdoor"],
        defaultPlacement: "indoor",
        registrationWindowDaysBefore: 5,
        typicalDurationDays: 3,
        facilities: ["power", "display-case"],
      },
    },
  },

  // Services
  {
    id: "bt_013",
    label: "Beauty Salon, Barbershop & Spa",
    group: "Services",
    defaultBEPMonths: 10,
    defaultCapital: 30_000_000,
    avgGrossMarginRatio: 0.6,
    industryRentToRevenueRatio: 0.15,
    landmarks: ["residential", "office", "campus"],
    permanencePresets: {
      permanent: {
        allowedPropertyTypes: ["shophouse", "garage-driveway"],
        allowedPlacements: ["indoor"],
        defaultPlacement: "indoor",
        recommendedSizeSqm: { min: 15, max: 45 },
        recommendedFloors: { min: 1, max: 1 },
        facilities: [
          "power",
          "water",
          "drainage",
          "air-conditioner",
          "seating",
          "toilet",
          "parking",
        ],
      },
      "semi-permanent": {
        allowedPropertyTypes: ["mall-shop"],
        allowedPlacements: ["indoor"],
        defaultPlacement: "indoor",
        defaultOpeningTime: "10:00",
        defaultClosingTime: "21:00",
        facilities: [
          "power",
          "water",
          "drainage",
          "air-conditioner",
          "seating",
          "toilet",
        ],
      },
    },
  },
  {
    id: "bt_014",
    label: "Service, Repair Shop & Laundry",
    group: "Services",
    defaultBEPMonths: 8,
    defaultCapital: 20_000_000,
    avgGrossMarginRatio: 0.5,
    industryRentToRevenueRatio: 0.12,
    landmarks: ["residential", "office", "gas-station"],
    permanencePresets: {
      permanent: {
        allowedPropertyTypes: ["shophouse", "garage-driveway", "street-kiosk"],
        allowedPlacements: ["indoor", "semi-outdoor"],
        defaultPlacement: "semi-outdoor",
        recommendedSizeSqm: { min: 15, max: 40 },
        recommendedFloors: { min: 1, max: 1 },
        facilities: [
          "power",
          "high-power",
          "water",
          "drainage",
          "storage",
          "parking",
        ],
      },
      "semi-permanent": {
        allowedPropertyTypes: ["traditional-market-shop"],
        allowedPlacements: ["semi-outdoor"],
        defaultPlacement: "semi-outdoor",
        defaultOpeningTime: "08:00",
        defaultClosingTime: "17:00",
        facilities: ["power", "water", "storage"],
      },
    },
  },
  {
    id: "bt_015",
    label: "Professional Office & Agency",
    group: "Services",
    defaultBEPMonths: 12,
    defaultCapital: 45_000_000,
    avgGrossMarginRatio: 0.55,
    industryRentToRevenueRatio: 0.15,
    landmarks: ["office", "market", "government"],
    permanencePresets: {
      permanent: {
        allowedPropertyTypes: ["shophouse"],
        allowedPlacements: ["indoor"],
        defaultPlacement: "indoor",
        recommendedSizeSqm: { min: 20, max: 60 },
        recommendedFloors: { min: 1, max: 2 },
        facilities: [
          "power",
          "high-power",
          "wifi",
          "air-conditioner",
          "security",
          "toilet",
          "parking",
        ],
      },
      "semi-permanent": {
        allowedPropertyTypes: ["mall-shop"],
        allowedPlacements: ["indoor"],
        defaultPlacement: "indoor",
        defaultOpeningTime: "09:00",
        defaultClosingTime: "18:00",
        facilities: [
          "power",
          "high-power",
          "wifi",
          "air-conditioner",
          "security",
          "toilet",
        ],
      },
    },
  },
  {
    id: "bt_016",
    label: "Education & Studio Space",
    group: "Services",
    defaultBEPMonths: 12,
    defaultCapital: 35_000_000,
    avgGrossMarginRatio: 0.5,
    industryRentToRevenueRatio: 0.14,
    landmarks: ["school", "campus", "residential"],
    permanencePresets: {
      permanent: {
        allowedPropertyTypes: ["shophouse", "garage-driveway"],
        allowedPlacements: ["indoor"],
        defaultPlacement: "indoor",
        recommendedSizeSqm: { min: 25, max: 60 },
        recommendedFloors: { min: 1, max: 2 },
        facilities: [
          "power",
          "water",
          "air-conditioner",
          "wifi",
          "seating",
          "toilet",
          "security",
          "parking",
        ],
      },
      "semi-permanent": {
        allowedPropertyTypes: ["mall-shop"],
        allowedPlacements: ["indoor"],
        defaultPlacement: "indoor",
        defaultOpeningTime: "10:00",
        defaultClosingTime: "20:00",
        facilities: [
          "power",
          "water",
          "air-conditioner",
          "wifi",
          "seating",
          "toilet",
        ],
      },
    },
  },
];

/* ─── 3. MAP LOOKUP & HELPER FUNCTION (BY ID) ─── */

export const BUSINESS_TYPE_MAP: Record<string, BusinessType> =
  BUSINESS_TYPES.reduce(
    (acc, item) => {
      acc[item.id] = item;
      return acc;
    },
    {} as Record<string, BusinessType>,
  );

export function getPresetForPermanenceTab(
  id: string,
  permanenceType: StallPermanenceType,
  capital?: number,
  bepMonths?: number,
) {
  const typeDef = BUSINESS_TYPE_MAP[id];
  if (!typeDef) return null;

  const preset = typeDef.permanencePresets[permanenceType];
  if (!preset) return null;

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

  return {
    businessTypeId: typeDef.id,
    label: typeDef.label,
    group: typeDef.group,
    activeCapital,
    activeBEP,
    cycleRanges,
    ...preset,
  };
}
