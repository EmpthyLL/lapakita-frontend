/* eslint-disable jsx-a11y/role-has-required-aria-props */
/* eslint-disable react-hooks/refs */
"use client";

import { Check, ChevronDown, Loader2, X, type LucideIcon } from "lucide-react";
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
type IconValue = string | LucideIcon;

function isLucideIcon(icon: unknown): icon is LucideIcon {
  return (
    typeof icon === "function" ||
    (typeof icon === "object" && icon !== null && "render" in (icon as object))
  );
}

function OptionIcon({
  icon,
  size,
  alt,
  className,
}: {
  icon: IconValue;
  size: number;
  alt: string;
  className?: string;
}) {
  if (isLucideIcon(icon)) {
    const Icon = icon;
    return (
      <Icon
        className={cn("shrink-0 text-muted-foreground", className)}
        style={{ width: size, height: size }}
      />
    );
  }
  return (
    <Image
      src={String(icon)}
      width={size}
      height={size}
      className={cn("shrink-0 rounded-full object-cover", className)}
      alt={alt}
      unoptimized
    />
  );
}

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
  iconKey?: keyof T;
  groupKey?: keyof T;

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

  mode?: "default" | "solid";
  size?: AutocompleteSize;
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
  mode = "default",
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

  const isSolid = mode === "solid";
  const hasValue = selectedOption != null || (value != null && value !== "");
  const roleVar = `var(--${role})`;
  const s = SIZE_STYLES[size];

  // Isolasi scroll internal list
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
        "relative flex cursor-pointer items-center justify-between rounded-md",
        s.itemPad,
        isGrouped && "pl-5",
        String(value) === String(option[valueKey]) && "bg-primary/10",
      )}
      style={
        isSolid && String(value) === String(option[valueKey])
          ? {
              backgroundColor: `color-mix(in oklch, ${roleVar}, transparent 90%)`,
            }
          : undefined
      }
    >
      <div className="flex min-w-0 items-center gap-2">
        {iconKey && option[iconKey] && (
          <OptionIcon
            icon={option[iconKey]}
            size={s.iconSize}
            alt={String(option[labelKey]) || ""}
          />
        )}
        <span
          className={cn(
            s.itemText,
            "truncate font-medium",
            isSolid ? "text-foreground/80" : "text-foreground",
          )}
        >
          {option[labelKey]}
        </span>
      </div>

      <Check
        className={cn(
          "h-4 w-4 shrink-0 opacity-0",
          String(value) === String(option[valueKey]) && "opacity-100",
        )}
        style={isSolid ? { color: roleVar } : undefined}
      />
    </CommandItem>
  );

  const triggerClass = isSolid
    ? cn(
        "rounded-md border bg-white text-[16px] font-medium outline-none transition-all duration-150",
        "hover:bg-white",
        "border-primary/40",
        "focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20",
        "data-[state=open]:border-primary data-[state=open]:ring-2 data-[state=open]:ring-primary/20",
        disabled &&
          "pointer-events-none cursor-not-allowed bg-[#F2F6F8] text-[#adb4ba] hover:bg-[#F2F6F8] border-gray-200",
        hasError &&
          !disabled &&
          "border-red-500 focus-within:border-red-500 focus-within:ring-red-500/20",
      )
    : cn(
        "rounded-md border bg-background text-foreground outline-none transition-all duration-150",
        "hover:bg-background",
        "border-input",
        "focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20",
        "data-[state=open]:border-primary data-[state=open]:ring-2 data-[state=open]:ring-primary/20",
        hasError &&
          "border-destructive focus-within:border-destructive focus-within:ring-destructive/20",
        disabled &&
          "pointer-events-none cursor-not-allowed bg-muted text-muted-foreground opacity-50",
      );

  const inputDisplayValue = open
    ? search
    : selectedOption
      ? String(selectedOption[labelKey])
      : search;

  /* PERBAIKAN: Teks hasil ketikan & value selalu pekat/hitam. 
     Placeholder saja yang abu-abu. 
  */
  const inputClass = isSolid
    ? cn(
        "font-semibold outline-none transition-colors duration-150 text-gray-950 placeholder:text-[#9FB1C1] placeholder:font-normal",
        disabled &&
          "cursor-not-allowed bg-[#F2F6F8] text-[#adb4ba] placeholder:text-[#adb4ba]",
      )
    : cn(
        "font-medium outline-none transition-colors duration-150 text-foreground placeholder:text-muted-foreground placeholder:font-normal",
        disabled && "cursor-not-allowed",
      );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <div
          role="combobox"
          aria-expanded={open}
          aria-invalid={hasError}
          aria-disabled={disabled}
          tabIndex={disabled ? -1 : 0}
          onClick={() => !disabled && setOpen(!open)}
          onKeyDown={(e) => !disabled && handlers.handleTriggerKeyDown(e)}
          className={cn(
            "flex w-full cursor-pointer items-center gap-2 overflow-hidden",
            s.trigger,
            triggerClass,
            className,
          )}
          style={
            isSolid
              ? ({ "--role-color": roleVar } as React.CSSProperties)
              : undefined
          }
        >
          <div className="flex min-w-0 flex-1 items-center gap-2 text-start">
            {indicatorIcon && !(iconKey && selectedOption?.[iconKey]) && (
              <div className="flex shrink-0 items-center text-muted-foreground">
                {indicatorIcon}
              </div>
            )}

            {isLoading && (
              <Loader2 className="h-5 w-5 shrink-0 animate-spin text-muted-foreground" />
            )}

            {iconKey && selectedOption?.[iconKey] && (
              <OptionIcon
                icon={selectedOption[iconKey]}
                size={isSolid ? 28 : 20}
                alt={String(selectedOption?.[labelKey]) || ""}
              />
            )}

            <input
              ref={refs.inputRef}
              type="text"
              value={inputDisplayValue}
              onChange={(e) => !disabled && setSearch(e.target.value)}
              onClick={handlers.handleInputClick}
              onKeyDown={handlers.handleInputKeyDown}
              disabled={disabled}
              tabIndex={-1}
              placeholder={placeholder}
              className={cn(
                "min-w-0 flex-1 truncate bg-transparent disabled:cursor-not-allowed",
                s.text,
                inputClass,
              )}
            />
          </div>

          <div className="flex shrink-0 items-center gap-1.5">
            {(search !== "" || (showClearButton && value != null)) &&
              !disabled && (
                <button
                  type="button"
                  onClick={(e) => {
                    if (search) {
                      handlers.handleClearSearch(e);
                    } else {
                      handlers.handleClearValue(e);
                    }
                  }}
                  tabIndex={-1}
                  className="flex items-center justify-center rounded-sm p-0.5 text-muted-foreground transition-colors hover:text-foreground"
                >
                  <X className={isSolid ? "h-6 w-6 stroke-[2.5]" : s.clear} />
                </button>
              )}

            <ChevronDown
              className={cn(
                "shrink-0 transition-all duration-150 text-muted-foreground",
                isSolid ? "h-8 w-8 stroke-[2.5]" : s.chevron,
                open && "rotate-180",
                hasValue ? "opacity-100" : "opacity-40",
              )}
            />
          </div>
        </div>
      </PopoverTrigger>

      <PopoverContent
        className="rounded-md p-0"
        style={{ width: "var(--radix-popover-trigger-width)" }}
      >
        <Command
          shouldFilter={!onFilterChange}
          className="rounded-md flex flex-col"
        >
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
                className="max-h-75 flex-1 overflow-y-auto overscroll-contain"
                style={{
                  scrollbarWidth: "thin",
                  scrollbarColor: isSolid
                    ? "rgba(0,0,0,0.2) transparent"
                    : "var(--border) transparent",
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
                      className="w-full text-sm rounded-md"
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
