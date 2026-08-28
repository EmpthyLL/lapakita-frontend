import { z } from "zod";
import { ResponseData } from "../base";

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

// 2. Payload Request ke Backend API Go
export interface CompleteProfilePayload {
  name: string;
  phone: string;
  avatar_url?: string;
}

// 3. User & Auth Response Data
export interface PhonePayload {
  number: string;
  is_primary: boolean;
  roles: string[];
}

export interface PersonaDetail {
  display_name: string;
  avatar_url: string;
  phone: string;
}

export interface UserPayload {
  id: string;
  default_name: string;
  default_avatar_url?: string | null;
  default_phone: string;
  email: string;
  is_password_set: boolean;
  active_role: string;
  subscription_plan: string;
  subscription_expires_at?: string | null;
  phone_numbers: PhonePayload[];
  personas: Record<string, PersonaDetail>;
  token: string;
}

export interface AuthResponseData {
  user: UserPayload;
  access_token: string;
  refresh_token: string;
}

export type CompleteProfileResponse = ResponseData<AuthResponseData>;
