import { z } from "zod";
import { PaginatedResponse } from "../base";

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

export const savePhoneNumbersSchema = z.object({
  phone_numbers: z.array(phoneRequestSchema),
});

export type PhoneValues = z.infer<typeof phoneRequestSchema>;
export type SavePhoneNumbersValues = z.infer<typeof savePhoneNumbersSchema>;

export interface PhoneNumberItem {
  number: string;
  is_primary: boolean;
  roles: string[];
}

export type GetPhoneNumbersResponse = PaginatedResponse<PhoneNumberItem>;
