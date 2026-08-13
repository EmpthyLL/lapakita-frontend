"use client";

import { cn } from "@/lib/utils";
import { Check } from "lucide-react";
import { isLucideIcon, OptionIcon } from "../input/OptionIcon";
import { FACILITY_GROUPS } from "./SearchConstants";

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
    <div className="space-y-5">
      {FACILITY_GROUPS.map((group) => (
        <div key={group.group}>
          <p className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
            {group.group}
          </p>
          <div
            className={cn(
              "grid gap-3",
              size === "sidebar" && "grid-cols-2",
              size === "compact" && "grid-cols-3 sm:grid-cols-4 lg:grid-cols-5",
              size === "default" && "grid-cols-2 sm:grid-cols-3 lg:grid-cols-5",
            )}
          >
            {group.items.map((facility) => {
              const active = selected.includes(facility.value);
              const isPhoto = !isLucideIcon(facility.icon);

              return (
                <button
                  key={facility.value}
                  type="button"
                  onClick={() => onToggle(facility.value)}
                  className={cn(
                    "group relative flex flex-col items-center gap-2 overflow-hidden rounded-2xl border text-center transition-all outline-none",
                    isPhoto ? "p-0" : "p-4",
                    active
                      ? "border-primary bg-primary-secondary/40 ring-1 ring-primary shadow-xs"
                      : "border-border bg-card hover:border-primary/40 hover:bg-muted/50",
                  )}
                >
                  {active && (
                    <span className="absolute right-2 top-2 z-10 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-xs">
                      <Check className="h-3 w-3 stroke-[2.5]" />
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
                              ? "bg-primary/15"
                              : "bg-black/0 group-hover:bg-black/10",
                          )}
                        />
                      </div>
                      <span
                        className={cn(
                          "pb-3 text-xs font-semibold leading-tight transition-colors",
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
                          "flex h-12 w-12 items-center justify-center rounded-xl transition-colors",
                          active
                            ? "bg-primary/20 text-primary-foreground"
                            : "bg-muted text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary",
                        )}
                      >
                        <OptionIcon
                          icon={facility.icon}
                          size={24}
                          alt={facility.label}
                          className={active ? "text-primary" : ""}
                        />
                      </span>
                      <span
                        className={cn(
                          "text-xs font-semibold leading-tight transition-colors",
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
        </div>
      ))}
    </div>
  );
}
