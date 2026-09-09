"use client";

import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { FilterOption } from "./Constant";
import { FilterItem } from "./FilterItem";
import { FilterOptions } from "./FilterOptions";

interface SearchFilterBarProps<TData, TParams extends Record<string, unknown>> {
  searchValue: string;
  onSearchChange: (value: string) => void;
  searchPlaceholder?: string;
  filterOptions?: FilterOption<TData>[];
  selectedOptions: FilterOption<TData>[];
  setSelectedOptions: React.Dispatch<
    React.SetStateAction<FilterOption<TData>[]>
  >;
  filterValues: Partial<TParams>;
  setFilterValues: React.Dispatch<React.SetStateAction<Partial<TParams>>>;
  filterToParamKey?: Record<string, keyof TParams>;
}

export function SearchFilterBar<
  TData,
  TParams extends Record<string, unknown>,
>({
  searchValue,
  onSearchChange,
  searchPlaceholder,
  filterOptions,
  selectedOptions,
  setSelectedOptions,
  filterValues,
  setFilterValues,
  filterToParamKey,
}: SearchFilterBarProps<TData, TParams>) {
  const t = useTranslations("common.display_table");
  const [filtersOpen, setFiltersOpen] = useState(false);

  const handleRemoveFilter = (option: FilterOption<TData>) => {
    setSelectedOptions((prev) => prev.filter((o) => o.id !== option.id));
  };

  const hasFilterOptions = Boolean(filterOptions && filterOptions.length > 0);

  return (
    <div className="space-y-2.5">
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={searchValue}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder={searchPlaceholder ?? t("search_placeholder")}
            className="h-11 rounded-full border-border bg-secondary/30 pl-10 text-sm shadow-none focus-visible:bg-background"
          />
        </div>

        {hasFilterOptions && (
          <button
            type="button"
            onClick={() => setFiltersOpen((o) => !o)}
            className={cn(
              "flex h-11 shrink-0 items-center gap-1.5 rounded-full border px-4 text-sm font-medium transition-colors",
              filtersOpen || selectedOptions.length > 0
                ? "border-primary/40 bg-primary/10 text-primary"
                : "border-border text-muted-foreground hover:bg-secondary/60",
            )}
          >
            <SlidersHorizontal className="h-3.5 w-3.5" />
            {t("filters")}
            {selectedOptions.length > 0 && (
              <span className="flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                {selectedOptions.length}
              </span>
            )}
          </button>
        )}
      </div>

      {hasFilterOptions && filtersOpen && (
        <div className="flex flex-wrap items-center gap-2 rounded-2xl border border-dashed border-border/70 p-3">
          <FilterOptions
            options={filterOptions!}
            selectedOptions={selectedOptions}
            setSelectedOptions={setSelectedOptions}
          />
          {selectedOptions.map((option) => (
            <FilterItem
              key={option.id as string}
              option={option}
              filterValues={filterValues}
              setFilterValues={setFilterValues}
              filterToParamKey={filterToParamKey!}
              onRemove={handleRemoveFilter}
            />
          ))}
          {selectedOptions.length === 0 && (
            <span className="text-xs text-muted-foreground">
              {t("no_filters_applied")}
            </span>
          )}
        </div>
      )}

      {!filtersOpen && selectedOptions.length > 0 && (
        <div className="flex flex-wrap items-center gap-1.5">
          {selectedOptions.map((option) => (
            <button
              key={option.id as string}
              type="button"
              onClick={() => setFiltersOpen(true)}
              className="flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary hover:bg-primary/15"
            >
              {option.title}
              <X
                className="h-3 w-3"
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemoveFilter(option);
                }}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
