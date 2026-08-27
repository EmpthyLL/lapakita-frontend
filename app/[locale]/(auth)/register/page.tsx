"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { UserPlus } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";

import { GoogleButton } from "@/components/common/GoogleButton";
import { PasswordInput } from "@/components/common/input/PasswordInput";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { registerUser } from "@/lib/data/api/auth";
import {
  registerSchema,
  RegisterValues,
} from "@/lib/data/schema/auth/register";
import { handleError } from "@/lib/error";
import { AuthDivider } from "../AuthDivider";
import { AuthShell } from "../AuthShell";

export default function RegisterPage() {
  const router = useRouter();

  const { control, handleSubmit } = useForm<RegisterValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      password: "",
      confirm_password: "",
    },
  });

  const registerMutation = useMutation({
    mutationFn: (values: RegisterValues) => registerUser(values),
    onSuccess: (_, variables) => {
      toast.success("Account created! Please verify your email.");
      router.push(
        `/verify-otp?flow=register&email=${encodeURIComponent(variables.email)}`,
      );
    },
    onError: (error) => {
      handleError(error);
    },
  });

  function onSubmit(values: RegisterValues) {
    registerMutation.mutate(values);
  }

  return (
    <AuthShell
      imageSide="left"
      illustration={{
        icon: UserPlus,
        eyebrow: "Join Lapakita",
        headline: "One account, three ways to grow.",
        description:
          "Rent a stall, list your space, or supply the ecosystem — all from a single Lapakita account.",
      }}
    >
      <div className="mb-5">
        <h1 className="font-heading text-2xl font-bold tracking-tight text-foreground">
          Create your account
        </h1>
        <p className="mt-1 text-xs text-muted-foreground">
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-medium text-primary hover:underline"
          >
            Log in
          </Link>
        </p>
      </div>

      <GoogleButton />
      <AuthDivider label="Or sign up with email" />

      <form onSubmit={handleSubmit(onSubmit)}>
        <FieldGroup>
          {/* Full Name */}
          <Controller
            control={control}
            name="name"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="name">Full Name</FieldLabel>
                <Input id="name" placeholder="e.g. John Doe" {...field} />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          {/* Email Address */}
          <Controller
            control={control}
            name="email"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="email">Email Address</FieldLabel>
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

          {/* Phone Number */}
          <Controller
            control={control}
            name="phone"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="phone">Phone Number</FieldLabel>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+62 812 3456 7890"
                  {...field}
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          {/* Password */}
          <Controller
            control={control}
            name="password"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="password">Password</FieldLabel>
                <PasswordInput
                  id="password"
                  placeholder="Create a password"
                  {...field}
                />
                {fieldState.invalid ? (
                  <FieldError errors={[fieldState.error]} />
                ) : (
                  <FieldDescription>
                    At least 8 characters long.
                  </FieldDescription>
                )}
              </Field>
            )}
          />

          {/* Confirm Password */}
          <Controller
            control={control}
            name="confirm_password"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="confirm_password">
                  Confirm Password
                </FieldLabel>
                <PasswordInput
                  id="confirm_password"
                  placeholder="Re-enter your password"
                  {...field}
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          <Field className="pt-1.5">
            <Button
              type="submit"
              isLoading={registerMutation.isPending}
              size="lg"
              className="w-full font-semibold"
            >
              Create Account
            </Button>
          </Field>
        </FieldGroup>
      </form>

      <p className="mt-5 text-center text-xs text-muted-foreground">
        By creating an account, you agree to Lapakita&apos;s{" "}
        <Link href="/terms" className="underline hover:text-foreground">
          Terms of Service
        </Link>{" "}
        and{" "}
        <Link href="/privacy" className="underline hover:text-foreground">
          Privacy Policy
        </Link>
        .
      </p>
    </AuthShell>
  );
}
