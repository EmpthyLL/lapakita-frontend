import { LucideIcon } from "lucide-react";

export type BEPMonths = 3 | 6 | 12 | 18 | 24;
export type RadiusPreset = "1 km" | "3 km" | "5 km" | "10 km";

export type StartDateValue = 1 | 15 | "eom";
export type TempStartDateValue =
  | "event_day_1"
  | "event_day_2"
  | "event_week_1"
  | "event_week_2";
export type EventStartDayValue = string;

export type LeasePeriodValue = "1m" | "3m" | "6m" | "12m" | "custom";
export type PaymentCycle = "day" | "month" | "quarter" | "semester" | "year";

export type DayOfMonthValue = number;
export type LeaseMonthsValue = number;
export type LeaseDaysValue = number;

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
export type StallPermanenceType = "permanent" | "semi-permanent" | "temporary";

export type StallPropertyTypeValue =
  | "shophouse"
  | "garage-driveway"
  | "street-kiosk"
  | "mall-shop"
  | "mall-island"
  | "traditional-market-shop"
  | "open-market-stall"
  | "food-court-counter"
  | "street-vendor-spot"
  | "food-truck-spot"
  | "bazaar-booth";

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

export type EventOperatingDaysValue =
  | "everyday"
  | "weekends"
  | "weekdays"
  | "flexible";

export type AttendanceRequirementValue = "mandatory_full" | "flexible_days";

export type CancellationPolicyValue =
  | "pro_rata"
  | "deposit_refundable"
  | "non_refundable";

export interface Facility {
  value: FacilityValue;
  label: string;
  icon: LucideIcon;
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

export interface SearchInfoItem {
  icon: LucideIcon;
  highlight: string;
  label: string;
}

export interface StartDateOption {
  value: StartDateValue;
  label: string;
}

export interface TempStartDateOption {
  value: TempStartDateValue;
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

export interface RentRangeConfig {
  min: number;
  max: number;
  step: number;
}
