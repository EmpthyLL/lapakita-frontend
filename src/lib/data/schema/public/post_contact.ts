import z from "zod";

export const contactSchema = z.object({
  name: z.string().min(2, "Enter your full name"),
  email: z.string().email("Enter a valid email address"),
  whatsapp: z.string().optional(),
  persona: z.string().min(1, "Select who you are"),
  inquiryType: z.string().min(1, "Select an inquiry type"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

export type ContactValues = z.infer<typeof contactSchema>;
