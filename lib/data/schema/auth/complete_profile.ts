import { z } from "zod";

export const completeProfileSchema = z.object({
  setupToken: z.string().min(1, "Setup token is required"),
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  avatarUrl: z.string().optional(),
});

export type CompleteProfileValues = z.infer<typeof completeProfileSchema>;

export interface CompleteProfileResponseData {
  user: {
    id: string;
    name: string;
    email: string;
    phone: string;
    avatarUrl?: string;
    activeRole: string;
    subscriptionPlan: string;
    subscriptionExpiresAt?: string;
    token: string;
  };
  access_token: string;
  refresh_token: string;
}
