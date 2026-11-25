import { z } from "zod";
import { basePaginationQuerySchema, PaginatedResponse } from "../base";

export const businessFrontPlatformEnum = z.enum([
  "offline_stall",
  "shopee",
  "tokopedia",
  "lazada",
  "bukalapak",
  "blibli",
  "gofood",
  "grabfood",
  "website",
  "other",
]);

export type BusinessFrontPlatform = z.infer<typeof businessFrontPlatformEnum>;

export const getBusinessFrontsQuerySchema = basePaginationQuerySchema.extend({
  search: z.string().optional(),
  platform: z.string().optional(),
});

export type GetBusinessFrontsQueryParams = z.infer<
  typeof getBusinessFrontsQuerySchema
>;

export interface BusinessFrontResponse {
  id: string;
  business_id: string;
  platform: string;
  store_name: string;
  store_url?: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export type GetBusinessFrontsResponse =
  PaginatedResponse<BusinessFrontResponse>;

export const addBusinessFrontSchema = z.object({
  platform: businessFrontPlatformEnum,
  store_name: z
    .string()
    .min(2, "Store name must be at least 2 characters")
    .max(255, "Store name must be at most 255 characters"),
  store_url: z
    .string()
    .url("Invalid URL format")
    .optional()
    .nullable()
    .or(z.literal("")),
  is_active: z.boolean().optional(),
});

export type AddBusinessFrontValues = z.infer<typeof addBusinessFrontSchema>;

export const updateBusinessFrontSchema = addBusinessFrontSchema.partial();

export type UpdateBusinessFrontValues = z.infer<
  typeof updateBusinessFrontSchema
>;
