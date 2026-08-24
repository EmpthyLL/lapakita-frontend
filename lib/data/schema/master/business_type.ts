import {
  FacilityValue,
  LandmarkCategoryValue,
  StallPlacement,
  StallPropertyTypeValue,
} from "@/components/common/search/constants/types";
import {
  basePaginationQuerySchema,
  PaginatedResponse,
} from "@/lib/data/schema/base";
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

export interface BusinessType {
  id: string;
  label: string;
  group_name: string;
  default_bep_months: number;
  default_capital: number;
  avg_gross_margin_ratio: number;
  industry_rent_to_revenue_ratio: number;
  permanence_presets: PermanencePresetsMap;
  recommended_landmarks: LandmarkCategoryValue[];
}

export type BusinessTypeResponce = PaginatedResponse<BusinessType>;
