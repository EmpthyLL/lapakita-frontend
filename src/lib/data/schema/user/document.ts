import { z } from "zod";
import { basePaginationQuerySchema, PaginatedResponse } from "../base";

export const uploadDocumentSchema = z.object({
  full_name_ktp: z.string().min(2, "Name must be at least 2 characters"),
  nik: z.string().length(16, "NIK must be exactly 16 digits"),
  domicile_city: z.string().min(2, "Domicile city is required").max(128),
  ktp_photo: z.string().min(1, "KTP photo is required"),
});

export type UploadDocumentValues = z.infer<typeof uploadDocumentSchema>;

export const documentQueryParamsSchema = basePaginationQuerySchema.extend({
  name: z.string().optional(),
  nik: z.string().optional(),
});

export type DocumentQueryParams = z.infer<typeof documentQueryParamsSchema>;

export interface GetDocumentData {
  id: string;
  full_name_ktp: string;
  nik: string;
  ktp_photo_url: string;
  domicile_city: string;
}

export type GetDocumentResponse = PaginatedResponse<GetDocumentData>;
