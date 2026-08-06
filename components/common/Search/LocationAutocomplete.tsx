/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useEffect, useRef, useState } from "react";
import {
  MapPin,
  Loader2,
  Building,
  Map as MapIcon,
  MapPinned,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import {
  LocationSuggestion,
  searchLocations,
} from "@/lib/data/schema/master/location";
import { useDebounce } from "@/hooks/use-bounce";

const TYPE_ICON = {
  street: MapPinned,
  area: MapIcon,
  city: Building,
} as const;

interface LocationAutocompleteProps {
  value: string;
  onChange: (value: string) => void;
  /** Fired on Enter, or when a suggestion is clicked — this is the "commit" search trigger. */
  onCommit: (value: string) => void;
  placeholder?: string;
  className?: string;
  inputClassName?: string;
}

export function LocationAutocomplete({
  value,
  onChange,
  onCommit,
  placeholder = "Street, area, or city",
  className,
  inputClassName,
}: LocationAutocompleteProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<LocationSuggestion[]>([]);
  const [activeIndex, setActiveIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);

  const debouncedValue = useDebounce(value, 300);

  useEffect(() => {
    let cancelled = false;

    if (!debouncedValue.trim()) {
      setSuggestions([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    searchLocations(debouncedValue).then((results) => {
      if (!cancelled) {
        setSuggestions(results);
        setLoading(false);
      }
    });

    return () => {
      cancelled = true;
    };
  }, [debouncedValue]);

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
    onCommit(query);
    setOpen(false);
  }

  function selectSuggestion(suggestion: LocationSuggestion) {
    const label = `${suggestion.primary}, ${suggestion.secondary}`;
    onChange(label);
    commit(label);
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
        value={value}
        onChange={(e) => {
          onChange(e.target.value);
          setOpen(true);
          setActiveIndex(-1);
        }}
        onFocus={() => value.trim() && setOpen(true)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className={cn("pl-9", inputClassName)}
        autoComplete="off"
      />
      {loading && (
        <Loader2 className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin text-muted-foreground" />
      )}

      {open && suggestions.length > 0 && (
        <div className="absolute left-0 right-0 top-full z-50 mt-2 max-h-72 overflow-y-auto rounded-xl border border-border bg-card p-1.5 shadow-lg">
          {suggestions.map((s, i) => {
            const Icon = TYPE_ICON[s.type];
            return (
              <button
                key={s.id}
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => selectSuggestion(s)}
                className={cn(
                  "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm transition-colors",
                  i === activeIndex
                    ? "bg-primary-secondary"
                    : "hover:bg-secondary",
                )}
              >
                <Icon className="h-4 w-4 shrink-0 text-muted-foreground" />
                <span className="min-w-0 flex-1">
                  <span className="block truncate font-medium text-foreground">
                    {s.primary}
                  </span>
                  <span className="block truncate text-xs text-muted-foreground">
                    {s.secondary}
                  </span>
                </span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
