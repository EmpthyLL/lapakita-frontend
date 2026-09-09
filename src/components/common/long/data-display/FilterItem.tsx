"use client";

import { DatePicker } from "@/components/common/input/DatePicker";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Trash2 } from "lucide-react";
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
  const t = useTranslations("common.display_table");
  const [open, setOpen] = useState(true);
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
          <Select
            value={String(value)}
            onValueChange={(val) => {
              handleChange(val);
              setOpen(false);
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder={t("select_option")} />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {option.options.map((op) => (
                  <SelectItem key={op.value} value={String(op.value)}>
                    {op.label}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
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
