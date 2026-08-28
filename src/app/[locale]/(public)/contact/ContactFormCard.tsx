"use client";

import { Autocomplete } from "@/components/common/input/Autocomplete";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  contactSchema,
  ContactValues,
} from "@/lib/data/schema/public/post_contact";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle2, MessageSquare, Send } from "lucide-react";
import { useEffect, useState } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import {
  INQUIRY_OPTIONS_BY_PERSONA,
  PERSONA_OPTIONS,
  type PersonaValue,
} from "./ContactData";

export function ContactFormCard() {
  const [isLoading, setIsLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const { control, handleSubmit, reset, setValue } = useForm<ContactValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: "",
      email: "",
      whatsapp: "",
      persona: "",
      inquiryType: "",
      message: "",
    },
  });

  const persona = useWatch({ control, name: "persona" }) as PersonaValue | "";
  const inquiryOptions = persona ? INQUIRY_OPTIONS_BY_PERSONA[persona] : [];

  useEffect(() => {
    setValue("inquiryType", "");
  }, [persona, setValue]);

  async function onSubmit() {
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1200));
    setIsLoading(false);
    setSubmitted(true);
    reset();
  }

  if (submitted) {
    return (
      <div className="flex h-full flex-col items-center justify-center rounded-3xl border border-border bg-card p-10 text-center shadow-sm">
        <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-owner-secondary text-owner">
          <CheckCircle2 className="h-7 w-7" />
        </div>
        <h3 className="font-heading text-xl font-bold text-foreground">
          Message Sent
        </h3>
        <p className="mt-2 max-w-sm text-sm text-muted-foreground">
          Thanks for reaching out — our support team will get back to you
          shortly, usually within one business day.
        </p>
        <Button
          type="button"
          variant="outline"
          className="mt-6"
          onClick={() => setSubmitted(false)}
        >
          Send another message
        </Button>
      </div>
    );
  }

  return (
    <div className="rounded-3xl border border-border bg-card p-6 shadow-sm sm:p-8">
      <div className="mb-6 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-secondary text-primary">
          <MessageSquare className="h-5 w-5" />
        </div>
        <h2 className="font-heading text-lg font-bold text-foreground">
          Send Us a Message
        </h2>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <FieldGroup>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <Controller
              control={control}
              name="name"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="name">Full Name</FieldLabel>
                  <Input id="name" placeholder="e.g. Andi Wijaya" {...field} />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

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
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <Controller
              control={control}
              name="whatsapp"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="whatsapp">
                    WhatsApp Number{" "}
                    <span className="text-muted-foreground">(optional)</span>
                  </FieldLabel>
                  <Input
                    id="whatsapp"
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

            <Controller
              control={control}
              name="persona"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="persona">User Persona / Role</FieldLabel>
                  <Autocomplete
                    value={field.value}
                    onSelect={(v) => field.onChange(String(v))}
                    options={PERSONA_OPTIONS}
                    mode="solid"
                    placeholder="Select your role"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </div>

          <Controller
            control={control}
            name="inquiryType"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="inquiryType">
                  Subject / Inquiry Type
                </FieldLabel>
                <Autocomplete
                  value={field.value}
                  onSelect={(v) => field.onChange(String(v))}
                  options={inquiryOptions}
                  placeholder={
                    persona ? "What's this about?" : "Select your role first"
                  }
                  mode="solid"
                  disabled={!persona}
                />
                <FieldDescription>
                  {persona
                    ? "Options are scoped to your selected role."
                    : "Select your role above to see relevant inquiry types."}
                </FieldDescription>
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          <Controller
            control={control}
            name="message"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="message">Message</FieldLabel>
                <Textarea
                  id="message"
                  placeholder="Describe your question or issue in detail..."
                  className="min-h-32 resize-none"
                  {...field}
                />
                {fieldState.invalid ? (
                  <FieldError errors={[fieldState.error]} />
                ) : (
                  <FieldDescription>Minimum 10 characters.</FieldDescription>
                )}
              </Field>
            )}
          />

          <Field>
            <Button
              type="submit"
              isLoading={isLoading}
              size="lg"
              variant={"success"}
            >
              Send Message
              <Send className="ml-1.5 h-4 w-4" />
            </Button>
          </Field>
        </FieldGroup>
      </form>
    </div>
  );
}
