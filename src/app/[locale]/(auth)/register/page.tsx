"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { UserPlus } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";

import { GoogleButton } from "@/components/common/GoogleButton";
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
import { Input } from "@/components/ui/input";
import { registerUser } from "@/lib/data/api/auth";
import {
  registerSchema,
  RegisterValues,
} from "@/lib/data/schema/auth/register";
import { handleError } from "@/lib/error";
import { showToast } from "@/lib/toast";
import { AuthDivider } from "../AuthDivider";
import { AuthShell } from "../AuthShell";

export default function RegisterPage() {
  const router = useRouter();

  const form = useForm<RegisterValues>({
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
    onSuccess: (res, variables) => {
      if (res?.message) {
        showToast.success(res.message);
      }
      router.push(
        `/verify-otp?flow=register&email=${encodeURIComponent(variables.email)}`,
      );
    },
    onError: handleError,
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

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="flex flex-col gap-5">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="name">Full Name</FormLabel>
                  <FormControl>
                    <Input id="name" placeholder="e.g. John Doe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="email">Email Address</FormLabel>
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
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="phone">Phone Number</FormLabel>
                  <FormControl>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="+62 812 3456 7890"
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
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormLabel htmlFor="password">Password</FormLabel>
                  <FormControl>
                    <PasswordInput
                      id="password"
                      placeholder="Create a password"
                      {...field}
                    />
                  </FormControl>
                  {fieldState.invalid ? (
                    <FormMessage />
                  ) : (
                    <FormDescription>
                      At least 8 characters long.
                    </FormDescription>
                  )}
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="confirm_password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="confirm_password">
                    Confirm Password
                  </FormLabel>
                  <FormControl>
                    <PasswordInput
                      id="confirm_password"
                      placeholder="Re-enter your password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="pt-1.5">
              <Button
                type="submit"
                isLoading={registerMutation.isPending}
                size="lg"
                className="w-full font-semibold"
              >
                Create Account
              </Button>
            </div>
          </div>
        </form>
      </Form>

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
