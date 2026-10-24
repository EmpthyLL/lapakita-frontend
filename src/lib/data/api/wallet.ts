import { PAYOUT_PROVIDERS } from "@/app/[locale]/dashboard/wallet/payment-methods/PayoutProvider";
import api from "@/lib/api";
import {
  GetPaymentMethodsResponse,
  PaymentMethodItem,
  PaymentMethodQueryParams,
  PaymentMethodValues,
} from "../schema/wallet/payment_method";

export async function getPaymentMethods(
  params?: PaymentMethodQueryParams,
): Promise<GetPaymentMethodsResponse> {
  const response = await api.get<GetPaymentMethodsResponse>("/payment-method", {
    params,
  });

  // Opsional: Otomatis mapping logoUrl dari PAYOUT_PROVIDERS berdasarkan provider_code
  const mappedData = response.data.data.map((item: PaymentMethodItem) => {
    let logoUrl = "";
    if (item.payout_type === "bank_account") {
      const found = PAYOUT_PROVIDERS.banks.find(
        (b) => b.code === item.provider_code,
      );
      logoUrl = found?.logoUrl || "";
    } else if (item.payout_type === "e_wallet") {
      const found = PAYOUT_PROVIDERS.eWallets.find(
        (e) => e.code === item.provider_code,
      );
      logoUrl = found?.logoUrl || "";
    }

    return {
      ...item,
      logo_url: logoUrl,
    };
  });

  return {
    ...response.data,
    data: mappedData,
  };
}

export async function createPaymentMethod(
  payload: PaymentMethodValues,
): Promise<void> {
  await api.post("/payment-method", payload);
}

export async function deletePaymentMethod(id: string): Promise<void> {
  await api.delete(`/payment-method/${id}`);
}

export async function setPrimaryPaymentMethod(id: string): Promise<void> {
  await api.put(`/payment-method/${id}/primary`);
}
