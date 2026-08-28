import { z } from "zod";
import { ResponseData } from "../base";
import { AuthResponseData } from "./complete_profile";

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export type LoginValues = z.infer<typeof loginSchema>;

export interface LoginPayload {
  email: string;
  password: string;
}

export type LoginResponseData = AuthResponseData;
export type LoginResponse = ResponseData<LoginResponseData>;
