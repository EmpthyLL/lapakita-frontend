import { Role } from "@/types";
import { z } from "zod";
import { ResponseData } from "../base";

export const updateGeneralProfileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(255),
  default_avatar_url: z.string().optional().nullable(),
  phone_number: z
    .object({
      dialCode: z.string(),
      number: z.string(),
    })
    .optional()
    .nullable()
    .refine((val) => !val || !val.number || val.number.length >= 5, {
      message: "Phone number must be at least 5 digits",
    }),
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
  primary_phone: { dialCode: string; number: string };
  active_role: Role;
}

export type GetGeneralProfilePayload = ResponseData<GetGeneralProfileResponse>;
export type UpdateGeneralProfilePayload = ResponseData<null>;
