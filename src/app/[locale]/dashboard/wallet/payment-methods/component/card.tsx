"use client";

import {
  ColumnConfig,
  DataDisplayActionContext,
} from "@/components/common/long/data-display/constant";
import { PaymentMethodItem } from "@/lib/data/schema/wallet/payment_method";
import { CreditCard, ShieldCheck, Wifi } from "lucide-react";
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
  const actionColumns = (columns.actions ?? []).filter(
    (column) => !column.hideInPreset,
  );

  return (
    <div className="group relative overflow-hidden rounded-2xl border border-border/70 bg-payment-card-pattern p-4 text-foreground shadow-sm transition-all hover:-translate-y-1 hover:border-primary/40 hover:shadow-md">
      <div className="relative z-10 space-y-4">
        {/* Header: Logo, Name, Primary Badge, & Tombol Action Primary di Atas Kanan */}
        <div className="flex min-w-0 items-start justify-between gap-2.5">
          <div className="flex min-w-0 items-center gap-2.5">
            {row.logo_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={row.logo_url}
                alt=""
                className="h-8 w-11 shrink-0 rounded-lg border border-border/70 bg-background/90 p-1.5 object-contain shadow-2xs"
              />
            ) : (
              <div className="flex h-8 w-11 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <CreditCard className="h-4 w-4" />
              </div>
            )}
            <div className="min-w-0">
              <h3 className="truncate text-sm font-bold text-foreground">
                {row.provider_name}
              </h3>
              <p className="mt-0.5 text-[10px] font-medium text-muted-foreground">
                {formatPayoutType(row.payout_type)}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            {row.is_primary && (
              <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-success/10 px-2 py-0.5 text-[10px] font-semibold text-success">
                <ShieldCheck className="h-3 w-3" />
                Primary
              </span>
            )}

            {/* Action Pertama (Tombol Set Primary) di Atas Kanan */}
            {actionColumns[0] && (
              <div
                className="flex items-center"
                onClick={(event) => event.stopPropagation()}
              >
                {actionColumns[0].render(row, index, action)}
              </div>
            )}
          </div>
        </div>

        {/* Card Chip & Account Number */}
        <div className="flex min-w-0 items-center gap-3 py-0.5">
          <div className="flex h-7 w-9 shrink-0 items-center justify-center rounded-md border border-border/80 bg-linear-to-tr from-amber-500/20 via-amber-400/10 to-yellow-500/20 shadow-2xs">
            <div className="grid h-4 w-6 grid-cols-2 grid-rows-2 overflow-hidden rounded-2xs border border-amber-600/30">
              <span className="border-b border-r border-amber-600/30 bg-amber-500/10" />
              <span className="border-b border-amber-600/30 bg-amber-500/10" />
              <span className="border-r border-amber-600/30 bg-amber-500/10" />
              <span className="bg-amber-500/10" />
            </div>
          </div>
          <Wifi className="h-3.5 w-3.5 shrink-0 rotate-90 text-muted-foreground/60" />
          <p className="min-w-0 flex-1 break-all font-mono text-sm font-bold tracking-[0.14em] text-foreground sm:text-base">
            {row.account_number}
          </p>
        </div>

        {/* Footer: Holder & Action Kedua (Delete) di Bawah */}
        <div className="flex min-w-0 items-end justify-between gap-2 border-t border-border/50 pt-3">
          <div className="min-w-0 flex-1">
            <p className="text-[9px] font-semibold uppercase tracking-wider text-muted-foreground">
              Account Holder
            </p>
            <p className="wrap-break-word text-xs font-bold uppercase tracking-tight text-foreground">
              {row.account_holder_name}
            </p>
          </div>

          {/* Action Kedua (Delete Button) di Bawah */}
          {actionColumns[1] && (
            <div
              className="flex shrink-0 items-center gap-1"
              onClick={(event) => event.stopPropagation()}
            >
              {actionColumns[1].render(row, index, action)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
