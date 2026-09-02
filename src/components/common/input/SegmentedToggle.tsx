"use client";

import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { Info } from "lucide-react";

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
  const selectedOption = options.find((opt) => opt.value === value);

  return (
    <div className="space-y-2">
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
                      "w-full min-w-0 rounded-lg px-2 py-2 text-xs font-semibold transition-all duration-200 select-none truncate",
                      isSelected
                        ? "bg-primary! text-primary-foreground! shadow-xs"
                        : "text-muted-foreground hover:bg-background/50 hover:text-foreground",
                    )}
                  >
                    <span className="truncate">{displayLabel}</span>
                  </ToggleGroupItem>
                </TooltipTrigger>
                <TooltipContent side="top" className="hidden lg:block text-xs">
                  {opt.label}
                </TooltipContent>
              </Tooltip>
            );
          })}
        </ToggleGroup>
      </TooltipProvider>

      {selectedOption && selectedOption.label !== selectedOption.shortLabel && (
        <div className="flex items-center gap-1.5 px-1.5 py-1 text-[11px] text-muted-foreground lg:hidden">
          <Info className="h-3.5 w-3.5 shrink-0 text-primary/70" />
          <span>
            <span className="font-semibold text-foreground">
              {selectedOption.label}
            </span>
          </span>
        </div>
      )}
    </div>
  );
}
