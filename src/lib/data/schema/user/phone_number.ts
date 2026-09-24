import { Role, ROLE_VALUES } from "@/types";
import { z } from "zod";
import { basePaginationQuerySchema, PaginatedResponse } from "../base";

export const phoneRequestSchema = z.object({
  label: z
    .string()
    .min(1, "Label is required")
    .max(100, "Label must be at most 100 characters"),
  dial_code: z.string().max(8),
  number: z
    .string()
    .min(5, "Phone number is invalid")
    .max(32, "Number is too long"),
  is_primary: z.boolean(),
  roles: z.array(z.enum(ROLE_VALUES)).optional(),
});

export type PhoneValues = z.infer<typeof phoneRequestSchema>;

export const phoneQueryParamsSchema = basePaginationQuerySchema.extend({
  search: z.string().optional(),
  dial_code: z.string().optional(),
  role: z.string().optional(),
});

export type PhoneQueryParams = z.infer<typeof phoneQueryParamsSchema>;

export interface PhoneNumberItem {
  index: number;
  label: string;
  display_label?: string;
  flag?: string;
  dial_code: string;
  number: string;
  is_primary: boolean;
  roles: Role[];
}

export type GetPhoneNumbersResponse = PaginatedResponse<PhoneNumberItem>;
