"use client";

import { RangeInput } from "../../input/RangeInput";
import { SegmentedToggle } from "../../input/SegmentedToggle";
import { STALL_PLACEMENT_OPTIONS } from "../constants/permanance";
import { FLOOR_COUNT_RANGE, STALL_SIZE_RANGE } from "../constants/range";
import { StallPlacement } from "../constants/types";

const SHORT_LABEL: Record<StallPlacement, string> = {
  indoor: "Indoor",
  "semi-outdoor": "Semi-Outdoor",
  outdoor: "Outdoor",
};

interface PermanentSpaceFieldsProps {
  allowedPlacements: StallPlacement[];
  placement: StallPlacement | "";
  onPlacementChange: (value: StallPlacement | "") => void;
  floorCount: [number, number];
  onFloorCountChange: (value: [number, number]) => void;
  stallSize: [number, number];
  onStallSizeChange: (value: [number, number]) => void;
}

export function PermanentSpaceFields({
  allowedPlacements,
  placement,
  onPlacementChange,
  floorCount,
  onFloorCountChange,
  stallSize,
  onStallSizeChange,
}: PermanentSpaceFieldsProps) {
  const placementOptions = STALL_PLACEMENT_OPTIONS.filter((opt) =>
    allowedPlacements.includes(opt.value),
  ).map((opt) => ({
    value: opt.value,
    label: opt.label,
    shortLabel: SHORT_LABEL[opt.value],
  }));

  return (
    <div className="flex flex-col gap-5">
      <div>
        <p className="mb-2 text-xs font-semibold text-muted-foreground">
          Stall Placement
        </p>
        {placementOptions.length > 0 ? (
          <SegmentedToggle
            value={placement}
            onChange={onPlacementChange}
            options={placementOptions}
          />
        ) : (
          <p className="rounded-lg border border-dashed border-border p-3 text-center text-[11px] text-muted-foreground">
            Select a property type to view placement options.
          </p>
        )}
      </div>

      <RangeInput
        label="Number of Floors"
        min={FLOOR_COUNT_RANGE.min}
        max={FLOOR_COUNT_RANGE.max}
        step={FLOOR_COUNT_RANGE.step}
        value={floorCount}
        onChange={onFloorCountChange}
        formatValue={(n) => `${n} floor${n > 1 ? "s" : ""}`}
        suffix=" floor"
      />

      <RangeInput
        label="Stall Size"
        min={STALL_SIZE_RANGE.min}
        max={STALL_SIZE_RANGE.max}
        step={STALL_SIZE_RANGE.step}
        value={stallSize}
        onChange={onStallSizeChange}
        formatValue={(n) => `${n} m²`}
        suffix=" m²"
      />
    </div>
  );
}
