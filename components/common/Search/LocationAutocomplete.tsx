/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { Input } from "@/components/ui/input";
import { useDebounce } from "@/hooks/use-debounce";
import {
  searchLocations,
  type AreaGeneralResponseData,
} from "@/lib/data/schema/master/location";
import { cn } from "@/lib/utils";
import { Loader2, MapPin, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { AREA_TYPE_CONFIG } from "./util/LocationStyle";

interface LocationAutocompleteProps {
  value: string;
  onChange: (value: string) => void;
  onCommit: (value: string) => void;
  placeholder?: string;
  className?: string;
  inputClassName?: string;
}

export function LocationAutocomplete({
  value,
  onChange,
  onCommit,
  placeholder = "Street, district, city, or province",
  className,
  inputClassName,
}: LocationAutocompleteProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fetchingMore, setFetchingMore] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const [page, setPage] = useState(1);
  const [suggestions, setSuggestions] = useState<AreaGeneralResponseData[]>([]);
  const [activeIndex, setActiveIndex] = useState(-1);

  const containerRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const debouncedValue = useDebounce(value, 300);

  useEffect(() => {
    let cancelled = false;

    if (!debouncedValue.trim()) {
      setSuggestions([]);
      setLoading(false);
      setHasMore(false);
      setPage(1);
      return;
    }

    setLoading(true);
    setPage(1);

    searchLocations(debouncedValue, 1).then((res) => {
      if (!cancelled) {
        setSuggestions(res.results);
        setHasMore(res.hasMore);
        setLoading(false);
      }
    });

    return () => {
      cancelled = true;
    };
  }, [debouncedValue]);

  async function loadMore() {
    if (fetchingMore || !hasMore) return;
    setFetchingMore(true);
    const nextPage = page + 1;
    try {
      const res = await searchLocations(debouncedValue, nextPage);
      setSuggestions((prev) => [...prev, ...res.results]);
      setHasMore(res.hasMore);
      setPage(nextPage);
    } finally {
      setFetchingMore(false);
    }
  }

  function handleScroll(e: React.UIEvent<HTMLDivElement>) {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    if (scrollHeight - scrollTop - clientHeight <= 20) loadMore();
  }

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      )
        setOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function commit(query: string) {
    onCommit(query);
    setOpen(false);
  }

  function selectSuggestion(area: AreaGeneralResponseData) {
    onChange(area.fullLabel);
    commit(area.fullLabel);
  }

  function handleClear() {
    onChange("");
    setSuggestions([]);
    setOpen(false);
    setActiveIndex(-1);
    inputRef.current?.focus();
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (!open || suggestions.length === 0) {
      if (e.key === "Enter") commit(value);
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
      if (activeIndex >= 0) {
        selectSuggestion(suggestions[activeIndex]);
      } else {
        commit(value);
      }
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  }

  return (
    <div ref={containerRef} className={cn("relative", className)}>
      <MapPin className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        ref={inputRef}
        value={value}
        onChange={(e) => {
          onChange(e.target.value);
          setOpen(true);
          setActiveIndex(-1);
        }}
        onFocus={() => value.trim() && setOpen(true)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className={cn("pl-9 pr-9", inputClassName)}
        autoComplete="off"
      />

      {/* Right Controls: Loader or Clear Button */}
      <div className="absolute right-3 top-1/2 flex -translate-y-1/2 items-center gap-1">
        {loading ? (
          <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
        ) : (
          value.length > 0 && (
            <button
              type="button"
              onClick={handleClear}
              className="rounded-full p-0.5 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
            >
              <X className="h-4 w-4 stroke-[2.5] opacity-60" />
              <span className="sr-only">Clear input</span>
            </button>
          )
        )}
      </div>

      {open && suggestions.length > 0 && (
        <div
          ref={dropdownRef}
          onScroll={handleScroll}
          className="absolute left-0 right-0 top-full z-50 mt-2 max-h-72 overflow-y-auto rounded-xl border border-border bg-card p-1.5 shadow-lg"
        >
          {suggestions.map((area, i) => {
            const config = AREA_TYPE_CONFIG[area.type];
            const Icon = config.icon;
            return (
              <button
                key={`${area.type}-${area.title}-${i}`}
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => selectSuggestion(area)}
                className={cn(
                  "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm transition-colors",
                  i === activeIndex ? "bg-secondary" : "hover:bg-secondary/60",
                )}
              >
                <span
                  className={cn(
                    "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg",
                    config.bgClass,
                  )}
                >
                  <Icon className={cn("h-4 w-4", config.iconClass)} />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="flex items-center gap-1.5">
                    <span className="truncate font-medium text-foreground">
                      {area.title}
                    </span>
                    <span
                      className={cn(
                        "shrink-0 rounded-full px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide",
                        config.bgClass,
                        config.iconClass,
                      )}
                    >
                      {config.label}
                    </span>
                  </span>
                  <span className="block truncate text-xs text-muted-foreground">
                    {area.subtitle}
                  </span>
                </span>
              </button>
            );
          })}

          {fetchingMore && (
            <div className="flex items-center justify-center p-2 text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
