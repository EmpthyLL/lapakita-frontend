import { z } from "zod";
import { ResponseData } from "../base";

export const resetSchema = z
  .object({
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(6, "Confirm password is required"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type ResetValues = z.infer<typeof resetSchema>;

export interface ResetPasswordPayload {
  email: string;
  verification_token: string;
  new_password: string;
}

export type ResetPasswordResponse = ResponseData<null>;
