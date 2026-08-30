"use client";

import { AreaHistoryItemResponse } from "@/lib/data/schema/master/area_history";
import {
  AreaGeneralResponseData,
  AreaType,
} from "@/lib/data/schema/master/location";
import { Clock, Loader2, Trash2, type LucideIcon } from "lucide-react";
import { RefObject } from "react";
import { LocationHistoryItem } from "./LocationHistoryItem";
import { LocationSearchResultItem } from "./LocationSearchResultItem";

interface AreaTypeConfig {
  icon: LucideIcon;
  label: string;
  iconClass: string;
  bgClass: string;
}

interface LocationAutocompleteDropdownProps {
  dropdownRef: RefObject<HTMLDivElement | null>;
  filteredHistories: AreaHistoryItemResponse[];
  liveSuggestions: AreaGeneralResponseData[];
  isSearchValid: boolean;
  isSearchLoading: boolean;
  isFetchingNextPage: boolean;
  isClearPending: boolean;
  activeIndex: number;
  areaTypeConfig: Record<AreaType, AreaTypeConfig>;
  onScroll: (e: React.UIEvent<HTMLDivElement>) => void;
  onSelectSuggestion: (area: AreaGeneralResponseData) => void;
  onClearHistory: () => void;
  onDeleteHistoryItem: (fullLabel: string) => void;
}

export function LocationAutocompleteDropdown({
  dropdownRef,
  filteredHistories,
  liveSuggestions,
  isSearchValid,
  isSearchLoading,
  isFetchingNextPage,
  isClearPending,
  activeIndex,
  areaTypeConfig,
  onScroll,
  onSelectSuggestion,
  onClearHistory,
  onDeleteHistoryItem,
}: LocationAutocompleteDropdownProps) {
  const hasHistory = filteredHistories && filteredHistories.length > 0;
  const hasLiveResults = liveSuggestions && liveSuggestions.length > 0;

  return (
    <div
      ref={dropdownRef}
      onScroll={onScroll}
      className="absolute left-0 right-0 top-full z-50 mt-1.5 max-h-80 overflow-y-auto rounded-xl border border-border bg-popover p-1.5 shadow-lg space-y-2"
    >
      {/* ── SECTION 1: RECENT SEARCHES (HISTORY) ATAS ── */}
      {hasHistory && (
        <div className="space-y-1">
          <div className="flex items-center justify-between px-2.5 py-1 text-[11px] font-semibold text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <Clock className="size-3 text-primary" />
              <span>Recent Searches</span>
            </div>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onClearHistory();
              }}
              disabled={isClearPending}
              className="flex items-center gap-1 text-[10px] font-medium text-destructive hover:underline outline-none disabled:opacity-50 cursor-pointer"
            >
              <Trash2 className="size-3 text-destructive" />
              <span>Clear All</span>
            </button>
          </div>

          {filteredHistories.map((area, i) => (
            <LocationHistoryItem
              key={`history-${area.type}-${area.full_label}-${i}`}
              area={area}
              isSelected={i === activeIndex}
              config={areaTypeConfig[area.type] ?? areaTypeConfig.street}
              onSelect={onSelectSuggestion}
              onDelete={onDeleteHistoryItem}
            />
          ))}
        </div>
      )}

      {/* SEPARATOR HANYA BILA DUA-DUANYA TAMPIL */}
      {hasHistory && isSearchValid && <div className="mx-2 h-px bg-border" />}

      {/* ── SECTION 2: LIVE SEARCH RESULTS BAHWA ── */}
      {isSearchValid && (
        <div className="space-y-1">
          <div className="px-2.5 py-1 text-[11px] font-semibold text-muted-foreground">
            Search Results
          </div>

          {hasLiveResults
            ? liveSuggestions.map((area, i) => {
                const globalIdx =
                  (hasHistory ? filteredHistories.length : 0) + i;
                return (
                  <LocationSearchResultItem
                    key={`live-${area.type}-${area.full_label}-${i}`}
                    area={area}
                    isSelected={globalIdx === activeIndex}
                    config={areaTypeConfig[area.type] ?? areaTypeConfig.street}
                    onSelect={onSelectSuggestion}
                  />
                );
              })
            : !isSearchLoading && (
                <div className="p-3 text-center text-xs text-muted-foreground">
                  No locations found
                </div>
              )}

          {isFetchingNextPage && (
            <div className="flex items-center justify-center p-2">
              <Loader2 className="size-4 animate-spin text-primary" />
            </div>
          )}
        </div>
      )}

      {/* EMPTY STATE: HANYA DITAMPILKAN JIKA TIDAK ADA HISTORY SAMA SEKALI & BELUM GET KETIK 3 KARAKTER */}
      {!hasHistory && !isSearchValid && (
        <div className="p-4 text-center text-xs text-muted-foreground">
          Type at least 3 characters to search locations
        </div>
      )}
    </div>
  );
}
