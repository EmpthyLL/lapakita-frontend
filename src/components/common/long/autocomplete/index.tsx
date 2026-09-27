"use client";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useAutocomplete } from "@/hooks/use-autocomplete";
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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface AutocompleteProps<T extends Record<string, any>> {
  value: string | number | null;
  onSelect: (value: string | number, option?: T) => void;
  options: T[];

  valueKey?: keyof T;
  labelKey?: keyof T;
  searchKey?: keyof T;
  iconKey?: keyof T;
  groupKey?: keyof T;

  placeholder?: string;
  emptyText?: string;

  disabled?: boolean;
  isLoading?: boolean;
  isFetchingNext?: boolean;
  isFetchingPrev?: boolean;
  hasError?: boolean;

  showClearButton?: boolean;
  indicatorIcon?: React.ReactNode;
  addButton?: React.ReactNode;
  render?: (option: T) => React.ReactNode;
  renderTriggerAsCustom?: boolean; // Properti baru untuk menentukan trigger ikut render custom atau normal

  hasNext?: boolean;
  fetchNext?: () => void;
  hasPrev?: boolean;
  fetchPrev?: () => void;
  onFilterChange?: (query: string) => void;
  debounceDelay?: number;
  className?: string;

  open?: boolean;
  onOpenChange?: (open: boolean) => void;

  mode?: "default" | "solid";
  size?: AutocompleteSize;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function Autocomplete<T extends Record<string, any>>({
  value,
  onSelect,
  options,
  valueKey = "value" as keyof T,
  labelKey = "label" as keyof T,
  searchKey = "label" as keyof T,
  iconKey = "icon" as keyof T,
  groupKey,
  placeholder = "Select option...",
  emptyText = "No option found.",
  disabled = false,
  isLoading = false,
  isFetchingNext = false,
  isFetchingPrev = false,
  hasError = false,
  showClearButton = false,
  indicatorIcon,
  addButton,
  render,
  renderTriggerAsCustom = false,
  hasNext = false,
  fetchNext,
  hasPrev = false,
  fetchPrev,
  onFilterChange,
  debounceDelay = 300,
  className,
  open: controlledOpen,
  onOpenChange: controlledOnOpenChange,
  mode = "default",
  size = "md",
}: AutocompleteProps<T>) {
  const {
    open,
    setOpen,
    search,
    setSearch,
    selectedOption,
    filteredOptions,
    groupedOptions,
    refs,
    handlers,
  } = useAutocomplete({
    value,
    onSelect,
    options,
    valueKey,
    labelKey: searchKey,
    groupKey,
    onFilterChange,
    debounceDelay,
    open: controlledOpen,
    onOpenChange: controlledOnOpenChange,
  });

  const isSolid = mode === "solid";
  const hasValue = selectedOption != null;
  const s = SIZE_STYLES[size];

  // Keep the selected value at the top of the scrollable list.
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

  React.useEffect(() => {
    if (!open) return;

    const commandList = refs.commandListRef.current;
    if (!commandList) return;

    const preventOuterScroll = (e: WheelEvent) => {
      const { scrollTop, scrollHeight, clientHeight } = commandList;
      const delta = e.deltaY;
      const isDeltaDown = delta > 0;

      if (
        (isDeltaDown && scrollTop + clientHeight >= scrollHeight) ||
        (!isDeltaDown && scrollTop <= 0)
      ) {
        e.preventDefault();
      }
    };

    commandList.addEventListener("wheel", preventOuterScroll, {
      passive: false,
    });

    return () => {
      commandList.removeEventListener("wheel", preventOuterScroll);
    };
  }, [open, refs.commandListRef]);

  const triggerClass = isSolid
    ? cn(
        "rounded-md border border-input bg-white font-semibold outline-none transition-all duration-150",
        "hover:bg-white",
        "focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20",
        "data-[state=open]:border-primary data-[state=open]:ring-2 data-[state=open]:ring-primary/20",
        disabled &&
          "pointer-events-none cursor-not-allowed border-gray-200 bg-[#F2F6F8] text-[#adb4ba] hover:bg-[#F2F6F8]",
        "group-data-[invalid=true]/field:border-destructive group-data-[invalid=true]/field:focus-within:border-destructive group-data-[invalid=true]/field:focus-within:ring-destructive/20",
        "aria-invalid:border-destructive aria-invalid:focus-within:border-destructive aria-invalid:focus-within:ring-destructive/20",
        hasError &&
          !disabled &&
          "border-destructive focus-within:border-destructive focus-within:ring-destructive/20",
      )
    : cn(
        "rounded-md border border-input bg-background font-semibold text-foreground outline-none transition-all duration-150",
        "hover:bg-background",
        "focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20",
        "data-[state=open]:border-primary data-[state=open]:ring-2 data-[state=open]:ring-primary/20",
        "group-data-[invalid=true]/field:border-destructive group-data-[invalid=true]/field:focus-within:border-destructive group-data-[invalid=true]/field:focus-within:ring-destructive/20",
        "aria-invalid:border-destructive aria-invalid:focus-within:border-destructive aria-invalid:focus-within:ring-destructive/20",
        hasError &&
          "border-destructive focus-within:border-destructive focus-within:ring-destructive/20",
        disabled &&
          "pointer-events-none cursor-not-allowed bg-muted text-muted-foreground opacity-50",
      );

  const inputClass = cn(
    "font-semibold text-foreground outline-none transition-colors duration-150",
    "placeholder:text-muted-foreground/70 placeholder:font-normal placeholder:transition-colors",
    "group-data-[invalid=true]/field:placeholder:text-destructive/70",
    "aria-invalid:placeholder:text-destructive/70",
    hasError && "placeholder:text-destructive/70",
    disabled &&
      (isSolid
        ? "cursor-not-allowed bg-[#F2F6F8] text-[#adb4ba]"
        : "cursor-not-allowed"),
  );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <div className="w-full">
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
            render={render}
            renderTriggerAsCustom={renderTriggerAsCustom}
            sizeStyle={s}
            triggerClass={cn(triggerClass, className)}
            inputClass={inputClass}
            inputRef={refs.inputRef}
            handlers={handlers}
            isSolid={isSolid}
          />
        </div>
      </PopoverTrigger>

      <PopoverContent
        className="rounded-md p-0"
        style={{ width: "var(--radix-popover-trigger-width)" }}
      >
        <AutocompleteList
          options={options}
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
          onFilterChange={onFilterChange}
          search={search}
          setSearch={setSearch}
          disabled={disabled}
          render={render}
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
