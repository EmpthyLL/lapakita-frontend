import api from "@/lib/api";
import {
  CompleteProfileResponse,
  CompleteProfileValues,
} from "../schema/auth/complete_profile";
import { ForgotValues } from "../schema/auth/forget_password";
import { GoogleAuthPayload, GoogleAuthResponse } from "../schema/auth/google";
import { LoginResponse, LoginValues } from "../schema/auth/login";
import { OtpValues, VerifyOtpResponse } from "../schema/auth/otp";
import { RegisterValues } from "../schema/auth/register";
import { ResetValues } from "../schema/auth/reset_password";

export async function googleAuth(payload: GoogleAuthPayload) {
  const res = await api.post<GoogleAuthResponse>("/auth/google", payload);
  return res.data;
}

export async function loginUser(payload: LoginValues) {
  const res = await api.post<LoginResponse>("/auth/login", payload);
  return res.data;
}

export async function registerUser(payload: RegisterValues) {
  const res = await api.post("/auth/register", payload);
  return res.data;
}

export async function completeGoogleProfile(payload: CompleteProfileValues) {
  const res = await api.put<CompleteProfileResponse>(
    "/auth/complete-profile",
    payload,
  );
  return res.data;
}

export async function sendOTP(payload: ForgotValues) {
  const res = await api.post("/auth/otp/send", payload);
  return res.data;
}

export async function verifyOTP(payload: OtpValues) {
  const res = await api.post<VerifyOtpResponse>("/auth/otp/verify", payload);
  return res.data;
}

export async function resetPassword(payload: ResetValues) {
  const { email, ...rest } = payload;
  const res = await api.post(
    `/auth/reset-password/${encodeURIComponent(email)}`,
    rest,
  );
  return res.data;
}
