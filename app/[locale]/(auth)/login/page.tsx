"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { LogIn } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";

import { GoogleButton } from "@/components/common/GoogleButton";
import { PasswordInput } from "@/components/common/input/PasswordInput";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { loginSchema, LoginValues } from "@/lib/data/schema/auth/login";
import { AuthDivider } from "../AuthDivider";
import { AuthShell } from "../AuthShell";

export default function LoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const { control, handleSubmit } = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "", remember: false },
  });

  async function onSubmit() {
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsLoading(false);
    router.push("/dashboard");
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

      {/* Social sign-in */}
      <GoogleButton href="/api/auth/google?flow=login" />

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

          <Controller
            control={control}
            name="remember"
            render={({ field }) => (
              <Field orientation="horizontal">
                <Checkbox
                  id="remember"
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
                <FieldLabel
                  htmlFor="remember"
                  className="font-normal text-muted-foreground"
                >
                  Keep me logged in
                </FieldLabel>
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
              Log In
            </Button>
          </Field>
        </FieldGroup>
      </form>
    </AuthShell>
  );
}
