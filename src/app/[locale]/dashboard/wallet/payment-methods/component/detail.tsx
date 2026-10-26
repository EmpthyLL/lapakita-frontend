/* eslint-disable @next/next/no-img-element */
"use client";

import { SurfaceComponentProps } from "@/components/common/SurfaceRenderer";
import { Button } from "@/components/ui/button";
import { PaymentMethodItem } from "@/lib/data/schema/wallet/payment_method";
import { Building2, CreditCard, Hash, ShieldCheck, User } from "lucide-react";
import { formatPayoutType } from "./config";

export function PaymentMethodDetail({
  row: method,
  close,
}: SurfaceComponentProps<PaymentMethodItem>) {
  if (!method) return null;

  return (
    <div className="space-y-6 pt-2">
      <div className="flex items-center gap-4 rounded-3xl bg-secondary/30 p-5 border border-border/80">
        {method.logo_url ? (
          <div className="flex h-16 w-20 shrink-0 items-center justify-center rounded-2xl border border-border bg-background p-2.5 shadow-xs">
            <img
              src={method.logo_url}
              alt={method.provider_name}
              className="h-full w-full object-contain"
            />
          </div>
        ) : (
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <CreditCard className="h-8 w-8" />
          </div>
        )}
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="text-base font-bold text-foreground">
              {method.provider_name}
            </h3>
            {method.is_primary && (
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-600">
                <ShieldCheck className="h-3 w-3" /> Primary Account
              </span>
            )}
          </div>
          <p className="text-xs text-muted-foreground mt-0.5 font-mono">
            {method.account_number}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 rounded-3xl bg-card p-5 border border-border shadow-xs">
        <div className="space-y-1">
          <span className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            <User className="h-3.5 w-3.5 text-primary" /> Account Holder
          </span>
          <p className="font-semibold text-foreground text-sm tracking-tight">
            {method.account_holder_name}
          </p>
        </div>

        <div className="space-y-1">
          <span className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            <CreditCard className="h-3.5 w-3.5 text-primary" /> Payout Type
          </span>
          <p className="font-semibold text-foreground text-sm tracking-tight">
            {formatPayoutType(method.payout_type)}
          </p>
        </div>

        <div className="space-y-1">
          <span className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            <Hash className="h-3.5 w-3.5 text-primary" /> Account Number
          </span>
          <p className="font-mono font-semibold text-foreground text-sm tracking-wide">
            {method.account_number}
          </p>
        </div>

        <div className="space-y-1">
          <span className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            <Building2 className="h-3.5 w-3.5 text-primary" /> Provider Code
          </span>
          <p className="font-mono font-semibold text-foreground text-sm tracking-wide uppercase">
            {method.provider_code}
          </p>
        </div>
      </div>

      <div className="pt-4 border-t border-border flex justify-end">
        <Button
          type="button"
          variant="default"
          onClick={close}
          className="rounded-2xl px-6 font-semibold shadow-sm transition-all hover:shadow"
        >
          Close Detail
        </Button>
      </div>
    </div>
  );
}
