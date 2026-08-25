"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { ArrowLeft, MailCheck } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldGroup } from "@/components/ui/field";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { sendOTP, verifyOTP } from "@/lib/data/api/auth";
import { otpSchema, OtpValues } from "@/lib/data/schema/auth/otp";
import { handleError } from "@/lib/error";
import { AuthShell } from "../AuthShell";

const RESEND_SECONDS = 30;

export default function VerifyOtpPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const flow = searchParams.get("flow") || "reset";
  const email = searchParams.get("email") || "";

  const [secondsLeft, setSecondsLeft] = useState(RESEND_SECONDS);
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

  const verifyOtpMutation = useMutation({
    mutationFn: (values: OtpValues) =>
      verifyOTP({
        state_payload: JSON.stringify({ email, mode: flow }),
        otp_code: values.code,
      }),
    onSuccess: (data) => {
      if (flow === "reset") {
        router.push(
          `/reset-password?token=${encodeURIComponent(data?.token || "")}&email=${encodeURIComponent(email)}`,
        );
      } else {
        router.push("/login?verified=1");
      }
    },
    onError: (error) => {
      hasAutoSubmitted.current = false;
      handleError(error);
    },
  });

  const resendMutation = useMutation({
    mutationFn: () =>
      sendOTP({
        email,
        mode: flow === "reset" ? "reset_password" : "register",
      }),
    onSuccess: () => {
      setSecondsLeft(RESEND_SECONDS);
      hasAutoSubmitted.current = false;
    },
    onError: (error) => {
      handleError(error);
    },
  });

  useEffect(() => {
    if (
      codeValue?.length === 6 &&
      !hasAutoSubmitted.current &&
      !verifyOtpMutation.isPending
    ) {
      hasAutoSubmitted.current = true;
      handleSubmit((vals) => verifyOtpMutation.mutate(vals))();
    }
    if (codeValue?.length !== 6) {
      hasAutoSubmitted.current = false;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [codeValue]);

  function onSubmit(values: OtpValues) {
    verifyOtpMutation.mutate(values);
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
        href={flow === "reset" ? "/forget-password" : "/register"}
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
          <span className="font-medium text-foreground">{email}</span>.
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
                  disabled={verifyOtpMutation.isPending}
                  containerClassName="justify-center"
                >
                  <InputOTPGroup>
                    <InputOTPSlot
                      index={0}
                      className="size-12 sm:size-14 text-lg sm:text-xl"
                    />
                    <InputOTPSlot
                      index={1}
                      className="size-12 sm:size-14 text-lg sm:text-xl"
                    />
                    <InputOTPSlot
                      index={2}
                      className="size-12 sm:size-14 text-lg sm:text-xl"
                    />
                    <InputOTPSlot
                      index={3}
                      className="size-12 sm:size-14 text-lg sm:text-xl"
                    />
                    <InputOTPSlot
                      index={4}
                      className="size-12 sm:size-14 text-lg sm:text-xl"
                    />
                    <InputOTPSlot
                      index={5}
                      className="size-12 sm:size-14 text-lg sm:text-xl"
                    />
                  </InputOTPGroup>
                </InputOTP>
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          <Field>
            <Button
              type="submit"
              isLoading={verifyOtpMutation.isPending}
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
          onClick={() => resendMutation.mutate()}
          disabled={secondsLeft > 0 || resendMutation.isPending}
          className="font-medium text-primary hover:underline disabled:cursor-not-allowed disabled:text-muted-foreground disabled:no-underline"
        >
          {secondsLeft > 0 ? `Resend in ${secondsLeft}s` : "Resend code"}
        </button>
      </p>
    </AuthShell>
  );
}
