import { z } from "zod";
import { basePaginationQuerySchema, PaginatedResponse } from "../base";
import { BusinessFrontPlatform } from "./business_front";

export interface BusinessFrontItem {
  id: string;
  platform: BusinessFrontPlatform | string;
  store_name: string;
  store_url?: string | null;
  is_active: boolean;
}

export const listBusinessQuerySchema = basePaginationQuerySchema.extend({
  business_type_id: z.string().optional(),
  search: z.string().optional(),
});

export type ListBusinessQueryParams = z.infer<typeof listBusinessQuerySchema>;

export interface Business {
  id: string;
  name: string;
  logo_url?: string | null;
  business_type_name: string;
  fronts?: BusinessFrontItem[];
  total_fronts?: number;
  created_at: string;
}

export type GetBusinessListResponse = PaginatedResponse<Business>;
