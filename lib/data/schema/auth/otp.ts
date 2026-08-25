import { z } from "zod";

export const otpSchema = z.object({
  code: z.string().length(6, "OTP code must be 6 digits"),
});

export type OtpValues = z.infer<typeof otpSchema>;
