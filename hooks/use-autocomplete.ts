/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import * as React from "react";
import { useDebounce } from "./use-debounce";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface UseAutocompleteParams<T extends Record<string, any>> {
  value: string | number | null;
  onSelect: (value: string | number, option?: T) => void;
  options: T[];
  valueKey?: keyof T;
  labelKey?: keyof T;
  groupKey?: keyof T;
  /** Provide to do remote/server-side filtering instead of local filtering. */
  onFilterChange?: (query: string) => void;
  debounceDelay?: number;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function useAutocomplete<T extends Record<string, any>>({
  value,
  onSelect,
  options,
  valueKey = "value" as keyof T,
  labelKey = "label" as keyof T,
  groupKey,
  onFilterChange,
  debounceDelay = 300,
  open: controlledOpen,
  onOpenChange: controlledOnOpenChange,
}: UseAutocompleteParams<T>) {
  const [internalOpen, setInternalOpen] = React.useState(false);
  const [search, setSearch] = React.useState("");

  const commandListRef = React.useRef<HTMLDivElement>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const commandInputRef = React.useRef<HTMLInputElement>(null);
  const selectedItemRef = React.useRef<HTMLDivElement>(null);

  const open = controlledOpen !== undefined ? controlledOpen : internalOpen;
  const setOpen = controlledOnOpenChange ?? setInternalOpen;

  const debouncedSearch = useDebounce(search, debounceDelay);

  React.useEffect(() => {
    if (onFilterChange) onFilterChange(debouncedSearch);
  }, [debouncedSearch, onFilterChange]);

  const selectedOption = options.find(
    (option) => String(option[valueKey]) === String(value),
  );

  const filteredOptions = React.useMemo(() => {
    if (!search || onFilterChange) return options;
    return options.filter((option) =>
      String(option[labelKey]).toLowerCase().includes(search.toLowerCase()),
    );
  }, [options, search, labelKey, onFilterChange]);

  /** Group filtered options in first-appearance order. `null` group = ungrouped list. */
  const groupedOptions = React.useMemo(() => {
    if (!groupKey) return null;

    const groups = new Map<string, T[]>();
    for (const option of filteredOptions) {
      const groupLabel = String(option[groupKey] ?? "");
      if (!groups.has(groupLabel)) groups.set(groupLabel, []);
      groups.get(groupLabel)!.push(option);
    }
    return Array.from(groups.entries());
  }, [filteredOptions, groupKey]);

  const handleClearSearch = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSearch("");
    inputRef.current?.focus();
  };

  const handleClearValue = (e: React.MouseEvent) => {
    e.stopPropagation();
    onSelect("");
  };

  const handleInputClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setOpen(!open);
  };

  const handleTriggerKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      setOpen(!open);
    }
    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      e.preventDefault();
      if (!open) setOpen(true);
      forwardKeyToCommand(e.key, e.code);
    }
  };

  const handleInputKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Tab") {
      e.preventDefault();
      forwardKeyToCommand("Enter", "Enter");
      return;
    }
    if (e.key === "ArrowDown" || e.key === "ArrowUp" || e.key === "Enter") {
      e.preventDefault();
      if (!open) setOpen(true);
      forwardKeyToCommand(e.key, e.code);
    }
    if (e.key === " ") {
      e.stopPropagation();
    }
  };

  function forwardKeyToCommand(key: string, code: string) {
    commandInputRef.current?.dispatchEvent(
      new KeyboardEvent("keydown", {
        key,
        code,
        bubbles: true,
        cancelable: true,
      }),
    );
  }

  function selectOption(rawValue: string) {
    const selected = filteredOptions.find(
      (o) => String(o[valueKey]).toLowerCase() === rawValue.toLowerCase(),
    );
    if (selected) onSelect(selected[valueKey], selected);
    setOpen(false);
  }

  // scroll active/selected item into view when opened
  React.useEffect(() => {
    if (!open || value == null) return;
    const timer = setTimeout(() => {
      selectedItemRef.current?.scrollIntoView({
        block: "center",
        behavior: "instant",
      });
    }, 100);
    return () => clearTimeout(timer);
  }, [open, value]);

  // reset search on close, focus trigger input on open
  React.useEffect(() => {
    if (!open) {
      setSearch("");
    } else {
      setTimeout(() => inputRef.current?.focus(), 0);
      requestAnimationFrame(() => commandInputRef.current?.focus());
    }
  }, [open]);

  // let mouse wheel scroll the list without bubbling to page scroll
  React.useEffect(() => {
    if (!open) return;
    const timer = setTimeout(() => {
      const el = commandListRef.current;
      if (!el) return;
      const handleWheel = (e: WheelEvent) => {
        e.stopPropagation();
        el.scrollTop += e.deltaY;
      };
      el.addEventListener("wheel", handleWheel, { passive: true });
      return () => el.removeEventListener("wheel", handleWheel);
    }, 100);
    return () => clearTimeout(timer);
  }, [open]);

  return {
    open,
    setOpen,
    search,
    setSearch,
    selectedOption,
    filteredOptions,
    groupedOptions,
    refs: { commandListRef, inputRef, commandInputRef, selectedItemRef },
    handlers: {
      handleClearSearch,
      handleClearValue,
      handleInputClick,
      handleTriggerKeyDown,
      handleInputKeyDown,
      selectOption,
    },
  };
}
