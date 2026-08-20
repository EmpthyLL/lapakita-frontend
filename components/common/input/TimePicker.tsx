"use client";

import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Clock } from "lucide-react";
import { useState } from "react";

interface TimePickerProps {
  value: string;
  onChange: (value: string) => void;
  minTime?: string; // e.g. "08:00" -> waktu di bawah ini akan di-disable
  maxTime?: string; // e.g. "22:00" -> waktu di atas ini akan di-disable
  className?: string;
  placeholder?: string;
}

const TIME_OPTIONS = Array.from({ length: 48 }, (_, i) => {
  const hours = Math.floor(i / 2)
    .toString()
    .padStart(2, "0");
  const minutes = i % 2 === 0 ? "00" : "30";
  return `${hours}:${minutes}`;
});

export function TimePicker({
  value,
  onChange,
  minTime,
  maxTime,
  className,
  placeholder = "00:00",
}: TimePickerProps) {
  const [open, setOpen] = useState(false);

  function handleSelect(time: string) {
    onChange(time);
    setOpen(false);
  }

  function isTimeDisabled(time: string) {
    if (minTime && time < minTime) return true;
    if (maxTime && time > maxTime) return true;
    return false;
  }

  const isCurrentValueInvalid =
    (minTime && value < minTime) || (maxTime && value > maxTime);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <div className={cn("relative flex items-center", className)}>
        <Input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setOpen(true)}
          placeholder={placeholder}
          maxLength={5}
          className={cn(
            "h-10 pr-9 font-semibold transition-colors text-foreground",
            isCurrentValueInvalid &&
              "border-destructive text-destructive focus-visible:ring-destructive/20",
          )}
        />

        <PopoverTrigger asChild>
          <button
            type="button"
            className="absolute right-2.5 flex items-center justify-center text-muted-foreground hover:text-foreground outline-none"
          >
            <Clock className="h-4 w-4" />
          </button>
        </PopoverTrigger>
      </div>

      <PopoverContent
        className="w-36 p-1 shadow-md rounded-xl border-border bg-card max-h-56 overflow-y-auto"
        align="start"
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        <div className="flex flex-col gap-0.5">
          {TIME_OPTIONS.map((time) => {
            const isSelected = value === time;
            const disabled = isTimeDisabled(time);

            return (
              <button
                key={time}
                type="button"
                disabled={disabled}
                onClick={() => handleSelect(time)}
                className={cn(
                  "w-full rounded-md px-3 py-1.5 text-left text-xs font-semibold transition-colors",
                  isSelected &&
                    !disabled &&
                    "bg-primary text-primary-foreground",
                  !isSelected &&
                    !disabled &&
                    "hover:bg-secondary text-foreground",
                  disabled &&
                    "opacity-30 cursor-not-allowed text-muted-foreground hover:bg-transparent",
                )}
              >
                {time}
              </button>
            );
          })}
        </div>
      </PopoverContent>
    </Popover>
  );
}
