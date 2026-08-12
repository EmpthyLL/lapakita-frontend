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
          "border-input bg-background ring-offset-background focus-visible:ring-ring text-md file:text-md flex h-10 w-full justify-start rounded-md border px-3 file:border-0 file:bg-transparent file:font-medium focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50",
          error &&
            "border-destructive focus-within:border-destructive focus-within:ring-destructive/20",
          !value && "text-muted-foreground",
        )}
      >
        <PopoverTrigger asChild>
          <button type="button" className="flex flex-1 items-center py-2">
            <CalendarIcon className="mr-2 h-4 w-4" />
            {parsedValue ? (
              format(parsedValue, "dd MMMM yyyy")
            ) : (
              <span className="text-muted-foreground font-normal whitespace-nowrap">
                {placeholder}
              </span>
            )}
          </button>
        </PopoverTrigger>
        {!!value && (
          <X
            className="h-4 w-4 hover:cursor-pointer"
            onClick={() => onChange(null)}
          />
        )}
      </div>
      <PopoverContent align="start" className="w-auto p-0">
        <Calendar
          initialFocus
          mode="single"
          captionLayout="dropdown"
          fromYear={resolvedMin.getFullYear()}
          toYear={resolvedMax.getFullYear()}
          fromDate={resolvedMin}
          defaultMonth={parsedValue ?? resolvedMax}
          toDate={resolvedMax}
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
