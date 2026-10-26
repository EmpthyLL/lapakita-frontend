import { z } from "zod";
import { basePaginationQuerySchema, PaginatedResponse } from "../base";

// Zod Schema untuk membuat metode pembayaran baru
export const paymentMethodRequestSchema = z.object({
  payout_type: z.enum(["bank_account", "e_wallet"], {
    message: "Please select a valid payout type",
  }),
  provider_code: z.string().min(1, "Provider code is required").max(32),
  provider_name: z.string().min(1, "Provider name is required").max(128),
  account_number: z
    .string()
    .min(3, "Account number is invalid")
    .max(64, "Account number is too long"),
  account_holder_name: z
    .string()
    .min(2, "Account holder name is required")
    .max(255, "Name is too long"),
});

export type PaymentMethodValues = z.infer<typeof paymentMethodRequestSchema>;

// Zod Schema untuk query parameter Get Payment Methods
export const paymentMethodQueryParamsSchema = basePaginationQuerySchema.extend({
  search: z.string().optional(),
  payout_type: z.enum(["bank_account", "e_wallet"]).optional(),
  provider: z.string().optional(),
  is_primary: z.boolean().optional(),
});

export type PaymentMethodQueryParams = z.infer<
  typeof paymentMethodQueryParamsSchema
>;

// TypeScript Interfaces untuk Response API
export interface PaymentMethodItem {
  id: string;
  payout_type: "bank_account" | "e_wallet";
  provider_code: string;
  provider_name: string;
  account_number: string;
  account_holder_name: string;
  is_primary: boolean;
  logo_url?: string;
  created_at: string;
  updated_at: string;
}

export type GetPaymentMethodsResponse = PaginatedResponse<PaymentMethodItem>;

export interface PaymentMethodPayload {
  status: boolean;
  message: string;
  data: PaymentMethodItem;
}
