"use client";

import { Autocomplete } from "@/components/common/input/Autocomplete";
import { AvatarInput } from "@/components/common/input/AvatarInput";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/common/input/FormField";
import { RoleSelectPopover } from "@/components/common/input/RoleSelectPopover";
import { Spinner } from "@/components/common/Spinner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useInfiniteSearch } from "@/hooks/use-infinite-search";
import {
  getGeneralProfile,
  getPhoneNumbers,
  updateGeneralProfile,
} from "@/lib/data/api/user";
import {
  updateGeneralProfileSchema,
  UpdateGeneralProfileValues,
} from "@/lib/data/schema/user/general_profile";
import {
  PhoneNumberItem,
  PhoneQueryParams,
} from "@/lib/data/schema/user/phone_number";
import { handleError } from "@/lib/error";
import { showToast } from "@/lib/toast";
import type { Role } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AtSign, Phone, Save, ShieldCheck, UserCheck } from "lucide-react";
import { useSession } from "next-auth/react";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";

export default function GeneralProfilePage() {
  const queryClient = useQueryClient();
  const { update: updateSession } = useSession();

  const [phoneSearch, setPhoneSearch] = useState("");

  const { data: profile, isLoading: isProfileLoading } = useQuery({
    queryKey: ["user-general-profile"],
    queryFn: getGeneralProfile,
  });

  const {
    data: phoneList,
    isLoading: isPhoneLoading,
    hasNextPage: hasMorePhone,
    fetchNextPage: fetchMorePhone,
    isFetchingNextPage: isFetchingMorePhone,
  } = useInfiniteSearch<PhoneNumberItem, PhoneQueryParams, PhoneNumberItem>({
    queryKey: ["user-phone-autocomplete"],
    queryFn: getPhoneNumbers,
    search: phoneSearch,
    searchKey: "number",
    initialLimit: 10,
  });

  const isInitializedRef = useRef(false);

  const form = useForm<UpdateGeneralProfileValues>({
    resolver: zodResolver(updateGeneralProfileSchema),
    defaultValues: {
      name: "",
      default_avatar_url: "",
      phone_number: "",
      active_role: "tenant",
    },
  });

  useEffect(() => {
    if (profile && !isInitializedRef.current) {
      form.reset({
        name: profile.name ?? "",
        default_avatar_url: profile.default_avatar_url ?? "",
        phone_number: profile.primary_phone ?? "",
        active_role: profile.active_role ?? "tenant",
      });
      isInitializedRef.current = true;
    }
  }, [profile, form]);

  const activeRole = form.watch("active_role");
  const currentName = form.watch("name");

  const getRoleColorClass = (role?: Role) => {
    switch (role) {
      case "owner":
        return "text-owner bg-owner/10";
      case "supplier":
        return "text-supplier bg-supplier/10";
      case "tenant":
      default:
        return "text-tenant bg-tenant/10";
    }
  };

  const currentRoleColorClass = getRoleColorClass(activeRole);

  const updateMutation = useMutation({
    mutationFn: updateGeneralProfile,
    onSuccess: async (res) => {
      showToast.success("General profile updated successfully");

      await updateSession({
        user: {
          defaultName: res.name,
          defaultPhone: res.primary_phone,
          defaultAvatarUrl: res.default_avatar_url,
          activeRole: res.active_role || activeRole,
        },
      });

      form.reset({
        name: res.name ?? form.getValues("name"),
        default_avatar_url:
          res.default_avatar_url ?? form.getValues("default_avatar_url"),
        phone_number: res.primary_phone ?? form.getValues("phone_number"),
        active_role: res.active_role ?? activeRole,
      });

      queryClient.invalidateQueries({ queryKey: ["user-general-profile"] });
    },
    onError: (error) => {
      handleError(error);
    },
  });

  function onSubmit(values: UpdateGeneralProfileValues) {
    updateMutation.mutate(values);
  }

  if (isProfileLoading) {
    return <Spinner className="h-96" />;
  }

  const { isDirty } = form.formState;

  return (
    <div className="mx-auto max-w-3xl space-y-8 pb-12">
      <div className="relative overflow-hidden rounded-3xl border border-border bg-card p-6 shadow-sm sm:p-8">
        <div className="absolute top-0 right-0 h-32 w-32 -translate-y-8 translate-x-8 rounded-full bg-gradient-brand opacity-10 blur-2xl pointer-events-none" />

        <div className="flex items-center gap-3">
          <div
            className={`flex h-10 w-10 items-center justify-center rounded-xl transition-colors ${currentRoleColorClass}`}
          >
            <UserCheck className="h-5 w-5" />
          </div>
          <div>
            <h1 className="font-heading text-xl font-bold text-foreground">
              General Profile
            </h1>
            <p className="text-xs text-muted-foreground mt-0.5">
              Manage your identity, profile picture, default persona, and main
              contact points.
            </p>
          </div>
        </div>
      </div>

      <div className="rounded-3xl border border-border bg-card p-6 shadow-sm sm:p-8">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="flex flex-col items-center justify-center border-b border-border pb-8">
              <div className="relative mb-3">
                <div className="absolute -inset-1 rounded-full bg-gradient-brand opacity-40 blur-sm pointer-events-none" />
                <FormField
                  control={form.control}
                  name="default_avatar_url"
                  render={({ field }) => (
                    <FormItem className="relative">
                      <FormControl>
                        <AvatarInput
                          value={field.value ?? ""}
                          onChange={field.onChange}
                          name={currentName || "User"}
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
                Profile Picture
              </span>
              <p className="text-[11px] text-muted-foreground mt-0.5 text-center mb-4">
                Click the camera badge or upload button to update your avatar
                photo.
              </p>

              <div className="w-full max-w-xs">
                <FormField
                  control={form.control}
                  name="active_role"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground block text-center mb-1">
                        Default Persona Role
                      </FormLabel>
                      <FormControl>
                        <RoleSelectPopover
                          value={field.value as Role}
                          onChange={(v) => field.onChange(v)}
                        />
                      </FormControl>
                      <FormMessage className="text-center text-xs" />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div className="space-y-1.5 rounded-2xl bg-secondary/40 p-4 border border-border/60">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                  <AtSign
                    className={`h-3.5 w-3.5 transition-colors ${activeRole === "owner" ? "text-owner" : activeRole === "supplier" ? "text-supplier" : "text-tenant"}`}
                  />{" "}
                  Email Address
                </span>
                <span className="inline-flex items-center gap-1 rounded-full bg-success/10 px-2 py-0.5 text-[10px] font-semibold text-success">
                  <ShieldCheck className="h-3 w-3" /> Verified Account
                </span>
              </div>
              <p className="text-sm font-semibold text-foreground pt-0.5 truncate">
                {profile?.email || "No email linked"}
              </p>
              <p className="text-[11px] text-muted-foreground">
                Email address is managed securely and cannot be altered directly
                here.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Full Name
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter your full name"
                        className="h-11 rounded-xl bg-background border-border focus-visible:ring-primary"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="phone_number"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Primary Phone Number
                    </FormLabel>
                    <FormControl>
                      <Autocomplete
                        value={field.value ?? ""}
                        onSelect={(v) => field.onChange(String(v))}
                        options={phoneList ?? []}
                        labelKey="number"
                        valueKey="number"
                        isLoading={isPhoneLoading}
                        isFetchingMore={isFetchingMorePhone}
                        hasMore={hasMorePhone}
                        fetchMore={() => fetchMorePhone()}
                        onFilterChange={(q) => setPhoneSearch(q)}
                        placeholder="Select or enter phone number"
                        indicatorIcon={<Phone className="size-4" />}
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
                variant={activeRole}
                disabled={!isDirty}
                isLoading={updateMutation.isPending}
              >
                <Save className="mr-2 h-4 w-4" /> Save Changes
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
