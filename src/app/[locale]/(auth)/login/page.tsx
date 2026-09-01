"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { LogIn } from "lucide-react";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";

import { GoogleButton } from "@/components/common/GoogleButton";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/common/input/FormField";
import { PasswordInput } from "@/components/common/input/PasswordInput";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { loginUser } from "@/lib/data/api/auth";
import { loginSchema, LoginValues } from "@/lib/data/schema/auth/login";
import { handleError } from "@/lib/error";
import { showToast } from "@/lib/toast";
import { AuthDivider } from "../AuthDivider";
import { AuthShell } from "../AuthShell";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";

  const form = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const loginMutation = useMutation({
    mutationFn: (values: LoginValues) => loginUser(values),
    onSuccess: async (res) => {
      const authData = res.data;

      if (authData) {
        await signIn("credentials", {
          accessToken: authData.access_token,
          refreshToken: authData.refresh_token,
          userData: JSON.stringify(authData.user),
          callbackUrl,
          redirect: true,
        });

        if (res.message) showToast.success(res.message);
        router.push("/dashboard");
      }
    },
    onError: handleError,
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

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center justify-between">
                    <FormLabel htmlFor="password">Password</FormLabel>
                    <Link
                      href="/forget-password"
                      className="text-xs font-medium text-primary hover:underline"
                    >
                      Forget password?
                    </Link>
                  </div>
                  <FormControl>
                    <PasswordInput
                      id="password"
                      placeholder="Enter your password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="pt-2">
              <Button
                type="submit"
                isLoading={loginMutation.isPending}
                size="lg"
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
              >
                Log In
              </Button>
            </div>
          </div>
        </form>
      </Form>
    </AuthShell>
  );
}
