import { z } from "zod";

export const forgotSchema = z.object({
  email: z.string().email("Email address is invalid"),
  mode: z.enum(["register", "reset_password"] as const),
});

export type ForgotValues = z.infer<typeof forgotSchema>;
