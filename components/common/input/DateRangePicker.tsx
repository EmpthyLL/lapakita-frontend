/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { CheckIcon, ChevronDownIcon } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import React, { useEffect, useRef, useState, type FC } from "react";
import {
  DateRange,
  Matcher,
  useDayPicker,
  type MonthCaptionProps,
} from "react-day-picker";

export interface DateRangePickerProps {
  onUpdate?: (values: DateRange) => void;
  value?: DateRange;
  selectedDate?: DateRange | undefined;
  onCancel?: () => void;
  fixedCalender?: boolean;
  align?: "start" | "center" | "end";
  locale?: string;
  disabled?: Matcher | Matcher[];
  fromYear?: number;
  toYear?: number;
}

const MONTH_LABELS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const PRESET_KEYS = [
  "today",
  "yesterday",
  "last7",
  "last14",
  "last30",
  "thisWeek",
  "lastWeek",
  "thisMonth",
  "lastMonth",
  "thisYear",
] as const;

const formatDate = (date: Date, locale: string = "en-US"): string => {
  return date.toLocaleDateString(locale, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const isValidDate = (date: Date | string | undefined): boolean => {
  if (date === undefined) return false;
  const parsedDate = typeof date === "string" ? new Date(date) : date;
  return parsedDate instanceof Date && !isNaN(parsedDate.getTime());
};

function CalendarCaption({
  calendarMonth,
  fromYear,
  toYear,
  minMonth,
  maxMonth,
  onMonthSelect,
}: MonthCaptionProps & {
  fromYear: number;
  toYear: number;
  minMonth?: Date;
  maxMonth?: Date;
  onMonthSelect?: (date: Date) => void;
}) {
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

export const DateRangePicker: FC<DateRangePickerProps> & {
  filePath: string;
} = ({
  value,
  onUpdate = () => {},
  onCancel = () => {},
  align = "end",
  locale,
  disabled,
  fromYear = new Date().getFullYear() - 100,
  toYear = new Date().getFullYear(),
}): React.JSX.Element => {
  const t = useTranslations("common.date_range_picker");
  const activeLocale = useLocale();
  const currentLocale = locale || activeLocale;

  const [isOpen, setIsOpen] = useState(false);

  const [range, setRange] = useState<DateRange>({
    from: value?.from ? value.from : undefined,
    to: value?.to ? value.to : undefined,
  });

  const openedRangeRef = useRef<DateRange | undefined>(undefined);

  const [selectedPreset, setSelectedPreset] = useState<string | undefined>(
    undefined,
  );

  const [isSmallScreen, setIsSmallScreen] = useState(
    typeof window !== "undefined" ? window.innerWidth < 960 : false,
  );

  const [leftMonth, setLeftMonth] = useState<Date>(new Date());
  const [rightMonth, setRightMonth] = useState<Date>(
    new Date(new Date().getFullYear(), new Date().getMonth() + 1, 1),
  );

  useEffect(() => {
    const handleResize = (): void => {
      setIsSmallScreen(window.innerWidth < 960);
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const getPresetRange = (presetName: string): DateRange => {
    const from = new Date();
    const to = new Date();
    const first = from.getDate() - from.getDay();

    switch (presetName) {
      case "today":
        from.setHours(0, 0, 0, 0);
        to.setHours(23, 59, 59, 999);
        break;
      case "yesterday":
        from.setDate(from.getDate() - 1);
        from.setHours(0, 0, 0, 0);
        to.setDate(to.getDate() - 1);
        to.setHours(23, 59, 59, 999);
        break;
      case "last7":
        from.setDate(from.getDate() - 6);
        from.setHours(0, 0, 0, 0);
        to.setHours(23, 59, 59, 999);
        break;
      case "last14":
        from.setDate(from.getDate() - 13);
        from.setHours(0, 0, 0, 0);
        to.setHours(23, 59, 59, 999);
        break;
      case "last30":
        from.setDate(from.getDate() - 29);
        from.setHours(0, 0, 0, 0);
        to.setHours(23, 59, 59, 999);
        break;
      case "thisWeek":
        from.setDate(first);
        from.setHours(0, 0, 0, 0);
        to.setHours(23, 59, 59, 999);
        break;
      case "lastWeek":
        from.setDate(from.getDate() - 7 - from.getDay());
        to.setDate(to.getDate() - to.getDay() - 1);
        from.setHours(0, 0, 0, 0);
        to.setHours(23, 59, 59, 999);
        break;
      case "thisMonth":
        from.setDate(1);
        from.setHours(0, 0, 0, 0);
        to.setHours(23, 59, 59, 999);
        break;
      case "lastMonth":
        from.setMonth(from.getMonth() - 1);
        from.setDate(1);
        from.setHours(0, 0, 0, 0);
        to.setDate(0);
        to.setHours(23, 59, 59, 999);
        break;
      case "thisYear":
        from.setMonth(0);
        from.setDate(1);
        from.setHours(0, 0, 0, 0);
        to.setHours(23, 59, 59, 999);
        break;
      default:
        throw new Error(`Unexpected preset name: ${presetName}`);
    }

    return { from, to };
  };

  const setPreset = (preset: string): void => {
    const rangeValue = getPresetRange(preset);
    setRange(rangeValue);
  };

  const checkPreset = (): void => {
    const matchedPreset = PRESET_KEYS.find((key) => {
      const presetRange = getPresetRange(key);

      const normalizedRangeFrom = new Date(range.from!);
      normalizedRangeFrom.setHours(0, 0, 0, 0);
      const normalizedPresetFrom = new Date(
        presetRange.from!.setHours(0, 0, 0, 0),
      );

      const normalizedRangeTo = new Date(range.to ?? 0);
      normalizedRangeTo.setHours(0, 0, 0, 0);
      const normalizedPresetTo = new Date(
        presetRange.to?.setHours(0, 0, 0, 0) ?? 0,
      );

      return (
        normalizedRangeFrom.getTime() === normalizedPresetFrom.getTime() &&
        normalizedRangeTo.getTime() === normalizedPresetTo.getTime()
      );
    });

    setSelectedPreset(matchedPreset);
  };

  const resetValues = (): void => {
    onCancel();

    const validInitialDateFrom = isValidDate(value?.from)
      ? value?.from
      : undefined;
    const validInitialDateTo = isValidDate(value?.to) ? value?.to : undefined;

    setRange({ from: validInitialDateFrom, to: validInitialDateTo });
  };

  useEffect(() => {
    const isValidRangeFrom = isValidDate(value?.from);
    const isValidRangeTo = isValidDate(value?.to);
    const hasIncomingValue =
      value?.from !== undefined || value?.to !== undefined;

    if (!hasIncomingValue) {
      setRange({ from: undefined, to: undefined });
      return;
    }

    if (!isValidRangeFrom || !isValidRangeTo) {
      resetValues();
    } else {
      setRange({
        from: isValidRangeFrom ? value?.from : undefined,
        to: isValidRangeTo ? value?.to : undefined,
      });
    }
  }, [value?.from, value?.to]);

  useEffect(() => {
    checkPreset();
  }, [range]);

  useEffect(() => {
    if (isOpen) {
      openedRangeRef.current = range;

      const fromDate = range.from ?? new Date();
      const leftAnchor = new Date(
        fromDate.getFullYear(),
        fromDate.getMonth(),
        1,
      );

      let rightAnchor: Date;
      if (range.to) {
        rightAnchor = new Date(range.to.getFullYear(), range.to.getMonth(), 1);
        if (
          rightAnchor.getFullYear() === leftAnchor.getFullYear() &&
          rightAnchor.getMonth() === leftAnchor.getMonth()
        ) {
          rightAnchor = new Date(
            leftAnchor.getFullYear(),
            leftAnchor.getMonth() + 1,
            1,
          );
        }
      } else {
        rightAnchor = new Date(
          leftAnchor.getFullYear(),
          leftAnchor.getMonth() + 1,
          1,
        );
      }

      setLeftMonth(leftAnchor);
      setRightMonth(rightAnchor);
    }
  }, [isOpen]);

  const handleLeftMonthChange = (newLeft: Date) => {
    const nextLeft = new Date(newLeft.getFullYear(), newLeft.getMonth(), 1);
    setLeftMonth(nextLeft);

    const currentRight = new Date(
      rightMonth.getFullYear(),
      rightMonth.getMonth(),
      1,
    );

    if (nextLeft >= currentRight) {
      setRightMonth(
        new Date(nextLeft.getFullYear(), nextLeft.getMonth() + 1, 1),
      );
    }
  };

  const handleRightMonthChange = (newRight: Date) => {
    const nextRight = new Date(newRight.getFullYear(), newRight.getMonth(), 1);
    const currentLeft = new Date(
      leftMonth.getFullYear(),
      leftMonth.getMonth(),
      1,
    );

    if (nextRight <= currentLeft) {
      setRightMonth(
        new Date(currentLeft.getFullYear(), currentLeft.getMonth() + 1, 1),
      );
    } else {
      setRightMonth(nextRight);
    }
  };

  const PresetButton = ({
    preset,
    label,
    isSelected,
  }: {
    preset: string;
    label: string;
    isSelected: boolean;
  }): React.JSX.Element => (
    <Button
      className={cn(isSelected && "pointer-events-none")}
      variant="ghost"
      onClick={() => {
        setPreset(preset);
      }}
    >
      <>
        <span className={cn("pr-2 opacity-0", isSelected && "opacity-70")}>
          <CheckIcon width={18} height={18} />
        </span>
        {label}
      </>
    </Button>
  );

  const areRangesEqual = (a?: DateRange, b?: DateRange): boolean => {
    if (!a || !b) return a === b;
    return (
      a?.from?.getTime() === b?.from?.getTime() &&
      (!a?.to || !b?.to || a.to.getTime() === b.to.getTime())
    );
  };

  const handleSelect = (val: { from?: Date; to?: Date } | undefined) => {
    if (val?.from != null) {
      setRange({ from: val.from, to: val?.to });
    }
  };

  const maxLeftMonth = new Date(
    rightMonth.getFullYear(),
    rightMonth.getMonth() - 1,
    1,
  );

  const minRightMonth = new Date(
    leftMonth.getFullYear(),
    leftMonth.getMonth() + 1,
    1,
  );

  return (
    <Popover
      modal
      open={isOpen}
      onOpenChange={(open: boolean) => {
        if (!open) {
          if (openedRangeRef.current) {
            setRange(openedRangeRef.current);
          }
        }
        setIsOpen(open);
      }}
    >
      <PopoverTrigger asChild>
        <Button size="lg" variant="outline">
          <div className="text-right">
            <div className="py-1">
              <div>
                {range.from
                  ? `${formatDate(range.from, currentLocale)}${
                      range.to
                        ? ` - ${formatDate(range.to, currentLocale)}`
                        : ""
                    }`
                  : t("select_date")}
              </div>
            </div>
          </div>
          <div className="-mr-2 scale-125 pl-1 opacity-60">
            <ChevronDownIcon
              width={24}
              className={`transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
            />
          </div>
        </Button>
      </PopoverTrigger>
      <PopoverContent
        align={align}
        className={cn(
          "w-auto",
          isSmallScreen && "mx-auto w-[calc(100vw-2rem)] max-w-sm",
        )}
        side="bottom"
        sideOffset={8}
        avoidCollisions
        collisionPadding={16}
      >
        <div className="flex flex-col py-2 lg:flex-row">
          <div className="flex flex-col">
            {isSmallScreen && (
              <Select
                defaultValue={selectedPreset}
                onValueChange={(val) => {
                  setPreset(val);
                }}
              >
                <SelectTrigger className="mx-auto mb-2 w-full max-w-45">
                  <SelectValue placeholder={t("select_placeholder")} />
                </SelectTrigger>
                <SelectContent>
                  {PRESET_KEYS.map((key) => (
                    <SelectItem key={key} value={key}>
                      {t(`presets.${key}`)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
            <div
              className={cn(
                "flex justify-center gap-4",
                isSmallScreen && "overflow-hidden",
              )}
            >
              <Calendar
                mode="range"
                month={leftMonth}
                onMonthChange={handleLeftMonthChange}
                onSelect={handleSelect}
                selected={range}
                disabled={disabled}
                numberOfMonths={1}
                className={cn(isSmallScreen && "origin-center scale-90")}
                components={{
                  MonthCaption: (props) => (
                    <CalendarCaption
                      {...props}
                      fromYear={fromYear}
                      toYear={toYear}
                      maxMonth={isSmallScreen ? undefined : maxLeftMonth}
                      onMonthSelect={handleLeftMonthChange}
                    />
                  ),
                }}
              />
              {!isSmallScreen && (
                <Calendar
                  mode="range"
                  month={rightMonth}
                  onMonthChange={handleRightMonthChange}
                  onSelect={handleSelect}
                  selected={range}
                  disabled={disabled}
                  numberOfMonths={1}
                  components={{
                    MonthCaption: (props) => (
                      <CalendarCaption
                        {...props}
                        fromYear={fromYear}
                        toYear={toYear}
                        minMonth={minRightMonth}
                        onMonthSelect={handleRightMonthChange}
                      />
                    ),
                  }}
                />
              )}
            </div>
          </div>
          {!isSmallScreen && (
            <div className="flex flex-col items-end gap-1 pr-2 pl-6">
              <div className="flex max-h-80 w-full flex-col items-end gap-1 overflow-y-auto pr-2 pb-6 pl-6">
                {PRESET_KEYS.map((key) => (
                  <PresetButton
                    key={key}
                    preset={key}
                    label={t(`presets.${key}`)}
                    isSelected={selectedPreset === key}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
        <div className="flex justify-end gap-2 py-2 pr-4">
          <Button
            onClick={() => {
              setIsOpen(false);
              resetValues();
            }}
            variant="ghost"
          >
            {t("cancel")}
          </Button>
          <Button
            onClick={() => {
              setIsOpen(false);
              if (!areRangesEqual(range, openedRangeRef.current)) {
                onUpdate?.(range);
              }
            }}
          >
            {t("submit")}
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
};

DateRangePicker.filePath =
  "src/libs/shared/ui-kit/src/src/lib/date-range-picker/date-range-picker.tsx";
