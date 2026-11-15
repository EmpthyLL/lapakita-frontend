import { z } from "zod";

export const createBusinessSchema = z.object({
  business_type_id: z.string().min(1, "Business type is required"),
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(120, "Name must be at most 120 characters"),
  logo_url: z.string().url("Invalid URL format").optional().nullable(),
});

export type CreateBusinessValues = z.infer<typeof createBusinessSchema>;
