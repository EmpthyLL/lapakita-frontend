/* eslint-disable @next/next/no-img-element */
"use client";

import { AvatarInput } from "@/components/common/input/AvatarInput";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/common/input/FormField";
import { Autocomplete } from "@/components/common/long/autocomplete";
import { Spinner } from "@/components/common/Spinner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  getPersonaProfile,
  getPhoneNumbers,
  updatePersonaProfile,
} from "@/lib/data/api/user";
import {
  updatePersonaSchema,
  UpdatePersonaValues,
} from "@/lib/data/schema/user/persona";
import {
  PhoneNumberItem,
  PhoneQueryParams,
} from "@/lib/data/schema/user/phone_number";
import { handleError } from "@/lib/error";
import { showToast } from "@/lib/toast";
import { cn } from "@/lib/utils";
import type { Role } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Briefcase, Building2, Home, Save, UserCheck } from "lucide-react";
import { useSession } from "next-auth/react";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";

const ROLES: {
  id: Role;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}[] = [
  { id: "tenant", label: "Tenant Persona", icon: Home },
  { id: "owner", label: "Owner Persona", icon: Building2 },
  { id: "supplier", label: "Supplier Persona", icon: Briefcase },
];

export default function PersonaProfilePage() {
  const queryClient = useQueryClient();
  const { data: session, update: updateSession } = useSession();

  const [activeTab, setActiveTab] = useState<Role>("tenant");

  // Fetch data persona berdasarkan role yang sedang aktif di tab
  const { data: persona, isLoading: isPersonaLoading } = useQuery({
    queryKey: ["user-persona-profile", activeTab],
    queryFn: () => getPersonaProfile(activeTab),
  });

  const isInitializedRef = useRef(false);

  const form = useForm<UpdatePersonaValues>({
    resolver: zodResolver(updatePersonaSchema),
    defaultValues: {
      display_name: "",
      avatar_url: "",
      phone_number_index: 0,
    },
  });

  // Reset form saat data persona atau tab berubah
  useEffect(() => {
    isInitializedRef.current = false;
  }, [activeTab]);

  useEffect(() => {
    if (persona && !isInitializedRef.current) {
      form.reset({
        display_name: persona.display_name ?? "",
        avatar_url: persona.avatar_url ?? "",
        phone_number_index: persona.phone?.index ?? 0,
      });
      isInitializedRef.current = true;
    }
  }, [persona, form]);

  const currentName = form.watch("display_name");

  const getRoleTheme = (role: Role) => {
    switch (role) {
      case "owner":
        return {
          text: "text-owner",
          bg: "bg-owner/10",
          border: "border-owner/40",
        };
      case "supplier":
        return {
          text: "text-supplier",
          bg: "bg-supplier/10",
          border: "border-supplier/40",
        };
      case "tenant":
      default:
        return {
          text: "text-tenant",
          bg: "bg-tenant/10",
          border: "border-tenant/40",
        };
    }
  };

  const currentTheme = getRoleTheme(activeTab);

  const updateMutation = useMutation({
    mutationFn: (values: UpdatePersonaValues) =>
      updatePersonaProfile(activeTab, values),
    onSuccess: async (res) => {
      showToast.success(
        `${activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} persona updated successfully`,
      );

      const existingPersonas = session?.user?.personas || {};

      await updateSession({
        user: {
          personas: {
            ...existingPersonas,
            [activeTab]: {
              display_name: res.display_name,
              avatar_url: res.avatar_url,
              phone: {
                dial_code: res.phone.dial_code,
                number: res.phone.number,
              },
            },
          },
        },
      });

      queryClient.invalidateQueries({
        queryKey: ["user-persona-profile", activeTab],
      });
      queryClient.invalidateQueries({ queryKey: ["phone-numbers"] });
    },
    onError: (error) => {
      handleError(error);
    },
  });

  function onSubmit(values: UpdatePersonaValues) {
    updateMutation.mutate(values);
  }

  const { isDirty } = form.formState;

  return (
    <div className="mx-auto max-w-3xl space-y-8 pb-12">
      {/* Header Profile */}
      <div className="relative overflow-hidden rounded-3xl border border-border bg-card p-6 shadow-sm sm:p-8">
        <div className="absolute top-0 right-0 h-32 w-32 -translate-y-8 translate-x-8 rounded-full bg-gradient-brand opacity-10 blur-2xl pointer-events-none" />

        <div className="flex items-center gap-3">
          <div
            className={`flex h-10 w-10 items-center justify-center rounded-xl transition-colors ${currentTheme.bg} ${currentTheme.text}`}
          >
            <UserCheck className="h-5 w-5" />
          </div>
          <div>
            <h1 className="font-heading text-xl font-bold text-foreground">
              Persona Profiles
            </h1>
            <p className="text-xs text-muted-foreground mt-0.5">
              Customize your identity, avatar, and contact preferences for each
              specific role persona.
            </p>
          </div>
        </div>
      </div>

      {/* Role Navigation Tabs */}
      <div className="flex rounded-2xl bg-secondary/60 p-1.5 border border-border/60">
        {ROLES.map((role) => {
          const Icon = role.icon;
          const isActive = activeTab === role.id;
          const theme = getRoleTheme(role.id);

          return (
            <button
              key={role.id}
              type="button"
              onClick={() => setActiveTab(role.id)}
              className={cn(
                "flex flex-1 items-center justify-center gap-2 rounded-xl py-2.5 text-xs font-semibold capitalize transition-all outline-none cursor-pointer",
                isActive
                  ? cn("bg-card shadow-xs", theme.text)
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              <Icon className="h-4 w-4" />
              <span>{role.label}</span>
            </button>
          );
        })}
      </div>

      {/* Form Content */}
      <div className="rounded-3xl border border-border bg-card p-6 shadow-sm sm:p-8">
        {isPersonaLoading ? (
          <Spinner className="h-64" />
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="flex flex-col items-center justify-center border-b border-border pb-8">
                <div className="relative mb-3">
                  <div className="absolute -inset-1 rounded-full bg-gradient-brand opacity-40 blur-sm pointer-events-none" />
                  <FormField
                    control={form.control}
                    name="avatar_url"
                    render={({ field }) => (
                      <FormItem className="relative">
                        <FormControl>
                          <AvatarInput
                            value={field.value ?? ""}
                            onChange={field.onChange}
                            name={currentName || "Persona"}
                            mode="edit"
                            size="lg"
                            disabled={updateMutation.isPending}
                          />
                        </FormControl>
                        <FormMessage className="text-center" />
                      </FormItem>
                    )}
                  />
                </div>
                <span className="text-xs font-semibold uppercase tracking-wider text-gradient-brand">
                  {activeTab} Persona Avatar
                </span>
                <p className="text-[11px] text-muted-foreground mt-0.5 text-center">
                  Set a unique display picture specifically for your {activeTab}{" "}
                  persona.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <FormField
                  control={form.control}
                  name="display_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        Display Name
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter persona display name"
                          className="h-11 rounded-xl bg-background border-border focus-visible:ring-primary"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Primary Phone Number Autocomplete */}
                <FormField
                  control={form.control}
                  name="phone_number_index"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        Persona Phone Number
                      </FormLabel>
                      <FormControl>
                        <Autocomplete<PhoneNumberItem, PhoneQueryParams>
                          value={field.value}
                          onSelect={field.onChange}
                          asyncConfig={{
                            queryFn: getPhoneNumbers,
                            queryKey: ["phone-numbers"],
                            searchKey: "search",
                          }}
                          labelKey="display_label"
                          valueKey="index"
                          iconKey="flag"
                          placeholder="Select contact phone number"
                          renderConfig={{
                            item: (option) => (
                              <div className="flex items-center gap-2.5 py-1.5 w-full">
                                {option.flag && (
                                  <img
                                    src={option.flag}
                                    alt="flag"
                                    className="h-3.5 w-5 object-contain rounded-xs shrink-0 shadow-xs"
                                  />
                                )}
                                <div className="flex flex-col min-w-0 flex-1">
                                  <span className="font-semibold text-foreground text-xs truncate">
                                    {option.label}
                                  </span>
                                  <span className="font-mono text-[11px] text-muted-foreground truncate">
                                    {option.dial_code} {option.number}
                                  </span>
                                </div>
                              </div>
                            ),
                            triggerAsCustom: false,
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="pt-4 border-t border-border flex justify-end">
                <Button
                  type="submit"
                  size="lg"
                  variant={activeTab}
                  className={cn("rounded-xl")}
                  disabled={!isDirty}
                  isLoading={updateMutation.isPending}
                >
                  <Save className="mr-2 h-4 w-4" /> Save Persona
                </Button>
              </div>
            </form>
          </Form>
        )}
      </div>
    </div>
  );
}
