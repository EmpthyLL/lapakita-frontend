"use client";

import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { LANDMARK_CATEGORIES } from "@/lib/data/schema/master/landmark";

/* ---------------------------------------------------------------------- */
/* 4. Financial & semi-analysis presets                                    */
/* ---------------------------------------------------------------------- */

export const RADIUS_PRESETS = ["1 km", "3 km", "5 km", "10 km"];
export const RADIUS_RANGE = { min: 0.5, max: 50, step: 0.5 };

interface LandmarkRadiusPickerProps {
  selectedLandmarks: string[];
  onToggleLandmark: (value: string) => void;
  radius: string;
  onRadiusChange: (value: string) => void;
}

export function LandmarkRadiusPicker({
  selectedLandmarks,
  onToggleLandmark,
  radius,
  onRadiusChange,
}: LandmarkRadiusPickerProps) {
  return (
    <div className="space-y-4">
      <div>
        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Nearby Landmarks{" "}
          <span className="normal-case text-muted-foreground/70">
            (select any that apply)
          </span>
        </p>
        <div className="flex flex-wrap gap-2">
          {LANDMARK_CATEGORIES.map((landmark) => {
            const active = selectedLandmarks.includes(landmark.value);
            return (
              <button
                key={landmark.value}
                type="button"
                onClick={() => onToggleLandmark(landmark.value)}
                className={cn(
                  "flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
                  active
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-secondary/50 text-muted-foreground hover:border-primary/40 hover:text-foreground",
                )}
              >
                {active && <Check className="h-3 w-3" />}
                <landmark.icon className="h-3.5 w-3.5" />
                {landmark.label}
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Radius
        </p>
        <div className="flex flex-wrap gap-1.5">
          {RADIUS_PRESETS.map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => onRadiusChange(r)}
              className={cn(
                "rounded-full px-3 py-1 text-xs font-medium transition-colors",
                radius === r
                  ? "bg-primary text-primary-foreground"
                  : "border border-border bg-secondary/50 text-muted-foreground hover:border-primary/40 hover:text-foreground",
              )}
            >
              {r}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
