import { z } from "zod";
import { createBusinessSchema } from "./create_business";

export const updateBusinessSchema = createBusinessSchema.partial();

export type UpdateBusinessValues = z.infer<typeof updateBusinessSchema>;
