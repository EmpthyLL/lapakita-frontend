"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { LogIn } from "lucide-react";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";

import { GoogleButton } from "@/components/common/GoogleButton";
import { PasswordInput } from "@/components/common/input/PasswordInput";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { loginSchema, LoginValues } from "@/lib/data/schema/auth/login";
import { handleError } from "@/lib/error";
import { AuthDivider } from "../AuthDivider";
import { AuthShell } from "../AuthShell";

export default function LoginPage() {
  const router = useRouter();

  const { control, handleSubmit } = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const loginMutation = useMutation({
    mutationFn: async (values: LoginValues) => {
      const result = await signIn("credentials", {
        email: values.email,
        password: values.password,
        redirect: false,
      });

      // Pengecekan respons NextAuth v5
      if (result?.error || !result?.ok) {
        const errorMessage =
          result?.code && result.code !== "credentials"
            ? result.code
            : "Invalid email or password";

        throw new Error(errorMessage);
      }

      return result;
    },
    onSuccess: () => {
      router.push("/dashboard");
    },
    onError: (error) => {
      handleError(error);
    },
  });

  function onSubmit(values: LoginValues) {
    loginMutation.mutate(values);
  }

  return (
    <AuthShell
      imageSide="right"
      illustration={{
        icon: LogIn,
        eyebrow: "Welcome back",
        headline: "Pick up right where you left off.",
        description:
          "Track occupancy, restock supply, or manage your stall — your dashboard is one login away.",
      }}
    >
      <div className="mb-8">
        <h1 className="font-heading text-2xl font-bold tracking-tight text-foreground">
          Log in to Lapakita
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Don&apos;t have an account?{" "}
          <Link
            href="/register"
            className="font-medium text-primary hover:underline"
          >
            Sign up
          </Link>
        </p>
      </div>

      <GoogleButton />

      <AuthDivider label="Or log in with email" />

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

          <Controller
            control={control}
            name="password"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <div className="flex items-center justify-between">
                  <FieldLabel htmlFor="password">Password</FieldLabel>
                  <Link
                    href="/forget-password"
                    className="text-xs font-medium text-primary hover:underline"
                  >
                    Forget password?
                  </Link>
                </div>
                <PasswordInput
                  id="password"
                  placeholder="Enter your password"
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
              isLoading={loginMutation.isPending}
              size="lg"
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
            >
              Log In
            </Button>
          </Field>
        </FieldGroup>
      </form>
    </AuthShell>
  );
}
