/* eslint-disable react-hooks/incompatible-library */
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { ArrowRight, Phone, UserCheck } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";

import { AvatarInput } from "@/components/common/input/AvatarInput";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { completeGoogleProfile } from "@/lib/data/api/auth";
import {
  completeProfileSchema,
  CompleteProfileValues,
} from "@/lib/data/schema/auth/complete_profile";
import { handleError } from "@/lib/error";
import { showToast } from "@/lib/toast";
import { AuthShell } from "../AuthShell";

export default function CompleteProfilePage() {
  const router = useRouter();
  const { data: session, update: updateSession } = useSession();

  const user = session?.user;

  const { control, handleSubmit, setValue, watch } =
    useForm<CompleteProfileValues>({
      resolver: zodResolver(completeProfileSchema),
      defaultValues: {
        setupToken: "",
        name: user?.name || user?.defaultName || "",
        email: user?.email || "",
        phone: user?.phone || user?.defaultPhone || "",
        password: "",
        avatarUrl: user?.avatarUrl || user?.defaultAvatarUrl || "",
      },
    });

  const currentName = watch("name");

  // Sync data form jika session selesai dimuat
  useEffect(() => {
    if (user) {
      if (user.name || user.defaultName)
        setValue("name", user.name || user.defaultName || "");
      if (user.email) setValue("email", user.email);
      if (user.avatarUrl || user.defaultAvatarUrl)
        setValue("avatarUrl", user.avatarUrl || user.defaultAvatarUrl || "");
      if (user.phone || user.defaultPhone)
        setValue("phone", user.phone || user.defaultPhone || "");
    }
  }, [user, setValue]);

  const completeProfileMutation = useMutation({
    mutationFn: (values: CompleteProfileValues) =>
      completeGoogleProfile({
        setup_token: values.setupToken,
        name: values.name,
        phone: values.phone,
        avatar_url: values.avatarUrl || undefined,
      }),
    onSuccess: async (res) => {
      const authData = res.data;

      if (authData) {
        // 1. Perbarui payload Session lokal di browser
        await updateSession({
          defaultName: authData.user.default_name,
          defaultPhone: authData.user.default_phone,
          defaultAvatarUrl: authData.user.default_avatar_url,
          phoneNumbers: authData.user.phone_numbers,
          personas: authData.user.personas,
        });

        if (res.message) {
          showToast.success(res.message);
        }

        // 2. Navigasi ke Dashboard (Middleware akan meloloskan karena phone & name sudah terisi)
        router.push("/dashboard");
        router.refresh();
      }
    },
    onError: handleError,
  });

  function onSubmit(values: CompleteProfileValues) {
    completeProfileMutation.mutate(values);
  }

  return (
    <AuthShell
      layout="centered"
      illustration={{
        icon: UserCheck,
        eyebrow: "Google Account Connected",
        headline: "Complete Your Profile",
        description:
          "Confirm your name, setup your profile photo, and add your phone number to finish setting up your account.",
      }}
    >
      <div className="mb-6 text-center">
        <h1 className="font-heading text-2xl font-bold tracking-tight text-foreground">
          Complete Your Profile
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Signed in with Google as{" "}
          <span className="font-medium text-foreground">
            {user?.email || "—"}
          </span>
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-6 rounded-xl border border-border bg-secondary/30 p-4">
          <Controller
            control={control}
            name="avatarUrl"
            render={({ field }) => (
              <AvatarInput
                value={field.value}
                onChange={field.onChange}
                name={currentName}
                disabled={completeProfileMutation.isPending}
              />
            )}
          />
        </div>

        <FieldGroup className="space-y-3.5">
          <Controller
            control={control}
            name="name"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <div className="flex items-center justify-between">
                  <FieldLabel htmlFor="name">Full Name</FieldLabel>
                  <span className="text-[11px] text-muted-foreground">
                    From Google — editable
                  </span>
                </div>
                <Input id="name" placeholder="e.g. John Doe" {...field} />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          <Controller
            control={control}
            name="phone"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="phone">Phone Number</FieldLabel>
                <div className="relative flex items-center">
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+62 812 3456 7890"
                    className="pr-10"
                    {...field}
                  />
                  <Phone className="pointer-events-none absolute right-3 size-4 text-muted-foreground" />
                </div>
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          <Field className="pt-2">
            <Button
              type="submit"
              isLoading={completeProfileMutation.isPending}
              size="lg"
              className="group w-full font-semibold"
            >
              <span>Complete Setup</span>
              <ArrowRight className="size-4 transition-transform duration-150 group-hover:translate-x-1" />
            </Button>
          </Field>
        </FieldGroup>
      </form>
    </AuthShell>
  );
}
