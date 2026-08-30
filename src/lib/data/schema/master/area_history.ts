import { ResponseData } from "@/lib/data/schema/base";
import { AreaGeneralResponseData } from "@/lib/data/schema/master/location";
import { z } from "zod";

// ── Schema Request: Save History (POST /areas/history) ──────────────────────
export const saveAreaHistorySchema = z.object({
  type: z.enum(["country", "province", "city", "district", "suburb", "street"]),
  title: z.string().min(1, "Title is required"),
  subtitle: z.string().min(1, "Subtitle is required"),
  full_label: z.string().min(1, "Full label is required"),
  country: z.string().min(1, "Country is required"),
  country_code: z.string().min(1, "Country code is required"),
  city: z.string().optional(),
  province: z.string().optional(),
  district: z.string().optional(),
  suburb: z.string().optional(),
});

export type SaveAreaHistoryPayload = z.infer<typeof saveAreaHistorySchema>;

export interface AreaHistoryItemResponse extends AreaGeneralResponseData {
  searched_at: string;
}

// ── Delete 1 Item Request ──────────────────────────────────────────────────
export const deleteHistoryItemSchema = z.object({
  full_label: z.string().min(1, "Full label is required"),
});

export type DeleteHistoryItemPayload = z.infer<typeof deleteHistoryItemSchema>;

export type GetAreaHistoryResponse = ResponseData<AreaHistoryItemResponse[]>;
export type SaveAreaHistoryResponse = ResponseData<null>;
export type ClearAreaHistoryResponse = ResponseData<null>;
export type DeleteHistoryItemResponse = ResponseData<null>;
