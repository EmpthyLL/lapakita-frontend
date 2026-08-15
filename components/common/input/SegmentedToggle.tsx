"use client";

import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

export interface ToggleOption<T extends string = string> {
  value: T;
  label: string;
  shortLabel?: string;
}

interface SegmentedToggleProps<T extends string> {
  value: T | "";
  onChange: (value: T | "") => void;
  options: readonly ToggleOption<T>[] | ToggleOption<T>[];
  className?: string;
}

export function SegmentedToggle<T extends string>({
  value,
  onChange,
  options,
  className,
}: SegmentedToggleProps<T>) {
  return (
    <TooltipProvider delayDuration={200}>
      <ToggleGroup
        type="single"
        value={value}
        onValueChange={(v) => onChange((v as T) || "")}
        className={cn(
          "grid w-full grid-flow-col auto-cols-fr gap-1 rounded-xl border border-border bg-secondary/40 p-1",
          className,
        )}
      >
        {options.map((opt) => {
          const displayLabel = opt.shortLabel || opt.label;
          const isSelected = value === opt.value;

          return (
            <Tooltip key={opt.value}>
              <TooltipTrigger asChild>
                <ToggleGroupItem
                  value={opt.value}
                  className={cn(
                    "w-full min-w-0 rounded-lg px-2 py-1.5 text-xs font-semibold transition-all duration-200 select-none",
                    isSelected
                      ? "bg-primary! text-primary-foreground! shadow-xs"
                      : "text-muted-foreground hover:bg-background/50 hover:text-foreground",
                  )}
                >
                  <span className="block truncate">{displayLabel}</span>
                </ToggleGroupItem>
              </TooltipTrigger>
              <TooltipContent side="top" className="text-xs">
                {opt.label}
              </TooltipContent>
            </Tooltip>
          );
        })}
      </ToggleGroup>
    </TooltipProvider>
  );
}
