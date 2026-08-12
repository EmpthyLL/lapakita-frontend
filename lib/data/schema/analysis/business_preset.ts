export interface BusinessPreset {
  bepMonths: number;
  capital: number;
  rentRange: [number, number];
  depositRange: [number, number];
  facilities: string[]; // values from FACILITIES
  landmarks: string[]; // values from LANDMARK_CATEGORIES
}

export const BUSINESS_PRESETS: Record<string, BusinessPreset> = {
  "full-service-restaurant": {
    bepMonths: 12,
    capital: 50_000_000,
    rentRange: [3_000_000, 8_000_000],
    depositRange: [3_000_000, 6_000_000],
    facilities: [
      "power",
      "water",
      "drainage",
      "grease-trap",
      "ventilation",
      "seating",
      "toilet",
      "parking",
    ],
    landmarks: ["office", "market", "residential"],
  },
  "coffee-shop": {
    bepMonths: 9,
    capital: 35_000_000,
    rentRange: [2_500_000, 6_000_000],
    depositRange: [2_500_000, 5_000_000],
    facilities: [
      "power",
      "water",
      "ventilation",
      "seating",
      "toilet",
      "parking",
    ],
    landmarks: ["office", "campus", "residential"],
  },
  bakery: {
    bepMonths: 9,
    capital: 30_000_000,
    rentRange: [2_000_000, 5_000_000],
    depositRange: [2_000_000, 4_000_000],
    facilities: ["power", "water", "ventilation", "storage", "toilet"],
    landmarks: ["residential", "school", "market"],
  },
  "fast-food": {
    bepMonths: 8,
    capital: 25_000_000,
    rentRange: [2_000_000, 5_000_000],
    depositRange: [2_000_000, 4_000_000],
    facilities: [
      "power",
      "water",
      "ventilation",
      "grease-trap",
      "seating",
      "parking",
    ],
    landmarks: ["campus", "office", "market"],
  },
  "beverage-kiosk": {
    bepMonths: 4,
    capital: 8_000_000,
    rentRange: [500_000, 2_000_000],
    depositRange: [500_000, 1_500_000],
    facilities: ["power", "water"],
    landmarks: ["campus", "school", "residential"],
  },
  "mini-market": {
    bepMonths: 12,
    capital: 60_000_000,
    rentRange: [3_000_000, 8_000_000],
    depositRange: [3_000_000, 6_000_000],
    facilities: ["power", "water", "security", "storage", "parking"],
    landmarks: ["residential", "office"],
  },
  fashion: {
    bepMonths: 10,
    capital: 40_000_000,
    rentRange: [3_000_000, 7_000_000],
    depositRange: [3_000_000, 5_000_000],
    facilities: ["power", "security", "storage"],
    landmarks: ["market", "office"],
  },
  "general-retail": {
    bepMonths: 9,
    capital: 25_000_000,
    rentRange: [2_000_000, 5_000_000],
    depositRange: [2_000_000, 4_000_000],
    facilities: ["power", "security", "storage"],
    landmarks: ["residential", "market"],
  },
  "beauty-salon": {
    bepMonths: 10,
    capital: 30_000_000,
    rentRange: [2_500_000, 6_000_000],
    depositRange: [2_500_000, 5_000_000],
    facilities: ["power", "water", "ventilation", "toilet"],
    landmarks: ["residential", "office"],
  },
  "repair-shop": {
    bepMonths: 8,
    capital: 20_000_000,
    rentRange: [1_500_000, 4_000_000],
    depositRange: [1_500_000, 3_000_000],
    facilities: ["power", "water", "storage", "parking"],
    landmarks: ["residential", "office"],
  },
  "professional-office": {
    bepMonths: 12,
    capital: 45_000_000,
    rentRange: [3_000_000, 8_000_000],
    depositRange: [3_000_000, 6_000_000],
    facilities: ["power", "security", "toilet", "parking"],
    landmarks: ["office", "market"],
  },
  "education-studio": {
    bepMonths: 12,
    capital: 35_000_000,
    rentRange: [2_500_000, 6_000_000],
    depositRange: [2_500_000, 5_000_000],
    facilities: ["power", "water", "toilet", "security"],
    landmarks: ["school", "campus", "residential"],
  },
};
