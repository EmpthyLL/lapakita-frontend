import { z } from "zod";
import { basePaginationQuerySchema, PaginatedResponse } from "../base";

export const phoneRequestSchema = z.object({
  number: z
    .string()
    .max(32)
    .optional()
    .nullable()
    .refine((val) => !val || val.length >= 10, {
      message: "Phone number must be at least 10 digits",
    }),
  is_primary: z.boolean(),
  roles: z.array(z.string()),
});

export type PhoneValues = z.infer<typeof phoneRequestSchema>;

export const phoneQueryParamsSchema = basePaginationQuerySchema.extend({
  number: z.string().optional(),
});

export type PhoneQueryParams = z.infer<typeof phoneQueryParamsSchema>;
export interface PhoneNumberItem {
  number: string;
  is_primary: boolean;
  roles: string[];
}

export type GetPhoneNumbersResponse = PaginatedResponse<PhoneNumberItem>;
