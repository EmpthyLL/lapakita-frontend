"use client";

import { DataDisplayActionContext } from "@/components/common/long/data-display/Constant";
import { Button } from "@/components/ui/button";
import {
  deletePaymentMethod,
  setPrimaryPaymentMethod,
} from "@/lib/data/api/wallet";
import { PaymentMethodItem } from "@/lib/data/schema/wallet/payment_method";
import { handleError } from "@/lib/error";
import { showToast } from "@/lib/toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Star, Trash2 } from "lucide-react";

interface PaymentMethodRowActionsProps {
  row: PaymentMethodItem;
  action: DataDisplayActionContext<PaymentMethodItem>;
}

export function PaymentMethodRowActions({
  row,
  action,
}: PaymentMethodRowActionsProps) {
  const queryClient = useQueryClient();

  const primaryMutation = useMutation({
    mutationFn: async () => {
      await setPrimaryPaymentMethod(row.id);
    },
    onSuccess: () => {
      showToast.success("Primary payment method updated");
      queryClient.invalidateQueries({ queryKey: ["payment-methods"] });
    },
    onError: handleError,
  });

  const deleteMutation = useMutation({
    mutationFn: async () => {
      await deletePaymentMethod(row.id);
    },
    onSuccess: () => {
      showToast.success("Payment method deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["payment-methods"] });
    },
    onError: handleError,
  });

  return (
    <div
      className="flex items-center gap-1.5"
      onClick={(e) => e.stopPropagation()}
    >
      {!row.is_primary && (
        <Button
          variant="outline"
          size="sm"
          onClick={() => primaryMutation.mutate()}
          isLoading={primaryMutation.isPending}
          className="h-8 gap-1 rounded-xl text-xs font-semibold"
        >
          <Star className="h-3.5 w-3.5" /> Set Primary
        </Button>
      )}
      <Button
        variant="destructive"
        size="icon-sm"
        onClick={() => {
          action.openDelete(
            () => deleteMutation.mutate(),
            `${row.provider_name} (${row.account_number})`,
          );
        }}
        isLoading={deleteMutation.isPending}
        className="rounded-xl"
      >
        <Trash2 className="size-4" />
      </Button>
    </div>
  );
}
