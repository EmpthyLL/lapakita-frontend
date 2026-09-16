import { z } from "zod";

export const resetSchema = z
  .object({
    email: z.string().email("Email address is invalid"),
    verification_token: z.string(),
    new_password: z.string().min(8, "Password must be at least 8 characters"),
    confirm_password: z.string(),
  })
  .refine((data) => data.new_password === data.confirm_password, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type ResetValues = z.infer<typeof resetSchema>;
