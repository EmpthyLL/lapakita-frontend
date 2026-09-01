import { z } from "zod";
import { ResponseData } from "../base";
import { AuthResponseData } from "./login";

export const otpSchema = z.object({
  code: z.string().length(6, "OTP code must be 6 digits"),
});

export type OtpValues = z.infer<typeof otpSchema>;

export type OtpMode = "register" | "reset_password";

export function flowToOtpMode(flow: string): OtpMode {
  return flow === "register" ? "register" : "reset_password";
}

export interface VerifyOtpPayload {
  email: string;
  mode: OtpMode;
  otp_code: string;
}

/** Menyesuaikan DTO VerifyOTPResponse Go */
export interface VerifyOtpResponseData {
  verification_token?: string;
  auth_data?: AuthResponseData;
}

export type VerifyOtpResponse = ResponseData<VerifyOtpResponseData>;
