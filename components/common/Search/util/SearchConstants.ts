import {
  AirVent,
  Armchair,
  Building,
  Building2,
  Bus,
  CalendarDays,
  Car,
  Cctv,
  Clock,
  ConciergeBell,
  Container,
  Cylinder,
  Droplets,
  Flame,
  Fuel,
  GraduationCap,
  HeartPulse,
  Home,
  Key,
  Landmark,
  LucideIcon,
  MapPin,
  Plane,
  Plug,
  School,
  ShieldCheck,
  ShoppingBag,
  SlidersHorizontal,
  Sparkles,
  Store,
  Target,
  Tent,
  ToiletIcon,
  TrainFront,
  Trash2,
  Truck,
  Tv,
  Utensils,
  Warehouse,
  Waves,
  Wifi,
  Wind,
  Zap,
} from "lucide-react";

/* ─── 1. CORE TYPES & INTERFACES ─── */

export type BEPMonths = 3 | 6 | 12 | 18 | 24;
export type RadiusPreset = "1 km" | "3 km" | "5 km" | "10 km";
export type StartDateValue = 1 | 15 | "eom";
export type LeasePeriodValue = "1m" | "3m" | "6m" | "12m" | "custom";
export type PaymentCycle = "month" | "quarter" | "semester" | "year";
export type DayOfMonthValue = number;
export type LeaseMonthsValue = number;

export type LandmarkCategoryValue =
  | "campus"
  | "school"
  | "office"
  | "market"
  | "residential"
  | "transit-station"
  | "transit-bus"
  | "healthcare"
  | "culinary-center"
  | "government"
  | "gas-station"
  | "airport";

export type StallPlacement = "indoor" | "semi-outdoor" | "outdoor";

/**
 * CORE PERMANENCE LEVEL (DEFINED BY OPERATIONAL DEPENDENCY)
 * - permanent: Independent access & full operational control (No parent entity).
 * - semi-permanent: Managed complex / shared parent entity (Bound by opening hours & complex rules).
 * - temporary: Event-based or pop-up spot (Short-term / schedule-bound).
 */
export type StallPermanenceType = "permanent" | "semi-permanent" | "temporary";

export type StallPropertyTypeValue =
  | "shophouse" // Independent Shophouse / Standalone Store
  | "garage-driveway" // Home Garage / Private Yard
  | "street-kiosk" // Standalone Street Kiosk / Container
  | "mall-shop" // Enclosed Mall Unit
  | "mall-island" // Mall Island / Corridor Booth
  | "traditional-market-shop" // Enclosed Traditional Market Kiosk
  | "open-market-stall" // Open Market Counter / Bench Stall
  | "food-court-counter" // Food Court Kitchen Counter
  | "street-vendor-spot" // Pavement / Sidewalk Stall Spot
  | "food-truck-spot" // Designated Food Truck Bay
  | "bazaar-booth"; // Pop-Up Event / Festival Booth

export type FacilityValue =
  | "power"
  | "high-power"
  | "water"
  | "drainage"
  | "grease-trap"
  | "ventilation"
  | "air-conditioner"
  | "gas-pipeline"
  | "wifi"
  | "seating"
  | "parking"
  | "toilet"
  | "display-case"
  | "storage"
  | "trash-area"
  | "cleaning-service"
  | "security"
  | "cctv"
  | "reception"
  | "tv-display";

export interface SearchInfoItem {
  icon: LucideIcon;
  highlight: string;
  label: string;
}

export interface StartDateOption {
  value: StartDateValue;
  label: string;
}

export interface LeasePeriodOption {
  value: LeasePeriodValue;
  label: string;
  months: number | null;
}

export interface PaymentCycleOption {
  value: PaymentCycle;
  label: string;
}

export interface LandmarkCategory {
  value: LandmarkCategoryValue;
  label: string;
  icon: LucideIcon;
}

export interface StallPlacementOption {
  value: StallPlacement;
  label: string;
}

export interface StallPermanenceTabOption {
  value: StallPermanenceType;
  label: string;
  shortLabel: string;
  description: string;
  icon: LucideIcon;
  allowedPaymentCycles: PaymentCycle[];
}

export interface StallPropertyType {
  value: StallPropertyTypeValue;
  label: string;
  description: string;
  icon: LucideIcon;
  permanenceType: StallPermanenceType;
  allowedPlacements: StallPlacement[];
  allowedFacilities: FacilityValue[];
}

export interface Facility {
  value: FacilityValue;
  label: string;
  icon: LucideIcon;
}

/* ─── 2. MAIN PERMANENCE TABS ─── */

export const STALL_PERMANENCE_TABS: StallPermanenceTabOption[] = [
  {
    value: "permanent",
    label: "Independent Stalls (24/7 Access)",
    shortLabel: "Independent",
    description:
      "Fully independent properties. No shared management or opening hour restrictions.",
    icon: Key,
    allowedPaymentCycles: ["month", "quarter", "semester", "year"],
  },
  {
    value: "semi-permanent",
    label: "Managed Complex Stalls (Shared Facility)",
    shortLabel: "Managed Complex",
    description:
      "Located within markets, malls, or food courts. Bound by shared management schedules.",
    icon: Clock,
    allowedPaymentCycles: ["month", "quarter"],
  },
  {
    value: "temporary",
    label: "Temporary & Event Spots",
    shortLabel: "Temporary & Pop-Up",
    description:
      "Pop-up event booths, street vendor spots, or food truck bays with short-term schedules.",
    icon: CalendarDays,
    allowedPaymentCycles: ["month"],
  },
];

/* ─── 3. MASTER FACILITIES DEFINITION ─── */

export const MASTER_FACILITIES: Record<FacilityValue, Facility> = {
  power: { value: "power", label: "Standard Power Supply (PLN)", icon: Zap },
  "high-power": {
    value: "high-power",
    label: "High Power Capacity (>2200W)",
    icon: Plug,
  },
  water: { value: "water", label: "Clean Water Supply", icon: Droplets },
  drainage: { value: "drainage", label: "Drainage & Waste Water", icon: Waves },
  "grease-trap": {
    value: "grease-trap",
    label: "Grease Trap (F&B)",
    icon: Flame,
  },
  ventilation: {
    value: "ventilation",
    label: "Exhaust & Ventilation System",
    icon: Wind,
  },
  "air-conditioner": {
    value: "air-conditioner",
    label: "Air Conditioner (AC)",
    icon: AirVent,
  },
  "gas-pipeline": {
    value: "gas-pipeline",
    label: "LPG / Gas Line Access",
    icon: Cylinder,
  },
  wifi: { value: "wifi", label: "High-Speed Wi-Fi", icon: Wifi },
  seating: {
    value: "seating",
    label: "Customer Seating Area",
    icon: Armchair,
  },
  parking: { value: "parking", label: "Customer & Staff Parking", icon: Car },
  toilet: {
    value: "toilet",
    label: "Restroom / Shared Toilet",
    icon: ToiletIcon,
  },
  "display-case": {
    value: "display-case",
    label: "Storefront Window / Display Case",
    icon: Store,
  },
  storage: {
    value: "storage",
    label: "Private Storage Room",
    icon: Warehouse,
  },
  "trash-area": {
    value: "trash-area",
    label: "Daily Waste Disposal Area",
    icon: Trash2,
  },
  "cleaning-service": {
    value: "cleaning-service",
    label: "Shared Area Cleaning Service",
    icon: Sparkles,
  },
  security: {
    value: "security",
    label: "24/7 Security Guard",
    icon: ShieldCheck,
  },
  cctv: { value: "cctv", label: "CCTV Surveillance", icon: Cctv },
  reception: {
    value: "reception",
    label: "Shared Lobby / Reception",
    icon: ConciergeBell,
  },
  "tv-display": {
    value: "tv-display",
    label: "Digital Signage / Display Area",
    icon: Tv,
  },
};

/* ─── 4. PROPERTY TYPES & FACILITY CONTEXT MAPPING ─── */

export const STALL_PROPERTY_TYPES: StallPropertyType[] = [
  // ── INDEPENDENT (PERMANENT) ──
  {
    value: "shophouse",
    label: "Shophouse / Standalone Store",
    description:
      "Multi-story or ground floor independent commercial shopfront.",
    icon: Building,
    permanenceType: "permanent",
    allowedPlacements: ["indoor", "semi-outdoor"],
    allowedFacilities: [
      "power",
      "high-power",
      "water",
      "drainage",
      "grease-trap",
      "ventilation",
      "air-conditioner",
      "gas-pipeline",
      "wifi",
      "seating",
      "parking",
      "toilet",
      "display-case",
      "storage",
      "trash-area",
      "security",
      "cctv",
      "tv-display",
    ],
  },
  {
    value: "garage-driveway",
    label: "Garage & Front Yard Space",
    description:
      "Converted residential garage or private driveway for quiet operations.",
    icon: Warehouse,
    permanenceType: "permanent",
    allowedPlacements: ["indoor", "semi-outdoor", "outdoor"],
    allowedFacilities: [
      "power",
      "high-power",
      "water",
      "drainage",
      "wifi",
      "seating",
      "parking",
      "toilet",
      "trash-area",
    ],
  },
  {
    value: "street-kiosk",
    label: "Standalone Kiosk / Container",
    description:
      "Private standalone container or booth with dedicated street access.",
    icon: Container,
    permanenceType: "permanent",
    allowedPlacements: ["semi-outdoor", "outdoor"],
    allowedFacilities: [
      "power",
      "high-power",
      "water",
      "drainage",
      "grease-trap",
      "ventilation",
      "seating",
      "parking",
      "display-case",
      "trash-area",
      "cctv",
    ],
  },

  // ── MANAGED COMPLEX (SEMI-PERMANENT) ──
  {
    value: "mall-shop",
    label: "Enclosed Mall Shop",
    description:
      "Private shopfront located inside a commercial shopping center.",
    icon: Building2,
    permanenceType: "semi-permanent",
    allowedPlacements: ["indoor"],
    allowedFacilities: [
      "power",
      "high-power",
      "water",
      "drainage",
      "air-conditioner",
      "wifi",
      "seating",
      "parking",
      "toilet",
      "display-case",
      "storage",
      "trash-area",
      "cleaning-service",
      "security",
      "cctv",
      "reception",
      "tv-display",
    ],
  },
  {
    value: "mall-island",
    label: "Mall Island / Corridor Booth",
    description: "Open corridor kiosk or booth in high-footfall mall areas.",
    icon: ShoppingBag,
    permanenceType: "semi-permanent",
    allowedPlacements: ["indoor"],
    allowedFacilities: [
      "power",
      "high-power",
      "wifi",
      "parking",
      "toilet",
      "display-case",
      "trash-area",
      "cleaning-service",
      "security",
      "cctv",
    ],
  },
  {
    value: "traditional-market-shop",
    label: "Traditional Market Shop (Kios Pasar)",
    description:
      "Enclosed shopfront inside traditional wet/dry markets with rolling doors.",
    icon: Store,
    permanenceType: "semi-permanent",
    allowedPlacements: ["indoor", "semi-outdoor"],
    allowedFacilities: [
      "power",
      "water",
      "drainage",
      "parking",
      "toilet",
      "storage",
      "trash-area",
      "security",
    ],
  },
  {
    value: "open-market-stall",
    label: "Open Market Counter (Los Pasar)",
    description:
      "Open bench or wooden table stall in traditional markets without full walls.",
    icon: Store,
    permanenceType: "semi-permanent",
    allowedPlacements: ["semi-outdoor", "outdoor"],
    allowedFacilities: ["power", "water", "drainage", "trash-area", "security"],
  },
  {
    value: "food-court-counter",
    label: "Food Court Counter",
    description: "Dedicated kitchen counter with shared customer dining area.",
    icon: Tent,
    permanenceType: "semi-permanent",
    allowedPlacements: ["indoor", "semi-outdoor"],
    allowedFacilities: [
      "power",
      "high-power",
      "water",
      "drainage",
      "grease-trap",
      "ventilation",
      "gas-pipeline",
      "wifi",
      "seating",
      "parking",
      "toilet",
      "trash-area",
      "cleaning-service",
      "security",
      "cctv",
    ],
  },

  // ── TEMPORARY & POP-UP (TEMPORARY) ──
  {
    value: "street-vendor-spot",
    label: "Street Vendor Spot (Kakilima)",
    description:
      "Designated outdoor pavement spot for temporary open-air tents.",
    icon: Tent,
    permanenceType: "temporary",
    allowedPlacements: ["outdoor"],
    allowedFacilities: ["power", "water", "trash-area", "seating"],
  },
  {
    value: "food-truck-spot",
    label: "Food Truck Parking Spot",
    description: "Designated parking bay equipped with utility hookups.",
    icon: Truck,
    permanenceType: "temporary",
    allowedPlacements: ["outdoor"],
    allowedFacilities: [
      "power",
      "high-power",
      "water",
      "drainage",
      "seating",
      "parking",
      "trash-area",
    ],
  },
  {
    value: "bazaar-booth",
    label: "Pop-Up Event / Bazaar Booth",
    description:
      "Short-term festival or exhibition booth spot tied to event dates.",
    icon: CalendarDays,
    permanenceType: "temporary",
    allowedPlacements: ["indoor", "semi-outdoor", "outdoor"],
    allowedFacilities: [
      "power",
      "wifi",
      "seating",
      "parking",
      "toilet",
      "trash-area",
      "cleaning-service",
      "security",
    ],
  },
];

export function getPropertyTypesForPermanence(
  permanenceType: StallPermanenceType,
): StallPropertyType[] {
  return STALL_PROPERTY_TYPES.filter(
    (t) => t.permanenceType === permanenceType,
  );
}

export function getAllowedPlacements(
  selectedPropertyTypes: StallPropertyTypeValue[],
  fallbackPermanence: StallPermanenceType,
): StallPlacement[] {
  // Union of allowed placements across whatever's selected — falls back to
  // "everything this tab allows" when nothing is picked yet.
  const source =
    selectedPropertyTypes.length > 0
      ? STALL_PROPERTY_TYPES.filter((t) =>
          selectedPropertyTypes.includes(t.value),
        )
      : STALL_PROPERTY_TYPES.filter(
          (t) => t.permanenceType === fallbackPermanence,
        );

  const set = new Set<StallPlacement>();
  source.forEach((t) => t.allowedPlacements.forEach((p) => set.add(p)));
  return Array.from(set);
}

/**
 * HELPER: Returns available facilities based on selected property types.
 */
export function getContextualFacilities(
  selectedPropertyTypes: StallPropertyTypeValue[] = [],
  fallbackPermanence?: StallPermanenceType,
): Facility[] {
  const source =
    selectedPropertyTypes.length > 0
      ? STALL_PROPERTY_TYPES.filter((t) =>
          selectedPropertyTypes.includes(t.value),
        )
      : fallbackPermanence
        ? STALL_PROPERTY_TYPES.filter(
            (t) => t.permanenceType === fallbackPermanence,
          )
        : STALL_PROPERTY_TYPES;

  const allowedSet = new Set<FacilityValue>();
  source.forEach((t) => t.allowedFacilities.forEach((f) => allowedSet.add(f)));

  return Array.from(allowedSet)
    .map((facKey) => MASTER_FACILITIES[facKey])
    .filter(Boolean);
}

/* ─── 5. RANGES & DEFAULT CONSTANTS ─── */

export const BEP_PRESETS_MONTHS: readonly BEPMonths[] = [3, 6, 12, 18, 24];

export interface RentRangeConfig {
  min: number;
  max: number;
  step: number;
}

export const GENERAL_RENT_RANGE: RentRangeConfig = {
  min: 300_000,
  max: 50_000_000,
  step: 250_000,
};

export const RENT_RANGE_BY_CYCLE: Record<PaymentCycle, RentRangeConfig> = {
  month: { min: 300_000, max: 10_000_000, step: 50_000 },
  quarter: { min: 900_000, max: 25_000_000, step: 250_000 },
  semester: { min: 1_800_000, max: 45_000_000, step: 500_000 },
  year: { min: 3_500_000, max: 80_000_000, step: 1_000_000 },
};

export function getRentRangeConfig(cycle: PaymentCycle | ""): RentRangeConfig {
  if (!cycle) return GENERAL_RENT_RANGE;
  return RENT_RANGE_BY_CYCLE[cycle];
}

export const DEPOSIT_RANGE = {
  min: 500_000,
  max: 10_000_000,
  step: 100_000,
} as const;

export const DEFAULT_ASSUMED_CAPITAL = 35_000_000;
export const DEFAULT_BEP_MONTHS: BEPMonths = 6;

export const RADIUS_PRESETS: readonly RadiusPreset[] = [
  "1 km",
  "3 km",
  "5 km",
  "10 km",
];

export const RADIUS_RANGE = { min: 0.5, max: 50, step: 0.5 } as const;

/* ─── 6. OPTIONS & PRESETS ─── */

export const SEARCH_CAPABILITIES: SearchInfoItem[] = [
  {
    icon: MapPin,
    highlight: "Landmark & Radius",
    label: "Search near campus, schools & offices",
  },
  {
    icon: SlidersHorizontal,
    highlight: "Multi-Filter Utility",
    label: "Power, water, kitchen & rent range",
  },
  {
    icon: Target,
    highlight: "Budget & ROI Match",
    label: "Calculate rent fit by capital & BEP target",
  },
];

export const START_DATE_PRESETS: StartDateOption[] = [
  { value: 1, label: "1st of the month" },
  { value: 15, label: "15th of the month" },
  { value: "eom", label: "End of month" },
];

export const MIN_LEASE_PERIOD_PRESETS: LeasePeriodOption[] = [
  { value: "1m", label: "1 month", months: 1 },
  { value: "3m", label: "3 months", months: 3 },
  { value: "6m", label: "6 months", months: 6 },
  { value: "12m", label: "12 months", months: 12 },
  { value: "custom", label: "Custom", months: null },
];

export const PAYMENT_CYCLE_OPTIONS: PaymentCycleOption[] = [
  { value: "month", label: "Monthly" },
  { value: "quarter", label: "Quarterly" },
  { value: "semester", label: "Semesterly" },
  { value: "year", label: "Yearly" },
];

export const DAY_OF_MONTH_OPTIONS: { value: DayOfMonthValue; label: string }[] =
  Array.from({ length: 28 }, (_, i) => {
    const day = i + 1;
    return { value: day, label: `Day ${day}` };
  });

export const LEASE_MONTHS_OPTIONS: {
  value: LeaseMonthsValue;
  label: string;
}[] = Array.from({ length: 12 }, (_, i) => {
  const month = i + 1;
  return {
    value: month,
    label: `${month} month${month > 1 ? "s" : ""}`,
  };
});

export const LANDMARK_CATEGORIES: LandmarkCategory[] = [
  { value: "campus", label: "Campus & University Area", icon: GraduationCap },
  { value: "school", label: "School District (SD/SMP/SMA)", icon: School },
  { value: "office", label: "Office & Commercial District", icon: Building2 },
  { value: "market", label: "Traditional & Modern Market", icon: ShoppingBag },
  { value: "residential", label: "Housing Complex & Settlement", icon: Home },
  {
    value: "transit-station",
    label: "Train & MRT/LRT Station",
    icon: TrainFront,
  },
  { value: "transit-bus", label: "Bus Terminal & Stop", icon: Bus },
  { value: "healthcare", label: "Hospital & Medical Center", icon: HeartPulse },
  {
    value: "culinary-center",
    label: "Food Court & Culinary Street",
    icon: Utensils,
  },
  { value: "government", label: "Government & Public Office", icon: Landmark },
  { value: "gas-station", label: "Gas Station (SPBU) Area", icon: Fuel },
  { value: "airport", label: "Airport / Logistics Hub", icon: Plane },
];

export const STALL_PLACEMENT_OPTIONS: StallPlacementOption[] = [
  { value: "indoor", label: "Indoor (Fully Enclosed / Air-Conditioned)" },
  { value: "semi-outdoor", label: "Semi-Outdoor (Covered / Canopy)" },
  { value: "outdoor", label: "Outdoor (Open Air / Courtyard)" },
];

export const FLOOR_COUNT_RANGE = { min: 1, max: 4, step: 1 } as const;

export const STALL_SIZE_RANGE = { min: 2, max: 100, step: 1 } as const;

export const OPERATING_HOURS_PRESETS = [
  { openingTime: "08:00", closingTime: "17:00", label: "08:00 – 17:00" },
  { openingTime: "10:00", closingTime: "22:00", label: "10:00 – 22:00" },
  { openingTime: "09:00", closingTime: "21:00", label: "09:00 – 21:00" },
] as const;

export const REGISTRATION_DEADLINE_PRESETS = [1, 2, 3, 5, 7, 14] as const;
export const EVENT_DURATION_PRESETS = [1, 2, 3, 5, 7, 14, 30] as const;
