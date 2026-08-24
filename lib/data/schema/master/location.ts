import {
  basePaginationQuerySchema,
  PaginatedResponse,
} from "@/lib/data/schema/base";
import { z } from "zod";

export type AreaType =
  | "country"
  | "province"
  | "city"
  | "district"
  | "suburb"
  | "street";

// ── Struct / DTO Response: Search General (/areas) ──────────────────────────
export interface AreaGeneralResponseData {
  type: AreaType;
  title: string;
  subtitle: string;
  full_label: string;
  country: string;
  country_code: string;
  city?: string;
  province?: string;
  district?: string;
  suburb?: string;
}

export type AreaGeneralResponse = PaginatedResponse<AreaGeneralResponseData>;

// ── Struct / DTO Response: Search Detail (/areas/detail) ─────────────────────
export interface AreaDetailResponseData {
  formatted: string;
  street_address: string;
  suburb: string;
  district: string;
  city: string;
  province: string;
  country: string;
  country_code: string;
  postal_code: string;
  latitude: number;
  longitude: number;
  map_url: string;
  embedded_map_url: string;
}

export type AreaDetailResponse = PaginatedResponse<AreaDetailResponseData>;

// ── Query Schema ────────────────────────────────────────────────────────────
export const getAreaQuerySchema = basePaginationQuerySchema.extend({
  search: z.string(),
});

export type GetAreaQuery = z.infer<typeof getAreaQuerySchema>;
