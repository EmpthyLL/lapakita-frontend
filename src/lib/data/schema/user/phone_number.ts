import { Role, ROLE_VALUES } from "@/types";
import { z } from "zod";
import { basePaginationQuerySchema, PaginatedResponse } from "../base";

export const phoneRequestSchema = z.object({
  dial_code: z.string(),
  number: z.string().min(5, "Phone number is invalid"),
  is_primary: z.boolean(),
  roles: z.array(z.enum(ROLE_VALUES)),
});

export type PhoneValues = z.infer<typeof phoneRequestSchema>;

export const phoneQueryParamsSchema = basePaginationQuerySchema.extend({
  seach: z.string().optional(),
});

export type PhoneQueryParams = z.infer<typeof phoneQueryParamsSchema>;

export interface PhoneNumberItem {
  display_label: string;
  flag: string;
  index: number;
  dial_code: string;
  number: string;
  is_primary: boolean;
  roles: Role[];
}

export type GetPhoneNumbersResponse = PaginatedResponse<PhoneNumberItem>;
