// app/dashboard/settings/password/page.tsx
"use client";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/common/input/FormField";
import { PasswordInput } from "@/components/common/input/PasswordInput";
import { Spinner } from "@/components/common/Spinner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { updatePassword } from "@/lib/data/api/user";
import {
  passwordSchema,
  PasswordValues,
} from "@/lib/data/schema/user/password";
import { handleError } from "@/lib/error";
import { showToast } from "@/lib/toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { KeyRound, Lock, Save, ShieldAlert, ShieldCheck } from "lucide-react";
import { useSession } from "next-auth/react";
import { useForm } from "react-hook-form";

export default function PasswordManagementPage() {
  const { data: session, status, update: updateSession } = useSession();

  const form = useForm<PasswordValues>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      current_password: "",
      new_password: "",
      confirm_password: "",
    },
  });

  const isPasswordSet = session?.user?.isPasswordSet ?? true;

  const mutation = useMutation({
    mutationFn: async (values: PasswordValues) => {
      const payload: PasswordValues = {
        current_password: isPasswordSet ? values.current_password : undefined,
        new_password: values.new_password,
        confirm_password: values.confirm_password,
      };
      await updatePassword(payload);
    },
    onSuccess: async () => {
      showToast.success(
        isPasswordSet
          ? "Password updated successfully"
          : "Password set successfully",
      );
      form.reset({
        current_password: "",
        new_password: "",
        confirm_password: "",
      });
      await updateSession({
        ...session,
        user: {
          ...(session?.user || {}),
          isPasswordSet: true,
        },
      });
    },
    onError: handleError,
  });

  if (status === "loading") {
    return <Spinner className="h-96" />;
  }

  function onSubmit(values: PasswordValues) {
    mutation.mutate(values);
  }

  const { isDirty } = form.formState;

  return (
    <div className="mx-auto max-w-3xl space-y-8 pb-12">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl border border-border bg-card p-6 shadow-sm sm:p-8">
        <div className="absolute top-0 right-0 h-40 w-40 -translate-y-10 translate-x-10 rounded-full bg-primary/10 blur-3xl pointer-events-none" />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary shadow-inner">
              <KeyRound className="h-6 w-6" />
            </div>
            <div>
              <h1 className="font-heading text-xl font-bold text-foreground">
                {isPasswordSet ? "Change Password" : "Set Password"}
              </h1>
              <p className="text-xs text-muted-foreground mt-0.5">
                {isPasswordSet
                  ? "Ensure your account is using a long, random password to stay secure."
                  : "Your account does not have a password set yet. Create one to secure your account."}
              </p>
            </div>
          </div>

          <div className="self-start sm:self-auto">
            {isPasswordSet ? (
              <Badge variant="success" className="gap-1.5 px-3 py-3 text-xs">
                <ShieldCheck className="h-3.5 w-3.5" /> Password Set
              </Badge>
            ) : (
              <Badge variant="warning" className="gap-1.5 px-3 py-3 text-xs">
                <ShieldAlert className="h-3.5 w-3.5" /> Password Not Set
              </Badge>
            )}
          </div>
        </div>
      </div>

      {/* Form Container */}
      <div className="relative overflow-hidden rounded-3xl border border-border bg-card p-6 shadow-sm sm:p-8">
        <div className="absolute bottom-0 left-0 h-32 w-32 -translate-x-10 translate-y-10 rounded-full bg-accent/5 blur-2xl pointer-events-none" />

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-6 relative z-10"
          >
            <div className="space-y-4">
              {isPasswordSet && (
                <FormField
                  control={form.control}
                  name="current_password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                        <Lock className="h-3.5 w-3.5 text-primary" /> Current
                        Password
                      </FormLabel>
                      <FormControl>
                        <PasswordInput
                          placeholder="Enter current password"
                          className="h-11 bg-background border-border focus-visible:ring-primary"
                          {...field}
                          value={field.value ?? ""}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <FormField
                  control={form.control}
                  name="new_password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                        <KeyRound className="h-3.5 w-3.5 text-primary" />{" "}
                        {isPasswordSet ? "New Password" : "Password"}
                      </FormLabel>
                      <FormControl>
                        <PasswordInput
                          placeholder="Enter new password"
                          className="h-11 bg-background border-border focus-visible:ring-primary"
                          {...field}
                          value={field.value ?? ""}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="confirm_password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                        <ShieldCheck className="h-3.5 w-3.5 text-primary" />{" "}
                        Confirm Password
                      </FormLabel>
                      <FormControl>
                        <PasswordInput
                          placeholder="Confirm new password"
                          className="h-11 bg-background border-border focus-visible:ring-primary"
                          {...field}
                          value={field.value ?? ""}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div className="pt-4 border-t border-border flex items-center justify-between">
              <p className="text-[11px] text-muted-foreground hidden sm:block">
                Minimum 8 characters with a mix of letters and numbers.
              </p>
              <Button
                type="submit"
                size="lg"
                disabled={!isDirty}
                isLoading={mutation.isPending}
                className="px-6"
              >
                <Save className="mr-2 h-4 w-4" />{" "}
                {isPasswordSet ? "Update Password" : "Set Password"}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
