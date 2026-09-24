import { z } from "zod";
import { basePaginationQuerySchema, PaginatedResponse } from "../base";

export const uploadDocumentSchema = z
  .object({
    country_code: z.string().max(8).optional().default("ID"),
    document_type: z.enum(["national_id", "passport", "residence_permit"], {
      message: "Select a valid document type",
    }),
    document_label: z
      .string()
      .min(1, "Document label is required")
      .max(100, "Label must be at most 100 characters"),
    full_name_identity: z
      .string()
      .min(2, "Name must be at least 2 characters")
      .max(255),
    document_number: z.string().min(1, "Document number is required"),
    document_photo: z.string().min(1, "Document photo is required"),
  })
  .superRefine((data, ctx) => {
    if (data.document_type === "national_id") {
      if (!/^\d{16}$/.test(data.document_number)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "National ID (NIK) must be exactly 16 digits",
          path: ["document_number"],
        });
      }
    } else if (data.document_type === "passport") {
      if (data.document_number.length < 6 || data.document_number.length > 12) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Passport number must be between 6 and 12 characters",
          path: ["document_number"],
        });
      }
    } else if (data.document_type === "residence_permit") {
      if (data.document_number.length < 5 || data.document_number.length > 32) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message:
            "Residence permit number must be between 5 and 32 characters",
          path: ["document_number"],
        });
      }
    }
  });

export type UploadDocumentValues = z.infer<typeof uploadDocumentSchema>;

export type DocumentType = "national_id" | "passport" | "residence_permit";

export const documentQueryParamsSchema = basePaginationQuerySchema.extend({
  search: z.string().optional(),
  name: z.string().optional(),
  document_number: z.string().optional(),
  document_type: z
    .enum(["national_id", "passport", "residence_permit"])
    .optional(),
  country_code: z.string().optional(),
});

export type DocumentQueryParams = z.infer<typeof documentQueryParamsSchema>;

export interface GetDocumentData {
  id: string;
  country_code: string;
  document_type: DocumentType;
  document_label: string;
  full_name_identity: string;
  document_number: string;
  document_photo_url: string;
}

export type GetDocumentResponse = PaginatedResponse<GetDocumentData>;
