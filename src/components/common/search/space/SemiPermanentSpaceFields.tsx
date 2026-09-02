"use client";

import { cn } from "@/lib/utils";
import { Clock } from "lucide-react";
import { TimePicker } from "../../input/TimePicker";
import { OPERATING_HOURS_PRESETS } from "../constants/range";

interface SemiPermanentSpaceFieldsProps {
  openingTime: string;
  onOpeningTimeChange: (value: string) => void;
  closingTime: string;
  onClosingTimeChange: (value: string) => void;
}

export function SemiPermanentSpaceFields({
  openingTime,
  onOpeningTimeChange,
  closingTime,
  onClosingTimeChange,
}: SemiPermanentSpaceFieldsProps) {
  return (
    <div className="flex flex-col gap-4">
      <p className="flex items-start gap-1.5 rounded-lg bg-primary/10 px-2.5 py-2 text-[11px] font-medium text-primary">
        <Clock className="mt-0.5 h-3 w-3 shrink-0" />
        Managed complexes follow the parent building&apos;s operating window.
      </p>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="mb-1.5 block text-xs font-semibold text-muted-foreground">
            Opening Time
          </label>
          <TimePicker
            value={openingTime}
            onChange={onOpeningTimeChange}
            maxTime={closingTime || undefined}
          />
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-semibold text-muted-foreground">
            Closing Time
          </label>
          <TimePicker
            value={closingTime}
            onChange={onClosingTimeChange}
            minTime={openingTime || undefined}
          />
        </div>
      </div>

      <div>
        <p className="mb-2 text-xs font-semibold text-muted-foreground">
          Common Presets
        </p>
        <div className="flex flex-wrap gap-1.5">
          {OPERATING_HOURS_PRESETS.map((preset) => {
            const active =
              openingTime === preset.openingTime &&
              closingTime === preset.closingTime;
            return (
              <button
                key={preset.label}
                type="button"
                onClick={() => {
                  onOpeningTimeChange(preset.openingTime);
                  onClosingTimeChange(preset.closingTime);
                }}
                className={cn(
                  "rounded-full px-3 py-1 text-xs font-medium transition-colors outline-none",
                  active
                    ? "bg-primary text-white"
                    : "border border-border bg-secondary/50 text-muted-foreground hover:border-primary/40 hover:text-foreground",
                )}
              >
                {preset.label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
