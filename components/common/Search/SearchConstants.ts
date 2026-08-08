import { LucideIcon, MapPin, SlidersHorizontal, Target } from "lucide-react";

export const BEP_PRESETS_MONTHS = [3, 6, 12, 18, 24];

export const RENT_RANGE = { min: 500_000, max: 20_000_000, step: 100_000 };
export const DEPOSIT_RANGE = { min: 0, max: 10_000_000, step: 100_000 };

export function formatIDR(value: number) {
  if (value >= 1_000_000) {
    return `Rp ${(value / 1_000_000).toFixed(value % 1_000_000 === 0 ? 0 : 1)}jt`;
  }
  return `Rp ${value.toLocaleString("id-ID")}`;
}

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
