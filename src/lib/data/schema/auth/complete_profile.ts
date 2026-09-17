import { z } from "zod";
import { ResponseData } from "../base";
import { UserPayload } from "./login";

export const completeProfileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  dial_code: z.string(),
  phone: z.string().min(5, "Phone number is invalid"),
  avatar_url: z.string().optional(),
});

export type CompleteProfileValues = z.infer<typeof completeProfileSchema>;

export type CompleteProfileResponse = ResponseData<UserPayload>;
