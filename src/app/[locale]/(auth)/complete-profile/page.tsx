/* eslint-disable react-hooks/incompatible-library */
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { ArrowRight, Phone, UserCheck } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import { useForm } from "react-hook-form";

import { AvatarInput } from "@/components/common/input/AvatarInput";
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
import { completeGoogleProfile } from "@/lib/data/api/auth";
import {
  completeProfileSchema,
  CompleteProfileValues,
} from "@/lib/data/schema/auth/complete_profile";
import { handleError } from "@/lib/error";
import { showToast } from "@/lib/toast";
import { AuthShell } from "../AuthShell";

export default function CompleteProfilePage() {
  const router = useRouter();
  const { data: session, update: updateSession } = useSession();

  const user = session?.user;
  const isInitializedRef = useRef(false);

  const form = useForm<CompleteProfileValues>({
    resolver: zodResolver(completeProfileSchema),
    defaultValues: {
      name: user?.defaultName || "",
      phone: user?.defaultPhone || "",
      avatarUrl: user?.defaultAvatarUrl || "",
    },
  });

  const currentName = form.watch("name");

  // Gunakan ref agar sinkronisasi data dari session hanya terjadi sekali di awal,
  // sehingga tidak akan menimpa pilihan foto/input baru saat session ter-update.
  useEffect(() => {
    if (user && !isInitializedRef.current) {
      if (user.defaultName) form.setValue("name", user.defaultName);
      if (user.defaultPhone) form.setValue("phone", user.defaultPhone);
      if (user.defaultAvatarUrl) {
        form.setValue("avatarUrl", user.defaultAvatarUrl);
      }
      isInitializedRef.current = true;
    }
  }, [user, form]);

  const completeProfileMutation = useMutation({
    mutationFn: (values: CompleteProfileValues) =>
      completeGoogleProfile({
        name: values.name,
        phone: values.phone,
        avatar_url: values.avatarUrl || undefined,
      }),
    onSuccess: async (res) => {
      const authData = res.data;

      if (authData) {
        if (res.message) {
          showToast.success(res.message);
        }

        await updateSession({
          user: {
            defaultName: authData.default_name,
            defaultPhone: authData.default_phone,
            defaultAvatarUrl: authData.default_avatar_url,
            phoneNumbers: authData.phone_numbers,
            personas: authData.personas,
          },
        });

        router.push("/dashboard");
        router.refresh();
      }
    },
    onError: handleError,
  });

  function onSubmit(values: CompleteProfileValues) {
    completeProfileMutation.mutate(values);
  }

  return (
    <AuthShell
      layout="centered"
      illustration={{
        icon: UserCheck,
        eyebrow: "Google Account Connected",
        headline: "Complete Your Profile",
        description:
          "Confirm your name, setup your profile photo, and add your phone number to finish setting up your account.",
      }}
    >
      <div className="mb-6 text-center">
        <h1 className="font-heading text-2xl font-bold tracking-tight text-foreground">
          Complete Your Profile
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Signed in with Google as{" "}
          <span className="font-medium text-foreground">
            {user?.email || "—"}
          </span>
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="mb-6 rounded-xl border border-border bg-secondary/30 p-4">
            <FormField
              control={form.control}
              name="avatarUrl"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <AvatarInput
                      value={field.value}
                      onChange={field.onChange}
                      name={currentName}
                      disabled={completeProfileMutation.isPending}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="flex flex-col gap-3.5">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center justify-between">
                    <FormLabel htmlFor="name">Full Name</FormLabel>
                    <span className="text-[11px] text-muted-foreground">
                      From Google — editable
                    </span>
                  </div>
                  <FormControl>
                    <Input id="name" placeholder="e.g. John Doe" {...field} />
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
                  <div className="relative flex items-center">
                    <FormControl>
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="+62 812 3456 7890"
                        className="pr-10"
                        {...field}
                      />
                    </FormControl>
                    <Phone className="pointer-events-none absolute right-3 size-4 text-muted-foreground" />
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="pt-2">
              <Button
                type="submit"
                isLoading={completeProfileMutation.isPending}
                size="lg"
                className="group w-full font-semibold"
              >
                <span>Complete Setup</span>
                <ArrowRight className="size-4 transition-transform duration-150 group-hover:translate-x-1" />
              </Button>
            </div>
          </div>
        </form>
      </Form>
    </AuthShell>
  );
}
