/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/common/input/FormField";
import { PhoneInput } from "@/components/common/input/PhoneInput";
import { DataDisplaySurfaceComponentProps } from "@/components/common/long/data-display/Constant";
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { addPhoneNumber, updatePhoneNumber } from "@/lib/data/api/user";
import {
  PhoneNumberItem,
  phoneRequestSchema,
  PhoneValues,
} from "@/lib/data/schema/user/phone_number";
import { handleError } from "@/lib/error";
import { showToast } from "@/lib/toast";
import { cn } from "@/lib/utils";
import { Role } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

interface RoleOption {
  label: string;
  value: Role;
  activeClass: string;
}

const AVAILABLE_ROLES: readonly RoleOption[] = [
  {
    label: "Tenant",
    value: "tenant",
    activeClass: "border-tenant bg-tenant/10 text-tenant",
  },
  {
    label: "Owner",
    value: "owner",
    activeClass: "border-owner bg-owner/10 text-owner",
  },
  {
    label: "Supplier",
    value: "supplier",
    activeClass: "border-supplier bg-supplier/10 text-supplier",
  },
] as const;

export function PhoneForm({
  mode,
  row: initialData,
  close,
}: DataDisplaySurfaceComponentProps<PhoneNumberItem>) {
  const queryClient = useQueryClient();
  const { data: session, update: updateSession } = useSession();
  const isEdit = mode === "edit";

  const form = useForm<PhoneValues>({
    resolver: zodResolver(phoneRequestSchema),
    defaultValues: {
      label: "",
      number: "",
      dial_code: "+62",
      is_primary: false,
      roles: [],
    },
  });

  useEffect(() => {
    if (isEdit && initialData) {
      form.reset({
        label: initialData.label || "",
        number: initialData.number || "",
        dial_code: initialData.dial_code || "+62",
        is_primary: initialData.is_primary,
        roles: initialData.roles || [],
      });
    } else {
      form.reset({
        label: "",
        number: "",
        dial_code: "+62",
        is_primary: false,
        roles: [],
      });
    }
  }, [isEdit, initialData, form]);

  const mutation = useMutation({
    mutationFn: async (values: PhoneValues) => {
      if (isEdit && initialData) {
        await updatePhoneNumber(initialData.index, values);
      } else {
        await addPhoneNumber(values);
      }
      return values;
    },
    onSuccess: async (values) => {
      showToast.success(
        isEdit
          ? "Phone number updated successfully"
          : "Phone number added successfully",
      );

      const phoneObj = {
        dial_code: values.dial_code,
        number: values.number,
      };

      if (session?.user) {
        let newDefaultPhone = session.user.defaultPhone;
        const updatedPersonas = { ...(session.user.personas || {}) };

        if (values.is_primary) {
          newDefaultPhone = phoneObj;
        }

        values.roles?.forEach((role) => {
          const existingPersona = updatedPersonas[role];
          if (existingPersona) {
            updatedPersonas[role] = {
              ...existingPersona,
              phone: phoneObj,
            };
          } else {
            updatedPersonas[role] = {
              display_name: "",
              avatar_url: "",
              phone: phoneObj,
            };
          }
        });

        await updateSession({
          user: {
            defaultPhone: newDefaultPhone,
            personas: updatedPersonas,
          },
        });
      }

      queryClient.invalidateQueries({ queryKey: ["phone-numbers"] });
      close();
    },
    onError: handleError,
  });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit((values) => mutation.mutate(values))}
        className="space-y-5 pt-3 px-2"
      >
        <FormField
          control={form.control}
          name="label"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Label</FormLabel>
              <FormControl>
                <Input
                  placeholder="e.g. Kontak Utama Usaha / WhatsApp Logistik"
                  {...field}
                  value={field.value ?? ""}
                />
              </FormControl>
              <FormDescription className="text-xs text-muted-foreground">
                Nama penanda untuk mengidentifikasi nomor telepon ini.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name={["number", "dial_code"] as any}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phone Number</FormLabel>
              <FormControl>
                <PhoneInput
                  value={field.value}
                  onChange={field.onChange}
                  placeholder="812 3456 7890"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="is_primary"
          render={({ field }) => (
            <FormItem className="flex items-center justify-between rounded-xl border border-border p-3.5 bg-secondary/30 space-y-0">
              <div className="space-y-0.5 pr-4">
                <FormLabel className="text-sm font-semibold cursor-pointer">
                  Set as Primary
                </FormLabel>
                <p className="text-[11px] text-muted-foreground">
                  Hanya satu nomor yang dapat menjadi primary di akun Anda.
                </p>
              </div>
              <FormControl>
                <div className="shrink-0">
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </div>
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="roles"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Linked Roles</FormLabel>
              <div className="grid grid-cols-3 gap-2 pt-1">
                {AVAILABLE_ROLES.map((role) => {
                  const currentRoles = field.value || [];
                  const isChecked = currentRoles.includes(role.value);
                  return (
                    <button
                      key={role.value}
                      type="button"
                      onClick={() => {
                        if (isChecked) {
                          field.onChange(
                            currentRoles.filter((r) => r !== role.value),
                          );
                        } else {
                          field.onChange([...currentRoles, role.value]);
                        }
                      }}
                      className={cn(
                        "flex items-center justify-center rounded-xl border py-2 text-xs font-semibold transition-all cursor-pointer outline-none",
                        isChecked
                          ? role.activeClass
                          : "border-border bg-background text-muted-foreground hover:bg-secondary",
                      )}
                    >
                      {role.label}
                    </button>
                  );
                })}
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        <DialogFooter className="pt-4 border-t border-border flex gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={close}
            className="rounded-xl"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            isLoading={mutation.isPending}
            className="rounded-xl"
          >
            {isEdit ? "Save Changes" : "Add Phone Number"}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
}
