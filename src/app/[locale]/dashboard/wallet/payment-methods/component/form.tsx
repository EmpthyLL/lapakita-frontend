/* eslint-disable @next/next/no-img-element */
"use client";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/common/input/FormField";
import { Autocomplete } from "@/components/common/long/autocomplete";
import { SurfaceComponentProps } from "@/components/common/SurfaceRenderer";
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createPaymentMethod } from "@/lib/data/api/wallet";
import {
  PaymentMethodItem,
  paymentMethodRequestSchema,
  PaymentMethodValues,
} from "@/lib/data/schema/wallet/payment_method";
import { handleError } from "@/lib/error";
import { showToast } from "@/lib/toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { PAYOUT_PROVIDERS, type PayoutProviderOption } from "./config";

export function PaymentMethodForm({
  close,
}: SurfaceComponentProps<PaymentMethodItem>) {
  const queryClient = useQueryClient();

  const form = useForm<PaymentMethodValues>({
    resolver: zodResolver(paymentMethodRequestSchema),
    defaultValues: {
      payout_type: "bank_account",
      provider_code: "",
      provider_name: "",
      account_number: "",
      account_holder_name: "",
    },
  });

  const payoutType = form.watch("payout_type");

  const availableProviders =
    payoutType === "bank_account"
      ? PAYOUT_PROVIDERS.banks
      : PAYOUT_PROVIDERS.eWallets;

  const mutation = useMutation({
    mutationFn: async (values: PaymentMethodValues) => {
      await createPaymentMethod(values);
    },
    onSuccess: () => {
      showToast.success("Payment method added successfully");
      queryClient.invalidateQueries({ queryKey: ["payment-methods"] });
      close();
    },
    onError: handleError,
  });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit((values) => mutation.mutate(values))}
        className="space-y-4 p-2"
      >
        {/* Payout Type */}
        <FormField
          control={form.control}
          name="payout_type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Payout Type</FormLabel>
              <Select
                onValueChange={(val: "bank_account" | "e_wallet") => {
                  field.onChange(val);
                  form.setValue("provider_code", "");
                  form.setValue("provider_name", "");
                }}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger className="h-10 bg-background border-border">
                    <SelectValue placeholder="Select payout type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="bank_account">Bank Account</SelectItem>
                  <SelectItem value="e_wallet">E-Wallet</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Provider menggunakan Autocomplete */}
        <FormField
          control={form.control}
          name="provider_code"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Provider / Bank</FormLabel>
              <FormControl>
                <Autocomplete<PayoutProviderOption>
                  options={availableProviders}
                  value={field.value}
                  onSelect={(code, option) => {
                    field.onChange(String(code));
                    if (option) {
                      form.setValue("provider_name", option.name);
                    }
                  }}
                  valueKey="code"
                  labelKey="name"
                  searchKey="name"
                  iconKey="icon"
                  placeholder="Cari atau pilih bank/e-wallet..."
                  emptyText="Provider tidak ditemukan."
                  showClearButton
                  size="md"
                  renderConfig={{
                    item: (option) => (
                      <div className="flex min-w-0 flex-1 items-center gap-3">
                        <div className="flex size-11 shrink-0 items-center justify-center rounded-md border border-border/70 bg-background p-1.5 shadow-xs">
                          <img
                            src={option.icon}
                            alt=""
                            className="h-8 w-9 object-contain"
                          />
                        </div>
                        <div className="min-w-0 flex-1">
                          <span className="block truncate text-sm font-semibold text-foreground">
                            {option.name}
                          </span>
                          <span className="mt-0.5 block text-[11px] font-medium text-muted-foreground">
                            {option.type === "bank_account"
                              ? "Bank"
                              : "E-Wallet"}
                          </span>
                        </div>
                      </div>
                    ),
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Account Number */}
        <FormField
          control={form.control}
          name="account_number"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Account Number / Phone Number</FormLabel>
              <FormControl>
                <Input placeholder="Enter account number" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Account Holder Name */}
        <FormField
          control={form.control}
          name="account_holder_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Account Holder Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter account holder name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <DialogFooter className="pt-4 border-t border-border flex gap-2">
          <Button type="button" variant="outline" onClick={close}>
            Cancel
          </Button>
          <Button type="submit" isLoading={mutation.isPending}>
            Add Payout Method
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
}
