import {
  calculateMultiCycleRanges,
  MultiCycleRanges,
} from "@/components/common/search/BusinessTypeCalc";
import {
  FacilityValue,
  LandmarkCategoryValue,
  StallPermanenceType,
  StallPlacement,
  StallPropertyTypeValue,
} from "@/components/common/search/SearchConstants";

export interface PermanencePresetConfig {
  isAllowed: boolean;
  allowedPropertyTypes: StallPropertyTypeValue[];
  allowedPlacements: StallPlacement[];
  defaultPlacement: StallPlacement;
  recommendedSizeSqm: { min: number; max: number };
  recommendedFloors: { min: number; max: number };
  facilities: FacilityValue[];

  // Metadata Optional Specific to Temporary & Bazaar Events
  eventMeta?: {
    typicalDurationDays: number;
    requiresRegistrationDeadline: boolean;
    registrationWindowDaysBefore: number;
  };
}

export interface BusinessType {
  id: string;
  slug: string;
  label: string;
  groupName: string;

  // Baseline Financial Defaults
  defaultBEPMonths: number;
  defaultCapital: number;

  // Financial Feasibility Benchmarks
  avgGrossMarginRatio: number;
  industryRentToRevenueRatio: number;

  // Presets Per Permanence Tab (Independent, Managed Complex, Temporary)
  permanencePresets: Record<StallPermanenceType, PermanencePresetConfig>;

  // Target Location Tags
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
        avgGrossMarginRatio: 0.5,
        industryRentToRevenueRatio: 0.15,
        landmarks: ["office", "market", "residential", "culinary-center"],
        permanencePresets: {
          permanent: {
            isAllowed: true,
            allowedPropertyTypes: [
              "shophouse",
              "garage-driveway",
              "street-kiosk",
            ],
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
            isAllowed: true,
            allowedPropertyTypes: ["mall-shop", "food-court-counter"],
            allowedPlacements: ["indoor", "semi-outdoor"],
            defaultPlacement: "indoor",
            recommendedSizeSqm: { min: 30, max: 80 },
            recommendedFloors: { min: 1, max: 1 },
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
          temporary: {
            isAllowed: false,
            allowedPropertyTypes: [],
            allowedPlacements: [],
            defaultPlacement: "outdoor",
            recommendedSizeSqm: { min: 0, max: 0 },
            recommendedFloors: { min: 1, max: 1 },
            facilities: [],
          },
        },
      },
      {
        id: "bt_002",
        slug: "coffee-shop-cafe",
        label: "Coffee Shop & Cafe",
        groupName: "F&B (Food & Beverages)",
        defaultBEPMonths: 9,
        defaultCapital: 35_000_000,
        avgGrossMarginRatio: 0.7,
        industryRentToRevenueRatio: 0.18,
        landmarks: ["office", "campus", "residential", "transit-station"],
        permanencePresets: {
          permanent: {
            isAllowed: true,
            allowedPropertyTypes: [
              "shophouse",
              "garage-driveway",
              "street-kiosk",
            ],
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
            isAllowed: true,
            allowedPropertyTypes: [
              "mall-shop",
              "mall-island",
              "food-court-counter",
            ],
            allowedPlacements: ["indoor", "semi-outdoor"],
            defaultPlacement: "indoor",
            recommendedSizeSqm: { min: 10, max: 30 },
            recommendedFloors: { min: 1, max: 1 },
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
            isAllowed: true,
            allowedPropertyTypes: [
              "bazaar-booth",
              "food-truck-spot",
              "street-vendor-spot",
            ],
            allowedPlacements: ["semi-outdoor", "outdoor"],
            defaultPlacement: "outdoor",
            recommendedSizeSqm: { min: 6, max: 15 },
            recommendedFloors: { min: 1, max: 1 },
            facilities: ["power", "water", "trash-area", "seating"],
            eventMeta: {
              typicalDurationDays: 3,
              requiresRegistrationDeadline: true,
              registrationWindowDaysBefore: 7,
            },
          },
        },
      },
      {
        id: "bt_003",
        slug: "bakery-pastry",
        label: "Bakery & Pastry Shop",
        groupName: "F&B (Food & Beverages)",
        defaultBEPMonths: 9,
        defaultCapital: 30_000_000,
        avgGrossMarginRatio: 0.55,
        industryRentToRevenueRatio: 0.15,
        landmarks: ["residential", "school", "market", "transit-station"],
        permanencePresets: {
          permanent: {
            isAllowed: true,
            allowedPropertyTypes: [
              "shophouse",
              "garage-driveway",
              "street-kiosk",
            ],
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
            isAllowed: true,
            allowedPropertyTypes: [
              "mall-shop",
              "mall-island",
              "traditional-market-shop",
            ],
            allowedPlacements: ["indoor", "semi-outdoor"],
            defaultPlacement: "indoor",
            recommendedSizeSqm: { min: 8, max: 20 },
            recommendedFloors: { min: 1, max: 1 },
            facilities: ["power", "display-case", "trash-area"],
          },
          temporary: {
            isAllowed: true,
            allowedPropertyTypes: ["bazaar-booth"],
            allowedPlacements: ["indoor", "semi-outdoor"],
            defaultPlacement: "indoor",
            recommendedSizeSqm: { min: 4, max: 10 },
            recommendedFloors: { min: 1, max: 1 },
            facilities: ["power", "display-case", "trash-area"],
            eventMeta: {
              typicalDurationDays: 3,
              requiresRegistrationDeadline: true,
              registrationWindowDaysBefore: 5,
            },
          },
        },
      },
      {
        id: "bt_004",
        slug: "quick-service-fast-food",
        label: "Quick-Service / Fast Food",
        groupName: "F&B (Food & Beverages)",
        defaultBEPMonths: 8,
        defaultCapital: 25_000_000,
        avgGrossMarginRatio: 0.5,
        industryRentToRevenueRatio: 0.15,
        landmarks: ["campus", "office", "market", "culinary-center"],
        permanencePresets: {
          permanent: {
            isAllowed: true,
            allowedPropertyTypes: [
              "shophouse",
              "street-kiosk",
              "garage-driveway",
            ],
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
            isAllowed: true,
            allowedPropertyTypes: [
              "food-court-counter",
              "mall-island",
              "traditional-market-shop",
            ],
            allowedPlacements: ["indoor", "semi-outdoor"],
            defaultPlacement: "semi-outdoor",
            recommendedSizeSqm: { min: 8, max: 20 },
            recommendedFloors: { min: 1, max: 1 },
            facilities: ["power", "water", "drainage", "trash-area"],
          },
          temporary: {
            isAllowed: true,
            allowedPropertyTypes: ["bazaar-booth", "street-vendor-spot"],
            allowedPlacements: ["semi-outdoor", "outdoor"],
            defaultPlacement: "outdoor",
            recommendedSizeSqm: { min: 6, max: 12 },
            recommendedFloors: { min: 1, max: 1 },
            facilities: ["power", "water", "trash-area"],
            eventMeta: {
              typicalDurationDays: 3,
              requiresRegistrationDeadline: true,
              registrationWindowDaysBefore: 5,
            },
          },
        },
      },
      {
        id: "bt_005",
        slug: "beverage-snack-kiosk",
        label: "Beverage & Snack Kiosk",
        groupName: "F&B (Food & Beverages)",
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
            isAllowed: true,
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
            isAllowed: true,
            allowedPropertyTypes: [
              "mall-island",
              "food-court-counter",
              "open-market-stall",
            ],
            allowedPlacements: ["indoor", "semi-outdoor"],
            defaultPlacement: "indoor",
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
          temporary: {
            isAllowed: true,
            allowedPropertyTypes: ["bazaar-booth", "street-vendor-spot"],
            allowedPlacements: ["semi-outdoor", "outdoor"],
            defaultPlacement: "outdoor",
            recommendedSizeSqm: { min: 3, max: 8 },
            recommendedFloors: { min: 1, max: 1 },
            facilities: ["power", "water", "trash-area"],
            eventMeta: {
              typicalDurationDays: 3,
              requiresRegistrationDeadline: true,
              registrationWindowDaysBefore: 3,
            },
          },
        },
      },
      {
        id: "bt_006",
        slug: "street-food-hawker",
        label: "Street Food & Hawker Stall",
        groupName: "F&B (Food & Beverages)",
        defaultBEPMonths: 3,
        defaultCapital: 6_000_000,
        avgGrossMarginRatio: 0.6,
        industryRentToRevenueRatio: 0.12,
        landmarks: ["school", "campus", "residential", "transit-bus"],
        permanencePresets: {
          permanent: {
            isAllowed: true,
            allowedPropertyTypes: ["street-kiosk", "garage-driveway"],
            allowedPlacements: ["semi-outdoor", "outdoor"],
            defaultPlacement: "outdoor",
            recommendedSizeSqm: { min: 4, max: 12 },
            recommendedFloors: { min: 1, max: 1 },
            facilities: ["power", "water", "trash-area"],
          },
          "semi-permanent": {
            isAllowed: true,
            allowedPropertyTypes: ["open-market-stall"],
            allowedPlacements: ["semi-outdoor", "outdoor"],
            defaultPlacement: "outdoor",
            recommendedSizeSqm: { min: 4, max: 10 },
            recommendedFloors: { min: 1, max: 1 },
            facilities: ["power", "water", "trash-area"],
          },
          temporary: {
            isAllowed: true,
            allowedPropertyTypes: ["street-vendor-spot", "bazaar-booth"],
            allowedPlacements: ["outdoor"],
            defaultPlacement: "outdoor",
            recommendedSizeSqm: { min: 2, max: 8 },
            recommendedFloors: { min: 1, max: 1 },
            facilities: ["power", "trash-area"],
            eventMeta: {
              typicalDurationDays: 2,
              requiresRegistrationDeadline: false,
              registrationWindowDaysBefore: 2,
            },
          },
        },
      },
      {
        id: "bt_007",
        slug: "butcher-meat-seafood",
        label: "Meat, Poultry & Seafood Retail",
        groupName: "F&B (Food & Beverages)",
        defaultBEPMonths: 5,
        defaultCapital: 12_000_000,
        avgGrossMarginRatio: 0.45,
        industryRentToRevenueRatio: 0.12,
        landmarks: ["market", "residential", "culinary-center"],
        permanencePresets: {
          permanent: {
            isAllowed: true,
            allowedPropertyTypes: ["shophouse", "street-kiosk"],
            allowedPlacements: ["indoor", "semi-outdoor"],
            defaultPlacement: "semi-outdoor",
            recommendedSizeSqm: { min: 10, max: 25 },
            recommendedFloors: { min: 1, max: 1 },
            facilities: ["power", "water", "drainage", "trash-area"],
          },
          "semi-permanent": {
            isAllowed: true,
            allowedPropertyTypes: [
              "traditional-market-shop",
              "open-market-stall",
            ],
            allowedPlacements: ["semi-outdoor", "outdoor"],
            defaultPlacement: "semi-outdoor",
            recommendedSizeSqm: { min: 4, max: 12 },
            recommendedFloors: { min: 1, max: 1 },
            facilities: ["water", "drainage", "trash-area"],
          },
          temporary: {
            isAllowed: false,
            allowedPropertyTypes: [],
            allowedPlacements: [],
            defaultPlacement: "outdoor",
            recommendedSizeSqm: { min: 0, max: 0 },
            recommendedFloors: { min: 1, max: 1 },
            facilities: [],
          },
        },
      },
      {
        id: "bt_008",
        slug: "food-truck-mobile",
        label: "Food Truck & Mobile Unit",
        groupName: "F&B (Food & Beverages)",
        defaultBEPMonths: 6,
        defaultCapital: 20_000_000,
        avgGrossMarginRatio: 0.55,
        industryRentToRevenueRatio: 0.15,
        landmarks: ["culinary-center", "campus", "office"],
        permanencePresets: {
          permanent: {
            isAllowed: true,
            allowedPropertyTypes: ["garage-driveway"],
            allowedPlacements: ["outdoor"],
            defaultPlacement: "outdoor",
            recommendedSizeSqm: { min: 12, max: 25 },
            recommendedFloors: { min: 1, max: 1 },
            facilities: ["power", "water", "trash-area", "parking"],
          },
          "semi-permanent": {
            isAllowed: false,
            allowedPropertyTypes: [],
            allowedPlacements: [],
            defaultPlacement: "outdoor",
            recommendedSizeSqm: { min: 0, max: 0 },
            recommendedFloors: { min: 1, max: 1 },
            facilities: [],
          },
          temporary: {
            isAllowed: true,
            allowedPropertyTypes: ["food-truck-spot"],
            allowedPlacements: ["outdoor"],
            defaultPlacement: "outdoor",
            recommendedSizeSqm: { min: 12, max: 25 },
            recommendedFloors: { min: 1, max: 1 },
            facilities: ["power", "water", "trash-area", "parking"],
            eventMeta: {
              typicalDurationDays: 3,
              requiresRegistrationDeadline: true,
              registrationWindowDaysBefore: 5,
            },
          },
        },
      },
    ],
  },
  {
    group: "Retail & Commerce",
    types: [
      {
        id: "bt_009",
        slug: "mini-market-convenience",
        label: "Mini Market & Convenience Store",
        groupName: "Retail & Commerce",
        defaultBEPMonths: 12,
        defaultCapital: 60_000_000,
        avgGrossMarginRatio: 0.2,
        industryRentToRevenueRatio: 0.08,
        landmarks: ["residential", "office", "gas-station", "healthcare"],
        permanencePresets: {
          permanent: {
            isAllowed: true,
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
            isAllowed: true,
            allowedPropertyTypes: ["mall-shop"],
            allowedPlacements: ["indoor"],
            defaultPlacement: "indoor",
            recommendedSizeSqm: { min: 30, max: 80 },
            recommendedFloors: { min: 1, max: 1 },
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
          temporary: {
            isAllowed: false,
            allowedPropertyTypes: [],
            allowedPlacements: [],
            defaultPlacement: "outdoor",
            recommendedSizeSqm: { min: 0, max: 0 },
            recommendedFloors: { min: 1, max: 1 },
            facilities: [],
          },
        },
      },
      {
        id: "bt_010",
        slug: "fresh-produce-groceries",
        label: "Fresh Fruits, Vegetables & Spices",
        groupName: "Retail & Commerce",
        defaultBEPMonths: 4,
        defaultCapital: 8_000_000,
        avgGrossMarginRatio: 0.25,
        industryRentToRevenueRatio: 0.08,
        landmarks: ["market", "residential"],
        permanencePresets: {
          permanent: {
            isAllowed: true,
            allowedPropertyTypes: [
              "shophouse",
              "street-kiosk",
              "garage-driveway",
            ],
            allowedPlacements: ["indoor", "semi-outdoor"],
            defaultPlacement: "semi-outdoor",
            recommendedSizeSqm: { min: 8, max: 20 },
            recommendedFloors: { min: 1, max: 1 },
            facilities: ["water", "drainage", "trash-area"],
          },
          "semi-permanent": {
            isAllowed: true,
            allowedPropertyTypes: [
              "traditional-market-shop",
              "open-market-stall",
            ],
            allowedPlacements: ["semi-outdoor", "outdoor"],
            defaultPlacement: "semi-outdoor",
            recommendedSizeSqm: { min: 4, max: 12 },
            recommendedFloors: { min: 1, max: 1 },
            facilities: ["water", "drainage", "trash-area"],
          },
          temporary: {
            isAllowed: true,
            allowedPropertyTypes: ["street-vendor-spot"],
            allowedPlacements: ["outdoor"],
            defaultPlacement: "outdoor",
            recommendedSizeSqm: { min: 3, max: 8 },
            recommendedFloors: { min: 1, max: 1 },
            facilities: ["trash-area"],
            eventMeta: {
              typicalDurationDays: 1,
              requiresRegistrationDeadline: false,
              registrationWindowDaysBefore: 1,
            },
          },
        },
      },
      {
        id: "bt_011",
        slug: "fashion-apparel-boutique",
        label: "Fashion, Apparel & Accessory Boutique",
        groupName: "Retail & Commerce",
        defaultBEPMonths: 10,
        defaultCapital: 40_000_000,
        avgGrossMarginRatio: 0.45,
        industryRentToRevenueRatio: 0.14,
        landmarks: ["market", "office", "campus"],
        permanencePresets: {
          permanent: {
            isAllowed: true,
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
            isAllowed: true,
            allowedPropertyTypes: [
              "mall-shop",
              "mall-island",
              "traditional-market-shop",
              "open-market-stall",
            ],
            allowedPlacements: ["indoor", "semi-outdoor"],
            defaultPlacement: "indoor",
            recommendedSizeSqm: { min: 6, max: 25 },
            recommendedFloors: { min: 1, max: 1 },
            facilities: ["power", "display-case", "security"],
          },
          temporary: {
            isAllowed: true,
            allowedPropertyTypes: ["bazaar-booth"],
            allowedPlacements: ["indoor", "semi-outdoor", "outdoor"],
            defaultPlacement: "indoor",
            recommendedSizeSqm: { min: 4, max: 12 },
            recommendedFloors: { min: 1, max: 1 },
            facilities: ["power", "display-case"],
            eventMeta: {
              typicalDurationDays: 3,
              requiresRegistrationDeadline: true,
              registrationWindowDaysBefore: 5,
            },
          },
        },
      },
      {
        id: "bt_012",
        slug: "general-retail-hobby",
        label: "General Retail & Hobby Store",
        groupName: "Retail & Commerce",
        defaultBEPMonths: 9,
        defaultCapital: 25_000_000,
        avgGrossMarginRatio: 0.35,
        industryRentToRevenueRatio: 0.12,
        landmarks: ["residential", "market", "school"],
        permanencePresets: {
          permanent: {
            isAllowed: true,
            allowedPropertyTypes: [
              "shophouse",
              "street-kiosk",
              "garage-driveway",
            ],
            allowedPlacements: ["indoor"],
            defaultPlacement: "indoor",
            recommendedSizeSqm: { min: 10, max: 30 },
            recommendedFloors: { min: 1, max: 1 },
            facilities: [
              "power",
              "display-case",
              "storage",
              "security",
              "cctv",
            ],
          },
          "semi-permanent": {
            isAllowed: true,
            allowedPropertyTypes: [
              "mall-shop",
              "mall-island",
              "traditional-market-shop",
            ],
            allowedPlacements: ["indoor", "semi-outdoor"],
            defaultPlacement: "indoor",
            recommendedSizeSqm: { min: 6, max: 18 },
            recommendedFloors: { min: 1, max: 1 },
            facilities: ["power", "display-case", "security"],
          },
          temporary: {
            isAllowed: true,
            allowedPropertyTypes: ["bazaar-booth"],
            allowedPlacements: ["indoor", "semi-outdoor"],
            defaultPlacement: "indoor",
            recommendedSizeSqm: { min: 4, max: 10 },
            recommendedFloors: { min: 1, max: 1 },
            facilities: ["power", "display-case"],
            eventMeta: {
              typicalDurationDays: 3,
              requiresRegistrationDeadline: true,
              registrationWindowDaysBefore: 5,
            },
          },
        },
      },
    ],
  },
  {
    group: "Services",
    types: [
      {
        id: "bt_013",
        slug: "beauty-salon-barbershop",
        label: "Beauty Salon, Barbershop & Spa",
        groupName: "Services",
        defaultBEPMonths: 10,
        defaultCapital: 30_000_000,
        avgGrossMarginRatio: 0.6,
        industryRentToRevenueRatio: 0.15,
        landmarks: ["residential", "office", "campus"],
        permanencePresets: {
          permanent: {
            isAllowed: true,
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
            isAllowed: true,
            allowedPropertyTypes: ["mall-shop"],
            allowedPlacements: ["indoor"],
            defaultPlacement: "indoor",
            recommendedSizeSqm: { min: 15, max: 40 },
            recommendedFloors: { min: 1, max: 1 },
            facilities: [
              "power",
              "water",
              "drainage",
              "air-conditioner",
              "seating",
              "toilet",
            ],
          },
          temporary: {
            isAllowed: false,
            allowedPropertyTypes: [],
            allowedPlacements: [],
            defaultPlacement: "outdoor",
            recommendedSizeSqm: { min: 0, max: 0 },
            recommendedFloors: { min: 1, max: 1 },
            facilities: [],
          },
        },
      },
      {
        id: "bt_014",
        slug: "service-repair-laundry",
        label: "Service, Repair Shop & Laundry",
        groupName: "Services",
        defaultBEPMonths: 8,
        defaultCapital: 20_000_000,
        avgGrossMarginRatio: 0.5,
        industryRentToRevenueRatio: 0.12,
        landmarks: ["residential", "office", "gas-station"],
        permanencePresets: {
          permanent: {
            isAllowed: true,
            allowedPropertyTypes: [
              "shophouse",
              "garage-driveway",
              "street-kiosk",
            ],
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
            isAllowed: true,
            allowedPropertyTypes: ["traditional-market-shop"],
            allowedPlacements: ["semi-outdoor"],
            defaultPlacement: "semi-outdoor",
            recommendedSizeSqm: { min: 8, max: 20 },
            recommendedFloors: { min: 1, max: 1 },
            facilities: ["power", "water", "storage"],
          },
          temporary: {
            isAllowed: false,
            allowedPropertyTypes: [],
            allowedPlacements: [],
            defaultPlacement: "outdoor",
            recommendedSizeSqm: { min: 0, max: 0 },
            recommendedFloors: { min: 1, max: 1 },
            facilities: [],
          },
        },
      },
      {
        id: "bt_015",
        slug: "professional-office-agency",
        label: "Professional Office & Agency",
        groupName: "Services",
        defaultBEPMonths: 12,
        defaultCapital: 45_000_000,
        avgGrossMarginRatio: 0.55,
        industryRentToRevenueRatio: 0.15,
        landmarks: ["office", "market", "government"],
        permanencePresets: {
          permanent: {
            isAllowed: true,
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
            isAllowed: true,
            allowedPropertyTypes: ["mall-shop"],
            allowedPlacements: ["indoor"],
            defaultPlacement: "indoor",
            recommendedSizeSqm: { min: 20, max: 50 },
            recommendedFloors: { min: 1, max: 1 },
            facilities: [
              "power",
              "high-power",
              "wifi",
              "air-conditioner",
              "security",
              "toilet",
            ],
          },
          temporary: {
            isAllowed: false,
            allowedPropertyTypes: [],
            allowedPlacements: [],
            defaultPlacement: "outdoor",
            recommendedSizeSqm: { min: 0, max: 0 },
            recommendedFloors: { min: 1, max: 1 },
            facilities: [],
          },
        },
      },
      {
        id: "bt_016",
        slug: "education-studio-space",
        label: "Education & Studio Space",
        groupName: "Services",
        defaultBEPMonths: 12,
        defaultCapital: 35_000_000,
        avgGrossMarginRatio: 0.5,
        industryRentToRevenueRatio: 0.14,
        landmarks: ["school", "campus", "residential"],
        permanencePresets: {
          permanent: {
            isAllowed: true,
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
            isAllowed: true,
            allowedPropertyTypes: ["mall-shop"],
            allowedPlacements: ["indoor"],
            defaultPlacement: "indoor",
            recommendedSizeSqm: { min: 20, max: 50 },
            recommendedFloors: { min: 1, max: 1 },
            facilities: [
              "power",
              "water",
              "air-conditioner",
              "wifi",
              "seating",
              "toilet",
            ],
          },
          temporary: {
            isAllowed: false,
            allowedPropertyTypes: [],
            allowedPlacements: [],
            defaultPlacement: "outdoor",
            recommendedSizeSqm: { min: 0, max: 0 },
            recommendedFloors: { min: 1, max: 1 },
            facilities: [],
          },
        },
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

export function getPresetForPermanenceTab(
  slug: string,
  permanenceType: StallPermanenceType,
  capital?: number,
  bepMonths?: number,
) {
  const typeDef = BUSINESS_TYPE_MAP[slug];
  if (!typeDef) return null;

  const preset = typeDef.permanencePresets[permanenceType];
  if (!preset || !preset.isAllowed) return null;

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
    slug: typeDef.slug,
    label: typeDef.label,
    groupName: typeDef.groupName,
    activeCapital,
    activeBEP,
    cycleRanges,

    // Active Tab Specific Preset
    ...preset,
  };
}
