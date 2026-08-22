"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  ArrowRight,
  CheckCircle2,
  Phone,
  ShieldCheck,
  Sparkles,
  UserPlus,
} from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";

import { GoogleButton } from "@/components/common/GoogleButton";
import { PasswordInput } from "@/components/common/input/PasswordInput";
import { GoogleIcon } from "@/components/icon/SocialIcon";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  registerSchema,
  RegisterValues,
} from "@/lib/data/schema/auth/register";
import { AuthDivider } from "../AuthDivider";
import { AuthShell } from "../AuthShell";

export default function RegisterPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);

  const isGoogleMode = searchParams.get("mode") === "google";
  const googleEmail = searchParams.get("email") ?? "";
  const googleName = searchParams.get("name") ?? "";

  const { control, handleSubmit, setValue } = useForm<RegisterValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      isGoogleMode: isGoogleMode,
      name: googleName,
      phone: "",
      email: googleEmail,
      password: "",
      confirm_password: "",
    },
  });

  useEffect(() => {
    setValue("isGoogleMode", isGoogleMode);
    if (googleName) setValue("name", googleName);
    if (googleEmail) setValue("email", googleEmail);
  }, [isGoogleMode, googleName, googleEmail, setValue]);

  async function onSubmit(values: RegisterValues) {
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsLoading(false);

    const targetEmail = isGoogleMode ? googleEmail : values.email;
    router.push(
      `/verify-otp?flow=register&email=${encodeURIComponent(targetEmail ?? "")}`,
    );
  }

  return (
    <AuthShell
      imageSide="left"
      illustration={{
        icon: UserPlus,
        eyebrow: isGoogleMode ? "Final Step" : "Join Lapakita",
        headline: isGoogleMode
          ? "Welcome to the Lapakita Ecosystem."
          : "One account, three ways to grow.",
        description: isGoogleMode
          ? "Your Google account is connected. Confirm your details to unlock stall rentals and business analytics."
          : "Rent a stall, list your space, or supply the ecosystem — all from a single Lapakita account.",
      }}
    >
      <div className="mb-5">
        {isGoogleMode ? (
          <>
            <div className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
              <Sparkles className="size-3.5 shrink-0" />
              <span>Google Account Verified</span>
            </div>
            <h1 className="mt-2.5 font-heading text-2xl font-bold tracking-tight text-foreground">
              Complete Your Profile
            </h1>
            <p className="mt-1 text-xs text-muted-foreground">
              Verify your details to finish setting up your identity.
            </p>
          </>
        ) : (
          <>
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
          </>
        )}
      </div>

      {isGoogleMode ? (
        <div className="mb-5 flex items-center justify-between rounded-xl border border-border bg-secondary/40 p-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-background shadow-xs border border-border">
              <GoogleIcon className="size-4" />
            </div>
            <div className="min-w-0">
              <p className="text-[11px] text-muted-foreground font-medium">
                Connected Google ID
              </p>
              <p className="truncate text-xs font-semibold text-foreground">
                {googleEmail || "user@gmail.com"}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1 shrink-0 text-success text-[11px] font-semibold bg-success/10 px-2.5 py-0.5 rounded-full">
            <CheckCircle2 className="size-3.5" />
            <span>Linked</span>
          </div>
        </div>
      ) : (
        <>
          <GoogleButton href="/api/auth/google?flow=register" />
          <AuthDivider label="Or sign up with email" />
        </>
      )}

      <form onSubmit={handleSubmit(onSubmit)}>
        <FieldGroup className="space-y-2.5">
          {/* Full Name */}
          <Controller
            control={control}
            name="name"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <div className="flex items-center justify-between">
                  <FieldLabel htmlFor="name">Full Name</FieldLabel>
                  {isGoogleMode && (
                    <span className="text-[11px] text-muted-foreground/80">
                      Pulled from Google
                    </span>
                  )}
                </div>
                <Input id="name" placeholder="e.g. John Doe" {...field} />
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
                    className={isGoogleMode ? "pr-10" : ""}
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

          {/* Email, Password & Confirm Password (HANYA MANUAL REGISTER) */}
          {!isGoogleMode && (
            <>
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
                        At least 8 characters, with 1 uppercase letter and 1
                        number.
                      </FieldDescription>
                    )}
                  </Field>
                )}
              />

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
            </>
          )}

          <Field className="pt-1.5">
            <Button
              type="submit"
              isLoading={isLoading}
              size="lg"
              className="w-full font-semibold group"
            >
              <span>{isGoogleMode ? "Complete Setup" : "Create Account"}</span>
              {isGoogleMode && (
                <ArrowRight className="size-4 transition-transform duration-150 group-hover:translate-x-1" />
              )}
            </Button>
          </Field>
        </FieldGroup>
      </form>

      {isGoogleMode ? (
        <div className="mt-6 rounded-lg border border-dashed border-border p-2.5">
          <div className="flex items-center justify-center gap-2 text-center text-muted-foreground">
            <ShieldCheck className="size-4 shrink-0 text-primary" />
            <p className="text-[11px] leading-normal font-medium">
              Your phone number is used for account verification and receiving
              transactional updates from Lapakita.
            </p>
          </div>
        </div>
      ) : (
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
      )}
    </AuthShell>
  );
}
