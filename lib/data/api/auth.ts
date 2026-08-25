import api from "@/lib/api";
import {
  CompleteProfileResponseData,
  CompleteProfileValues,
} from "../schema/auth/complete_profile";
import { ForgotValues } from "../schema/auth/forget_password";
import { LoginValues } from "../schema/auth/login";
import { RegisterValues } from "../schema/auth/register";

export async function loginUser(values: LoginValues) {
  const res = await api.post("/auth/login", values);
  console.log(res);
  return res.data;
}

export async function registerUser(values: RegisterValues) {
  const res = await api.post("/auth/register", {
    name: values.name,
    email: values.email,
    password: values.password,
    phone: values.phone,
  });
  return res.data;
}

export async function completeGoogleProfile(values: CompleteProfileValues) {
  const res = await api.post<CompleteProfileResponseData>(
    "/auth/complete-profile",
    {
      setup_token: values.setupToken,
      name: values.name,
      password: values.password,
      phone: values.phone,
      avatar_url: values.avatarUrl,
    },
  );
  return res.data;
}

export async function sendOTP(
  values: ForgotValues & { mode: "register" | "reset_password" },
) {
  const res = await api.post("/auth/otp/send", {
    email: values.email,
    mode: values.mode,
  });
  return res.data;
}

export async function verifyOTP(payload: {
  state_payload: string;
  otp_code: string;
}) {
  const res = await api.post("/auth/otp/verify", payload);
  return res.data;
}

export async function resetPassword(payload: {
  verification_token: string;
  new_password: string;
}) {
  const res = await api.post("/auth/reset-password", payload);
  return res.data;
}
