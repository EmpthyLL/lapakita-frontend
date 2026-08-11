"use client";

import { Input } from "@/components/ui/input";
import { LANDMARK_CATEGORIES } from "@/lib/data/schema/master/landmark";
import { cn } from "@/lib/utils";
import { Plus, X } from "lucide-react";
import { Autocomplete } from "../Autocomplete";
import { RADIUS_PRESETS } from "./SearchConstants";

export interface LandmarkRadiusEntry {
  id: string;
  landmark: string;
  radius: string;
}

export function createLandmarkRadiusEntry(): LandmarkRadiusEntry {
  return {
    id: Math.random().toString(36).slice(2, 9),
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
  function updateEntry(id: string, patch: Partial<LandmarkRadiusEntry>) {
    onChange(entries.map((e) => (e.id === id ? { ...e, ...patch } : e)));
  }

  function removeEntry(id: string) {
    onChange(entries.filter((e) => e.id !== id));
  }

  function addEntry() {
    onChange([...entries, createLandmarkRadiusEntry()]);
  }

  return (
    <div>
      <p className="mb-2 text-[11px] leading-snug text-muted-foreground">
        Add as many landmarks as you like, each with its own radius — a stall
        matching any one of them will show up in results.
      </p>

      <div className="space-y-3">
        {entries.map((entry, index) => (
          <div
            key={entry.id}
            className="rounded-xl border border-border bg-secondary/20 p-3"
          >
            <div className="mb-2 flex items-center justify-between">
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-secondary text-[11px] font-semibold text-muted-foreground">
                {index + 1}
              </span>
              {entries.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeEntry(entry.id)}
                  className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
                  aria-label="Remove landmark"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>

            <Autocomplete
              value={entry.landmark}
              onSelect={(v) => updateEntry(entry.id, { landmark: String(v) })}
              options={LANDMARK_CATEGORIES}
              placeholder="Search a landmark…"
              mode="solid"
              className="w-full"
            />

            <Input
              value={entry.radius}
              onChange={(e) =>
                updateEntry(entry.id, { radius: e.target.value })
              }
              onBlur={(e) =>
                updateEntry(entry.id, {
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
                  onClick={() => updateEntry(entry.id, { radius: r })}
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
        ))}
      </div>

      <button
        type="button"
        onClick={addEntry}
        className="mt-3 flex items-center gap-1.5 text-xs font-semibold text-primary hover:text-primary/80"
      >
        <Plus className="h-3.5 w-3.5" />
        Add another landmark
      </button>
    </div>
  );
}
