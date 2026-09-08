import { z } from "zod";
import { ResponseData } from "../base";

export const phoneNumberItemSchema = z.object({
  number: z.string().min(10, "Phone number must be at least 10 digits").max(32),
  is_primary: z.boolean(),
  roles: z.array(z.string()),
});

export const phoneRequestSchema = z.object({
  number: z.string().min(10, "Phone number must be at least 10 digits").max(32),
  is_primary: z.boolean(),
  roles: z.array(z.string()),
});

export type PhoneValues = z.infer<typeof phoneRequestSchema>;

export interface GetPhoneNumbersResponse {
  phone_numbers: z.infer<typeof phoneNumberItemSchema>[];
}

export type GetPhoneNumbersPayload = ResponseData<GetPhoneNumbersResponse>;
export type AddPhoneNumberPayload = ResponseData<null>;
export type UpdatePhoneNumberPayload = ResponseData<null>;
export type DeletePhoneNumberPayload = ResponseData<null>;
