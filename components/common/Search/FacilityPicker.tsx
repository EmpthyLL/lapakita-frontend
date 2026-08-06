"use client";

import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { FACILITIES } from "@/lib/data/schema/master/facility";

interface FacilityPickerProps {
  selected: string[];
  onToggle: (value: string) => void;
  /** "compact" for a smaller grid (e.g. used inside a denser filter panel) */
  size?: "default" | "compact";
}

export function FacilityPicker({
  selected,
  onToggle,
  size = "default",
}: FacilityPickerProps) {
  return (
    <div
      className={cn(
        "grid gap-3",
        size === "compact"
          ? "grid-cols-3 sm:grid-cols-4 lg:grid-cols-5"
          : "grid-cols-2 sm:grid-cols-3 lg:grid-cols-5",
      )}
    >
      {FACILITIES.map((facility) => {
        const active = selected.includes(facility.value);
        return (
          <button
            key={facility.value}
            type="button"
            onClick={() => onToggle(facility.value)}
            className={cn(
              "group relative flex flex-col items-center gap-2 overflow-hidden rounded-2xl border p-4 text-center transition-all",
              active
                ? "border-primary bg-primary-secondary shadow-sm"
                : "border-border bg-card hover:border-primary/40 hover:bg-secondary/50",
            )}
          >
            {active && (
              <span className="absolute right-2 top-2 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-white">
                <Check className="h-3 w-3" />
              </span>
            )}
            <span
              className={cn(
                "flex h-14 w-14 items-center justify-center rounded-xl transition-colors",
                active
                  ? "bg-primary text-white"
                  : "bg-secondary text-muted-foreground group-hover:text-primary",
              )}
            >
              <facility.icon className="h-7 w-7" />
            </span>
            <span
              className={cn(
                "text-xs font-medium leading-tight",
                active ? "text-primary" : "text-foreground",
              )}
            >
              {facility.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
