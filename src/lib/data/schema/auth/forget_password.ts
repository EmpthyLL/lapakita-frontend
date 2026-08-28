import { z } from "zod";
import { ResponseData } from "../base";

export const forgotSchema = z.object({
  email: z.string().email("Invalid email address"),
});

export type ForgotValues = z.infer<typeof forgotSchema>;

export interface SendOtpPayload {
  email: string;
  mode: "register" | "reset_password";
}

export type SendOtpResponse = ResponseData<null>;
