import { z } from "zod";
import { ResponseData } from "../base";

export const loginSchema = z.object({
  email: z.string().email("Email address is invalid"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export type LoginValues = z.infer<typeof loginSchema>;

export interface LoginPayload {
  email: string;
  password: string;
}

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

export type LoginResponse = ResponseData<AuthResponseData>;
