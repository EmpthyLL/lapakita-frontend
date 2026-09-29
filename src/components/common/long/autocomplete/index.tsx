/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  AutocompleteAsyncConfig,
  useAutocomplete,
} from "@/hooks/use-autocomplete";
import { cn } from "@/lib/utils";
import * as React from "react";
import { AutocompleteList } from "./AutocompleteList";
import { AutocompleteTrigger } from "./AutocompleteTrigger";

type AutocompleteSize = "sm" | "md" | "lg";

const SIZE_STYLES: Record<
  AutocompleteSize,
  {
    trigger: string;
    text: string;
    iconSize: number;
    chevron: string;
    clear: string;
    itemPad: string;
    itemText: string;
  }
> = {
  sm: {
    trigger: "h-9 px-2.5 py-2",
    text: "text-sm",
    iconSize: 18,
    chevron: "h-5 w-5",
    clear: "h-4 w-4",
    itemPad: "px-2.5 py-2",
    itemText: "text-sm",
  },
  md: {
    trigger: "h-10 px-3 py-2.5",
    text: "text-sm",
    iconSize: 20,
    chevron: "h-6 w-6",
    clear: "h-4.5 w-4.5",
    itemPad: "px-3 py-2.5",
    itemText: "text-sm",
  },
  lg: {
    trigger: "h-12 px-3 py-3",
    text: "text-[15px]",
    iconSize: 24,
    chevron: "h-7 w-7",
    clear: "h-5 w-5",
    itemPad: "px-3.5 py-3",
    itemText: "text-[15px]",
  },
};

// Interface Objek Render Terpadu
export interface AutocompleteRenderConfig<T> {
  item?: (option: T) => React.ReactNode;
  triggerAsCustom?: boolean; // Apakah trigger ikut dirender custom atau normal
}

export interface AutocompleteProps<
  T extends Record<string, any>,
  TQuery extends Record<string, any> = any,
> {
  value: string | number | null;
  onSelect: (value: string | number, option?: T) => void;
  options?: T[];
  asyncConfig?: AutocompleteAsyncConfig<T, TQuery>;

  valueKey?: keyof T;
  labelKey?: keyof T;
  searchKey?: keyof T;
  iconKey?: keyof T;
  groupKey?: keyof T;

  placeholder?: string;
  emptyText?: string;
  disabled?: boolean;
  hasError?: boolean;
  showClearButton?: boolean;
  indicatorIcon?: React.ReactNode;
  addButton?: React.ReactNode;

  renderConfig?: AutocompleteRenderConfig<T>; // Menggantikan render & renderTriggerAsCustom yang terpisah

  debounceDelay?: number;
  className?: string;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  mode?: "default" | "solid";
  size?: AutocompleteSize;
}

export function Autocomplete<
  T extends Record<string, any>,
  TQuery extends Record<string, any> = any,
>({
  value,
  onSelect,
  options,
  asyncConfig,
  valueKey = "value" as keyof T,
  labelKey = "label" as keyof T,
  searchKey = "label" as keyof T,
  iconKey = "icon" as keyof T,
  groupKey,
  placeholder = "Select option...",
  emptyText = "No option found.",
  disabled = false,
  hasError = false,
  showClearButton = false,
  indicatorIcon,
  addButton,
  renderConfig,
  debounceDelay = 300,
  className,
  open: controlledOpen,
  onOpenChange: controlledOnOpenChange,
  mode = "default",
  size = "md",
}: AutocompleteProps<T, TQuery>) {
  const {
    open,
    setOpen,
    search,
    setSearch,
    selectedOption,
    filteredOptions,
    groupedOptions,
    isLoading,
    isFetchingNext,
    isFetchingPrev,
    hasNext,
    hasPrev,
    fetchNext,
    fetchPrev,
    refs,
    handlers,
  } = useAutocomplete({
    value,
    onSelect,
    options,
    asyncConfig,
    valueKey,
    labelKey: searchKey,
    groupKey,
    debounceDelay,
    open: controlledOpen,
    onOpenChange: controlledOnOpenChange,
  });

  const isSolid = mode === "solid";
  const hasValue = selectedOption != null;
  const s = SIZE_STYLES[size];

  // Keep selected item at top
  React.useEffect(() => {
    if (!open) return;
    const scrollSelectedToTop = () => {
      const listEl = refs.commandListRef.current;
      const selectedEl = refs.selectedItemRef.current;
      if (!listEl || !selectedEl) return;
      const listRect = listEl.getBoundingClientRect();
      const selectedRect = selectedEl.getBoundingClientRect();
      listEl.scrollTop += selectedRect.top - listRect.top;
    };
    const frame = requestAnimationFrame(scrollSelectedToTop);
    const timeout = setTimeout(scrollSelectedToTop, 100);
    return () => {
      cancelAnimationFrame(frame);
      clearTimeout(timeout);
    };
  }, [open, filteredOptions.length, refs.commandListRef, refs.selectedItemRef]);

  const triggerClass = isSolid
    ? cn(
        "rounded-md border border-input bg-white font-semibold outline-none transition-all duration-150",
        "hover:bg-white",
        "focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20",
        disabled &&
          "pointer-events-none cursor-not-allowed border-gray-200 bg-[#F2F6F8] text-[#adb4ba]",
        hasError &&
          !disabled &&
          "border-destructive focus-within:border-destructive",
      )
    : cn(
        "rounded-md border border-input bg-background font-semibold text-foreground outline-none transition-all duration-150",
        "hover:bg-background",
        "focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20",
        hasError && "border-destructive focus-within:border-destructive",
        disabled &&
          "pointer-events-none cursor-not-allowed bg-muted text-muted-foreground opacity-50",
      );

  const inputClass = cn(
    "font-semibold text-foreground outline-none transition-colors duration-150",
    "placeholder:text-muted-foreground/70 placeholder:font-normal",
    hasError && "placeholder:text-destructive/70",
  );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <AutocompleteTrigger
          open={open}
          setOpen={setOpen}
          disabled={disabled}
          hasError={hasError}
          isLoading={isLoading}
          hasValue={hasValue}
          showClearButton={showClearButton}
          selectedOption={selectedOption}
          search={search}
          setSearch={setSearch}
          placeholder={placeholder}
          labelKey={labelKey}
          iconKey={iconKey}
          indicatorIcon={indicatorIcon}
          render={renderConfig?.item}
          renderTriggerAsCustom={renderConfig?.triggerAsCustom}
          sizeStyle={s}
          triggerClass={cn(triggerClass, className)}
          inputClass={inputClass}
          inputRef={refs.inputRef}
          handlers={handlers}
          isSolid={isSolid}
        />
      </PopoverTrigger>

      <PopoverContent
        className="rounded-md p-0"
        style={{ width: "var(--radix-popover-trigger-width)" }}
      >
        <AutocompleteList
          options={filteredOptions}
          filteredOptions={filteredOptions}
          groupedOptions={groupedOptions}
          value={value}
          valueKey={valueKey}
          labelKey={labelKey}
          searchKey={searchKey}
          iconKey={iconKey}
          emptyText={emptyText}
          isLoading={isLoading}
          isFetchingNext={isFetchingNext}
          isFetchingPrev={isFetchingPrev}
          hasNext={hasNext}
          hasPrev={hasPrev}
          fetchNext={fetchNext}
          fetchPrev={fetchPrev}
          search={search}
          setSearch={setSearch}
          disabled={disabled}
          render={renderConfig?.item}
          addButton={addButton}
          isSolid={isSolid}
          sizeStyle={s}
          refs={refs}
          handlers={handlers}
        />
      </PopoverContent>
    </Popover>
  );
}
