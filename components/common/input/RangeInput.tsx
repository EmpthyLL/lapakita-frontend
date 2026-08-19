/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { Slider } from "@/components/ui/slider";
import { useDebounce } from "@/hooks/use-debounce";
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

// ─── LOGARITHMIC MAPPING ───
function valueToPos(val: number, min: number, max: number): number {
  if (val <= min) return 0;
  if (val >= max) return 100;

  const safeMin = Math.max(1, min);
  const safeMax = Math.max(safeMin + 1, max);
  const safeVal = Math.max(safeMin, val);

  const minLog = Math.log(safeMin);
  const maxLog = Math.log(safeMax);
  const valLog = Math.log(safeVal);

  if (maxLog === minLog) return 0;
  return ((valLog - minLog) / (maxLog - minLog)) * 100;
}

function posToValue(
  pos: number,
  min: number,
  max: number,
  step: number,
): number {
  if (pos <= 0) return min;
  if (pos >= 100) return max;

  const safeMin = Math.max(1, min);
  const safeMax = Math.max(safeMin + 1, max);

  const minLog = Math.log(safeMin);
  const maxLog = Math.log(safeMax);
  const logVal = minLog + (pos / 100) * (maxLog - minLog);
  const rawVal = Math.exp(logVal);

  return step > 0 ? Math.round(rawVal / step) * step : Math.round(rawVal);
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
  // State lokal untuk pengetikan instan
  const [localMin, setLocalMin] = React.useState<number | "">(value[0]);
  const [localMax, setLocalMax] = React.useState<number | "">(value[1]);
  const [sliderPos, setSliderPos] = React.useState<[number, number]>([0, 100]);

  // Debounce state lokal agar tidak mengirim data mentah saat pengguna masih mengetik
  const debouncedMin = useDebounce(localMin, 100);
  const debouncedMax = useDebounce(localMax, 100);

  // 1. SYNC DARI PARENT (Kalo parent/kalkulator luar berubah)
  React.useEffect(() => {
    setLocalMin(value[0]);
    setLocalMax(value[1]);

    const activeMin = typeof value[0] === "number" ? value[0] : min;
    const activeMax = typeof value[1] === "number" ? value[1] : max;

    const dMin = Math.min(min, activeMin);
    const dMax = Math.max(max, activeMax);

    setSliderPos([
      valueToPos(activeMin, dMin, dMax),
      valueToPos(activeMax, dMin, dMax),
    ]);
  }, [min, max, value]);

  // 2. AUTO-CORRECT & EMIT VIA USEEFFECT + DEBOUNCE
  React.useEffect(() => {
    let safeMin = typeof debouncedMin === "number" ? debouncedMin : 0;
    if (safeMin < 0) safeMin = 0;

    let safeMax = typeof debouncedMax === "number" ? debouncedMax : safeMin;
    // Kalo max dihapus atau lebih kecil dari min -> stuck di min
    if (debouncedMax === "" || safeMax < safeMin) {
      safeMax = safeMin;
    }

    // Auto update state lokal biar tampilan input ter-correct
    if (localMin !== safeMin) setLocalMin(safeMin);
    if (localMax !== safeMax) setLocalMax(safeMax);

    // Hanya panggil onChange jika nilai sah berbeda dengan prop value luar
    if (safeMin !== value[0] || safeMax !== value[1]) {
      onChange([safeMin, safeMax]);
    }
  }, [debouncedMin, debouncedMax]);

  const activeMinVal = typeof localMin === "number" ? localMin : value[0];
  const activeMaxVal = typeof localMax === "number" ? localMax : value[1];

  const domainMin = Math.min(min, activeMinVal);
  const domainMax = Math.max(max, activeMaxVal);

  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <p className="text-xs font-semibold text-muted-foreground">{label}</p>
        <span className="text-[11px] font-medium text-muted-foreground/80">
          {formatValue(domainMin)} – {formatValue(domainMax)}
        </span>
      </div>

      <Slider
        min={0}
        max={100}
        step={0.1}
        value={sliderPos}
        onValueChange={(pos) => {
          setSliderPos(pos as [number, number]);
          const [pMin, pMax] = pos as [number, number];
          const newMin = posToValue(pMin, domainMin, domainMax, step);
          const newMax = posToValue(pMax, domainMin, domainMax, step);

          setLocalMin(Math.min(newMin, newMax));
          setLocalMax(Math.max(newMin, newMax));
        }}
        onValueCommit={(pos) => {
          const [pMin, pMax] = pos as [number, number];
          const newMin = posToValue(pMin, domainMin, domainMax, step);
          const newMax = posToValue(pMax, domainMin, domainMax, step);

          const safeMin = Math.min(newMin, newMax);
          const safeMax = Math.max(newMin, newMax);

          onChange([safeMin, safeMax]);
        }}
        className="mb-3 cursor-pointer"
      />

      <div className="flex items-center gap-2">
        <NumberInput
          prefix={prefix}
          suffix={suffix}
          decimalScale={0}
          allowNegative={false}
          placeholder="0"
          value={localMin}
          onValueChange={(v) => {
            const val = v.floatValue;
            setLocalMin(val === undefined || isNaN(val) ? "" : val);
          }}
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
          onValueChange={(v) => {
            const val = v.floatValue;
            setLocalMax(val === undefined || isNaN(val) ? "" : val);
          }}
          className="h-9 py-2 text-sm"
        />
      </div>
    </div>
  );
}
