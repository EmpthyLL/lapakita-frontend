"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { ShieldCheck } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";

import { PasswordInput } from "@/components/common/input/PasswordInput";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { resetPassword } from "@/lib/data/api/auth";
import {
  resetSchema,
  ResetValues,
} from "@/lib/data/schema/auth/reset_password";
import { handleError } from "@/lib/error";
import { AuthShell } from "../AuthShell";

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const token = searchParams.get("token") || "";
  const email = searchParams.get("email") || "";

  const { control, handleSubmit } = useForm<ResetValues>({
    resolver: zodResolver(resetSchema),
    defaultValues: { password: "", confirmPassword: "" },
  });

  const resetMutation = useMutation({
    mutationFn: (values: ResetValues) =>
      resetPassword({
        verification_token: token,
        new_password: values.password,
      }),
    onSuccess: () => {
      toast.success("Password reset successfully! Please log in.");
      router.push("/login?reset=1");
    },
    onError: (error) => {
      handleError(error);
    },
  });

  function onSubmit(values: ResetValues) {
    resetMutation.mutate(values);
  }

  return (
    <AuthShell
      layout="centered"
      illustration={{
        icon: ShieldCheck,
        eyebrow: "Secure your account",
        headline: "Set a new password.",
        description:
          "Choose something strong and unique — you'll use it every time you log back in.",
      }}
    >
      <div className="mb-8">
        <h1 className="font-heading text-2xl font-bold tracking-tight text-foreground">
          Reset your password
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {email ? (
            <>
              Create a new password for{" "}
              <span className="font-medium text-foreground">{email}</span>.
            </>
          ) : (
            "Create a new password for your account."
          )}
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <FieldGroup>
          <Controller
            control={control}
            name="password"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="password">New Password</FieldLabel>
                <PasswordInput
                  id="password"
                  placeholder="Create a new password"
                  {...field}
                />
                <FieldDescription>At least 6 characters long.</FieldDescription>
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          <Controller
            control={control}
            name="confirmPassword"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="confirmPassword">
                  Confirm New Password
                </FieldLabel>
                <PasswordInput
                  id="confirmPassword"
                  placeholder="Re-enter your new password"
                  {...field}
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          <Field>
            <Button
              type="submit"
              isLoading={resetMutation.isPending}
              size="lg"
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
            >
              Reset Password
            </Button>
          </Field>
        </FieldGroup>
      </form>
    </AuthShell>
  );
}
