import {
  Building,
  Building2,
  CalendarDays,
  Clock,
  Container,
  Key,
  ShoppingBag,
  Store,
  Tent,
  Truck,
  Warehouse,
} from "lucide-react";
import { MASTER_FACILITIES } from "./facilities";
import {
  Facility,
  StallPermanenceTabOption,
  StallPermanenceType,
  StallPlacement,
  StallPlacementOption,
  StallPropertyType,
  StallPropertyTypeValue,
} from "./types";

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
    allowedPaymentCycles: ["month", "quarter", "semester"],
  },
  {
    value: "temporary",
    label: "Temporary & Event Spots",
    shortLabel: "Temporary & Pop-Up",
    description:
      "Pop-up event booths, street vendor spots, or food truck bays with short-term schedules.",
    icon: CalendarDays,
    allowedPaymentCycles: ["day", "month"],
  },
];

export const STALL_PLACEMENT_OPTIONS: StallPlacementOption[] = [
  { value: "indoor", label: "Indoor (Fully Enclosed / Air-Conditioned)" },
  { value: "semi-outdoor", label: "Semi-Outdoor (Covered / Canopy)" },
  { value: "outdoor", label: "Outdoor (Open Air / Courtyard)" },
];

export const STALL_PROPERTY_TYPES: StallPropertyType[] = [
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

  const allowedSet = new Set<string>();
  source.forEach((t) => t.allowedFacilities.forEach((f) => allowedSet.add(f)));

  return Array.from(allowedSet)
    .map(
      (facKey) => MASTER_FACILITIES[facKey as keyof typeof MASTER_FACILITIES],
    )
    .filter(Boolean);
}
