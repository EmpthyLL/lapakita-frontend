"use client";

import { LANDMARK_CATEGORIES } from "@/components/common/search/constants/landmark";
import type { NearbyLandmark } from "@/lib/data/schema/stall/get_stall_detail";
import { MapPin } from "lucide-react";

export function StallLandmarks({ landmarks }: { landmarks: NearbyLandmark[] }) {
  if (!landmarks || landmarks.length === 0) return null;

  return (
    <div>
      <h2 className="text-lg font-semibold text-foreground">
        Nearby Landmarks
      </h2>
      <div className="mt-4 space-y-3">
        {landmarks.map((landmark) => {
          const category = LANDMARK_CATEGORIES.find(
            (c) => c.value === landmark.categoryValue,
          );
          const Icon = category?.icon ?? MapPin;

          return (
            <div
              key={landmark.name}
              className="flex items-center justify-between rounded-xl border border-border bg-card p-3.5 shadow-xs transition-colors hover:border-primary/30"
            >
              <div className="flex items-center gap-3 min-w-0">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Icon className="h-4 w-4" />
                </span>
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-foreground">
                    {landmark.name}
                  </p>
                  <p className="truncate text-xs text-muted-foreground">
                    {category?.label ?? "Landmark"}
                  </p>
                </div>
              </div>
              <span className="shrink-0 text-xs font-semibold text-primary bg-primary/5 px-2.5 py-1 rounded-full border border-primary/10">
                {landmark.distanceKm} km
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
