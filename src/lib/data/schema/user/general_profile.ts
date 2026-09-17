import type { Role } from "@/types";
import { z } from "zod";
import { ResponseData } from "../base";

export const updateGeneralProfileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(255),
  default_avatar_url: z.string().optional().nullable(),
  phone_number_index: z.number().optional().nullable(),
  active_role: z.enum(["tenant", "owner", "supplier"] as const),
});

export type UpdateGeneralProfileValues = z.infer<
  typeof updateGeneralProfileSchema
>;

export interface GetGeneralProfileResponse {
  id: string;
  name: string;
  email: string;
  default_avatar_url: string;
  phone: { index: number; dial_code: string; number: string };
  active_role: Role;
}

export type GetGeneralProfilePayload = ResponseData<GetGeneralProfileResponse>;
export type UpdateGeneralProfilePayload = ResponseData<null>;
