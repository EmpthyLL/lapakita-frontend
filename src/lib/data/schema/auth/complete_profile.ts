import { z } from "zod";
import { ResponseData } from "../base";
import { UserPayload } from "./login";

// 1. Schema Validator Form (Lebih fleksibel)
export const completeProfileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  phone: z
    .string()
    .min(8, "Phone number must be at least 8 digits")
    .regex(/^[0-9+\s-]+$/, "Invalid phone number format"),
  avatarUrl: z.string().optional(),
});

export type CompleteProfileValues = z.infer<typeof completeProfileSchema>;

export type CompleteProfileResponse = ResponseData<UserPayload>;
