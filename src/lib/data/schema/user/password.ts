import { z } from "zod";

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
    .min(8, "Password must be at least 8 characters")
    .max(64),
});

export type ChangePasswordValues = z.infer<typeof changePasswordSchema>;
