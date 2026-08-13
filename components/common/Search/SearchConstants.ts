import {
  AirVent,
  Armchair,
  Building2,
  Bus,
  Car,
  Cctv,
  ConciergeBell,
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
  ToiletIcon,
  TrainFront,
  Trash2,
  Tv,
  Utensils,
  Warehouse,
  Waves,
  Wifi,
  Wind,
  Zap,
} from "lucide-react";

export const BEP_PRESETS_MONTHS = [3, 6, 12, 18, 24];

export const RENT_RANGE = { min: 500_000, max: 20_000_000, step: 100_000 };
export const DEPOSIT_RANGE = { min: 500_000, max: 10_000_000, step: 100_000 };

// General assumptions — dipakai selama business type belum dipilih
export const DEFAULT_ASSUMED_CAPITAL = 20_000_000;
export const DEFAULT_BEP_MONTHS = BEP_PRESETS_MONTHS[1]; // 6 months

export const RADIUS_PRESETS = ["1 km", "3 km", "5 km", "10 km"];
export const RADIUS_RANGE = { min: 0.5, max: 50, step: 0.5 };

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

export interface StartDateOption {
  value: string;
  label: string;
}

export const START_DATE_PRESETS: StartDateOption[] = [
  { value: "1", label: "1st of the month" },
  { value: "15", label: "15th of the month" },
  { value: "eom", label: "End of month" },
];

export interface LeasePeriodOption {
  value: string;
  label: string;
  months: number | null;
}

export const MIN_LEASE_PERIOD_PRESETS: LeasePeriodOption[] = [
  { value: "1m", label: "1 month", months: 1 },
  { value: "3m", label: "3 months", months: 3 },
  { value: "6m", label: "6 months", months: 6 },
  { value: "12m", label: "12 months", months: 12 },
  { value: "custom", label: "Custom", months: null },
];

export type PaymentCycle = "monthly" | "quarterly" | "semesterly" | "yearly";

export interface PaymentCycleOption {
  value: PaymentCycle;
  label: string;
}

export const PAYMENT_CYCLE_OPTIONS: PaymentCycleOption[] = [
  { value: "monthly", label: "Monthly" },
  { value: "quarterly", label: "Quarterly" },
  { value: "semesterly", label: "Semesterly" },
  { value: "yearly", label: "Yearly" },
];

export const DAY_OF_MONTH_OPTIONS: { value: string; label: string }[] =
  Array.from({ length: 28 }, (_, i) => {
    const day = i + 1;
    return { value: String(day), label: `Day ${day}` };
  });

export const LEASE_MONTHS_OPTIONS: { value: string; label: string }[] =
  Array.from({ length: 12 }, (_, i) => {
    const month = i + 1;
    return {
      value: String(month),
      label: `${month} month${month > 1 ? "s" : ""}`,
    };
  });

export interface LandmarkCategory {
  value: string;
  label: string;
  icon: LucideIcon;
}

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

export type StallType = "indoor" | "semi-outdoor" | "outdoor";

export interface StallTypeOption {
  value: StallType;
  label: string;
}

export const STALL_TYPE_OPTIONS: StallTypeOption[] = [
  { value: "indoor", label: "Indoor" },
  { value: "semi-outdoor", label: "Semi-outdoor" },
  { value: "outdoor", label: "Outdoor" },
];

export const STALL_SIZE_RANGE = { min: 2, max: 100, step: 1 };

export interface Facility {
  value: string;
  label: string;
  icon: LucideIcon;
}

export interface FacilityGroup {
  group: string;
  items: Facility[];
}

export const FACILITY_GROUPS: FacilityGroup[] = [
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
];

// flat list, kept for anywhere that still needs a plain array (e.g. lookups by value)
export const FACILITIES: Facility[] = FACILITY_GROUPS.flatMap((g) => g.items);
