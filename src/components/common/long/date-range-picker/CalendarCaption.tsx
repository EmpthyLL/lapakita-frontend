"use client";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { ChevronDownIcon } from "lucide-react";
import { useLocale } from "next-intl";
import { useRef, useState } from "react";
import { useDayPicker, type MonthCaptionProps } from "react-day-picker";
import { MONTH_LABELS } from "./Types";

interface CalendarCaptionProps extends MonthCaptionProps {
  fromYear: number;
  toYear: number;
  minMonth?: Date;
  maxMonth?: Date;
  onMonthSelect?: (date: Date) => void;
}

export function CalendarCaption({
  calendarMonth,
  fromYear,
  toYear,
  minMonth,
  maxMonth,
  onMonthSelect,
}: CalendarCaptionProps) {
  const { goToMonth } = useDayPicker();
  const [open, setOpen] = useState(false);
  const selectedYearRef = useRef<HTMLButtonElement | null>(null);
  const locale = useLocale();

  const displayMonth = calendarMonth.date;
  const selectedYear = displayMonth.getFullYear();
  const selectedMonth = displayMonth.getMonth();

  const isDisabled = (year: number, month: number) => {
    const targetDate = new Date(year, month, 1);

    if (minMonth) {
      const minDate = new Date(minMonth.getFullYear(), minMonth.getMonth(), 1);
      if (targetDate < minDate) return true;
    }
    if (maxMonth) {
      const maxDate = new Date(maxMonth.getFullYear(), maxMonth.getMonth(), 1);
      if (targetDate > maxDate) return true;
    }

    return false;
  };

  const years: number[] = [];
  for (let y = fromYear; y <= toYear; y++) years.push(y);

  const handleSelect = (newDate: Date) => {
    if (onMonthSelect) {
      onMonthSelect(newDate);
    } else {
      goToMonth(newDate);
    }
    setOpen(false);
  };

  return (
    <Popover
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (next) {
          requestAnimationFrame(() => {
            selectedYearRef.current?.scrollIntoView({ block: "center" });
          });
        }
      }}
    >
      <div className="flex items-center justify-center px-1">
        <PopoverTrigger asChild>
          <button
            type="button"
            className="hover:bg-accent hover:text-accent-foreground flex items-center gap-1 rounded-md px-2 py-1 text-sm font-semibold capitalize"
          >
            {displayMonth.toLocaleDateString(locale, {
              month: "long",
              year: "numeric",
            })}
            <ChevronDownIcon
              className={cn(
                "h-3.5 w-3.5 opacity-60 transition-transform duration-200",
                open && "rotate-180",
              )}
            />
          </button>
        </PopoverTrigger>
      </div>

      <PopoverContent align="center" className="w-56 p-0">
        <ScrollArea className="h-40 border-b">
          <div className="flex flex-col gap-0.5 p-1.5">
            {years.map((y) => {
              const disabled =
                (minMonth && y < minMonth.getFullYear()) ||
                (maxMonth && y > maxMonth.getFullYear());
              return (
                <button
                  key={y}
                  disabled={disabled}
                  ref={y === selectedYear ? selectedYearRef : undefined}
                  type="button"
                  onClick={() => handleSelect(new Date(y, selectedMonth, 1))}
                  className={cn(
                    "rounded-md px-3 py-1.5 text-left text-sm",
                    disabled
                      ? "cursor-not-allowed opacity-40"
                      : "hover:bg-accent hover:text-accent-foreground",
                    y === selectedYear && "bg-accent font-semibold",
                  )}
                >
                  {y}
                </button>
              );
            })}
          </div>
        </ScrollArea>

        <div className="grid grid-cols-4 gap-1 p-2">
          {MONTH_LABELS.map((label, i) => {
            const disabled = isDisabled(selectedYear, i);
            return (
              <button
                disabled={disabled}
                key={label}
                type="button"
                onClick={() => handleSelect(new Date(selectedYear, i, 1))}
                className={cn(
                  "rounded-md py-1.5 text-center text-sm",
                  disabled
                    ? "cursor-not-allowed opacity-40"
                    : i === selectedMonth
                      ? "bg-primary text-primary-foreground hover:bg-primary/90"
                      : "hover:bg-accent hover:text-accent-foreground",
                )}
              >
                {label}
              </button>
            );
          })}
        </div>
      </PopoverContent>
    </Popover>
  );
}
