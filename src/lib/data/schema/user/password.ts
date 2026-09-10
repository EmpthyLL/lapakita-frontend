import { z } from "zod";

export const passwordSchema = z
  .object({
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
    confirm_password: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.new_password === data.confirm_password, {
    message: "Passwords do not match",
    path: ["confirm_password"],
  });

export type PasswordValues = z.infer<typeof passwordSchema>;
