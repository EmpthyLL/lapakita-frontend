"use client";

import { cn } from "@/lib/utils";
import { CalendarClock, Timer } from "lucide-react";
import { useState } from "react";
import { NumberInput } from "../../input/NumberInput";
import { SegmentedToggle } from "../../input/SegmentedToggle";
import { STALL_PLACEMENT_OPTIONS } from "../constants/permanance";
import {
  EVENT_DURATION_PRESETS,
  REGISTRATION_DEADLINE_PRESETS,
} from "../constants/range";
import { StallPlacement } from "../constants/types";

const SHORT_LABEL: Record<StallPlacement, string> = {
  indoor: "Indoor",
  "semi-outdoor": "Semi-Outdoor",
  outdoor: "Outdoor",
};

interface TemporarySpaceFieldsProps {
  allowedPlacements: StallPlacement[];
  placement: StallPlacement | "";
  onPlacementChange: (value: StallPlacement | "") => void;
  registrationDeadlineDays: number | null;
  onRegistrationDeadlineDaysChange: (value: number) => void;
  eventDurationDays: number | null;
  onEventDurationDaysChange: (value: number) => void;
}

export function TemporarySpaceFields({
  allowedPlacements,
  placement,
  onPlacementChange,
  registrationDeadlineDays,
  onRegistrationDeadlineDaysChange,
  eventDurationDays,
  onEventDurationDaysChange,
}: TemporarySpaceFieldsProps) {
  const placementOptions = STALL_PLACEMENT_OPTIONS.filter((opt) =>
    allowedPlacements.includes(opt.value),
  ).map((opt) => ({
    value: opt.value,
    label: opt.label,
    shortLabel: SHORT_LABEL[opt.value],
  }));

  const isCustomDuration =
    eventDurationDays !== null &&
    !EVENT_DURATION_PRESETS.includes(
      eventDurationDays as (typeof EVENT_DURATION_PRESETS)[number],
    );
  const [durationMode, setDurationMode] = useState<"preset" | "custom">(
    isCustomDuration ? "custom" : "preset",
  );

  const isCustomDeadline =
    registrationDeadlineDays !== null &&
    !REGISTRATION_DEADLINE_PRESETS.includes(
      registrationDeadlineDays as (typeof REGISTRATION_DEADLINE_PRESETS)[number],
    );
  const [deadlineMode, setDeadlineMode] = useState<"preset" | "custom">(
    isCustomDeadline ? "custom" : "preset",
  );

  return (
    <div className="flex flex-col gap-5">
      <p className="flex items-start gap-1.5 rounded-lg bg-primary/10 px-2.5 py-2 text-[11px] font-medium text-primary">
        <CalendarClock className="mt-0.5 h-3 w-3 shrink-0" />
        Pop-up spots are schedule-bound. Filter by registration lead time and
        duration.
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

      <div>
        <p className="mb-2 flex items-center gap-1.5 text-xs font-semibold text-muted-foreground">
          <CalendarClock className="h-3.5 w-3.5" />
          Registration Deadline (H-X before start)
        </p>
        <div className="flex flex-wrap gap-1.5">
          {REGISTRATION_DEADLINE_PRESETS.map((days) => (
            <button
              key={days}
              type="button"
              onClick={() => {
                setDeadlineMode("preset");
                onRegistrationDeadlineDaysChange(days);
              }}
              className={cn(
                "rounded-full px-3 py-1 text-xs font-medium transition-colors",
                deadlineMode === "preset" && registrationDeadlineDays === days
                  ? "bg-primary text-white"
                  : "border border-border bg-secondary/50 text-muted-foreground hover:border-primary/40 hover:text-foreground",
              )}
            >
              H-{days}
            </button>
          ))}
          <button
            type="button"
            onClick={() => setDeadlineMode("custom")}
            className={cn(
              "rounded-full px-3 py-1 text-xs font-medium transition-colors",
              deadlineMode === "custom"
                ? "bg-primary text-white"
                : "border border-border bg-secondary/50 text-muted-foreground hover:border-primary/40 hover:text-foreground",
            )}
          >
            Custom
          </button>
        </div>
        {deadlineMode === "custom" && (
          <NumberInput
            suffix=" days before start"
            decimalScale={0}
            allowNegative={false}
            placeholder="e.g. 21"
            value={isCustomDeadline ? (registrationDeadlineDays ?? "") : ""}
            onValueChange={(v) =>
              v.floatValue !== undefined &&
              onRegistrationDeadlineDaysChange(v.floatValue)
            }
            className="mt-2 h-9 py-2 text-sm"
          />
        )}
      </div>

      <div>
        <p className="mb-2 flex items-center gap-1.5 text-xs font-semibold text-muted-foreground">
          <Timer className="h-3.5 w-3.5" />
          Event / Booth Duration
        </p>
        <div className="flex flex-wrap gap-1.5">
          {EVENT_DURATION_PRESETS.map((days) => (
            <button
              key={days}
              type="button"
              onClick={() => {
                setDurationMode("preset");
                onEventDurationDaysChange(days);
              }}
              className={cn(
                "rounded-full px-3 py-1 text-xs font-medium transition-colors",
                durationMode === "preset" && eventDurationDays === days
                  ? "bg-primary text-white"
                  : "border border-border bg-secondary/50 text-muted-foreground hover:border-primary/40 hover:text-foreground",
              )}
            >
              {days} day{days > 1 ? "s" : ""}
            </button>
          ))}
          <button
            type="button"
            onClick={() => setDurationMode("custom")}
            className={cn(
              "rounded-full px-3 py-1 text-xs font-medium transition-colors",
              durationMode === "custom"
                ? "bg-primary text-white"
                : "border border-border bg-secondary/50 text-muted-foreground hover:border-primary/40 hover:text-foreground",
            )}
          >
            Custom
          </button>
        </div>
        {durationMode === "custom" && (
          <>
            <NumberInput
              suffix=" days"
              decimalScale={0}
              allowNegative={false}
              placeholder="e.g. 45"
              value={isCustomDuration ? (eventDurationDays ?? "") : ""}
              onValueChange={(v) =>
                v.floatValue !== undefined &&
                onEventDurationDaysChange(v.floatValue)
              }
              className="mt-2 h-9 py-2 text-sm"
            />
            {typeof eventDurationDays === "number" &&
              eventDurationDays > 30 && (
                <p className="mt-1.5 text-[11px] text-muted-foreground">
                  {Math.round((eventDurationDays / 30) * 10) / 10} month
                  {eventDurationDays > 60 ? "s" : ""} — long-running booths like
                  this are usually priced monthly rather than per day.
                </p>
              )}
          </>
        )}
      </div>
    </div>
  );
}
