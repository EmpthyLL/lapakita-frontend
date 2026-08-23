import {
  FacilityValue,
  LandmarkCategoryValue,
  StallPlacement,
  StallPropertyTypeValue,
} from "@/components/common/search/constants/types";
import { basePaginationQuerySchema } from "@/lib/data/schema/base";
import { z } from "zod";

export const getBusinessTypesQuerySchema = basePaginationQuerySchema.extend({
  search: z.string().optional(),
  group: z.string().optional(),
});

export type GetBusinessTypesQuery = z.infer<typeof getBusinessTypesQuerySchema>;

export interface BasePresetConfig {
  allowedPropertyTypes: StallPropertyTypeValue[];
  allowedPlacements: StallPlacement[];
  defaultPlacement: StallPlacement;
  facilities: FacilityValue[];
}

export interface PermanentPresetConfig extends BasePresetConfig {
  recommendedSizeSqm: { min: number; max: number };
  recommendedFloors: { min: number; max: number };
}

export interface SemiPermanentPresetConfig extends BasePresetConfig {
  defaultOpeningTime: string;
  defaultClosingTime: string;
}

export interface TemporaryPresetConfig extends BasePresetConfig {
  registrationWindowDaysBefore: number;
  typicalDurationDays: number;
}

export interface PermanencePresetsMap {
  permanent?: PermanentPresetConfig;
  "semi-permanent"?: SemiPermanentPresetConfig;
  temporary?: TemporaryPresetConfig;
}

// ── Model Domain Frontend ───────────────────────────────────────────────────
export interface BusinessType {
  id: string;
  label: string;
  group: string;
  defaultBEPMonths: number;
  defaultCapital: number;
  avgGrossMarginRatio: number;
  industryRentToRevenueRatio: number;
  permanencePresets: PermanencePresetsMap;
  landmarks: LandmarkCategoryValue[];
}

// ── Raw Response DTO dari API Backend (Golang) ────────────────────────────────
export interface RawBusinessTypeResponse {
  id: string;
  label: string;
  group_name: string;
  default_bep_months: number;
  default_capital: number;
  avg_gross_margin_ratio: number;
  industry_rent_to_revenue_ratio: number;
  permanence_presets: PermanencePresetsMap | string;
  recommended_landmarks: LandmarkCategoryValue[] | string;
}

// ── Helper Mapper dari Backend Response ke Model Domain Frontend ─────────────
export function mapRawBusinessType(raw: RawBusinessTypeResponse): BusinessType {
  let permanencePresets: PermanencePresetsMap = {};
  if (typeof raw.permanence_presets === "string") {
    try {
      permanencePresets = JSON.parse(raw.permanence_presets);
    } catch {
      permanencePresets = {};
    }
  } else if (raw.permanence_presets) {
    permanencePresets = raw.permanence_presets;
  }

  let landmarks: LandmarkCategoryValue[] = [];
  if (typeof raw.recommended_landmarks === "string") {
    try {
      landmarks = JSON.parse(raw.recommended_landmarks);
    } catch {
      landmarks = [];
    }
  } else if (Array.isArray(raw.recommended_landmarks)) {
    landmarks = raw.recommended_landmarks;
  }

  return {
    id: raw.id,
    label: raw.label,
    group: raw.group_name,
    defaultBEPMonths: raw.default_bep_months,
    defaultCapital: raw.default_capital,
    avgGrossMarginRatio: raw.avg_gross_margin_ratio,
    industryRentToRevenueRatio: raw.industry_rent_to_revenue_ratio,
    permanencePresets,
    landmarks,
  };
}
