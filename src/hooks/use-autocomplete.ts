/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import * as React from "react";
import { useDebounce } from "./use-debounce";
import { ApiResponse, useInfiniteSearch } from "./use-infinite-search";

export interface AutocompleteAsyncConfig<
  TData,
  TQuery extends Record<string, any> = Record<string, any>,
> {
  queryFn: (params: TQuery) => Promise<ApiResponse<TData>>;
  queryKey: readonly any[];
  params?: TQuery;
  searchKey?: keyof TQuery;
  initialLimit?: number;
}

export interface UseAutocompleteParams<
  TData,
  TQuery extends Record<string, any> = Record<string, any>,
> {
  value: string | number | null;
  onSelect: (value: string | number, option?: TData) => void;
  options?: TData[];
  asyncConfig?: AutocompleteAsyncConfig<TData, TQuery>;
  valueKey?: keyof TData;
  labelKey?: keyof TData;
  groupKey?: keyof TData;
  debounceDelay?: number;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function useAutocomplete<
  TData extends Record<string, any>,
  TQuery extends Record<string, any> = Record<string, any>,
>({
  value,
  onSelect,
  options: staticOptions = [],
  asyncConfig,
  valueKey = "value" as keyof TData,
  labelKey = "label" as keyof TData,
  groupKey,
  debounceDelay = 300,
  open: controlledOpen,
  onOpenChange: controlledOnOpenChange,
}: UseAutocompleteParams<TData, TQuery>) {
  const [internalOpen, setInternalOpen] = React.useState(false);
  const [search, setSearch] = React.useState("");

  const commandListRef = React.useRef<HTMLDivElement>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const commandInputRef = React.useRef<HTMLInputElement>(null);
  const selectedItemRef = React.useRef<HTMLDivElement>(null);

  const open = controlledOpen !== undefined ? controlledOpen : internalOpen;
  const setOpen = controlledOnOpenChange ?? setInternalOpen;

  const debouncedSearch = useDebounce(search, debounceDelay);

  const infiniteQuery = useInfiniteSearch({
    queryKey: asyncConfig?.queryKey ?? [],
    queryFn: asyncConfig?.queryFn ?? (async () => []),
    search: debouncedSearch,
    searchKey: asyncConfig?.searchKey ?? ("search" as keyof TQuery),
    enabled: Boolean(asyncConfig),
    params: asyncConfig?.params,
    initialLimit: asyncConfig?.initialLimit ?? 10,
    selected_id: value !== null ? value : undefined,
  });

  const options = asyncConfig ? infiniteQuery.data : staticOptions;
  const isLoading = asyncConfig ? infiniteQuery.isLoading : false;
  const isFetchingNext = asyncConfig ? infiniteQuery.isFetchingNextPage : false;
  const isFetchingPrev = asyncConfig
    ? infiniteQuery.isFetchingPreviousPage
    : false;
  const hasNext = asyncConfig ? infiniteQuery.hasNextPage : false;
  const hasPrev = asyncConfig ? infiniteQuery.hasPreviousPage : false;

  const selectedOption = options.find(
    (option) => String(option[valueKey]) === String(value),
  );

  const filteredOptions = React.useMemo(() => {
    if (asyncConfig || !search) return options;
    return options.filter((option) =>
      String(option[labelKey]).toLowerCase().includes(search.toLowerCase()),
    );
  }, [options, search, labelKey, asyncConfig]);

  const groupedOptions = React.useMemo(() => {
    if (!groupKey) return null;
    const groups = new Map<string, TData[]>();
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
    const selected = options.find(
      (o) => String(o[valueKey]).toLowerCase() === rawValue.toLowerCase(),
    );
    if (selected) onSelect(selected[valueKey] as string | number, selected);
    setOpen(false);
  }

  React.useEffect(() => {
    if (!open) {
      setSearch("");
    } else {
      setTimeout(() => inputRef.current?.focus(), 0);
      requestAnimationFrame(() => commandInputRef.current?.focus());
    }
  }, [open]);

  return {
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
    fetchNext: asyncConfig ? infiniteQuery.fetchNextPage : undefined,
    fetchPrev: asyncConfig ? infiniteQuery.fetchPreviousPage : undefined,
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
