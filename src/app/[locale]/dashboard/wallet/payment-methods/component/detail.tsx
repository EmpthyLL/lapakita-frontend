/* eslint-disable @next/next/no-img-element */
"use client";

import { SurfaceComponentProps } from "@/components/common/SurfaceRenderer";
import { PaymentMethodItem } from "@/lib/data/schema/wallet/payment_method";
import { CreditCard, Hash, ShieldCheck, User } from "lucide-react";
import { formatPayoutType, PAYOUT_PROVIDERS } from "./config";

export function PaymentMethodDetail({
  row: method,
}: SurfaceComponentProps<PaymentMethodItem>) {
  if (!method) return null;

  const resolvedLogo =
    method.logo_url ||
    (() => {
      const allProviders = [
        ...PAYOUT_PROVIDERS.banks,
        ...PAYOUT_PROVIDERS.eWallets,
      ];
      const found = allProviders.find((p) => p.code === method.provider_code);
      return found?.icon || "";
    })();

  return (
    <div className="min-w-0 space-y-2.5 px-1 py-1">
      {/* Konsep Belakang Kartu (Card Back) */}
      <div className="relative overflow-hidden rounded-2xl border border-border/80 bg-payment-card-pattern p-3.5 shadow-sm space-y-3">
        {/* Atas: Primary Badge (jika bukan primary, dibiarkan kosong) */}
        <div className="flex items-center h-2">
          {method.is_primary && (
            <span className="inline-flex items-center gap-1 rounded-full bg-success/10 px-2 py-0.5 text-[11px] font-bold text-success">
              <ShieldCheck className="h-3 w-3" /> Primary Account
            </span>
          )}
        </div>

        {/* Strip Hitam Magnetik dari Ujung ke Ujung: Kiri Logo, Kanan Nama Bank */}
        <div className="-mx-3.5 mb-1.5 h-10 w-[calc(100%+1.75rem)] bg-zinc-900 dark:bg-zinc-950 flex items-center px-3.5 justify-between">
          {resolvedLogo ? (
            <div className="flex h-6 w-9 shrink-0 items-center justify-center rounded-md bg-white p-1 shadow-2xs">
              <img
                src={resolvedLogo}
                alt={method.provider_name}
                className="h-full w-full object-contain"
              />
            </div>
          ) : (
            <div className="w-6" />
          )}
          <span className="text-xs font-mono font-bold tracking-widest text-zinc-100 uppercase truncate">
            {method.provider_name}
          </span>
        </div>

        {/* Kotak Tengah: Berisi Nomor Rekening */}
        <div className="space-y-1">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
            Account Number / Registered ID
          </p>
          <div className="h-10 rounded-xl border border-border/80 bg-background px-3.5 flex items-center justify-between shadow-2xs">
            <span className="font-mono text-sm font-bold tracking-[0.2em] text-foreground">
              {method.account_number}
            </span>
            <Hash className="h-4 w-4 text-muted-foreground/60" />
          </div>
        </div>

        {/* Informasi Detail Pendukung di Bawahnya (2 item) */}
        <div className="border-t border-border/60 pt-2 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="flex items-center gap-1.5 text-muted-foreground font-semibold uppercase tracking-wider text-[10px]">
              <User className="h-3.5 w-3.5 text-primary" /> Account Holder
            </span>
            <span className="font-bold uppercase text-foreground">
              {method.account_holder_name}
            </span>
          </div>

          <div className="flex items-center justify-between text-xs">
            <span className="flex items-center gap-1.5 text-muted-foreground font-semibold uppercase tracking-wider text-[10px]">
              <CreditCard className="h-3.5 w-3.5 text-primary" /> Payout Type
            </span>
            <span className="font-semibold text-foreground">
              {formatPayoutType(method.payout_type)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
