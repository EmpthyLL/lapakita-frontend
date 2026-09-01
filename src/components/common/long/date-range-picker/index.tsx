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
import { DateRange } from "react-day-picker";

import { CalendarCaption } from "./CalendarCaption";
import { DateRangePickerProps, PRESET_KEYS } from "./Types";
import {
  areRangesEqual,
  formatDate,
  getPresetRange,
  isValidDate,
} from "./Utils";

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
