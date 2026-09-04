"use client";

import { Autocomplete } from "@/components/common/input/Autocomplete";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/common/input/FormField";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import {
  contactSchema,
  ContactValues,
} from "@/lib/data/schema/public/post_contact";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { Check, CheckCircle2, MessageSquare, Send } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import {
  INQUIRY_OPTIONS_BY_PERSONA,
  PARTNERSHIP_OPTIONS,
  PERSONA_OPTIONS,
  type PersonaValue,
} from "./ContactData";

interface ContactFormCardProps {
  defaultIntent?: string;
  defaultEmail?: string;
}

export function ContactFormCard({
  defaultIntent,
  defaultEmail = "",
}: ContactFormCardProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const isPartnership = defaultIntent === "partnership";

  const form = useForm<ContactValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: "",
      email: defaultEmail,
      whatsapp: "",
      persona: isPartnership ? "partner" : "",
      inquiryType: "",
      message: "",
    },
  });

  const persona = useWatch({ control: form.control, name: "persona" }) as
    | PersonaValue
    | "partner"
    | "";

  const inquiryOptions = isPartnership
    ? PARTNERSHIP_OPTIONS
    : persona && persona !== "partner"
      ? INQUIRY_OPTIONS_BY_PERSONA[persona as PersonaValue]
      : [];

  useEffect(() => {
    if (defaultEmail) {
      form.setValue("email", defaultEmail);
    }
  }, [defaultEmail, form]);

  useEffect(() => {
    form.setValue("persona", isPartnership ? "partner" : "");
    form.setValue("inquiryType", "");
  }, [isPartnership, form]);

  useEffect(() => {
    if (!isPartnership) {
      form.setValue("inquiryType", "");
    }
  }, [persona, isPartnership, form]);

  async function onSubmit() {
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1200));
    setIsLoading(false);
    setSubmitted(true);
    form.reset({
      name: "",
      email: "",
      whatsapp: "",
      persona: isPartnership ? "partner" : "",
      inquiryType: "",
      message: "",
    });
  }

  if (submitted) {
    return (
      <div className="flex h-full flex-col items-center justify-center rounded-3xl border border-border bg-card p-10 text-center shadow-sm">
        <div
          className={cn(
            "mb-5 flex h-14 w-14 items-center justify-center rounded-2xl",
            isPartnership
              ? "bg-indigo-500/15 text-indigo-500"
              : "bg-primary-secondary text-primary",
          )}
        >
          <CheckCircle2 className="h-7 w-7" />
        </div>
        <h3 className="font-heading text-xl font-bold text-foreground">
          {isPartnership ? "Proposal Submitted" : "Message Sent"}
        </h3>
        <p className="mt-2 max-w-sm text-sm text-muted-foreground">
          {isPartnership
            ? "Thank you for your partnership interest — our strategic development team will review your proposal and contact you within 2-3 business days."
            : "Thanks for reaching out — our support team will get back to you shortly, usually within one business day."}
        </p>
        <Button
          type="button"
          variant="outline"
          className="mt-6"
          onClick={() => setSubmitted(false)}
        >
          {isPartnership ? "Submit another proposal" : "Send another message"}
        </Button>
      </div>
    );
  }

  return (
    <div className="rounded-3xl border border-border bg-card p-6 shadow-sm sm:p-8">
      <div className="mb-6 flex items-center gap-3">
        <div
          className={cn(
            "flex h-10 w-10 items-center justify-center rounded-xl",
            isPartnership
              ? "bg-indigo-500/15 text-indigo-500"
              : "bg-primary-secondary text-primary",
          )}
        >
          <MessageSquare className="h-5 w-5" />
        </div>
        <h2 className="font-heading text-lg font-bold text-foreground">
          {isPartnership ? "Partnership & B2B Proposal" : "Send Us a Message"}
        </h2>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
          {isPartnership ? (
            <>
              {/* Baris 1 Partnership: Company Name full width */}
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="name">Company Name</FormLabel>
                    <FormControl>
                      <Input
                        id="name"
                        placeholder="e.g. PT Properti Nusantara"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Baris 2 Partnership: Email & WhatsApp 50:50 */}
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
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
                          placeholder="siska@company.com"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="whatsapp"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel htmlFor="whatsapp">
                        WhatsApp Number{" "}
                        <span className="text-muted-foreground">
                          (optional)
                        </span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          id="whatsapp"
                          type="tel"
                          placeholder="+62 812 3456 7890"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </>
          ) : (
            <>
              {/* Layout Support Biasa */}
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel htmlFor="name">Full Name</FormLabel>
                      <FormControl>
                        <Input
                          id="name"
                          placeholder="e.g. Andi Wijaya"
                          {...field}
                        />
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
              </div>

              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <FormField
                  control={form.control}
                  name="whatsapp"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel htmlFor="whatsapp">
                        WhatsApp Number{" "}
                        <span className="text-muted-foreground">
                          (optional)
                        </span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          id="whatsapp"
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
                  name="persona"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel htmlFor="persona">
                        User Persona / Role
                      </FormLabel>
                      <FormControl>
                        <Autocomplete
                          value={field.value}
                          onSelect={(v) => field.onChange(String(v))}
                          options={PERSONA_OPTIONS}
                          mode="solid"
                          placeholder="Select your role"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </>
          )}

          <FormField
            control={form.control}
            name="inquiryType"
            render={({ field, fieldState }) => (
              <FormItem data-invalid={fieldState.invalid}>
                <FormLabel htmlFor="inquiryType">
                  {isPartnership
                    ? "Partnership Category"
                    : "Subject / Inquiry Type"}
                </FormLabel>
                <FormControl>
                  {isPartnership ? (
                    <RadioGroup
                      value={field.value}
                      onValueChange={field.onChange}
                      className="grid gap-2 pt-1"
                    >
                      {inquiryOptions.map((opt) => {
                        const active = field.value === opt.value;
                        return (
                          <label
                            key={opt.value}
                            className={cn(
                              "group relative flex w-full cursor-pointer items-start gap-3.5 rounded-2xl border p-3.5 text-left transition-all outline-none",
                              fieldState.invalid
                                ? "border-destructive"
                                : active
                                  ? "border-indigo-600 bg-indigo-500/10 ring-1 ring-indigo-600 shadow-xs"
                                  : "border-border bg-card hover:border-indigo-600/40 hover:bg-muted/50",
                            )}
                          >
                            <RadioGroupItem
                              value={opt.value}
                              hasError={fieldState.invalid}
                              className={cn(
                                "mt-0.5",
                                fieldState.invalid
                                  ? "border-destructive data-[state=checked]:border-destructive data-[state=checked]:bg-destructive"
                                  : "data-[state=checked]:border-indigo-600 data-[state=checked]:bg-indigo-600",
                              )}
                            />
                            <span className="min-w-0 flex-1">
                              <span
                                className={cn(
                                  "block text-xs font-semibold leading-tight transition-colors",
                                  fieldState.invalid
                                    ? "text-foreground"
                                    : active
                                      ? "text-indigo-600 dark:text-indigo-400"
                                      : "text-foreground",
                                )}
                              >
                                {opt.label}
                              </span>
                              {opt.description && (
                                <span className="mt-1 block text-[11px] leading-snug text-muted-foreground">
                                  {opt.description}
                                </span>
                              )}
                            </span>
                            {active && !fieldState.invalid && (
                              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-indigo-600 text-white shadow-xs">
                                <Check className="h-3 w-3 stroke-[2.5]" />
                              </span>
                            )}
                          </label>
                        );
                      })}
                    </RadioGroup>
                  ) : (
                    <Autocomplete
                      value={field.value}
                      onSelect={(v) => field.onChange(String(v))}
                      options={inquiryOptions}
                      placeholder={
                        persona
                          ? "What's this about?"
                          : "Select your role first"
                      }
                      mode="solid"
                      disabled={!persona}
                    />
                  )}
                </FormControl>

                {fieldState.invalid ? (
                  <FormMessage />
                ) : (
                  <FormDescription>
                    {isPartnership
                      ? "Select the partnership model that fits your organization."
                      : persona
                        ? "Options are scoped to your selected role."
                        : "Select your role above to see relevant inquiry types."}
                  </FormDescription>
                )}
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="message"
            render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor="message">
                  {isPartnership ? "Proposal Summary" : "Message"}
                </FormLabel>
                <FormControl>
                  <Textarea
                    id="message"
                    placeholder={
                      isPartnership
                        ? "Briefly describe your partnership objective, scale, and expected collaboration model..."
                        : "Describe your question or issue in detail..."
                    }
                    className="min-h-32 resize-none"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  {isPartnership
                    ? "Minimum 20 characters."
                    : "Minimum 10 characters."}
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <div>
            <Button
              type="submit"
              isLoading={isLoading}
              size="lg"
              variant="success"
              className="w-full"
            >
              {isPartnership ? "Submit Proposal" : "Send Message"}
              <Send className="ml-1.5 h-4 w-4" />
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
