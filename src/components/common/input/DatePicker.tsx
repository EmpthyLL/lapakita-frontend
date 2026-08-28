"use client";

import { format } from "date-fns";
import { Calendar as CalendarIcon, X } from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { useState } from "react";

import { Matcher } from "react-day-picker";

interface DatePickerProps {
  value?: Date | string | null;
  placeholder?: string;
  onChange: (date: Date | null | undefined) => void;
  disabled?: Matcher | Matcher[];
  error?: boolean;
  minDate?: Date;
  maxDate?: Date;
  yearsFromNow?: number;
}

export function DatePicker({
  value,
  placeholder = "Pick a date",
  onChange,
  disabled,
  error,
  minDate,
  maxDate,
  yearsFromNow,
}: DatePickerProps) {
  const [isOpen, setIsOpen] = useState(false);

  const today = new Date();
  const currentYear = today.getFullYear();

  const resolvedMin = minDate ?? new Date(1922, 0, 1);

  const resolvedMax = (() => {
    if (maxDate) return maxDate;
    if (yearsFromNow !== undefined) {
      const d = new Date(today);
      d.setFullYear(currentYear + yearsFromNow);
      return d;
    }
    return new Date(currentYear + 3, 11, 31);
  })();

  const disabledMatchers: Matcher[] = [
    { before: resolvedMin },
    { after: resolvedMax },
    ...(Array.isArray(disabled) ? disabled : disabled ? [disabled] : []),
  ];

  const parsedValue = value
    ? typeof value === "string"
      ? new Date(value)
      : value
    : undefined;

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <div
        className={cn(
          buttonVariants({ variant: "outline" }),
          "border-input bg-background ring-offset-background text-md file:text-md flex h-10 w-full justify-start rounded-md border px-3 file:border-0 file:bg-transparent file:font-medium focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50",

          /* Focus state normal */
          "focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20",

          /* Error State (Parent <Field data-invalid="true">, aria-invalid, atau prop error) */
          "group-data-[invalid=true]/field:border-destructive group-data-[invalid=true]/field:focus-within:border-destructive group-data-[invalid=true]/field:focus-within:ring-2 group-data-[invalid=true]/field:focus-within:ring-destructive/20",
          "aria-invalid:border-destructive aria-invalid:focus-within:border-destructive aria-invalid:focus-within:ring-2 aria-invalid:focus-within:ring-destructive/20",
          error &&
            "border-destructive focus-within:border-destructive focus-within:ring-2 focus-within:ring-destructive/20",

          !value && "text-muted-foreground",
        )}
      >
        <PopoverTrigger asChild>
          <button
            type="button"
            className="flex flex-1 items-center py-2 text-start"
          >
            <CalendarIcon className="mr-2 h-4 w-4 shrink-0 text-muted-foreground" />
            {parsedValue ? (
              <span className="font-semibold text-foreground">
                {format(parsedValue, "dd MMMM yyyy")}
              </span>
            ) : (
              <span
                className={cn(
                  "font-normal whitespace-nowrap text-muted-foreground/70 transition-colors",
                  /* Red placeholder saat error */
                  "group-data-[invalid=true]/field:text-destructive/70",
                  "aria-invalid:text-destructive/70",
                  error && "text-destructive/70",
                )}
              >
                {placeholder}
              </span>
            )}
          </button>
        </PopoverTrigger>
        {!!value && (
          <X
            className="h-4 w-4 shrink-0 hover:cursor-pointer text-muted-foreground hover:text-foreground"
            onClick={() => onChange(null)}
          />
        )}
      </div>
      <PopoverContent align="start" className="w-auto p-0">
        <Calendar
          autoFocus
          mode="single"
          captionLayout="dropdown"
          startMonth={resolvedMin}
          endMonth={resolvedMax}
          defaultMonth={parsedValue ?? resolvedMax}
          selected={parsedValue}
          onSelect={(val) => {
            setIsOpen(false);
            onChange(val);
          }}
          className="rounded-md border whitespace-nowrap"
          disabled={disabledMatchers}
        />
      </PopoverContent>
    </Popover>
  );
}
