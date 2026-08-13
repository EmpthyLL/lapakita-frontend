"use client";

import { Slider } from "@/components/ui/slider";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { NumberInput } from "../input/NumberInput";
import {
  STALL_SIZE_RANGE,
  STALL_TYPE_OPTIONS,
  type StallType,
} from "./SearchConstants";

interface StallSpaceFiltersProps {
  stallType: StallType | "";
  onStallTypeChange: (value: StallType) => void;
  sizeRange: [number, number];
  onSizeRangeChange: (value: [number, number]) => void;
}

export function StallSpaceFilters({
  stallType,
  onStallTypeChange,
  sizeRange,
  onSizeRangeChange,
}: StallSpaceFiltersProps) {
  function handleMinChange(next: number | undefined) {
    const parsed = Math.max(STALL_SIZE_RANGE.min, next ?? STALL_SIZE_RANGE.min);
    onSizeRangeChange([Math.min(parsed, sizeRange[1]), sizeRange[1]]);
  }

  function handleMaxChange(next: number | undefined) {
    const parsed = Math.min(STALL_SIZE_RANGE.max, next ?? STALL_SIZE_RANGE.max);
    onSizeRangeChange([sizeRange[0], Math.max(parsed, sizeRange[0])]);
  }

  return (
    <div className="space-y-5">
      <div>
        <p className="mb-2 text-xs font-semibold text-muted-foreground">
          Stall Type
        </p>
        <ToggleGroup
          type="single"
          value={stallType}
          onValueChange={(v) => v && onStallTypeChange(v as StallType)}
          className="flex w-full flex-wrap rounded-lg border border-border bg-secondary/40 p-1"
        >
          {STALL_TYPE_OPTIONS.map((opt) => (
            <ToggleGroupItem
              key={opt.value}
              value={opt.value}
              className="flex-1 rounded-md px-3 py-1.5 text-xs font-medium data-[state=on]:bg-primary data-[state=on]:text-primary-foreground"
            >
              {opt.label}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
      </div>

      <div>
        <div className="mb-2 flex items-center justify-between">
          <p className="text-xs font-semibold text-muted-foreground">
            Stall Size
          </p>
          <span className="text-[11px] text-muted-foreground">
            {sizeRange[0]} – {sizeRange[1]} m²
          </span>
        </div>
        <Slider
          min={STALL_SIZE_RANGE.min}
          max={STALL_SIZE_RANGE.max}
          step={STALL_SIZE_RANGE.step}
          value={sizeRange}
          onValueChange={(v) => onSizeRangeChange(v as [number, number])}
          className="mb-3"
        />
        <div className="flex items-center gap-2">
          <NumberInput
            suffix=" m²"
            noSeparated
            decimalScale={0}
            placeholder="Min"
            value={sizeRange[0]}
            onValueChange={(v) => handleMinChange(v.floatValue)}
            className="h-9 py-2 text-sm"
          />
          <span className="text-muted-foreground">–</span>
          <NumberInput
            suffix=" m²"
            noSeparated
            decimalScale={0}
            placeholder="Max"
            value={sizeRange[1]}
            onValueChange={(v) => handleMaxChange(v.floatValue)}
            className="h-9 py-2 text-sm"
          />
        </div>
      </div>
    </div>
  );
}
