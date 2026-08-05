"use client";

import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ShieldCheck } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { AuthShell } from "../AuthShell";
import { PasswordInput } from "@/components/ui/password-input";
import {
  resetSchema,
  ResetValues,
} from "@/lib/data/schema/auth/reset_password";

export default function ResetPasswordPage() {
  const router = useRouter();
  const email = "johndoe@example.com";
  const [isLoading, setIsLoading] = useState(false);

  const { control, handleSubmit } = useForm<ResetValues>({
    resolver: zodResolver(resetSchema),
    defaultValues: { password: "", confirmPassword: "" },
  });

  async function onSubmit() {
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsLoading(false);
    router.push("/login?reset=1");
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
                <FieldDescription>
                  At least 8 characters, with 1 uppercase letter and 1 number.
                </FieldDescription>
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
              isLoading={isLoading}
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
