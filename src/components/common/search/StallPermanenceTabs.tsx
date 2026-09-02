"use client";

import { cn } from "@/lib/utils";
import { Check } from "lucide-react";
import { STALL_PERMANENCE_TABS } from "./constants/permanance";
import { StallPermanenceType } from "./constants/types";

interface StallPermanenceTabsProps {
  value: StallPermanenceType;
  onChange: (value: StallPermanenceType) => void;
  mode?: "full" | "compact";
}

export function StallPermanenceTabs({
  value,
  onChange,
  mode = "full",
}: StallPermanenceTabsProps) {
  const active = STALL_PERMANENCE_TABS.find((t) => t.value === value);

  if (mode === "compact") {
    return (
      <div className="flex flex-wrap items-center gap-1.5 sm:flex-nowrap">
        {STALL_PERMANENCE_TABS.map((tab) => {
          const isActive = tab.value === value;
          const Icon = tab.icon;

          return (
            <button
              key={tab.value}
              type="button"
              onClick={() => onChange(tab.value)}
              className={cn(
                "group relative flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-semibold transition-all outline-none",
                isActive
                  ? "bg-primary text-primary-foreground shadow-sm shadow-primary/20 ring-2 ring-primary/20"
                  : "border border-border/60 bg-secondary/30 text-muted-foreground hover:border-primary/40 hover:bg-secondary/60 hover:text-foreground",
              )}
            >
              <Icon
                className={cn(
                  "size-4 shrink-0 transition-colors",
                  isActive
                    ? "text-primary-foreground"
                    : "text-muted-foreground group-hover:text-primary",
                )}
              />
              <span>{tab.shortLabel}</span>
            </button>
          );
        })}
      </div>
    );
  }

  return (
    <div>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {STALL_PERMANENCE_TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = tab.value === value;

          return (
            <button
              key={tab.value}
              type="button"
              onClick={() => onChange(tab.value)}
              aria-pressed={isActive}
              className={cn(
                "group relative flex items-start gap-3 overflow-hidden rounded-2xl border p-4 text-left transition-all outline-none",
                isActive
                  ? "border-primary bg-primary/6 shadow-sm ring-1 ring-primary"
                  : "border-border bg-card hover:border-primary/40 hover:bg-secondary/30",
              )}
            >
              <span
                className={cn(
                  "absolute inset-y-0 left-0 w-1 transition-colors",
                  isActive ? "bg-primary" : "bg-transparent",
                )}
              />

              <span
                className={cn(
                  "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl transition-colors",
                  isActive
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "bg-secondary text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary",
                )}
              >
                <Icon className="h-5 w-5" />
              </span>

              <span className="min-w-0 flex-1">
                <span className="flex items-center gap-1.5">
                  <span
                    className={cn(
                      "text-sm font-bold leading-tight",
                      isActive ? "text-primary" : "text-foreground",
                    )}
                  >
                    {tab.shortLabel}
                  </span>
                  {isActive && (
                    <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
                      <Check className="h-2.5 w-2.5 stroke-3" />
                    </span>
                  )}
                </span>
                <span
                  className={cn(
                    "mt-1 block text-xs leading-snug",
                    isActive ? "text-primary/80" : "text-muted-foreground",
                  )}
                >
                  {tab.description}
                </span>
              </span>
            </button>
          );
        })}
      </div>

      {active && (
        <div className="mt-3 flex items-center gap-2.5 rounded-xl bg-primary/10 px-3.5 py-2.5">
          <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
            <active.icon className="h-3.5 w-3.5" />
          </span>
          <p className="text-xs font-medium text-primary">
            <span className="font-bold">{active.label}.</span> All filters below
            are scoped to this category.
          </p>
        </div>
      )}
    </div>
  );
}
