import { Role } from "@/types";
import { z } from "zod";
import { basePaginationQuerySchema, PaginatedResponse } from "../base";

export const phoneRequestSchema = z.object({
  number: z.string().min(10, "Phone number must be at least 10 digits"),
  is_primary: z.boolean(),
  roles: z.array(z.enum(["tenant", "owner", "supplier"] as const)),
});

export type PhoneValues = z.infer<typeof phoneRequestSchema>;

export const phoneQueryParamsSchema = basePaginationQuerySchema.extend({
  number: z.string().optional(),
});

export type PhoneQueryParams = z.infer<typeof phoneQueryParamsSchema>;
export interface PhoneNumberItem {
  index: string;
  number: string;
  is_primary: boolean;
  roles: Role[];
}

export type GetPhoneNumbersResponse = PaginatedResponse<PhoneNumberItem>;
