"use client";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/common/input/FormField";
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

const AVAILABLE_ROLES = [
  {
    label: "Tenant",
    value: "tenant" as Role,
    activeClass: "border-tenant bg-tenant/10 text-tenant",
  },
  {
    label: "Owner",
    value: "owner" as Role,
    activeClass: "border-owner bg-owner/10 text-owner",
  },
  {
    label: "Supplier",
    value: "supplier" as Role,
    activeClass: "border-supplier bg-supplier/10 text-supplier",
  },
];

interface PhoneFormProps {
  mode: "create" | "edit";
  initialData?: PhoneNumberItem | null;
  onSuccess: () => void;
  onCancel?: () => void;
}

export function PhoneForm({
  mode,
  initialData,
  onSuccess,
  onCancel,
}: PhoneFormProps) {
  const queryClient = useQueryClient();
  const { data: session, update: updateSession } = useSession();

  const form = useForm<PhoneValues>({
    resolver: zodResolver(phoneRequestSchema),
    defaultValues: {
      number: "",
      is_primary: false,
      roles: [],
    },
  });

  useEffect(() => {
    if (mode === "edit" && initialData) {
      form.reset({
        number: initialData.number,
        is_primary: initialData.is_primary,
        roles: initialData.roles || [],
      });
    } else {
      form.reset({
        number: "",
        is_primary: false,
        roles: [],
      });
    }
  }, [mode, initialData, form]);

  const mutation = useMutation({
    mutationFn: async (values: PhoneValues) => {
      if (mode === "edit" && initialData) {
        await updatePhoneNumber(initialData.index, values);
      } else {
        await addPhoneNumber(values);
      }
      return values;
    },
    onSuccess: async (values) => {
      showToast.success(
        mode === "edit"
          ? "Phone number updated successfully"
          : "Phone number added successfully",
      );

      if (session?.user) {
        let newDefaultPhone = session.user.defaultPhone;
        const updatedPersonas = { ...(session.user.personas || {}) };

        if (values.is_primary) {
          newDefaultPhone = values.number;
        }

        values.roles.forEach((role) => {
          const existingPersona = updatedPersonas[role];
          if (existingPersona) {
            updatedPersonas[role] = {
              ...existingPersona,
              phone: values.number,
            };
          } else {
            updatedPersonas[role] = {
              display_name: "",
              avatar_url: "",
              phone: values.number,
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
      onSuccess();
    },
    onError: handleError,
  });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit((values) => mutation.mutate(values))}
        className="space-y-5 pt-3"
      >
        <FormField
          control={form.control}
          name="number"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phone Number</FormLabel>
              <FormControl>
                <Input
                  placeholder="e.g. +6281234567890"
                  {...field}
                  value={field.value ?? ""}
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
          {onCancel && (
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          )}
          <Button type="submit" isLoading={mutation.isPending}>
            {mode === "create" ? "Add Phone Number" : "Save Changes"}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
}
