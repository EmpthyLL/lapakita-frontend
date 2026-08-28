import api from "@/lib/api";
import {
  CompleteProfilePayload,
  CompleteProfileResponse,
} from "../schema/auth/complete_profile";
import {
  SendOtpPayload,
  SendOtpResponse,
} from "../schema/auth/forget_password";
import { GoogleAuthPayload, GoogleAuthResponse } from "../schema/auth/google";
import { LoginPayload, LoginResponse } from "../schema/auth/login";
import { VerifyOtpPayload, VerifyOtpResponse } from "../schema/auth/otp";
import { RegisterPayload, RegisterResponse } from "../schema/auth/register";
import {
  ResetPasswordPayload,
  ResetPasswordResponse,
} from "../schema/auth/reset_password";

export async function googleAuth(payload: GoogleAuthPayload) {
  const res = await api.post<GoogleAuthResponse>("/auth/google", payload);
  return res.data;
}

export async function loginUser(payload: LoginPayload) {
  const res = await api.post<LoginResponse>("/auth/login", payload);
  return res.data;
}

export async function registerUser(payload: RegisterPayload) {
  const res = await api.post<RegisterResponse>("/auth/register", payload);
  return res.data;
}

export async function completeGoogleProfile(payload: CompleteProfilePayload) {
  const res = await api.post<CompleteProfileResponse>(
    "/auth/complete-profile",
    payload,
  );
  return res.data;
}

export async function sendOTP(payload: SendOtpPayload) {
  const res = await api.post<SendOtpResponse>("/auth/otp/send", payload);
  return res.data;
}

export async function verifyOTP(payload: VerifyOtpPayload) {
  const res = await api.post<VerifyOtpResponse>("/auth/otp/verify", payload);
  return res.data;
}

export async function resetPassword(payload: ResetPasswordPayload) {
  const { email, ...rest } = payload;
  const res = await api.post<ResetPasswordResponse>(
    `/auth/reset-password/${encodeURIComponent(email)}`,
    rest,
  );
  return res.data;
}
