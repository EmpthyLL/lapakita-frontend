"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { UserCheck } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";

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
  completeProfileSchema,
  CompleteProfileValues,
} from "@/lib/data/schema/auth/complete_profile";
import { AuthShell } from "../AuthShell";

export default function CompleteProfilePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);

  const googleName = searchParams.get("name") ?? "";
  const email = searchParams.get("email") ?? "";

  const { control, handleSubmit } = useForm<CompleteProfileValues>({
    resolver: zodResolver(completeProfileSchema),
    defaultValues: { name: googleName, phone: "" },
  });

  async function onSubmit(values: CompleteProfileValues) {
    setIsLoading(true);
    // TODO: call BE to attach name + phone number to the OAuth-created account
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsLoading(false);
    router.push(`/verify-otp?flow=register&email=${encodeURIComponent(email)}`);
  }

  return (
    <AuthShell
      layout="centered"
      illustration={{
        icon: UserCheck,
        eyebrow: "Almost there",
        headline: "Just one more step.",
        description:
          "Confirm your name and add your phone number to finish setting up your account.",
      }}
    >
      <div className="mb-8 text-center">
        <h1 className="font-heading text-2xl font-bold tracking-tight text-foreground">
          Complete Your Profile
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Signed in with Google as{" "}
          <span className="font-medium text-foreground">{email || "—"}</span>
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <FieldGroup>
          <Controller
            control={control}
            name="name"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="name">Full Name</FieldLabel>
                <Input id="name" placeholder="e.g. John Doe" {...field} />
                <FieldDescription>
                  We pulled this from your Google account — feel free to correct
                  it.
                </FieldDescription>
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          <Controller
            control={control}
            name="phone"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="phone">Phone Number</FieldLabel>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+62 812 3456 7890"
                  {...field}
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
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
              Continue
            </Button>
          </Field>
        </FieldGroup>
      </form>
    </AuthShell>
  );
}
