// lib/data/schema/auth/complete_profile.ts
import { z } from "zod";
import { ResponseData } from "../base";
import { UserPayload } from "./login";

export const completeProfileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  phone: z.object({
    dialCode: z.string().min(1, "Dial code is required"),
    number: z.string().min(5, "Phone number is invalid"),
  }),
  avatar_url: z.string().optional(),
});

export type CompleteProfileValues = z.infer<typeof completeProfileSchema>;

export type CompleteProfileResponse = ResponseData<UserPayload>;
