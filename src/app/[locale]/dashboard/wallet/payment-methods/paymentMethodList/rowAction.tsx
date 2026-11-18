"use client";

import { DataDisplayRendererProps } from "@/components/common/long/data-display/constant";
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

export function PaymentMethodPrimaryAction({
  row,
}: DataDisplayRendererProps<PaymentMethodItem>) {
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

  if (row.is_primary) return null;

  return (
    <Button
      variant="ghost"
      size="icon-sm"
      onClick={() => primaryMutation.mutate()}
      isLoading={primaryMutation.isPending}
      title="Set as Primary"
      className="h-8 w-8 rounded-xl text-muted-foreground hover:text-primary hover:bg-primary/10"
    >
      <Star className="h-4 w-4" />
    </Button>
  );
}

export function PaymentMethodDeleteAction({
  row,
  action,
}: DataDisplayRendererProps<PaymentMethodItem>) {
  const queryClient = useQueryClient();

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
      title="Delete"
      className="rounded-xl h-8 w-8"
    >
      <Trash2 className="size-4" />
    </Button>
  );
}
