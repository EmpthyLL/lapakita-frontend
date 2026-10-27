"use client";

import { DataDisplay } from "@/components/common/long/data-display";
import { DataDisplayQuery } from "@/components/common/long/data-display/Constant";
import { Button } from "@/components/ui/button";
import { getPaymentMethods } from "@/lib/data/api/wallet";
import {
  PaymentMethodItem,
  PaymentMethodQueryParams,
} from "@/lib/data/schema/wallet/payment_method";
import { Plus } from "lucide-react";
import { PAYOUT_PROVIDERS } from "../component/config";
import { PaymentMethodDetail } from "../component/detail";
import { PaymentMethodForm } from "../component/form";
import { usePaymentMethodColumns } from "./column";

export default function PaymentMethodList() {
  const columns = usePaymentMethodColumns();

  const providerOptions = [
    ...PAYOUT_PROVIDERS.banks.map((b) => ({ label: b.name, value: b.code })),
    ...PAYOUT_PROVIDERS.eWallets.map((e) => ({ label: e.name, value: e.code })),
  ];

  const queryConfig: DataDisplayQuery<
    PaymentMethodItem,
    PaymentMethodQueryParams
  > = {
    queryFn: async (params) => {
      const response = await getPaymentMethods(params);
      return response;
    },
    queryKey: (params) => ["payment-methods", params],
    searchKey: "search",
    searchPlaceholder: "Cari nomor akun atau nama pemegang...",
    defaultParams: { page: 1 },
    filterToParamKey: {
      search: "search",
      provider: "provider",
      payout_type: "payout_type",
    },
    filterOptions: [
      {
        id: "provider",
        title: "Provider / Bank",
        type: "select",
        options: providerOptions,
      },
      {
        id: "payout_type",
        title: "Payout Type",
        type: "select",
        options: [
          { label: "Bank Account", value: "bank_account" },
          { label: "E-Wallet", value: "e_wallet" },
        ],
      },
    ],
  };

  return (
    <div className="rounded-3xl border border-border bg-card p-6 shadow-sm sm:p-8">
      <DataDisplay
        query={queryConfig}
        columns={columns}
        rowKey="id"
        variant="list"
        loadMode="pagination"
        showFilter
        showCount
        onRowClick={(row, _index, action) => {
          action.openDetail();
        }}
        detail={{
          type: "expandable",
          title: "Payment Method Detail",
          description:
            "Informasi detail akun bank atau e-wallet penarikan dana.",
          size: "lg",
          component: PaymentMethodDetail,
        }}
        form={{
          type: "dialog",
          title: "Add Payment Method",
          description:
            "Tambahkan rekening bank atau e-wallet baru untuk pencairan.",
          size: "md",
          component: PaymentMethodForm,
        }}
        toolbarExtraAction={({ openCreate, isLoading }) => (
          <Button
            onClick={() => openCreate("dialog")}
            disabled={isLoading}
            size="sm"
            className="h-10 gap-1.5 px-3.5 text-xs rounded-xl"
          >
            <Plus className="h-4 w-4" /> Add Payment Method
          </Button>
        )}
      />
    </div>
  );
}
