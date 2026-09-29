import { z } from "zod";
import { ResponseData } from "../base";

export const updatePersonaSchema = z.object({
  display_name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(255),
  avatar_url: z.string().optional().nullable(),
  phone_number_index: z.number(),
});

export type UpdatePersonaValues = z.infer<typeof updatePersonaSchema>;

export interface PersonaProfileResponse {
  role: string;
  display_name: string;
  avatar_url: string;
  phone: { index: number; dial_code: string; number: string };
}

export type PersonaProfilePayload = ResponseData<PersonaProfileResponse>;
