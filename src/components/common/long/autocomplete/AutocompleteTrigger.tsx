/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable jsx-a11y/role-has-required-aria-props */
"use client";

import { cn } from "@/lib/utils";
import { ChevronDown, Loader2, X } from "lucide-react";
import * as React from "react";
import { OptionIcon } from "../../input/OptionIcon";

interface AutocompleteTriggerProps<T> {
  open: boolean;
  setOpen: (open: boolean) => void;
  disabled: boolean;
  hasError: boolean;
  isLoading: boolean;
  hasValue: boolean;
  showClearButton: boolean;
  selectedOption?: T;
  search: string;
  setSearch: (val: string) => void;
  placeholder: string;
  labelKey: keyof T;
  iconKey: keyof T;
  indicatorIcon?: React.ReactNode;
  render?: (option: T) => React.ReactNode;
  renderTriggerAsCustom?: boolean;
  sizeStyle: { trigger: string; text: string; chevron: string; clear: string };
  triggerClass: string;
  inputClass: string;
  inputRef: React.RefObject<HTMLInputElement | null>;
  handlers: {
    handleTriggerKeyDown: (e: React.KeyboardEvent) => void;
    handleInputClick: (e: React.MouseEvent) => void;
    handleInputKeyDown: (e: React.KeyboardEvent) => void;
    handleClearSearch: (e: React.MouseEvent) => void;
    handleClearValue: (e: React.MouseEvent) => void;
  };
  isSolid: boolean;
}

// Menggunakan forwardRef agar kompatibel langsung dengan <PopoverTrigger asChild> tanpa pembungkus div tambahan
export const AutocompleteTrigger = React.forwardRef<
  HTMLDivElement,
  AutocompleteTriggerProps<any>
>(function AutocompleteTrigger(
  {
    open,
    setOpen,
    disabled,
    hasError,
    isLoading,
    hasValue,
    showClearButton,
    selectedOption,
    search,
    setSearch,
    placeholder,
    labelKey,
    iconKey,
    indicatorIcon,
    render,
    renderTriggerAsCustom = false,
    sizeStyle: s,
    triggerClass,
    inputClass,
    inputRef,
    handlers,
    isSolid,
  },
  ref,
) {
  const inputDisplayValue = open
    ? search
    : selectedOption
      ? String(selectedOption[labelKey])
      : search;

  const activePlaceholder = open
    ? selectedOption
      ? String(selectedOption[labelKey])
      : placeholder
    : placeholder;

  return (
    <div
      ref={ref}
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
      )}
    >
      <div className="flex min-w-0 flex-1 items-center gap-2 text-start truncate">
        {isLoading && (
          <Loader2 className="h-5 w-5 shrink-0 animate-spin text-muted-foreground" />
        )}

        {render && selectedOption && !open && renderTriggerAsCustom ? (
          <div className="flex-1 min-w-0 truncate">
            {render(selectedOption)}
          </div>
        ) : (
          <>
            {indicatorIcon && !(iconKey && selectedOption?.[iconKey]) && (
              <div className="flex shrink-0 items-center text-muted-foreground">
                {indicatorIcon}
              </div>
            )}

            {iconKey && selectedOption?.[iconKey] && (
              <OptionIcon
                icon={selectedOption[iconKey]}
                size={20}
                alt={String(selectedOption?.[labelKey]) || ""}
                className="opacity-68 shrink-0"
              />
            )}

            <input
              ref={inputRef}
              type="text"
              value={inputDisplayValue}
              onChange={(e) => !disabled && setSearch(e.target.value)}
              onClick={handlers.handleInputClick}
              onKeyDown={handlers.handleInputKeyDown}
              disabled={disabled}
              tabIndex={-1}
              placeholder={activePlaceholder}
              className={cn(
                "min-w-0 flex-1 truncate bg-transparent disabled:cursor-not-allowed",
                s.text,
                inputClass,
              )}
            />
          </>
        )}
      </div>

      <div className="flex shrink-0 items-center gap-1.5">
        {showClearButton && hasValue && !disabled && (
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
            className="flex items-center justify-center rounded-sm p-0.5 text-muted-foreground transition-all duration-150 hover:text-foreground"
          >
            <X
              className={cn(
                isSolid ? "h-6 w-6 stroke-[2.5]" : s.clear,
                hasValue ? "opacity-60" : "opacity-20",
              )}
            />
          </button>
        )}

        <ChevronDown
          className={cn(
            "shrink-0 text-muted-foreground transition-all duration-150",
            isSolid ? "h-8 w-8 stroke-[2.5]" : s.chevron,
            open && "rotate-180",
            hasValue ? "opacity-60" : "opacity-20",
          )}
        />
      </div>
    </div>
  );
});
