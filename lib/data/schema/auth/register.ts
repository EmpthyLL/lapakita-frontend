import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  email: z.string().email("Enter a valid email address"),
  phone: z
    .string()
    .min(9, "Enter a valid phone number")
    .regex(/^[0-9+ ]+$/, "Phone number can only contain numbers"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Must include at least one uppercase letter")
    .regex(/[0-9]/, "Must include at least one number"),
  referralCode: z.string().optional(),
});

export type RegisterValues = z.infer<typeof registerSchema>;
