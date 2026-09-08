import { z } from "zod";
import { ResponseData } from "../base";

export const changePasswordSchema = z.object({
  current_password: z
    .string()
    .optional()
    .nullable()
    .refine((val) => !val || val.length >= 8, {
      message: "Password must be at least 8 characters",
    }),
  new_password: z
    .string()
    .max(64)
    .optional()
    .nullable()
    .refine((val) => !val || val.length >= 8, {
      message: "Password must be at least 8 characters",
    }),
});

export type ChangePasswordValues = z.infer<typeof changePasswordSchema>;

export type ChangePasswordPayload = ResponseData<null>;
