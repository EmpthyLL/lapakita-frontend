/* eslint-disable react-hooks/refs */
/* eslint-disable jsx-a11y/role-has-required-aria-props */
"use client";

import { Check, ChevronDown, Loader2, X } from "lucide-react";
import * as React from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { useAutocomplete } from "@/hooks/use-autocomplete";
import { VariantColor } from "@/types";
import { useAutocompleteVariant } from "@/hooks/use-autocomplete-variant";

type AutocompleteSize = "sm" | "md" | "lg";

const SIZE_STYLES: Record<
  AutocompleteSize,
  {
    trigger: string;
    text: string;
    icon: string;
    chevron: string;
    itemPad: string;
    itemText: string;
  }
> = {
  sm: {
    trigger: "h-9 px-2.5 py-2",
    text: "text-sm",
    icon: "h-4 w-4",
    chevron: "h-3.5 w-3.5",
    itemPad: "px-2.5 py-2",
    itemText: "text-sm",
  },
  md: {
    trigger: "h-10 px-3 py-2.5",
    text: "text-sm",
    icon: "h-5 w-5",
    chevron: "h-4 w-4",
    itemPad: "px-3 py-2.5",
    itemText: "text-sm",
  },
  lg: {
    trigger: "h-12 px-3 py-3",
    text: "text-[15px]",
    icon: "h-6.5 w-6.5",
    chevron: "h-6 w-6",
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
  iconKey?: keyof T;
  /** Field on each option used to group items under a heading (e.g. "group"). */
  groupKey?: keyof T;

  renderItem?: (option: T) => React.ReactNode;

  placeholder?: string;
  emptyText?: string;

  disabled?: boolean;
  isLoading?: boolean;
  isFetchingMore?: boolean;
  hasError?: boolean;

  showClearButton?: boolean;
  indicatorIcon?: React.ReactNode;
  addButton?: React.ReactNode;

  hasMore?: boolean;
  fetchMore?: () => void;
  onFilterChange?: (query: string) => void;
  debounceDelay?: number;
  className?: string;

  open?: boolean;
  onOpenChange?: (open: boolean) => void;

  /** "simple": lighter border/weight (default). "solid": heavier border/weight, bolder text. */
  uiStyle?: "simple" | "solid";
  /** Controls trigger height, text size, and icon sizing. Independent of uiStyle. */
  size?: AutocompleteSize;
  /**
   * Role color theme. Defaults to "auto", which derives tenant/owner/supplier
   * from the current pathname via useRoleVariant(). Pass an explicit value to override.
   */
  variant?: VariantColor | "auto";
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function Autocomplete<T extends Record<string, any>>({
  value,
  onSelect,
  options,
  valueKey = "value" as keyof T,
  labelKey = "label" as keyof T,
  iconKey = "icon" as keyof T,
  groupKey,
  renderItem,
  placeholder = "Select option...",
  emptyText = "No option found.",
  disabled = false,
  isLoading = false,
  isFetchingMore = false,
  hasError = false,
  showClearButton = false,
  indicatorIcon,
  addButton,
  hasMore = false,
  fetchMore,
  onFilterChange,
  debounceDelay = 300,
  className,
  open: controlledOpen,
  onOpenChange: controlledOnOpenChange,
  uiStyle = "simple",
  size = "md",
  variant = "auto",
}: AutocompleteProps<T>) {
  const autoRole = useAutocompleteVariant();
  const role: VariantColor = variant === "auto" ? autoRole : variant;

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
    labelKey,
    groupKey,
    onFilterChange,
    debounceDelay,
    open: controlledOpen,
    onOpenChange: controlledOnOpenChange,
  });

  const isSolid = uiStyle === "solid";
  const roleVar = `var(--${role})`;
  const s = SIZE_STYLES[size];

  const renderOptionRow = (option: T, isGrouped: boolean) => (
    <CommandItem
      key={String(option[valueKey])}
      ref={
        String(option[valueKey]) === String(value)
          ? refs.selectedItemRef
          : undefined
      }
      value={String(option[valueKey])}
      keywords={[String(option[labelKey])]}
      onSelect={handlers.selectOption}
      className={cn(
        "relative flex cursor-pointer items-center justify-between rounded-none",
        s.itemPad,
        isGrouped && "pl-5",
      )}
      style={
        String(value) === String(option[valueKey])
          ? {
              backgroundColor: `color-mix(in oklch, ${roleVar}, transparent 90%)`,
            }
          : undefined
      }
    >
      {renderItem ? (
        renderItem(option)
      ) : (
        <div className="flex items-center gap-2">
          {iconKey && option[iconKey] && (
            <Image
              src={String(option[iconKey])}
              width={20}
              height={20}
              className="rounded-full object-contain"
              alt={String(option[labelKey]) || ""}
              unoptimized
            />
          )}
          <span
            className={cn(
              s.itemText,
              isSolid
                ? "font-semibold text-foreground/80"
                : "font-medium text-foreground",
            )}
          >
            {option[labelKey]}
          </span>
        </div>
      )}
      <Check
        className="h-4 w-4 shrink-0 opacity-0 data-[selected=true]:opacity-100"
        style={{ color: roleVar }}
        data-selected={String(value) === String(option[valueKey])}
      />
    </CommandItem>
  );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger>
        <div
          role="combobox"
          aria-expanded={open}
          aria-invalid={hasError}
          aria-disabled={disabled}
          tabIndex={disabled ? -1 : 0}
          onClick={() => !disabled && setOpen(!open)}
          onKeyDown={(e) => !disabled && handlers.handleTriggerKeyDown(e)}
          className={cn(
            "flex w-full cursor-pointer items-center outline-none transition-colors",
            s.trigger,
            isSolid
              ? "rounded-md border border-border bg-card"
              : "border border-input bg-background",
            !disabled && "hover:bg-secondary/40",
            hasError && "border-destructive",
            disabled &&
              "pointer-events-none cursor-not-allowed bg-muted text-muted-foreground opacity-60",
            className,
          )}
          style={
            !disabled && !hasError
              ? ({ "--tw-ring-color": roleVar } as React.CSSProperties)
              : undefined
          }
        >
          <div className="flex flex-1 items-center gap-2 text-start">
            {indicatorIcon && !(iconKey && selectedOption?.[iconKey]) && (
              <div className="flex items-center text-muted-foreground">
                {indicatorIcon}
              </div>
            )}

            {isLoading && (
              <Loader2
                className={cn(s.icon, "animate-spin text-muted-foreground")}
              />
            )}

            {iconKey && selectedOption?.[iconKey] && (
              <Image
                src={String(selectedOption[iconKey])}
                width={isSolid ? 26 : 20}
                height={isSolid ? 26 : 20}
                className="rounded-full object-cover"
                alt={String(selectedOption?.[labelKey]) || ""}
                unoptimized
              />
            )}

            <input
              ref={refs.inputRef}
              type="text"
              value={search}
              onChange={(e) => !disabled && setSearch(e.target.value)}
              onClick={handlers.handleInputClick}
              onKeyDown={handlers.handleInputKeyDown}
              disabled={disabled}
              tabIndex={-1}
              placeholder={
                selectedOption ? String(selectedOption[labelKey]) : placeholder
              }
              className={cn(
                "min-w-0 flex-1 bg-transparent outline-none disabled:cursor-not-allowed",
                s.text,
                isSolid
                  ? "font-semibold text-foreground placeholder:font-semibold"
                  : "font-medium text-foreground",
                !selectedOption && "placeholder:text-muted-foreground",
              )}
            />
          </div>

          <div className="flex items-center gap-1.5">
            {search && !disabled && (
              <button
                type="button"
                onClick={handlers.handleClearSearch}
                tabIndex={-1}
                className="flex items-center justify-center rounded-sm p-1 text-muted-foreground transition-colors hover:bg-secondary"
              >
                <X className={s.chevron} />
              </button>
            )}

            {showClearButton && value != null && !search && !disabled && (
              <button
                type="button"
                onClick={handlers.handleClearValue}
                tabIndex={-1}
                className="flex items-center justify-center rounded-sm p-1 text-muted-foreground transition-colors hover:bg-secondary"
              >
                <X className={s.chevron} />
              </button>
            )}

            <ChevronDown
              className={cn(
                "shrink-0 text-muted-foreground/70 transition-transform duration-200",
                s.chevron,
                open && "rotate-180",
              )}
            />
          </div>
        </div>
      </PopoverTrigger>

      <PopoverContent
        className="p-0"
        style={{ width: "var(--radix-popover-trigger-width)" }}
        initialFocus={false}
      >
        <Command shouldFilter={!onFilterChange}>
          <CommandInput
            ref={refs.commandInputRef}
            value={search}
            onValueChange={setSearch}
            className="sr-only"
            disabled={disabled}
          />

          {isLoading ? (
            <div className="flex w-full items-center justify-center p-2 py-6">
              <Loader2
                className="h-6 w-6 animate-spin"
                style={{ color: roleVar }}
              />
            </div>
          ) : (
            <>
              <CommandList
                ref={refs.commandListRef}
                className="max-h-72 overflow-y-auto overscroll-contain"
                style={{
                  scrollbarWidth: "thin",
                  scrollbarColor: "var(--border) transparent",
                }}
              >
                {filteredOptions.length === 0 ? (
                  <CommandEmpty className="mx-6 my-4 max-h-max font-medium text-muted-foreground">
                    {emptyText}
                  </CommandEmpty>
                ) : groupedOptions ? (
                  groupedOptions.map(([groupLabel, groupOptions]) => (
                    <CommandGroup
                      key={groupLabel}
                      heading={
                        <span className="px-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                          {groupLabel}
                        </span>
                      }
                      className="p-0 **:[[cmdk-group-heading]]:px-2 **:[[cmdk-group-heading]]:py-1.5"
                    >
                      {groupOptions.map((option) =>
                        renderOptionRow(option, true),
                      )}
                    </CommandGroup>
                  ))
                ) : (
                  <CommandGroup className="p-0">
                    {filteredOptions.map((option) =>
                      renderOptionRow(option, false),
                    )}
                  </CommandGroup>
                )}

                {hasMore && (
                  <div className="border-t border-border p-2">
                    <Button
                      type="button"
                      variant="ghost"
                      className="w-full text-sm"
                      onClick={fetchMore}
                      onMouseEnter={fetchMore}
                      disabled={isFetchingMore}
                    >
                      {isFetchingMore ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Loading...
                        </>
                      ) : (
                        "Load more..."
                      )}
                    </Button>
                  </div>
                )}
              </CommandList>

              {addButton && (
                <div className="sticky bottom-0 border-t border-border bg-popover p-2">
                  {addButton}
                </div>
              )}
            </>
          )}
        </Command>
      </PopoverContent>
    </Popover>
  );
}
