import { z } from "zod";
import { ResponseData } from "../base";

export const createBusinessSchema = z.object({
  business_type_id: z.string().uuid("Invalid business type ID"),
  name: z
    .string()
    .min(2, "Business name must be at least 2 characters")
    .max(255, "Business name must be at most 255 characters"),
  logo_url: z.string().url("Invalid logo URL").optional().nullable(),
});

export type CreateBusinessValues = z.infer<typeof createBusinessSchema>;

export interface CreateBusinessResponseData {
  id: string;
  user_id: string;
  business_type_id: string;
  name: string;
  logo_url?: string | null;
  created_at: string;
}

export type CreateBusinessResponse = ResponseData<CreateBusinessResponseData>;
