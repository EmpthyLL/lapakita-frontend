"use client";

import { MASTER_FACILITIES } from "@/components/common/search/constants/facilities";
import { getStallConstantLabel } from "@/components/common/search/constants/labels";
import { FacilityValue } from "@/components/common/search/constants/types";

export function StallFacilities({
  facilityValues,
}: {
  facilityValues: FacilityValue[];
}) {
  if (facilityValues.length === 0) return null;

  return (
    <div>
      <h2 className="text-lg font-semibold text-foreground">
        What This Stall Offers
      </h2>
      <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
        {facilityValues.map((value) => {
          const facility = MASTER_FACILITIES[value];
          const Icon = facility?.icon;
          const label = getStallConstantLabel("facility", value);

          return (
            <div
              key={value}
              className="flex items-center gap-2.5 rounded-xl border border-border bg-card p-3 shadow-xs"
            >
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                {Icon && <Icon className="h-4.5 w-4.5" />}
              </span>
              <span className="text-sm font-medium text-foreground">
                {label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
