"use client";

import {
  MASTER_FACILITIES,
  type FacilityValue,
} from "@/components/common/search/SearchConstants";

export function StallFacilities({
  facilityValues,
}: {
  facilityValues: FacilityValue[];
}) {
  const matchedFacilities = facilityValues
    .map((val) => MASTER_FACILITIES[val])
    .filter(Boolean);

  if (matchedFacilities.length === 0) return null;

  return (
    <div>
      <h2 className="text-lg font-semibold text-foreground">
        What This Stall Offers
      </h2>
      <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
        {matchedFacilities.map((facility) => {
          const Icon = facility.icon;

          return (
            <div
              key={facility.value}
              className="flex items-center gap-2.5 rounded-xl border border-border bg-card p-3 shadow-xs"
            >
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Icon className="h-4.5 w-4.5" />
              </span>
              <span className="text-sm font-medium text-foreground">
                {facility.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
