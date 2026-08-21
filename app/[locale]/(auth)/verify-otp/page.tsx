"use client";

import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ArrowLeft, MailCheck } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldGroup } from "@/components/ui/field";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { AuthShell } from "../AuthShell";
import { otpSchema, OtpValues } from "@/lib/data/schema/auth/otp";

const RESEND_SECONDS = 30;

export default function VerifyOtpPage() {
  const router = useRouter();

  const flow = "reset";
  const email = "johndoe@example.com";

  const [isLoading, setIsLoading] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(RESEND_SECONDS);
  // guards against double-submit if autofill fires onChange twice
  const hasAutoSubmitted = useRef(false);

  const { control, handleSubmit, watch } = useForm<OtpValues>({
    resolver: zodResolver(otpSchema),
    defaultValues: { code: "" },
  });

  const codeValue = watch("code");

  useEffect(() => {
    if (secondsLeft <= 0) return;
    const timer = setInterval(() => setSecondsLeft((s) => s - 1), 1000);
    return () => clearInterval(timer);
  }, [secondsLeft]);

  // Auto-submit once all 6 digits are entered
  useEffect(() => {
    if (codeValue?.length === 6 && !hasAutoSubmitted.current && !isLoading) {
      hasAutoSubmitted.current = true;
      handleSubmit(onSubmit)();
    }
    if (codeValue?.length !== 6) {
      hasAutoSubmitted.current = false;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [codeValue]);

  async function onSubmit() {
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsLoading(false);

    if (flow === "reset") {
      router.push(`/reset-password?email=${encodeURIComponent(email)}`);
    } else {
      router.push("/login?verified=1");
    }
  }

  function handleResend() {
    if (secondsLeft > 0) return;
    setSecondsLeft(RESEND_SECONDS);
    hasAutoSubmitted.current = false;
  }

  return (
    <AuthShell
      layout="centered"
      illustration={{
        icon: MailCheck,
        eyebrow: "Almost there",
        headline: "Check your inbox.",
        description:
          "A 6-digit verification code keeps your Lapakita account secure, whether you're joining or resetting access.",
      }}
    >
      <Link
        href={flow === "reset" ? "/forgot-password" : "/register"}
        className="mb-8 inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Back
      </Link>

      <div className="mb-8 text-center">
        <h1 className="font-heading text-2xl font-bold tracking-tight text-foreground">
          Enter verification code
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          We sent a 6-digit code to{" "}
          <span className="font-medium text-foreground">{email}</span>. This is
          a demo, so any 6-digit code will work.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <FieldGroup>
          <Controller
            control={control}
            name="code"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid} className="items-center">
                <InputOTP
                  maxLength={6}
                  value={field.value}
                  onChange={field.onChange}
                  disabled={isLoading}
                  containerClassName="justify-center"
                >
                  <InputOTPGroup>
                    <InputOTPSlot
                      index={0}
                      className="size-12 text-lg sm:size-14 sm:text-xl"
                    />
                    <InputOTPSlot
                      index={1}
                      className="size-12 text-lg sm:size-14 sm:text-xl"
                    />
                    <InputOTPSlot
                      index={2}
                      className="size-12 text-lg sm:size-14 sm:text-xl"
                    />
                    <InputOTPSlot
                      index={3}
                      className="size-12 text-lg sm:size-14 sm:text-xl"
                    />
                    <InputOTPSlot
                      index={4}
                      className="size-12 text-lg sm:size-14 sm:text-xl"
                    />
                    <InputOTPSlot
                      index={5}
                      className="size-12 text-lg sm:size-14 sm:text-xl"
                    />
                  </InputOTPGroup>
                </InputOTP>
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          {/* Fallback manual submit — mostly redundant once auto-submit fires,
              but kept for accessibility and edge cases (paste, autofill quirks). */}
          <Field>
            <Button
              type="submit"
              isLoading={isLoading}
              size="lg"
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
            >
              Verify Code
            </Button>
          </Field>
        </FieldGroup>
      </form>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        Didn&apos;t get the code?{" "}
        <button
          type="button"
          onClick={handleResend}
          disabled={secondsLeft > 0}
          className="font-medium text-primary hover:underline disabled:cursor-not-allowed disabled:text-muted-foreground disabled:no-underline"
        >
          {secondsLeft > 0 ? `Resend in ${secondsLeft}s` : "Resend code"}
        </button>
      </p>
    </AuthShell>
  );
}
