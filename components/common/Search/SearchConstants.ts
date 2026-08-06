import { Store, Building2, Users, type LucideIcon } from "lucide-react";

export const BEP_PRESETS_MONTHS = [3, 6, 12, 18, 24];

export const RENT_RANGE = { min: 500_000, max: 20_000_000, step: 100_000 };
export const DEPOSIT_RANGE = { min: 0, max: 10_000_000, step: 100_000 };

export function formatIDR(value: number) {
  if (value >= 1_000_000) {
    return `Rp ${(value / 1_000_000).toFixed(value % 1_000_000 === 0 ? 0 : 1)}jt`;
  }
  return `Rp ${value.toLocaleString("id-ID")}`;
}

export interface TrustStat {
  icon: LucideIcon;
  value: string;
  label: string;
}

export const TRUST_STATS: TrustStat[] = [
  { icon: Store, value: "500+", label: "active stalls" },
  { icon: Building2, value: "40+", label: "cities" },
  { icon: Users, value: "1,200+", label: "tenants matched" },
];