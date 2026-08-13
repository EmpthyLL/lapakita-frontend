"use client";

import { Slider } from "@/components/ui/slider";
import { NumberInput } from "../input/NumberInput";
import { STALL_SIZE_RANGE } from "./SearchConstants";

interface StallSizeFilterProps {
  value: [number, number];
  onChange: (value: [number, number]) => void;
}

export function StallSizeFilter({ value, onChange }: StallSizeFilterProps) {
  function handleMinChange(next: number | undefined) {
    const parsed = Math.max(STALL_SIZE_RANGE.min, next ?? STALL_SIZE_RANGE.min);
    onChange([Math.min(parsed, value[1]), value[1]]);
  }

  function handleMaxChange(next: number | undefined) {
    const parsed = Math.min(STALL_SIZE_RANGE.max, next ?? STALL_SIZE_RANGE.max);
    onChange([value[0], Math.max(parsed, value[0])]);
  }

  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <p className="text-xs font-semibold text-muted-foreground">
          Stall Size
        </p>
        <span className="text-[11px] text-muted-foreground">
          {value[0]} – {value[1]} m²
        </span>
      </div>
      <Slider
        min={STALL_SIZE_RANGE.min}
        max={STALL_SIZE_RANGE.max}
        step={STALL_SIZE_RANGE.step}
        value={value}
        onValueChange={(v) => onChange(v as [number, number])}
        className="mb-3"
      />
      <div className="flex items-center gap-2">
        <NumberInput
          suffix=" m²"
          decimalScale={0}
          placeholder="Min"
          value={value[0]}
          onValueChange={(v) => handleMinChange(v.floatValue)}
          className="h-9 py-2 text-sm"
        />
        <span className="text-muted-foreground">–</span>
        <NumberInput
          suffix=" m²"
          decimalScale={0}
          placeholder="Max"
          value={value[1]}
          onValueChange={(v) => handleMaxChange(v.floatValue)}
          className="h-9 py-2 text-sm"
        />
      </div>
    </div>
  );
}
