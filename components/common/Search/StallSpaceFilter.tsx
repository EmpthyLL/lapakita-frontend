"use client";

import { RangeInput } from "../input/RangeInput";
import { SegmentedToggle } from "../input/SegmentedToggle";
import {
  FLOOR_COUNT_RANGE,
  STALL_PLACEMENT_OPTIONS,
  STALL_SIZE_RANGE,
  StallPlacement,
} from "./SearchConstants";

interface StallSpaceFilterProps {
  placement: StallPlacement | "";
  onPlacementChange: (value: StallPlacement | "") => void;
  floorCount: [number, number];
  onFloorCountChange: (value: [number, number]) => void;
  stallSize: [number, number];
  onStallSizeChange: (value: [number, number]) => void;
}

const SHORT_LABEL: Record<StallPlacement, string> = {
  indoor: "Indoor",
  "semi-outdoor": "Semi-Outdoor",
  outdoor: "Outdoor",
};

export function StallSpaceFilter({
  placement,
  onPlacementChange,
  floorCount,
  onFloorCountChange,
  stallSize,
  onStallSizeChange,
}: StallSpaceFilterProps) {
  const placementOptions = STALL_PLACEMENT_OPTIONS.map((opt) => ({
    value: opt.value as StallPlacement,
    label: opt.label,
    shortLabel: SHORT_LABEL[opt.value as StallPlacement],
  }));

  return (
    <div className="flex flex-col gap-5">
      {/* 1. Filter Placement */}
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

      {/* 2. Filter Number of Floors */}
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

      {/* 3. Filter Stall Size */}
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
