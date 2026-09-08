import { z } from "zod";
import { ResponseData } from "../base";

export const updatePersonaSchema = z.object({
  display_name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(255),
  avatar_url: z.string().optional().nullable(),
});

export type UpdatePersonaValues = z.infer<typeof updatePersonaSchema>;

export interface PersonaProfileResponse {
  role: string;
  display_name: string;
  avatar_url: string;
}

export type PersonaProfilePayload = ResponseData<PersonaProfileResponse>;
export type UpdatePersonaPayload = ResponseData<null>;
