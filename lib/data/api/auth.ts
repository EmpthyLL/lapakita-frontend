import api from "@/lib/api";
import {
  AuthResponseData,
  CompleteProfilePayload,
} from "../schema/auth/complete_profile";
import { SendOtpPayload } from "../schema/auth/forget_password";
import { VerifyOtpPayload, VerifyOtpResponseData } from "../schema/auth/otp";
import { RegisterPayload } from "../schema/auth/register";
import { ResetPasswordPayload } from "../schema/auth/reset_password";

export async function registerUser(payload: RegisterPayload) {
  const res = await api.post("/auth/register", payload);
  return res.data;
}

export async function completeGoogleProfile(payload: CompleteProfilePayload) {
  const res = await api.post<AuthResponseData>(
    "/auth/complete-profile",
    payload,
  );
  return res.data;
}

export async function sendOTP(payload: SendOtpPayload) {
  const res = await api.post("/auth/otp/send", payload);
  return res.data;
}

export async function verifyOTP(payload: VerifyOtpPayload) {
  const res = await api.post<VerifyOtpResponseData>(
    "/auth/otp/verify",
    payload,
  );
  return res.data;
}

export async function resetPassword(payload: ResetPasswordPayload) {
  const { email, ...rest } = payload;
  const res = await api.post(
    `/auth/reset-password/${encodeURIComponent(email)}`,
    rest,
  );
  return res.data;
}
