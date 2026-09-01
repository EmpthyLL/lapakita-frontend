/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { Input } from "@/components/ui/input";
import { useInfiniteSearch } from "@/hooks/use-infinite-search";
import {
  clearAreaHistory,
  deleteAreaHistoryItem,
  getAreaHistory,
  saveAreaHistory,
  searchDetailLocation,
  searchGeneralLocations,
} from "@/lib/data/api/location";
import { AreaHistoryItemResponse } from "@/lib/data/schema/master/area_history";
import {
  AreaGeneralResponseData,
  GetAreaQuery,
} from "@/lib/data/schema/master/location";
import { cn } from "@/lib/utils";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader2, MapPin, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";

import { LocationAutocompleteDropdown } from "./LocationAutocompleteDropdown";
import {
  AREA_TYPE_CONFIG,
  buildDetailedLocationValues,
  DetailedLocationFormValues,
} from "./LocationAutocompleteUtil";
import { LocationDetailedForm } from "./LocationDetailedForm";

interface LocationAutocompleteProps {
  mode?: "search" | "detailed-form";
  value: string;
  onChange: (value: string) => void;
  onCommit?: (value: string) => void;
  onDetailedChange?: (details: DetailedLocationFormValues) => void;
  placeholder?: string;
  hasError?: boolean;
  className?: string;
  inputClassName?: string;
}

export function LocationAutocomplete({
  mode = "search",
  value,
  onChange,
  onCommit,
  onDetailedChange,
  placeholder,
  hasError = false,
  className,
  inputClassName,
}: LocationAutocompleteProps) {
  const t = useTranslations("common.location_autocomplete");
  const queryClient = useQueryClient();

  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState(value);
  const [activeIndex, setActiveIndex] = useState(-1);

  const [details, setDetails] = useState<DetailedLocationFormValues>({
    formatted: value,
    street_address: "",
    suburb: "",
    district: "",
    city: "",
    province: "",
    postal_code: "",
  });

  const containerRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setSearchTerm(value);
  }, [value]);

  // 1. History Query
  const { data: historyData } = useQuery({
    queryKey: ["location-history"],
    queryFn: getAreaHistory,
    staleTime: 1000 * 60 * 5,
  });

  const rawHistories: AreaHistoryItemResponse[] = historyData?.data || [];

  const filteredHistories = searchTerm.trim()
    ? rawHistories.filter((item) =>
        item.full_label.toLowerCase().includes(searchTerm.toLowerCase().trim()),
      )
    : rawHistories;

  // 2. Live Search Query
  const isSearchValid = searchTerm.trim().length > 2;
  const {
    data: rawSuggestions,
    isLoading: isSearchLoading,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
  } = useInfiniteSearch<AreaGeneralResponseData, GetAreaQuery>({
    queryKey: ["locations", searchTerm],
    queryFn: searchGeneralLocations,
    search: searchTerm,
    searchKey: "search",
    initialLimit: 10,
    enabled: isSearchValid,
  });

  const liveSuggestions = isSearchValid ? rawSuggestions : [];
  const allInteractiveItems = [...filteredHistories, ...liveSuggestions];

  // Mutasi History
  const saveHistoryMutation = useMutation({
    mutationFn: saveAreaHistory,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["location-history"] }),
  });

  const clearHistoryMutation = useMutation({
    mutationFn: clearAreaHistory,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["location-history"] }),
  });

  const deleteSingleHistoryMutation = useMutation({
    mutationFn: deleteAreaHistoryItem,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["location-history"] }),
  });

  function handleScroll(e: React.UIEvent<HTMLDivElement>) {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    if (
      hasNextPage &&
      !isFetchingNextPage &&
      scrollHeight - scrollTop - clientHeight <= 20
    ) {
      fetchNextPage();
    }
  }

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Simpan history & trigger commit hanya saat pilihan/Enter dilakukan
  async function selectSuggestion(area: AreaGeneralResponseData) {
    const selectedLabel = area.full_label;
    onChange(selectedLabel);
    setSearchTerm(selectedLabel);
    setOpen(false);

    // HANYA Simpan ke API History saat item terpilih/diklik
    saveHistoryMutation.mutate(area);

    if (mode === "detailed-form") {
      try {
        const detailRes = await searchDetailLocation({
          search: selectedLabel,
          limit: 1,
        });
        const updatedDetails = buildDetailedLocationValues(
          area,
          detailRes.data?.[0],
        );
        setDetails(updatedDetails);
        onDetailedChange?.(updatedDetails);
      } catch {
        const fallbackDetails = buildDetailedLocationValues(area);
        setDetails(fallbackDetails);
        onDetailedChange?.(fallbackDetails);
      }
    } else {
      onCommit?.(selectedLabel);
    }
  }

  function handleClear() {
    onChange("");
    setSearchTerm("");
    setOpen(true);
    setActiveIndex(-1);
    setDetails({
      formatted: "",
      street_address: "",
      suburb: "",
      district: "",
      city: "",
      province: "",
      postal_code: "",
    });
    inputRef.current?.focus();
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter") {
      e.preventDefault();

      // Kasus 1: Enter saat menyorot salah satu item di dropdown via panah keyboard
      if (open && activeIndex >= 0 && allInteractiveItems[activeIndex]) {
        selectSuggestion(allInteractiveItems[activeIndex]);
        return;
      }

      // Kasus 2: Enter langsung tanpa memilih dropdown (simpan teks pencarian yang ada)
      if (searchTerm.trim().length > 0) {
        onCommit?.(searchTerm);
        setOpen(false);
      }
      return;
    }

    if (!open || allInteractiveItems.length === 0) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, allInteractiveItems.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  }

  return (
    <div className="w-full space-y-4">
      <div ref={containerRef} className={cn("relative w-full", className)}>
        <MapPin
          className={cn(
            "pointer-events-none absolute left-3 top-1/2 z-10 size-4 -translate-y-1/2 transition-colors",
            hasError
              ? "text-destructive"
              : "text-muted-foreground group-data-[invalid=true]/field:text-destructive",
          )}
        />

        <Input
          ref={inputRef}
          value={searchTerm}
          hasError={hasError}
          onChange={(e) => {
            const val = e.target.value;
            setSearchTerm(val);
            onChange(val);
            setOpen(true);
            setActiveIndex(-1);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder || t("search_placeholder")}
          className={cn(
            "pl-9 pr-9 font-medium",
            mode === "search" ? "h-12 text-sm" : "h-10 text-xs",
            inputClassName,
          )}
          autoComplete="off"
        />

        <div className="absolute right-3 top-1/2 z-10 flex -translate-y-1/2 items-center gap-1">
          {isSearchLoading ? (
            <Loader2 className="size-4 animate-spin text-muted-foreground" />
          ) : (
            searchTerm.length > 0 && (
              <button
                type="button"
                onClick={handleClear}
                className="rounded-full p-0.5 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground outline-none cursor-pointer"
              >
                <X className="size-3.5 stroke-[2.5]" />
                <span className="sr-only">Clear input</span>
              </button>
            )
          )}
        </div>

        {open && (
          <LocationAutocompleteDropdown
            dropdownRef={dropdownRef}
            filteredHistories={filteredHistories}
            liveSuggestions={liveSuggestions}
            isSearchValid={isSearchValid}
            isSearchLoading={isSearchLoading}
            isFetchingNextPage={isFetchingNextPage}
            isClearPending={clearHistoryMutation.isPending}
            activeIndex={activeIndex}
            areaTypeConfig={AREA_TYPE_CONFIG}
            onScroll={handleScroll}
            onSelectSuggestion={selectSuggestion}
            onClearHistory={() => clearHistoryMutation.mutate()}
            onDeleteHistoryItem={(fullLabel) =>
              deleteSingleHistoryMutation.mutate(fullLabel)
            }
          />
        )}
      </div>

      {mode === "detailed-form" && (
        <LocationDetailedForm
          details={details}
          onChange={(field, val) => {
            const updated = { ...details, [field]: val };
            setDetails(updated);
            onDetailedChange?.(updated);
          }}
        />
      )}
    </div>
  );
}
