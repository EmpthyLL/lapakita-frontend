"use client";

import { DatePicker } from "@/components/common/input/DatePicker";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Check, ChevronDown, Trash2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { FILTER_TYPE_ICON, FilterOption } from "./Constant";

interface FilterItemProps<TData, TParams extends Record<string, unknown>> {
  option: FilterOption<TData>;
  filterValues: Partial<TParams>;
  setFilterValues: React.Dispatch<React.SetStateAction<Partial<TParams>>>;
  filterToParamKey: Record<string, keyof TParams>;
  onRemove: (option: FilterOption<TData>) => void;
}

export function FilterItem<TData, TParams extends Record<string, unknown>>({
  option,
  filterValues,
  setFilterValues,
  filterToParamKey,
  onRemove,
}: FilterItemProps<TData, TParams>) {
  const t = useTranslations("common.data_display");
  const [open, setOpen] = useState(true);
  const [selectPopoverOpen, setSelectPopoverOpen] = useState(false);

  const paramKey = filterToParamKey[option.id as string];
  const value = paramKey
    ? ((filterValues[paramKey] as string | number | Date | undefined) ?? "")
    : "";
  const hasValue = value !== "" && value !== undefined && value !== null;
  const Icon = FILTER_TYPE_ICON[option.type ?? "input"];

  const handleChange = (val: string | number | Date | null | undefined) => {
    if (!paramKey) return;
    setFilterValues((prev) => ({
      ...prev,
      [paramKey]: val ?? undefined,
    }));
  };

  const displayLabel = () => {
    if (!value && value !== 0)
      return <span className="capitalize">{option.title}</span>;

    if (option.type === "date" && value instanceof Date) {
      return (
        <span>
          {option.title} : {format(value, "dd MMM yyyy")}
        </span>
      );
    }

    if (option.type === "select" && option.options) {
      const found = option.options.find((o) => o.value === value);
      return (
        <span>
          {option.title} : {found?.label ?? String(value)}
        </span>
      );
    }

    return (
      <span>
        {option.title} : {String(value)}
      </span>
    );
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className={cn(
            "gap-1.5 rounded-full transition-colors",
            hasValue
              ? "border-primary/40 bg-primary/10 text-primary hover:bg-primary/15 hover:text-primary"
              : "border-border text-muted-foreground",
          )}
        >
          <Icon className="h-3.5 w-3.5" />
          {displayLabel()}
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-60 space-y-2 text-sm" align="start">
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-1.5 text-sm font-medium capitalize text-foreground">
            <Icon className="h-3.5 w-3.5 text-primary" />
            {option.title}
          </span>
          <Button
            aria-label={t("remove_filter")}
            variant="ghost"
            size="icon"
            className="h-7 w-7 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
            onClick={() => {
              handleChange(undefined);
              onRemove(option);
            }}
          >
            <Trash2 className="size-3.5" />
          </Button>
        </div>

        {option.type === "date" ? (
          <DatePicker
            value={
              value instanceof Date
                ? value
                : value
                  ? new Date(String(value))
                  : null
            }
            onChange={(date) => {
              handleChange(date ?? undefined);
              if (date) setOpen(false);
            }}
          />
        ) : option.type === "select" && option.options ? (
          <Popover open={selectPopoverOpen} onOpenChange={setSelectPopoverOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="flex w-full items-center justify-between h-9 px-3 text-xs font-normal border-border bg-background hover:bg-secondary/50 rounded-lg"
              >
                <span className="truncate">
                  {option.options.find((o) => String(o.value) === String(value))
                    ?.label || t("select_option")}
                </span>
                <ChevronDown
                  className={cn(
                    "h-3.5 w-3.5 shrink-0 text-muted-foreground transition-transform duration-200",
                    selectPopoverOpen && "rotate-180",
                  )}
                />
              </Button>
            </PopoverTrigger>
            <PopoverContent
              side="bottom"
              align="center"
              sideOffset={4}
              className="w-(--radix-popover-trigger-width) p-1 shadow-md rounded-xl"
            >
              <div className="space-y-0.5">
                {option.options.map((op) => {
                  const isSelected = String(value) === String(op.value);
                  return (
                    <button
                      key={op.value}
                      type="button"
                      onClick={() => {
                        handleChange(op.value);
                        setSelectPopoverOpen(false);
                        setOpen(false);
                      }}
                      className={cn(
                        "flex w-full items-center justify-between rounded-lg px-2.5 py-1.5 text-xs font-medium transition-colors outline-none cursor-pointer",
                        isSelected
                          ? "bg-primary/10 text-primary font-semibold"
                          : "text-foreground hover:bg-secondary",
                      )}
                    >
                      <span>{op.label}</span>
                      {isSelected && <Check className="h-3.5 w-3.5" />}
                    </button>
                  );
                })}
              </div>
            </PopoverContent>
          </Popover>
        ) : (
          <Input
            placeholder={t("type_here")}
            className="h-8"
            value={String(value)}
            autoFocus
            onChange={(e) =>
              handleChange(e.target.value === "" ? undefined : e.target.value)
            }
            onKeyDown={(e) => {
              if (e.key === "Enter") setOpen(false);
            }}
          />
        )}
      </PopoverContent>
    </Popover>
  );
}
