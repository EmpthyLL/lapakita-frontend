"use client";

import { Slider } from "@/components/ui/slider";
import { NumberInput } from "../input/NumberInput";

interface RangeInputProps {
  label: string;
  min: number;
  max: number;
  step: number;
  value: [number, number];
  onChange: (value: [number, number]) => void;
  formatValue: (n: number) => string;
  prefix?: string;
  suffix?: string;
}

export function RangeInput({
  label,
  min,
  max,
  step,
  value,
  onChange,
  formatValue,
  prefix,
  suffix,
}: RangeInputProps) {
  // Slider visually extends past its default max once the typed value exceeds it
  const sliderMax = Math.max(max, value[1]);

  function handleMinChange(next: number | undefined) {
    const parsed = Math.max(min, next ?? min);
    onChange([Math.min(parsed, value[1]), value[1]]);
  }

  function handleMaxChange(next: number | undefined) {
    // No upper clamp here on purpose — only floor it against min/current min
    const parsed = Math.max(min, next ?? max);
    onChange([value[0], Math.max(parsed, value[0])]);
  }

  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <p className="text-xs font-semibold text-muted-foreground">{label}</p>
        <span className="text-[11px] text-muted-foreground">
          {formatValue(value[0])} – {formatValue(value[1])}
        </span>
      </div>
      <Slider
        min={min}
        max={sliderMax}
        step={step}
        value={value}
        onValueChange={(v) => onChange(v as [number, number])}
        className="mb-3"
      />
      <div className="flex items-center gap-2">
        <NumberInput
          prefix={prefix}
          suffix={suffix}
          decimalScale={0}
          placeholder="Min"
          value={value[0]}
          onValueChange={(v) => handleMinChange(v.floatValue)}
          className="h-9 py-2 text-sm"
        />
        <span className="text-muted-foreground">–</span>
        <NumberInput
          prefix={prefix}
          suffix={suffix}
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
