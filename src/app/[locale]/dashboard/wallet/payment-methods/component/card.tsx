/* eslint-disable @next/next/no-img-element */
"use client";

import {
  ColumnConfig,
  DataDisplayActionContext,
  FieldColumnDef,
} from "@/components/common/long/data-display/Constant";
import { PaymentMethodItem } from "@/lib/data/schema/wallet/payment_method";
import { CreditCard, ShieldCheck } from "lucide-react";
import { formatPayoutType } from "./config";

interface PaymentMethodCardProps {
  row: PaymentMethodItem;
  index: number;
  columns: ColumnConfig<PaymentMethodItem>;
  action: DataDisplayActionContext<PaymentMethodItem>;
}

export function PaymentMethodCard({
  row,
  index,
  columns,
  action,
}: PaymentMethodCardProps) {
  const fieldColumns = (columns.fields ?? []).filter(
    (column) => !column.hideInPreset,
  );
  const actionColumns = (columns.actions ?? []).filter(
    (column) => !column.hideInPreset,
  );

  const primaryColumn =
    fieldColumns.find((column) => column.primary) ?? fieldColumns[0];
  const secondaryColumns = fieldColumns.filter(
    (column) => column.key !== primaryColumn?.key,
  );

  const renderField = (
    column: FieldColumnDef<PaymentMethodItem, keyof PaymentMethodItem>,
  ) =>
    column.render
      ? column.render(row[column.key], row, index)
      : String(row[column.key] ?? "");

  return (
    <div className="group relative overflow-hidden rounded-3xl border border-border bg-card p-5 shadow-xs transition-all hover:shadow-md hover:border-primary/40 flex flex-col justify-between space-y-4">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          {row.logo_url ? (
            <div className="flex h-12 w-14 shrink-0 items-center justify-center rounded-2xl border border-border bg-muted/30 p-2">
              <img
                src={row.logo_url}
                alt={row.provider_name}
                className="h-full w-full object-contain"
              />
            </div>
          ) : (
            <div className="flex h-12 w-14 shrink-0 items-center justify-center rounded-2xl border border-border bg-primary/10 text-primary">
              <CreditCard className="h-6 w-6" />
            </div>
          )}
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h4 className="truncate text-sm font-bold text-foreground">
                {row.provider_name}
              </h4>
              {row.is_primary && (
                <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                  <ShieldCheck className="h-3 w-3" /> Primary
                </span>
              )}
            </div>
            <p className="truncate font-mono text-xs text-muted-foreground mt-0.5">
              {row.account_number}
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-2 border-t border-border pt-3 text-xs text-muted-foreground">
        {secondaryColumns.map((column) => (
          <div
            key={String(column.key)}
            className="flex min-w-0 items-center justify-between gap-2"
          >
            <span className="flex items-center gap-1.5 truncate">
              {column.icon && (
                <column.icon className="h-3.5 w-3.5 shrink-0 text-primary" />
              )}
              {column.header}
            </span>
            <strong className="font-medium text-foreground">
              {column.key === "payout_type"
                ? formatPayoutType(row.payout_type)
                : renderField(column)}
            </strong>
          </div>
        ))}
      </div>

      <div className="pt-2 border-t border-border/80 flex items-center justify-end gap-2">
        {actionColumns.map((column, actionIndex) => (
          <div key={`action-${actionIndex}`}>
            {column.render(row, index, action)}
          </div>
        ))}
      </div>
    </div>
  );
}
