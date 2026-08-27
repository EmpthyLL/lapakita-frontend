import { z } from "zod";

export const completeProfileSchema = z.object({
  setupToken: z.string().min(1, "Setup token is required"),
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  password: z.string().optional(),
  avatarUrl: z.string().optional(),
});

export type CompleteProfileValues = z.infer<typeof completeProfileSchema>;

export interface CompleteProfilePayload {
  setup_token: string;
  name: string;
  phone: string;
  avatar_url?: string;
}

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
