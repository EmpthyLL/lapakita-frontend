/* eslint-disable @next/next/no-img-element */
"use client";

import { createColumnHelpers } from "@/components/common/long/data-display/Constant";
import { PaymentMethodItem } from "@/lib/data/schema/wallet/payment_method";
import { Building2, CreditCard, Hash, ShieldCheck, User } from "lucide-react";
import { useMemo } from "react";
import { formatPayoutType } from "../component/config";
import { PaymentMethodRowActions } from "./rowAction";

export function usePaymentMethodColumns() {
  const { field, action } = createColumnHelpers<PaymentMethodItem>();

  return useMemo(
    () => [
      field({
        key: "provider_name",
        header: "Provider",
        icon: Building2,
        primary: true,
        className: "font-semibold text-foreground",
        render: (val, row) => (
          <div className="flex items-center gap-2.5">
            {row.logo_url && (
              <img
                src={row.logo_url}
                alt={String(val)}
                className="h-6 w-8 object-contain rounded-xs border border-border/40 p-0.5 bg-background"
              />
            )}
            <span className="font-semibold text-foreground">
              {String(val || "-")}
            </span>
          </div>
        ),
      }),
      field({
        key: "account_number",
        header: "Account Number",
        icon: Hash,
        className: "font-mono text-muted-foreground",
      }),
      field({
        key: "account_holder_name",
        header: "Holder Name",
        icon: User,
        className: "font-medium text-foreground",
      }),
      field({
        key: "payout_type",
        header: "Type",
        icon: CreditCard,
        render: (val) => (
          <span className="inline-flex items-center rounded-md bg-primary/10 px-2 py-0.5 text-xs font-semibold text-primary">
            {formatPayoutType(String(val))}
          </span>
        ),
      }),
      field({
        key: "is_primary",
        header: "Status",
        icon: ShieldCheck,
        render: (val) =>
          val ? (
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
              Primary
            </span>
          ) : (
            <span className="text-xs text-muted-foreground">-</span>
          ),
      }),
      action({
        header: "Actions",
        className: "w-32 text-right",
        render: (row, _index, action) => (
          <PaymentMethodRowActions row={row} action={action!} />
        ),
      }),
    ],
    [field, action],
  );
}
