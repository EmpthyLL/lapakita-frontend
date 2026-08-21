import { z } from "zod";

export const completeProfileSchema = z.object({
  name: z.string().min(2, "Enter your full name"),
  phone: z
    .string()
    .min(9, "Enter a valid phone number")
    .regex(/^[0-9+ ]+$/, "Phone number can only contain numbers"),
});

export type CompleteProfileValues = z.infer<typeof completeProfileSchema>;
