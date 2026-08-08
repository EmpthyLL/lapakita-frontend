import {
  SlidersHorizontal,
  Target,
  Wallet,
  type LucideIcon,
} from "lucide-react";

export const BEP_PRESETS_MONTHS = [3, 6, 12, 18, 24];

export const RENT_RANGE = { min: 500_000, max: 20_000_000, step: 100_000 };
export const DEPOSIT_RANGE = { min: 0, max: 10_000_000, step: 100_000 };

export function formatIDR(value: number) {
  if (value >= 1_000_000) {
    return `Rp ${(value / 1_000_000).toFixed(value % 1_000_000 === 0 ? 0 : 1)}jt`;
  }
  return `Rp ${value.toLocaleString("id-ID")}`;
}

export interface SearchCapability {
  icon: LucideIcon;
  title: string;
  description: string;
}

export const SEARCH_CAPABILITIES: SearchCapability[] = [
  {
    icon: Target,
    title: "Landmark & Radius",
    description: "Search near campuses, schools, or office hubs",
  },
  {
    icon: SlidersHorizontal,
    title: "Facility Matching",
    description: "Filter power kVA, water, kitchen & seating",
  },
  {
    icon: Wallet,
    title: "Price & Escrow Lock",
    description: "Transparent rent & deposit min-max budget",
  },
];
