"use client";

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { cn } from "@/lib/utils";
import { Check, Loader2 } from "lucide-react";
import * as React from "react";
import { OptionIcon } from "../../input/OptionIcon";

interface AutocompleteListProps<T> {
  options: T[];
  filteredOptions: T[];
  groupedOptions: [string, T[]][] | null;
  value: string | number | null;
  valueKey: keyof T;
  labelKey: keyof T;
  searchKey: keyof T;
  iconKey: keyof T;
  emptyText: string;
  isLoading: boolean;
  isFetchingNext: boolean;
  isFetchingPrev: boolean;
  hasNext: boolean;
  hasPrev: boolean;
  fetchNext?: () => void;
  fetchPrev?: () => void;
  onFilterChange?: (query: string) => void;
  search: string;
  setSearch: (val: string) => void;
  disabled: boolean;
  render?: (option: T) => React.ReactNode;
  addButton?: React.ReactNode;
  isSolid: boolean;
  sizeStyle: { itemPad: string; itemText: string };
  refs: {
    commandListRef: React.RefObject<HTMLDivElement | null>;
    commandInputRef: React.RefObject<HTMLInputElement | null>;
    selectedItemRef: React.RefObject<HTMLDivElement | null>;
  };
  handlers: {
    selectOption: (value: string) => void;
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function AutocompleteList<T extends Record<string, any>>({
  filteredOptions,
  groupedOptions,
  value,
  valueKey,
  labelKey,
  searchKey,
  iconKey,
  emptyText,
  isLoading,
  isFetchingNext,
  isFetchingPrev,
  hasNext,
  hasPrev,
  fetchNext,
  fetchPrev,
  onFilterChange,
  search,
  setSearch,
  disabled,
  render,
  addButton,
  isSolid,
  sizeStyle: s,
  refs,
  handlers,
}: AutocompleteListProps<T>) {
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const el = e.currentTarget;
    const { scrollTop, scrollHeight, clientHeight } = el;

    if (
      hasNext &&
      fetchNext &&
      !isFetchingNext &&
      scrollHeight - scrollTop - clientHeight <= 20
    ) {
      fetchNext();
    }

    if (hasPrev && fetchPrev && !isFetchingPrev && scrollTop <= 20) {
      fetchPrev();
    }
  };

  const renderOptionRow = (option: T, isGrouped: boolean) => {
    const isSelected = String(value) === String(option[valueKey]);

    return (
      <CommandItem
        key={String(option[valueKey])}
        ref={isSelected ? refs.selectedItemRef : undefined}
        value={String(option[valueKey])}
        keywords={[
          String(option[labelKey]),
          String(option[searchKey]),
          String(option["name"] ?? ""),
          String(option["value"] ?? ""),
        ]}
        onSelect={handlers.selectOption}
        className={cn(
          "relative flex cursor-pointer items-center justify-between rounded-md transition-colors",
          s.itemPad,
          isGrouped && "pl-5",
          isSelected && "bg-primary/10 font-semibold text-primary",
        )}
      >
        {render ? (
          render(option)
        ) : (
          <div className="flex min-w-0 items-center gap-2">
            {iconKey && option[iconKey] && (
              <OptionIcon
                icon={option[iconKey]}
                size={18}
                alt={String(option[labelKey]) || ""}
              />
            )}
            <span
              className={cn(
                s.itemText,
                "truncate font-semibold",
                isSelected ? "text-primary" : "text-foreground",
              )}
            >
              {option[labelKey]}
            </span>
          </div>
        )}

        <Check
          className={cn(
            "h-4 w-4 shrink-0 text-primary opacity-0 transition-opacity",
            isSelected && "opacity-100",
          )}
        />
      </CommandItem>
    );
  };

  return (
    <Command
      shouldFilter={!onFilterChange}
      className="flex flex-col rounded-md"
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
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
        </div>
      ) : (
        <>
          <CommandList
            // eslint-disable-next-line react-hooks/refs
            ref={refs.commandListRef}
            onScroll={handleScroll}
            className="max-h-75 flex-1 overflow-y-auto overscroll-contain"
            style={{
              scrollbarWidth: "thin",
              scrollbarColor: isSolid
                ? "rgba(0,0,0,0.2) transparent"
                : "var(--border) transparent",
            }}
          >
            {isFetchingPrev && (
              <div className="flex items-center justify-center p-2 text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin text-primary" />
              </div>
            )}

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
                  {groupOptions.map((option) => renderOptionRow(option, true))}
                </CommandGroup>
              ))
            ) : (
              <CommandGroup className="p-0">
                {filteredOptions.map((option) =>
                  renderOptionRow(option, false),
                )}
              </CommandGroup>
            )}

            {isFetchingNext && (
              <div className="flex items-center justify-center p-2 text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin text-primary" />
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
  );
}
