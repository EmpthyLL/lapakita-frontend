import {
  calculateMultiCycleRanges,
  MultiCycleRanges,
} from "@/components/common/search/BusinessTypeCalc";
import {
  FacilityValue,
  LandmarkCategoryValue,
  StallPlacement,
  StallPropertyTypeValue,
} from "@/components/common/search/SearchConstants";

export interface BusinessType {
  id: string;
  slug: string;
  label: string;
  groupName: string;

  // Baseline Default
  defaultBEPMonths: number;
  defaultCapital: number;

  // Physical Property Presets
  recommendedPropertyTypes: StallPropertyTypeValue[];
  recommendedPlacement: StallPlacement; // Mandatory preset
  recommendedSizeSqm: {
    min: number;
    max: number;
  };
  recommendedFloors: {
    min: number;
    max: number;
  };

  // Facilities & Landmark Tags
  facilities: FacilityValue[];
  landmarks: LandmarkCategoryValue[];
}

export interface BusinessCategoryGroup {
  group: string;
  types: BusinessType[];
}

export const BUSINESS_CATEGORIES: BusinessCategoryGroup[] = [
  {
    group: "F&B (Food & Beverages)",
    types: [
      {
        id: "bt_001",
        slug: "full-service-restaurant",
        label: "Full-Service Restaurant",
        groupName: "F&B (Food & Beverages)",
        defaultBEPMonths: 12,
        defaultCapital: 60_000_000,
        recommendedPropertyTypes: [
          "shophouse",
          "mall-shop",
          "food-court-counter",
        ],
        recommendedPlacement: "indoor",
        recommendedSizeSqm: { min: 30, max: 100 },
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
        landmarks: ["office", "market", "residential", "culinary-center"],
      },
      {
        id: "bt_002",
        slug: "coffee-shop",
        label: "Coffee Shop & Cafe",
        groupName: "F&B (Food & Beverages)",
        defaultBEPMonths: 9,
        defaultCapital: 35_000_000,
        recommendedPropertyTypes: [
          "shophouse",
          "mall-island",
          "garage-driveway",
        ],
        recommendedPlacement: "indoor",
        recommendedSizeSqm: { min: 12, max: 40 },
        recommendedFloors: { min: 1, max: 1 },
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
        landmarks: ["office", "campus", "residential", "transit-station"],
      },
      {
        id: "bt_003",
        slug: "bakery",
        label: "Bakery & Pastry Shop",
        groupName: "F&B (Food & Beverages)",
        defaultBEPMonths: 9,
        defaultCapital: 30_000_000,
        recommendedPropertyTypes: ["mall-shop", "shophouse", "street-kiosk"],
        recommendedPlacement: "indoor",
        recommendedSizeSqm: { min: 10, max: 30 },
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
        landmarks: ["residential", "school", "market", "transit-station"],
      },
      {
        id: "bt_004",
        slug: "fast-food",
        label: "Quick-Service / Fast Food",
        groupName: "F&B (Food & Beverages)",
        defaultBEPMonths: 8,
        defaultCapital: 25_000_000,
        recommendedPropertyTypes: [
          "food-court-counter",
          "street-kiosk",
          "shophouse",
        ],
        recommendedPlacement: "semi-outdoor",
        recommendedSizeSqm: { min: 8, max: 25 },
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
        landmarks: ["campus", "office", "market", "culinary-center"],
      },
      {
        id: "bt_005",
        slug: "beverage-kiosk",
        label: "Beverage & Snack Kiosk",
        groupName: "F&B (Food & Beverages)",
        defaultBEPMonths: 4,
        defaultCapital: 10_000_000,
        recommendedPropertyTypes: [
          "mall-island",
          "street-kiosk",
          "food-court-counter",
        ],
        recommendedPlacement: "semi-outdoor",
        recommendedSizeSqm: { min: 4, max: 12 },
        recommendedFloors: { min: 1, max: 1 },
        facilities: [
          "power",
          "water",
          "drainage",
          "trash-area",
          "display-case",
        ],
        landmarks: [
          "campus",
          "school",
          "residential",
          "transit-station",
          "transit-bus",
        ],
      },
    ],
  },
  {
    group: "Retail & Commerce",
    types: [
      {
        id: "bt_006",
        slug: "mini-market",
        label: "Mini Market & Convenience Store",
        groupName: "Retail & Commerce",
        defaultBEPMonths: 12,
        defaultCapital: 60_000_000,
        recommendedPropertyTypes: ["shophouse", "mall-shop"],
        recommendedPlacement: "indoor",
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
        landmarks: ["residential", "office", "gas-station", "healthcare"],
      },
      {
        id: "bt_007",
        slug: "fashion",
        label: "Fashion & Apparel Boutique",
        groupName: "Retail & Commerce",
        defaultBEPMonths: 10,
        defaultCapital: 40_000_000,
        recommendedPropertyTypes: [
          "traditional-market",
          "mall-shop",
          "shophouse",
        ],
        recommendedPlacement: "indoor",
        recommendedSizeSqm: { min: 8, max: 35 },
        recommendedFloors: { min: 1, max: 1 },
        facilities: [
          "power",
          "air-conditioner",
          "display-case",
          "storage",
          "security",
          "wifi",
        ],
        landmarks: ["market", "office", "campus"],
      },
      {
        id: "bt_008",
        slug: "general-retail",
        label: "General Retail & Hobby Store",
        groupName: "Retail & Commerce",
        defaultBEPMonths: 9,
        defaultCapital: 25_000_000,
        recommendedPropertyTypes: [
          "traditional-market",
          "mall-island",
          "street-kiosk",
        ],
        recommendedPlacement: "indoor",
        recommendedSizeSqm: { min: 6, max: 20 },
        recommendedFloors: { min: 1, max: 1 },
        facilities: ["power", "display-case", "storage", "security", "cctv"],
        landmarks: ["residential", "market", "school"],
      },
    ],
  },
  {
    group: "Services",
    types: [
      {
        id: "bt_009",
        slug: "beauty-salon",
        label: "Beauty Salon & Barbershop",
        groupName: "Services",
        defaultBEPMonths: 10,
        defaultCapital: 30_000_000,
        recommendedPropertyTypes: ["shophouse", "garage-driveway", "mall-shop"],
        recommendedPlacement: "indoor",
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
        landmarks: ["residential", "office", "campus"],
      },
      {
        id: "bt_010",
        slug: "repair-shop",
        label: "Service & Repair Shop",
        groupName: "Services",
        defaultBEPMonths: 8,
        defaultCapital: 20_000_000,
        recommendedPropertyTypes: [
          "shophouse",
          "street-kiosk",
          "garage-driveway",
        ],
        recommendedPlacement: "semi-outdoor",
        recommendedSizeSqm: { min: 12, max: 30 },
        recommendedFloors: { min: 1, max: 1 },
        facilities: ["power", "high-power", "water", "storage", "parking"],
        landmarks: ["residential", "office", "gas-station"],
      },
      {
        id: "bt_011",
        slug: "professional-office",
        label: "Professional Office & Agency",
        groupName: "Services",
        defaultBEPMonths: 12,
        defaultCapital: 45_000_000,
        recommendedPropertyTypes: ["shophouse", "mall-shop"],
        recommendedPlacement: "indoor",
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
        landmarks: ["office", "market", "government"],
      },
      {
        id: "bt_012",
        slug: "education-studio",
        label: "Education & Studio Space",
        groupName: "Services",
        defaultBEPMonths: 12,
        defaultCapital: 35_000_000,
        recommendedPropertyTypes: ["shophouse", "garage-driveway"],
        recommendedPlacement: "indoor",
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
        landmarks: ["school", "campus", "residential"],
      },
    ],
  },
];

export const BUSINESS_TYPE_MAP: Record<string, BusinessType> =
  BUSINESS_CATEGORIES.reduce(
    (acc, group) => {
      group.types.forEach((type) => {
        acc[type.slug] = type;
      });
      return acc;
    },
    {} as Record<string, BusinessType>,
  );

export function getPresetWithCalculatedRanges(
  slug: string,
  capital?: number,
  bepMonths?: number,
) {
  const typeDef = BUSINESS_TYPE_MAP[slug];
  if (!typeDef) return null;

  const activeCapital = capital ?? typeDef.defaultCapital;
  const activeBEP = bepMonths ?? typeDef.defaultBEPMonths;

  const cycleRanges: MultiCycleRanges = calculateMultiCycleRanges(
    activeCapital,
    activeBEP,
  );

  return {
    ...typeDef,
    activeCapital,
    activeBEP,
    cycleRanges,
  };
}
