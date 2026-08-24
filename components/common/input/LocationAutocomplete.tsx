/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { Input } from "@/components/ui/input";
import { useInfiniteSearch } from "@/hooks/use-infinite-search";
import {
  searchDetailLocation,
  searchGeneralLocations,
} from "@/lib/data/api/location";
import {
  AreaDetailResponseData,
  AreaGeneralResponseData,
  AreaType,
  GetAreaQuery,
} from "@/lib/data/schema/master/location";
import { cn } from "@/lib/utils";
import {
  Building2,
  CheckCircle2,
  Globe,
  Home,
  Landmark,
  Loader2,
  Map,
  MapPin,
  MapPinned,
  X,
  type LucideIcon,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";

interface AreaTypeConfig {
  icon: LucideIcon;
  label: string;
  iconClass: string;
  bgClass: string;
}

const AREA_TYPE_CONFIG: Record<AreaType, AreaTypeConfig> = {
  country: {
    icon: Globe,
    label: "Country",
    iconClass: "text-slate-600 dark:text-slate-300",
    bgClass: "bg-slate-100 dark:bg-slate-800",
  },
  province: {
    icon: Map,
    label: "Province",
    iconClass: "text-purple-600 dark:text-purple-400",
    bgClass: "bg-purple-100 dark:bg-purple-950/50",
  },
  city: {
    icon: Building2,
    label: "City",
    iconClass: "text-blue-600 dark:text-blue-400",
    bgClass: "bg-blue-100 dark:bg-blue-950/50",
  },
  district: {
    icon: Landmark,
    label: "District",
    iconClass: "text-teal-600 dark:text-teal-400",
    bgClass: "bg-teal-100 dark:bg-teal-950/50",
  },
  suburb: {
    icon: Home,
    label: "Suburb",
    iconClass: "text-amber-600 dark:text-amber-400",
    bgClass: "bg-amber-100 dark:bg-amber-950/50",
  },
  street: {
    icon: MapPinned,
    label: "Street",
    iconClass: "text-primary",
    bgClass: "bg-primary/10",
  },
};

export interface DetailedLocationFormValues {
  formatted: string;
  streetAddress: string;
  suburb: string;
  district: string;
  city: string;
  province: string;
  postalCode: string;
  latitude?: number;
  longitude?: number;
}

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
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState(value);
  const [activeIndex, setActiveIndex] = useState(-1);

  const [details, setDetails] = useState<DetailedLocationFormValues>({
    formatted: value,
    streetAddress: "",
    suburb: "",
    district: "",
    city: "",
    province: "",
    postalCode: "",
  });

  const containerRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setSearchTerm(value);
  }, [value]);

  // Hanya jalankan pencarian jika searchTerm lebih dari 2 karakter
  const isSearchValid = searchTerm.trim().length > 2;

  const {
    data: rawSuggestions,
    isLoading,
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

  const suggestions = isSearchValid ? rawSuggestions : [];

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

  function commit(query: string) {
    onCommit?.(query);
    setOpen(false);
  }

  async function selectSuggestion(area: AreaGeneralResponseData) {
    const selectedLabel = area.full_label;
    onChange(selectedLabel);
    setSearchTerm(selectedLabel);
    setOpen(false);

    if (mode === "detailed-form") {
      try {
        const detailRes = await searchDetailLocation({
          search: selectedLabel,
          limit: 1,
        });
        const detailData: AreaDetailResponseData | undefined =
          detailRes.data?.[0];

        const updatedDetails: DetailedLocationFormValues = {
          formatted: detailData?.formatted || selectedLabel,
          streetAddress: detailData?.street_address || area.title,
          suburb: detailData?.suburb || area.suburb || "",
          district: detailData?.district || area.district || "",
          city: detailData?.city || area.city || "",
          province: detailData?.province || area.province || "",
          postalCode: detailData?.postal_code || "",
          latitude: detailData?.latitude,
          longitude: detailData?.longitude,
        };

        setDetails(updatedDetails);
        onDetailedChange?.(updatedDetails);
      } catch {
        const fallbackDetails: DetailedLocationFormValues = {
          formatted: selectedLabel,
          streetAddress: area.title,
          suburb: area.suburb || "",
          district: area.district || "",
          city: area.city || "",
          province: area.province || "",
          postalCode: "",
        };
        setDetails(fallbackDetails);
        onDetailedChange?.(fallbackDetails);
      }
    } else {
      commit(selectedLabel);
    }
  }

  function handleClear() {
    onChange("");
    setSearchTerm("");
    setOpen(false);
    setActiveIndex(-1);
    setDetails({
      formatted: "",
      streetAddress: "",
      suburb: "",
      district: "",
      city: "",
      province: "",
      postalCode: "",
    });
    inputRef.current?.focus();
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (!open || suggestions.length === 0) {
      if (e.key === "Enter") commit(searchTerm);
      return;
    }

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, suggestions.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (activeIndex >= 0 && suggestions[activeIndex]) {
        selectSuggestion(suggestions[activeIndex]);
      } else {
        commit(searchTerm);
      }
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  }

  function handleDetailInputChange(
    field: keyof DetailedLocationFormValues,
    val: string,
  ) {
    const updated = { ...details, [field]: val };
    setDetails(updated);
    onDetailedChange?.(updated);
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
            setOpen(val.trim().length > 2);
            setActiveIndex(-1);
          }}
          onFocus={() => searchTerm.trim().length > 2 && setOpen(true)}
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
          {isLoading ? (
            <Loader2 className="size-4 animate-spin text-muted-foreground" />
          ) : (
            searchTerm.length > 0 && (
              <button
                type="button"
                onClick={handleClear}
                className="rounded-full p-0.5 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground outline-none"
              >
                <X className="size-3.5 stroke-[2.5]" />
                <span className="sr-only">Clear input</span>
              </button>
            )
          )}
        </div>

        {open && suggestions.length > 0 && (
          <div
            ref={dropdownRef}
            onScroll={handleScroll}
            className="absolute left-0 right-0 top-full z-50 mt-1.5 max-h-72 overflow-y-auto rounded-xl border border-border bg-popover p-1.5 shadow-lg"
          >
            {suggestions.map((area, i) => {
              const config =
                AREA_TYPE_CONFIG[area.type] ?? AREA_TYPE_CONFIG.street;
              const Icon = config.icon;
              return (
                <button
                  key={`${area.type}-${area.title}-${i}`}
                  type="button"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => selectSuggestion(area)}
                  className={cn(
                    "flex w-full items-center gap-3 rounded-lg px-2.5 py-2 text-left text-xs font-semibold transition-colors outline-none",
                    i === activeIndex
                      ? "bg-secondary text-foreground"
                      : "text-foreground hover:bg-secondary/60",
                  )}
                >
                  <span
                    className={cn(
                      "flex size-7 shrink-0 items-center justify-center rounded-md border border-border/50",
                      config.bgClass,
                    )}
                  >
                    <Icon className={cn("size-3.5", config.iconClass)} />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="flex items-center gap-1.5">
                      <span className="truncate font-semibold text-foreground">
                        {area.title}
                      </span>
                      <span
                        className={cn(
                          "shrink-0 rounded-md px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider",
                          config.bgClass,
                          config.iconClass,
                        )}
                      >
                        {t(`types.${area.type}`)}
                      </span>
                    </span>
                    <span className="block truncate text-[11px] font-normal text-muted-foreground mt-0.5">
                      {area.subtitle}
                    </span>
                  </span>
                </button>
              );
            })}

            {isFetchingNextPage && (
              <div className="flex items-center justify-center p-2 text-muted-foreground">
                <Loader2 className="size-4 animate-spin" />
              </div>
            )}
          </div>
        )}
      </div>

      {mode === "detailed-form" && (
        <div className="rounded-xl border border-border bg-card/60 p-4 space-y-3 animate-in fade-in zoom-in-95">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-primary">
            <CheckCircle2 className="size-4" />
            <span>{t("auto_filled")}</span>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className="text-[11px] font-semibold text-muted-foreground">
                {t("street_address")}
              </label>
              <Input
                value={details.streetAddress}
                onChange={(e) =>
                  handleDetailInputChange("streetAddress", e.target.value)
                }
                className="mt-1 h-9 text-xs"
              />
            </div>

            <div>
              <label className="text-[11px] font-semibold text-muted-foreground">
                {t("suburb")}
              </label>
              <Input
                value={details.suburb}
                onChange={(e) =>
                  handleDetailInputChange("suburb", e.target.value)
                }
                className="mt-1 h-9 text-xs"
              />
            </div>

            <div>
              <label className="text-[11px] font-semibold text-muted-foreground">
                {t("district")}
              </label>
              <Input
                value={details.district}
                onChange={(e) =>
                  handleDetailInputChange("district", e.target.value)
                }
                className="mt-1 h-9 text-xs"
              />
            </div>

            <div>
              <label className="text-[11px] font-semibold text-muted-foreground">
                {t("city")}
              </label>
              <Input
                value={details.city}
                onChange={(e) =>
                  handleDetailInputChange("city", e.target.value)
                }
                className="mt-1 h-9 text-xs"
              />
            </div>

            <div>
              <label className="text-[11px] font-semibold text-muted-foreground">
                {t("province")}
              </label>
              <Input
                value={details.province}
                onChange={(e) =>
                  handleDetailInputChange("province", e.target.value)
                }
                className="mt-1 h-9 text-xs"
              />
            </div>

            <div>
              <label className="text-[11px] font-semibold text-muted-foreground">
                {t("postal_code")}
              </label>
              <Input
                value={details.postalCode}
                onChange={(e) =>
                  handleDetailInputChange("postalCode", e.target.value)
                }
                className="mt-1 h-9 text-xs"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
