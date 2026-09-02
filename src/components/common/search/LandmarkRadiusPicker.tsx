/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Plus, X } from "lucide-react";
import { useEffect, useMemo } from "react";
import { Autocomplete } from "../input/Autocomplete";
import { LANDMARK_CATEGORIES } from "./constants/landmark";
import { RADIUS_PRESETS } from "./constants/range";

export interface LandmarkRadiusEntry {
  landmark: string;
  radius: string;
}

export function createLandmarkRadiusEntry(): LandmarkRadiusEntry {
  return {
    landmark: "",
    radius: RADIUS_PRESETS[1],
  };
}

function normalizeRadius(raw: string) {
  const trimmed = raw.trim();
  if (!trimmed) return trimmed;
  if (/^\d+([.,]\d+)?$/.test(trimmed)) {
    return `${trimmed.replace(",", ".")} km`;
  }
  return trimmed;
}

interface LandmarkRadiusPickerProps {
  entries: LandmarkRadiusEntry[];
  onChange: (entries: LandmarkRadiusEntry[]) => void;
}

export function LandmarkRadiusPicker({
  entries,
  onChange,
}: LandmarkRadiusPickerProps) {
  // Pastikan selalu ada minimal 1 slot default jika entries kosong
  useEffect(() => {
    if (!entries || entries.length === 0) {
      onChange([createLandmarkRadiusEntry()]);
    }
  }, [entries]);

  const activeEntries =
    entries?.length > 0 ? entries : [createLandmarkRadiusEntry()];

  const usedLandmarks = useMemo(
    () => new Set(activeEntries.map((e) => e.landmark).filter(Boolean)),
    [activeEntries],
  );

  function updateEntry(index: number, patch: Partial<LandmarkRadiusEntry>) {
    onChange(
      activeEntries.map((e, i) => (i === index ? { ...e, ...patch } : e)),
    );
  }

  function removeEntry(index: number) {
    // Jika tinggal 1 slot, jangan biarkan kosong total, reset jadi kosong nilainya
    if (activeEntries.length === 1) {
      onChange([createLandmarkRadiusEntry()]);
      return;
    }
    onChange(activeEntries.filter((_, i) => i !== index));
  }

  function addEntry() {
    onChange([...activeEntries, createLandmarkRadiusEntry()]);
  }

  const allSelected = activeEntries.length >= LANDMARK_CATEGORIES.length;

  return (
    <div>
      <p className="mb-2 text-[11px] leading-snug text-muted-foreground">
        Add as many landmarks as you like, each with its own radius — a stall
        matching any one of them will show up in results.
      </p>

      <div className="space-y-3">
        {activeEntries.map((entry, index) => {
          const availableOptions = LANDMARK_CATEGORIES.filter(
            (l) => l.value === entry.landmark || !usedLandmarks.has(l.value),
          );

          return (
            <div
              key={index}
              className="rounded-xl border border-border bg-secondary/20 p-3"
            >
              <div className="mb-2 flex items-center justify-between">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-secondary text-[11px] font-semibold text-muted-foreground">
                  {index + 1}
                </span>
                <button
                  type="button"
                  onClick={() => removeEntry(index)}
                  className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
                  aria-label="Remove landmark"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>

              <Autocomplete
                value={entry.landmark}
                onSelect={(v) => updateEntry(index, { landmark: String(v) })}
                options={availableOptions}
                placeholder="Search a landmark…"
                mode="solid"
                className="w-full"
              />

              <Input
                value={entry.radius}
                onChange={(e) => updateEntry(index, { radius: e.target.value })}
                onBlur={(e) =>
                  updateEntry(index, {
                    radius: normalizeRadius(e.target.value),
                  })
                }
                placeholder="Radius, e.g. 3 km"
                className="mt-2 h-9 w-full"
              />

              <div className="mt-2 flex flex-wrap gap-1.5">
                {RADIUS_PRESETS.map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => updateEntry(index, { radius: r })}
                    className={cn(
                      "rounded-full border px-2.5 py-0.5 text-[11px] font-medium transition-colors",
                      entry.radius === r
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border text-muted-foreground hover:border-primary/40 hover:text-foreground",
                    )}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {allSelected ? (
        <p className="mt-3 text-[11px] text-muted-foreground">
          All available landmarks have been added.
        </p>
      ) : (
        <button
          type="button"
          onClick={addEntry}
          className="mt-3 flex items-center gap-1.5 text-xs font-semibold text-primary hover:text-primary/80"
        >
          <Plus className="h-3.5 w-3.5" />
          Add another landmark
        </button>
      )}
    </div>
  );
}
