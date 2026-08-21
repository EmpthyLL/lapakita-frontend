"use client";

import { OTPInput, OTPInputContext } from "input-otp";
import { MinusIcon } from "lucide-react";
import * as React from "react";

import { cn } from "@/lib/utils";

function InputOTP({
  className,
  containerClassName,
  ...props
}: React.ComponentProps<typeof OTPInput> & {
  containerClassName?: string;
}) {
  return (
    <OTPInput
      data-slot="input-otp"
      containerClassName={cn(
        "cn-input-otp flex items-center has-disabled:opacity-50",
        containerClassName,
      )}
      spellCheck={false}
      className={cn("disabled:cursor-not-allowed", className)}
      {...props}
    />
  );
}

function InputOTPGroup({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="input-otp-group"
      className={cn("flex items-center", className)}
      {...props}
    />
  );
}

function InputOTPSlot({
  index,
  className,
  ...props
}: React.ComponentProps<"div"> & {
  index: number;
}) {
  const inputOTPContext = React.useContext(OTPInputContext);
  const { char, hasFakeCaret, isActive } = inputOTPContext?.slots[index] ?? {};

  return (
    <div
      data-slot="input-otp-slot"
      data-active={isActive}
      className={cn(
        "relative flex size-10 items-center justify-center border-y border-r border-input text-sm font-semibold transition-all outline-none first:rounded-l-md first:border-l last:rounded-r-md",

        /* Focus/Active State Normal */
        "data-[active=true]:z-10 data-[active=true]:border-primary data-[active=true]:ring-2 data-[active=true]:ring-primary/20",

        /* Error State (Standard aria-invalid & Parent <Field data-invalid="true">) */
        "aria-invalid:border-destructive group-data-[invalid=true]/field:border-destructive",

        /* Focus/Active saat Error */
        "data-[active=true]:aria-invalid:border-destructive data-[active=true]:aria-invalid:ring-2 data-[active=true]:aria-invalid:ring-destructive/20",
        "group-data-[invalid=true]/field:data-[active=true]:border-destructive group-data-[invalid=true]/field:data-[active=true]:ring-2 group-data-[invalid=true]/field:data-[active=true]:ring-destructive/20",

        "dark:bg-input/30",
        className,
      )}
      {...props}
    >
      {char}
      {hasFakeCaret && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="h-4 w-px animate-caret-blink bg-foreground duration-1000" />
        </div>
      )}
    </div>
  );
}

function InputOTPSeparator({ ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="input-otp-separator"
      className="flex items-center px-1 text-muted-foreground/60 [&_svg:not([class*='size-'])]:size-4"
      role="separator"
      {...props}
    >
      <MinusIcon />
    </div>
  );
}

export { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot };
