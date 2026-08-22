import { z } from "zod";

export const registerSchema = z
  .object({
    isGoogleMode: z.boolean(),
    name: z.string().min(3, "Name must be at least 3 characters"),
    phone: z
      .string()
      .min(9, "Enter a valid phone number")
      .regex(/^[0-9+ ]+$/, "Phone number can only contain numbers"),
    email: z.string().optional(),
    password: z.string().optional(),
    confirm_password: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    // Jika BUKAN Google Mode (Form Pendaftaran Email Manual)
    if (!data.isGoogleMode) {
      if (!data.email || !z.string().email().safeParse(data.email).success) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Enter a valid email address",
          path: ["email"],
        });
      }

      if (!data.password || data.password.length < 8) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Password must be at least 8 characters",
          path: ["password"],
        });
      } else {
        if (!/[A-Z]/.test(data.password)) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Must include at least one uppercase letter",
            path: ["password"],
          });
        }
        if (!/[0-9]/.test(data.password)) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Must include at least one number",
            path: ["password"],
          });
        }
      }

      if (!data.confirm_password) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Please confirm your password",
          path: ["confirm_password"],
        });
      } else if (data.password !== data.confirm_password) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Passwords do not match",
          path: ["confirm_password"],
        });
      }
    }
  });

export type RegisterValues = z.infer<typeof registerSchema>;
