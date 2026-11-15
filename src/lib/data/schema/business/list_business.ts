import { z } from "zod";
import { basePaginationQuerySchema, PaginatedResponse } from "../base";

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
  created_at: string;
}

export type GetBusinessListResponse = PaginatedResponse<Business>;
