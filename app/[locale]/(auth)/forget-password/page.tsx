"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { ArrowLeft, KeyRound } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { sendOTP } from "@/lib/data/api/auth";
import {
  forgotSchema,
  ForgotValues,
} from "@/lib/data/schema/auth/forget_password";
import { handleError } from "@/lib/error";
import { AuthShell } from "../AuthShell";

export default function ForgotPasswordPage() {
  const router = useRouter();

  const { control, handleSubmit } = useForm<ForgotValues>({
    resolver: zodResolver(forgotSchema),
    defaultValues: { email: "" },
  });

  const sendOtpMutation = useMutation({
    mutationFn: (values: ForgotValues) =>
      sendOTP({ ...values, mode: "reset_password" }),
    onSuccess: (_, variables) => {
      router.push(
        `/verify-otp?flow=reset&email=${encodeURIComponent(variables.email)}`,
      );
    },
    onError: (error) => {
      handleError(error);
    },
  });

  function onSubmit(values: ForgotValues) {
    sendOtpMutation.mutate(values);
  }

  return (
    <AuthShell
      layout="centered"
      illustration={{
        icon: KeyRound,
        eyebrow: "Account recovery",
        headline: "Let's get you back in.",
        description:
          "We'll send a verification code to your email so you can safely reset your password.",
      }}
    >
      <Link
        href="/login"
        className="mb-8 inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to login
      </Link>

      <div className="mb-8">
        <h1 className="font-heading text-2xl font-bold tracking-tight text-foreground">
          Forgot your password?
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Enter the email linked to your account and we&apos;ll send you a
          verification code.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <FieldGroup>
          <Controller
            control={control}
            name="email"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@business.com"
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
              isLoading={sendOtpMutation.isPending}
              size="lg"
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
            >
              Send Verification Code
            </Button>
          </Field>
        </FieldGroup>
      </form>
    </AuthShell>
  );
}
