"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { ArrowLeft, KeyRound } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/common/input/FormField";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { sendOTP } from "@/lib/data/api/auth";
import {
  forgotSchema,
  ForgotValues,
} from "@/lib/data/schema/auth/forget_password";
import { handleError } from "@/lib/error";
import { showToast } from "@/lib/toast";
import { AuthShell } from "../AuthShell";

export default function ForgotPasswordPage() {
  const router = useRouter();

  const form = useForm<ForgotValues>({
    resolver: zodResolver(forgotSchema),
    defaultValues: { email: "" },
  });

  const sendOtpMutation = useMutation({
    mutationFn: (values: ForgotValues) =>
      sendOTP({ email: values.email, mode: "reset_password" }),
    onSuccess: (res, variables) => {
      if (res?.message) {
        showToast.success(res.message);
      }
      router.push(
        `/verify-otp?flow=reset_password&email=${encodeURIComponent(variables.email)}`,
      );
    },
    onError: handleError,
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

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="flex flex-col gap-5">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="email">Email</FormLabel>
                  <FormControl>
                    <Input
                      id="email"
                      type="email"
                      placeholder="you@business.com"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="pt-1">
              <Button
                type="submit"
                isLoading={sendOtpMutation.isPending}
                size="lg"
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
              >
                Send Verification Code
              </Button>
            </div>
          </div>
        </form>
      </Form>
    </AuthShell>
  );
}
