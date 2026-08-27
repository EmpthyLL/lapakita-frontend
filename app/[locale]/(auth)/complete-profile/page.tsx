"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { ArrowRight, Phone, ShieldCheck, UserCheck } from "lucide-react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";

import { AvatarInput } from "@/components/common/input/AvatarInput";
import { PasswordInput } from "@/components/common/input/PasswordInput";
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
import { AuthShell } from "../AuthShell";

export default function CompleteProfilePage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const setupToken = searchParams.get("setup_token") ?? "";
  const initialName = searchParams.get("name") ?? "";
  const initialEmail = searchParams.get("email") ?? "";
  const initialAvatar = searchParams.get("avatar_url") ?? "";

  const { control, handleSubmit, setValue, watch } =
    useForm<CompleteProfileValues>({
      resolver: zodResolver(completeProfileSchema),
      defaultValues: {
        setupToken,
        name: initialName,
        email: initialEmail,
        phone: "",
        password: "",
        avatarUrl: initialAvatar,
      },
    });

  const currentName = watch("name");

  useEffect(() => {
    if (setupToken) setValue("setupToken", setupToken);
    if (initialName) setValue("name", initialName);
    if (initialEmail) setValue("email", initialEmail);
    if (initialAvatar) setValue("avatarUrl", initialAvatar);
  }, [setupToken, initialName, initialEmail, initialAvatar, setValue]);

  const completeProfileMutation = useMutation({
    mutationFn: (values: CompleteProfileValues) =>
      completeGoogleProfile(values),
    onSuccess: async (_, variables) => {
      toast.success("Profile setup completed successfully!");

      const result = await signIn("credentials", {
        email: variables.email,
        password: variables.password,
        redirect: false,
      });

      if (result?.error) {
        handleError(
          new Error(
            "Profile completed, but automated login failed. Please login manually.",
          ),
        );
        router.push("/login");
      } else {
        router.push("/dashboard");
      }
    },
    onError: (error) => {
      handleError(error);
    },
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
          "Set up your profile photo, phone number, and password to finalize your Lapakita account.",
      }}
    >
      <div className="mb-6 text-center">
        <h1 className="font-heading text-xl font-bold tracking-tight text-foreground">
          Complete Your Profile
        </h1>
        <p className="mt-1 text-xs text-muted-foreground">
          Verify your details to finish setting up your account.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Input Avatar Komponen Terpisah */}
        <div className="mb-6 rounded-xl border border-border bg-secondary/30 p-4">
          <Controller
            control={control}
            name="avatarUrl"
            render={({ field }) => (
              <AvatarInput
                value={field.value}
                onChange={field.onChange}
                name={currentName}
              />
            )}
          />
        </div>

        <FieldGroup className="space-y-3.5">
          {/* Full Name */}
          <Controller
            control={control}
            name="name"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <div className="flex items-center justify-between">
                  <FieldLabel htmlFor="name">Full Name</FieldLabel>
                  <span className="text-[11px] text-muted-foreground">
                    From Google
                  </span>
                </div>
                <Input id="name" placeholder="Full Name" {...field} />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          {/* Phone Number */}
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
                  <Phone className="absolute right-3 size-4 text-muted-foreground pointer-events-none" />
                </div>
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          {/* Set Password */}
          <Controller
            control={control}
            name="password"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="password">Create Password</FieldLabel>
                <PasswordInput
                  id="password"
                  placeholder="Create account password"
                  {...field}
                />
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
              className="w-full font-semibold group"
            >
              <span>Complete Setup</span>
              <ArrowRight className="size-4 transition-transform duration-150 group-hover:translate-x-1" />
            </Button>
          </Field>
        </FieldGroup>
      </form>

      <div className="mt-6 rounded-lg border border-dashed border-border p-3">
        <div className="flex items-center justify-center gap-2 text-center text-muted-foreground">
          <ShieldCheck className="size-4 shrink-0 text-primary" />
          <p className="text-[11px] leading-normal font-medium">
            Your information is secured. Password enables fallback email logins.
          </p>
        </div>
      </div>
    </AuthShell>
  );
}
