import { z } from "zod";

export const contactSchema = z
  .object({
    name: z.string().min(2, "Enter your full name"),
    email: z.string().email("Enter a valid email address"),
    whatsapp: z.string().optional(),
    persona: z.string().min(1, "Select who you are"),
    inquiryType: z.string().min(1, "Select an inquiry type"),
    message: z.string(),
  })
  .refine(
    (data) => {
      const minLength = data.persona === "partner" ? 20 : 10;
      return data.message.length >= minLength;
    },
    {
      message: "Message must be at least 10 characters",
      path: ["message"],
    },
  );

export type ContactValues = z.infer<typeof contactSchema>;

export interface SubmitContactInquiryResponse {
  id: string;
  name: string;
  email: string;
  status: string;
  created_at: string;
}
