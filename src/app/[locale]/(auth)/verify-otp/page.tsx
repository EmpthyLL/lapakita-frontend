/* eslint-disable react-hooks/incompatible-library */
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { ArrowLeft, MailCheck } from "lucide-react";
import { signIn } from "next-auth/react";
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
import {
  flowToOtpMode,
  otpSchema,
  OtpValues,
} from "@/lib/data/schema/auth/otp";
import { handleError } from "@/lib/error";
import { showToast } from "@/lib/toast";
import { AuthShell } from "../AuthShell";

const RESEND_SECONDS = 60;

function formatTime(seconds: number) {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return mins > 0 ? `${mins}m ${secs}s` : `${secs}s`;
}

export default function VerifyOtpPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const flow = searchParams.get("flow") || "reset_password";
  const email = searchParams.get("email") || "";
  const mode = flowToOtpMode(flow);

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
      verifyOTP({ email, mode, otp_code: values.code }),
    onSuccess: async (res) => {
      if (res?.message) {
        showToast.success(res.message);
      }

      const otpResponse = res.data;

      if (mode === "reset_password") {
        router.push(
          `/reset-password?token=${encodeURIComponent(
            otpResponse?.verification_token ?? "",
          )}&email=${encodeURIComponent(email)}`,
        );
        return;
      }

      const authData = otpResponse?.auth_data;

      if (authData) {
        const signInRes = await signIn("credentials", {
          accessToken: authData.access_token,
          refreshToken: authData.refresh_token,
          userData: JSON.stringify(authData.user),
          redirect: false,
        });

        if (signInRes?.error) {
          router.push("/login");
          return;
        }

        window.location.href = "/dashboard";
      }
    },
    onError: (error) => {
      hasAutoSubmitted.current = false;
      handleError(error);
    },
  });

  const resendMutation = useMutation({
    mutationFn: () => sendOTP({ email, mode }),
    onSuccess: (res) => {
      if (res?.message) {
        showToast.success(res.message);
      }
      setSecondsLeft(RESEND_SECONDS);
      hasAutoSubmitted.current = false;
    },
    onError: handleError,
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
    if (codeValue?.length !== 6) hasAutoSubmitted.current = false;
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
        href={mode === "reset_password" ? "/forget-password" : "/register"}
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
                    {[0, 1, 2, 3, 4, 5].map((i) => (
                      <InputOTPSlot
                        key={i}
                        index={i}
                        className="size-12 text-lg sm:size-14 sm:text-xl"
                      />
                    ))}
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
          {secondsLeft > 0
            ? `Resend in ${formatTime(secondsLeft)}`
            : "Resend code"}
        </button>
      </p>
    </AuthShell>
  );
}
