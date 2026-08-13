"use client";

import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { STALL_PLACEMENT_OPTIONS, StallPlacement } from "./SearchConstants";

interface PlacementPickerProps {
  value: StallPlacement | "";
  onChange: (value: StallPlacement) => void;
}

// Short chip labels — the full descriptive text lives in STALL_PLACEMENT_OPTIONS
// (used for tooltips / a11y) but a segmented control needs to stay compact.
const SHORT_LABEL: Record<StallPlacement, string> = {
  indoor: "Indoor",
  "semi-outdoor": "Semi-Outdoor",
  outdoor: "Outdoor",
};

export function PlacementPicker({ value, onChange }: PlacementPickerProps) {
  return (
    <ToggleGroup
      type="single"
      value={value}
      onValueChange={(v) => v && onChange(v as StallPlacement)}
      className="flex w-full rounded-lg border border-border bg-secondary/40 p-1"
    >
      {STALL_PLACEMENT_OPTIONS.map((opt) => (
        <ToggleGroupItem
          key={opt.value}
          value={opt.value}
          title={opt.label}
          className="flex-1 rounded-md px-2 py-1.5 text-xs font-medium data-[state=on]:bg-primary data-[state=on]:text-primary-foreground"
        >
          {SHORT_LABEL[opt.value]}
        </ToggleGroupItem>
      ))}
    </ToggleGroup>
  );
}
