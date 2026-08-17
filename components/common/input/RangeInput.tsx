/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { Slider } from "@/components/ui/slider";
import * as React from "react";
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
  // Local state untuk fleksibilitas pengetikan
  const [localMin, setLocalMin] = React.useState<number | "">(value[0]);
  const [localMax, setLocalMax] = React.useState<number | "">(value[1]);

  // Sync dari parent HANYA jika nilainya berbeda (mencegah flickering saat slider digeser)
  React.useEffect(() => {
    if (value[0] !== localMin && localMin !== "") {
      setLocalMin(value[0]);
    }
    if (value[1] !== localMax && localMax !== "") {
      setLocalMax(value[1]);
    }
  }, [value, localMin, localMax]);

  const activeMinVal = typeof localMin === "number" ? localMin : value[0];
  const activeMaxVal = typeof localMax === "number" ? localMax : value[1];

  // BATAS DINAMIS SLIDER & LABEL HEADER
  const dynamicMin = Math.min(min, activeMinVal);
  const dynamicMax = Math.max(max, activeMaxVal);

  // ─── Handler Min Input ───
  function handleMinChange(val: number | undefined) {
    if (val === undefined || isNaN(val)) {
      setLocalMin("");
      return;
    }
    const safeMin = Math.max(0, val);
    setLocalMin(safeMin);

    const currentMax = typeof localMax === "number" ? localMax : value[1];
    const newMax = Math.max(currentMax, safeMin);
    setLocalMax(newMax);

    onChange([safeMin, newMax]);
  }

  function handleMinBlur() {
    if (localMin === "" || localMin < 0) {
      setLocalMin(0);
      const currentMax = typeof localMax === "number" ? localMax : value[1];
      onChange([0, Math.max(currentMax, 0)]);
    }
  }

  // ─── Handler Max Input ───
  function handleMaxChange(val: number | undefined) {
    if (val === undefined || isNaN(val)) {
      setLocalMax("");
      return;
    }
    setLocalMax(val);

    const currentMin = typeof localMin === "number" ? localMin : value[0];
    const safeMax = Math.max(currentMin, val);
    onChange([currentMin, safeMax]);
  }

  function handleMaxBlur() {
    const currentMin = typeof localMin === "number" ? localMin : value[0];
    if (localMax === "" || localMax < currentMin) {
      setLocalMax(currentMin);
      onChange([currentMin, currentMin]);
    }
  }

  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <p className="text-xs font-semibold text-muted-foreground">{label}</p>
        <span className="text-[11px] font-medium text-muted-foreground/80">
          {formatValue(dynamicMin)} – {formatValue(dynamicMax)}
        </span>
      </div>

      <Slider
        min={dynamicMin}
        max={dynamicMax}
        step={step}
        value={[activeMinVal, activeMaxVal]}
        onValueChange={(v) => {
          const [newMin, newMax] = v as [number, number];
          setLocalMin(newMin);
          setLocalMax(newMax);
          onChange([newMin, newMax]);
        }}
        className="mb-3"
      />

      <div className="flex items-center gap-2">
        <NumberInput
          prefix={prefix}
          suffix={suffix}
          decimalScale={0}
          allowNegative={false}
          placeholder="0"
          value={localMin}
          onValueChange={(v) => handleMinChange(v.floatValue)}
          onBlur={handleMinBlur}
          className="h-9 py-2 text-sm"
        />
        <span className="text-muted-foreground">–</span>
        <NumberInput
          prefix={prefix}
          suffix={suffix}
          decimalScale={0}
          allowNegative={false}
          placeholder="0"
          value={localMax}
          onValueChange={(v) => handleMaxChange(v.floatValue)}
          onBlur={handleMaxBlur}
          className="h-9 py-2 text-sm"
        />
      </div>
    </div>
  );
}
