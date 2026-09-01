"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { ShieldCheck } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/common/input/FormField";
import { PasswordInput } from "@/components/common/input/PasswordInput";
import { Button } from "@/components/ui/button";
import { resetPassword } from "@/lib/data/api/auth";
import {
  resetSchema,
  ResetValues,
} from "@/lib/data/schema/auth/reset_password";
import { handleError } from "@/lib/error";
import { showToast } from "@/lib/toast";
import { AuthShell } from "../AuthShell";

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const token = searchParams.get("token") || "";
  const email = searchParams.get("email") || "";

  const form = useForm<ResetValues>({
    resolver: zodResolver(resetSchema),
    defaultValues: { password: "", confirmPassword: "" },
  });

  const resetMutation = useMutation({
    mutationFn: (values: ResetValues) =>
      resetPassword({
        email,
        verification_token: token,
        new_password: values.password,
      }),
    onSuccess: (res) => {
      if (res?.message) {
        showToast.success(res.message);
      }
      router.push("/login?reset=1");
    },
    onError: handleError,
  });

  function onSubmit(values: ResetValues) {
    resetMutation.mutate(values);
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

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="flex flex-col gap-5">
            <FormField
              control={form.control}
              name="password"
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormLabel htmlFor="password">New Password</FormLabel>
                  <FormControl>
                    <PasswordInput
                      id="password"
                      placeholder="Create a new password"
                      {...field}
                    />
                  </FormControl>
                  {fieldState.invalid ? (
                    <FormMessage />
                  ) : (
                    <FormDescription>
                      At least 6 characters long.
                    </FormDescription>
                  )}
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="confirmPassword">
                    Confirm New Password
                  </FormLabel>
                  <FormControl>
                    <PasswordInput
                      id="confirmPassword"
                      placeholder="Re-enter your new password"
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
                isLoading={resetMutation.isPending}
                size="lg"
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
              >
                Reset Password
              </Button>
            </div>
          </div>
        </form>
      </Form>
    </AuthShell>
  );
}
