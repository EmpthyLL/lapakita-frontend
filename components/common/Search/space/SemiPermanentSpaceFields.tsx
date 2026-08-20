"use client";

import { cn } from "@/lib/utils";
import { Clock } from "lucide-react";
import { SegmentedToggle } from "../../input/SegmentedToggle";
import { TimePicker } from "../../input/TimePicker";
import { STALL_PLACEMENT_OPTIONS } from "../constants/permanance";
import { OPERATING_HOURS_PRESETS } from "../constants/range";
import { StallPlacement } from "../constants/types";

const SHORT_LABEL: Record<StallPlacement, string> = {
  indoor: "Indoor",
  "semi-outdoor": "Semi-Outdoor",
  outdoor: "Outdoor",
};

interface SemiPermanentSpaceFieldsProps {
  allowedPlacements: StallPlacement[];
  placement: StallPlacement | "";
  onPlacementChange: (value: StallPlacement | "") => void;
  openingTime: string;
  onOpeningTimeChange: (value: string) => void;
  closingTime: string;
  onClosingTimeChange: (value: string) => void;
}

export function SemiPermanentSpaceFields({
  allowedPlacements,
  placement,
  onPlacementChange,
  openingTime,
  onOpeningTimeChange,
  closingTime,
  onClosingTimeChange,
}: SemiPermanentSpaceFieldsProps) {
  const placementOptions = STALL_PLACEMENT_OPTIONS.filter((opt) =>
    allowedPlacements.includes(opt.value),
  ).map((opt) => ({
    value: opt.value,
    label: opt.label,
    shortLabel: SHORT_LABEL[opt.value],
  }));

  return (
    <div className="flex flex-col gap-4">
      <p className="flex items-start gap-1.5 rounded-lg bg-primary/10 px-2.5 py-2 text-[11px] font-medium text-primary">
        <Clock className="mt-0.5 h-3 w-3 shrink-0" />
        Managed complexes follow the parent building&apos;s operating window.
      </p>

      {placementOptions.length > 0 && (
        <div>
          <p className="mb-2 text-xs font-semibold text-muted-foreground">
            Stall Placement
          </p>
          <SegmentedToggle
            value={placement}
            onChange={onPlacementChange}
            options={placementOptions}
          />
        </div>
      )}

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
