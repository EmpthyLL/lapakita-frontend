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
import { PhoneSelector } from "@/components/common/input/PhoneSelector";
import { Spinner } from "@/components/common/Spinner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getPersonaProfile, updatePersonaProfile } from "@/lib/data/api/user";
import {
  updatePersonaSchema,
  UpdatePersonaValues,
} from "@/lib/data/schema/user/persona";
import { handleError } from "@/lib/error";
import { showToast } from "@/lib/toast";
import { cn } from "@/lib/utils";
import type { Role } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Briefcase, Building2, Home, Save } from "lucide-react";
import { useSession } from "next-auth/react";
import { useParams } from "next/navigation";
import { useEffect, useRef } from "react";
import { useForm } from "react-hook-form";

const ROLE_CONFIG: Record<
  Role,
  {
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    description: string;
  }
> = {
  tenant: {
    label: "Tenant Profile",
    icon: Home,
    description:
      "Manage your display name, avatar, and contact details specifically for your tenant activities.",
  },
  owner: {
    label: "Stall Owner Profile",
    icon: Building2,
    description:
      "Manage your display name, avatar, and contact details specifically for your stall owner activities.",
  },
  supplier: {
    label: "Supplier Profile",
    icon: Briefcase,
    description:
      "Manage your display name, avatar, and contact details specifically for your supplier activities.",
  },
};

const VALID_ROLES: Role[] = ["tenant", "owner", "supplier"];

export default function RoleProfilePage() {
  const queryClient = useQueryClient();
  const { data: session, update: updateSession } = useSession();
  const params = useParams();

  const rawRole = (params?.role as string)?.toLowerCase() as Role;
  const currentRole: Role = VALID_ROLES.includes(rawRole) ? rawRole : "tenant";

  const config = ROLE_CONFIG[currentRole];
  const Icon = config.icon;

  const { data: persona, isLoading: isPersonaLoading } = useQuery({
    queryKey: ["user-persona-profile", currentRole],
    queryFn: () => getPersonaProfile(currentRole),
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

  // Reset form saat role URL berubah
  useEffect(() => {
    isInitializedRef.current = false;
  }, [currentRole]);

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
        return { text: "text-owner", bg: "bg-owner/10" };
      case "supplier":
        return { text: "text-supplier", bg: "bg-supplier/10" };
      case "tenant":
      default:
        return { text: "text-tenant", bg: "bg-tenant/10" };
    }
  };

  const currentTheme = getRoleTheme(currentRole);

  const updateMutation = useMutation({
    mutationFn: (values: UpdatePersonaValues) =>
      updatePersonaProfile(currentRole, values),
    onSuccess: async (res) => {
      showToast.success(
        `${currentRole.charAt(0).toUpperCase() + currentRole.slice(1)} profile updated successfully`,
      );

      const existingPersonas = session?.user?.personas || {};

      await updateSession({
        user: {
          personas: {
            ...existingPersonas,
            [currentRole]: {
              display_name: res.display_name,
              avatar_url: res.avatar_url,
              phone: res.phone
                ? {
                    dial_code: res.phone.dial_code,
                    number: res.phone.number,
                  }
                : null,
            },
          },
        },
      });

      queryClient.invalidateQueries({
        queryKey: ["user-persona-profile", currentRole],
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
            <Icon className="h-5 w-5" />
          </div>
          <div>
            <h1 className="font-heading text-xl font-bold text-foreground capitalize">
              {config.label}
            </h1>
            <p className="text-xs text-muted-foreground mt-0.5">
              {config.description}
            </p>
          </div>
        </div>
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
                  {currentRole} Avatar
                </span>
                <p className="text-[11px] text-muted-foreground mt-0.5 text-center">
                  Set a unique display picture specifically for your{" "}
                  {currentRole} role workspace.
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
                          placeholder="Enter display name"
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
                        Contact Phone Number
                      </FormLabel>
                      <FormControl>
                        <PhoneSelector
                          value={field.value}
                          onSelect={field.onChange}
                          placeholder="Select contact phone number"
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
                  className={cn("rounded-xl")}
                  disabled={!isDirty}
                  isLoading={updateMutation.isPending}
                >
                  <Save className="mr-2 h-4 w-4" /> Save Changes
                </Button>
              </div>
            </form>
          </Form>
        )}
      </div>
    </div>
  );
}
