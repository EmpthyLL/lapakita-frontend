"use client";

import { FACILITIES } from "@/lib/data/schema/master/facility";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";
import { isLucideIcon, OptionIcon } from "../OptionIcon";

interface FacilityPickerProps {
  selected: string[];
  onToggle: (value: string) => void;
  size?: "default" | "compact" | "sidebar";
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
        size === "sidebar" && "grid-cols-2",
        size === "compact" && "grid-cols-3 sm:grid-cols-4 lg:grid-cols-5",
        size === "default" && "grid-cols-2 sm:grid-cols-3 lg:grid-cols-5",
      )}
    >
      {FACILITIES.map((facility) => {
        const active = selected.includes(facility.value);
        const isPhoto = !isLucideIcon(facility.icon);

        return (
          <button
            key={facility.value}
            type="button"
            onClick={() => onToggle(facility.value)}
            className={cn(
              "group relative flex flex-col items-center gap-2 overflow-hidden rounded-2xl border text-center transition-all",
              isPhoto ? "p-0" : "p-4",
              active
                ? "border-primary bg-primary-secondary shadow-sm"
                : "border-border bg-card hover:border-primary/40 hover:bg-secondary/50",
            )}
          >
            {active && (
              <span className="absolute right-2 top-2 z-10 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-white">
                <Check className="h-3 w-3" />
              </span>
            )}

            {isPhoto ? (
              <>
                <div className="relative h-20 w-full overflow-hidden">
                  <OptionIcon
                    icon={facility.icon}
                    size={200}
                    alt={facility.label}
                    className={cn(
                      "h-20! w-full! rounded-none object-cover transition-transform duration-200",
                      !active && "group-hover:scale-105",
                    )}
                  />
                  <div
                    className={cn(
                      "absolute inset-0 transition-colors",
                      active
                        ? "bg-primary/20"
                        : "bg-black/0 group-hover:bg-black/10",
                    )}
                  />
                </div>
                <span
                  className={cn(
                    "pb-3 text-xs font-medium leading-tight",
                    active ? "text-primary" : "text-foreground",
                  )}
                >
                  {facility.label}
                </span>
              </>
            ) : (
              <>
                <span
                  className={cn(
                    "flex h-14 w-14 items-center justify-center rounded-xl transition-colors",
                    active
                      ? "bg-primary text-white"
                      : "bg-secondary text-muted-foreground group-hover:text-primary",
                  )}
                >
                  <OptionIcon
                    icon={facility.icon}
                    size={28}
                    alt={facility.label}
                  />
                </span>
                <span
                  className={cn(
                    "text-xs font-medium leading-tight",
                    active ? "text-primary" : "text-foreground",
                  )}
                >
                  {facility.label}
                </span>
              </>
            )}
          </button>
        );
      })}
    </div>
  );
}
