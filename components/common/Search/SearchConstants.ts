import {
  AirVent,
  Armchair,
  Building,
  Building2,
  Bus,
  Car,
  Cctv,
  ConciergeBell,
  Container,
  Cylinder,
  Droplets,
  Flame,
  Fuel,
  GraduationCap,
  HeartPulse,
  Home,
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

/* ─── Ranges & Constants ─── */
export const BEP_PRESETS_MONTHS = [3, 6, 12, 18, 24] as const;
export type BEPMonths = (typeof BEP_PRESETS_MONTHS)[number];

export const RENT_RANGE = {
  min: 500_000,
  max: 20_000_000,
  step: 100_000,
} as const;
export const DEPOSIT_RANGE = {
  min: 500_000,
  max: 10_000_000,
  step: 100_000,
} as const;

export const DEFAULT_ASSUMED_CAPITAL = 20_000_000;
export const DEFAULT_BEP_MONTHS = BEP_PRESETS_MONTHS[1]; // 6

export const RADIUS_PRESETS = ["1 km", "3 km", "5 km", "10 km"] as const;
export type RadiusPreset = (typeof RADIUS_PRESETS)[number];

export const RADIUS_RANGE = { min: 0.5, max: 50, step: 0.5 } as const;

/* ─── Capabilities Info ─── */
export interface SearchInfoItem {
  icon: LucideIcon;
  highlight: string;
  label: string;
}

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

/* ─── Start Date Options ─── */
export const START_DATE_PRESETS = [
  { value: 1, label: "1st of the month" },
  { value: 15, label: "15th of the month" },
  { value: "eom", label: "End of month" },
] as const;

export type StartDate = (typeof START_DATE_PRESETS)[number]["value"];

export interface StartDateOption {
  value: StartDate;
  label: string;
}

/* ─── Lease Period Options ─── */
export const MIN_LEASE_PERIOD_PRESETS = [
  { value: "1m", label: "1 month", months: 1 },
  { value: "3m", label: "3 months", months: 3 },
  { value: "6m", label: "6 months", months: 6 },
  { value: "12m", label: "12 months", months: 12 },
  { value: "custom", label: "Custom", months: null },
] as const;

export type LeasePeriodValue =
  (typeof MIN_LEASE_PERIOD_PRESETS)[number]["value"];

export interface LeasePeriodOption {
  value: LeasePeriodValue;
  label: string;
  months: number | null;
}

/* ─── Payment Cycle ─── */
export const PAYMENT_CYCLE_OPTIONS = [
  { value: "month", label: "Monthly" },
  { value: "quarter", label: "Quarterly" },
  { value: "semester", label: "Semesterly" },
  { value: "year", label: "Yearly" },
] as const;

export type PaymentCycle = (typeof PAYMENT_CYCLE_OPTIONS)[number]["value"];

export interface PaymentCycleOption {
  value: PaymentCycle;
  label: string;
}

/* ─── Days & Months Dropdown Options (Numbers) ─── */
export const DAY_OF_MONTH_OPTIONS = Array.from({ length: 28 }, (_, i) => {
  const day = i + 1;
  return { value: day, label: `Day ${day}` };
});
export type DayOfMonthValue = number;

export const LEASE_MONTHS_OPTIONS = Array.from({ length: 12 }, (_, i) => {
  const month = i + 1;
  return {
    value: month,
    label: `${month} month${month > 1 ? "s" : ""}`,
  };
});
export type LeaseMonthsValue = number;

/* ─── Landmark Categories ─── */
export const LANDMARK_CATEGORIES = [
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
] as const;

export type LandmarkCategoryValue =
  (typeof LANDMARK_CATEGORIES)[number]["value"];

export interface LandmarkCategory {
  value: LandmarkCategoryValue;
  label: string;
  icon: LucideIcon;
}

/* ─── Stall Placement ─── */
export const STALL_PLACEMENT_OPTIONS = [
  { value: "indoor", label: "Indoor (Fully Enclosed / Air-Conditioned)" },
  { value: "semi-outdoor", label: "Semi-Outdoor (Covered / Canopy)" },
  { value: "outdoor", label: "Outdoor (Open Air / Courtyard)" },
] as const;

export type StallPlacement = (typeof STALL_PLACEMENT_OPTIONS)[number]["value"];

export interface StallPlacementOption {
  value: StallPlacement;
  label: string;
}

/* ─── Stall Property Type ─── */
export const STALL_PROPERTY_TYPES = [
  {
    value: "mall-island",
    label: "Mall Island / Kiosk Corridor",
    description: "Open 360-degree booth in high-footfall mall corridors.",
    icon: ShoppingBag,
  },
  {
    value: "mall-shop",
    label: "Enclosed Mall Shop / Retail Unit",
    description: "Private shopfront with glass doors inside a shopping center.",
    icon: Building2,
  },
  {
    value: "shophouse",
    label: "Shophouse / Ruko (Full or Shared Floor)",
    description: "Ground floor or shared space in a multi-story shophouse.",
    icon: Building,
  },
  {
    value: "traditional-market",
    label: "Traditional Market Stall (Lapak / Los Pasar)",
    description:
      "Open counter or enclosed stall inside wet/dry traditional markets.",
    icon: Store,
  },
  {
    value: "food-court-counter",
    label: "Food Court & Culinary Hub Counter",
    description: "Dedicated kitchen counter with shared customer seating area.",
    icon: Tent,
  },
  {
    value: "street-kiosk",
    label: "Street Kiosk / Container Stall",
    description:
      "Standalone booth, container, or mini shop facing primary roads.",
    icon: Container,
  },
  {
    value: "garage-driveway",
    label: "Home Garage / Front Yard Space",
    description:
      "Converted residential garage or private front yard for quiet SME ops.",
    icon: Warehouse,
  },
  {
    value: "food-truck-spot",
    label: "Food Truck / Mobile Unit Parking",
    description: "Designated parking bay with dedicated utility hookups.",
    icon: Truck,
  },
] as const;

export type StallPropertyTypeValue =
  (typeof STALL_PROPERTY_TYPES)[number]["value"];

export interface StallPropertyType {
  value: StallPropertyTypeValue;
  label: string;
  description: string;
  icon: LucideIcon;
}

export const STALL_SIZE_RANGE = { min: 2, max: 100, step: 1 } as const;

/* ─── Facility & Facility Groups ─── */
export const FACILITY_GROUPS = [
  {
    group: "Utility & Hardware",
    items: [
      { value: "power", label: "Power Supply (PLN)", icon: Zap },
      {
        value: "high-power",
        label: "High Power Capacity (>2200W)",
        icon: Plug,
      },
      { value: "water", label: "Clean Water Access", icon: Droplets },
      { value: "drainage", label: "Drainage & Waste Water", icon: Waves },
      { value: "grease-trap", label: "Grease Trap (F&B)", icon: Flame },
      { value: "ventilation", label: "Exhaust & Ventilation", icon: Wind },
      {
        value: "air-conditioner",
        label: "Air Conditioner (AC)",
        icon: AirVent,
      },
      { value: "gas-pipeline", label: "LPG / Gas Line Area", icon: Cylinder },
    ],
  },
  {
    group: "Customer Amenities",
    items: [
      { value: "wifi", label: "High-Speed WiFi", icon: Wifi },
      { value: "seating", label: "Customer Seating Area", icon: Armchair },
      { value: "parking", label: "Customer & Staff Parking", icon: Car },
      { value: "toilet", label: "Public / Shared Toilet", icon: ToiletIcon },
      {
        value: "display-case",
        label: "Front Store Window / Display",
        icon: Store,
      },
    ],
  },
  {
    group: "Space Management & Safety",
    items: [
      {
        value: "storage",
        label: "Private Stock / Storage Room",
        icon: Warehouse,
      },
      { value: "trash-area", label: "Daily Waste Disposal Area", icon: Trash2 },
      {
        value: "cleaning-service",
        label: "Shared Area Cleaning",
        icon: Sparkles,
      },
      { value: "security", label: "24/7 Security Guard", icon: ShieldCheck },
      { value: "cctv", label: "CCTV Surveillance", icon: Cctv },
      {
        value: "reception",
        label: "Shared Lobby / Reception",
        icon: ConciergeBell,
      },
      { value: "tv-display", label: "Digital Signage / TV Area", icon: Tv },
    ],
  },
] as const;

export type FacilityValue =
  (typeof FACILITY_GROUPS)[number]["items"][number]["value"];

export interface Facility {
  value: FacilityValue;
  label: string;
  icon: LucideIcon;
}

export interface FacilityGroup {
  group: string;
  items: readonly Facility[];
}
