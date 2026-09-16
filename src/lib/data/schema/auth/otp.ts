import { z } from "zod";
import { ResponseData } from "../base";
import { AuthResponseData } from "./login";

export type OtpMode = "register" | "reset_password";

export function flowToOtpMode(flow: string): OtpMode {
  return flow === "register" ? "register" : "reset_password";
}

export const otpSchema = z.object({
  email: z.string().email("Email address is invalid"),
  mode: z.enum(["register", "reset_password"] as const),
  otp_code: z.string().length(6, "OTP code must be 6 digits"),
});

export type OtpValues = z.infer<typeof otpSchema>;

export interface VerifyOtpResponseData {
  verification_token?: string;
  auth_data?: AuthResponseData;
}

export type VerifyOtpResponse = ResponseData<VerifyOtpResponseData>;
