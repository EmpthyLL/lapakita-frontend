"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { LandmarkRadiusPicker, RADIUS_PRESETS } from "./LandmarkRadiusPicker";
import { FacilityPicker } from "./FacilityPicker";
import {
  RENT_RANGE,
  DEPOSIT_RANGE,
  BEP_PRESETS_MONTHS,
} from "./SearchConstants";
import { StallSearchPrimaryRow } from "./StallSearchPrimaryRow";
import { StallSearchAdvancedFilters } from "./StallSearchAdvancedFilters";
import { StallSearchFooter } from "./SearchFooter";

export interface StallSearchProps {
  /** "hero": lightweight bar for the landing page. "full": all filters, for /stalls. */
  mode?: "hero" | "full";
}

export default function StallSearch({ mode = "full" }: StallSearchProps) {
  const isFull = mode === "full";

  // shared
  const [location, setLocation] = useState("");
  const [radius, setRadius] = useState(RADIUS_PRESETS[1]);

  // hero-only
  const [singleLandmark, setSingleLandmark] = useState("any");

  // full-only
  const [landmarks, setLandmarks] = useState<string[]>([]);
  const [businessType, setBusinessType] = useState("");
  const [facilities, setFacilities] = useState<string[]>([]);
  const [bepMonths, setBepMonths] = useState<number>(BEP_PRESETS_MONTHS[1]);
  const [capital, setCapital] = useState("");
  const [rentRange, setRentRange] = useState<[number, number]>([
    RENT_RANGE.min,
    RENT_RANGE.max,
  ]);
  const [depositRange, setDepositRange] = useState<[number, number]>([
    DEPOSIT_RANGE.min,
    DEPOSIT_RANGE.max,
  ]);
  const [advancedOpen, setAdvancedOpen] = useState(false);

  function toggleLandmark(value: string) {
    setLandmarks((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value],
    );
  }

  function toggleFacility(value: string) {
    setFacilities((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value],
    );
  }

  function handleSearch() {
    if (isFull) {
      console.log({
        location,
        landmarks,
        radius,
        businessType,
        facilities,
        bepMonths,
        capital,
        rentRange,
        depositRange,
      });
    } else {
      console.log({ location, landmark: singleLandmark, radius });
    }
  }

  return (
    <div className="w-full">
      <div
        className={cn(
          "rounded-2xl border border-border bg-card shadow-sm",
          isFull ? "p-5 sm:p-6" : "p-3 shadow-lg shadow-primary/5 sm:p-4",
        )}
      >
        <StallSearchPrimaryRow
          isFull={isFull}
          location={location}
          onLocationChange={setLocation}
          businessType={businessType}
          onBusinessTypeChange={setBusinessType}
          singleLandmark={singleLandmark}
          onSingleLandmarkChange={setSingleLandmark}
          onSearch={handleSearch}
        />

        {!isFull && (
          <div className="mt-3 flex flex-wrap items-center gap-2 border-t border-border pt-3">
            <span className="text-xs font-medium text-muted-foreground">
              Radius:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {RADIUS_PRESETS.map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setRadius(r)}
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
        )}

        {isFull && (
          <>
            <div className="mt-6 border-t border-border pt-6">
              <LandmarkRadiusPicker
                selectedLandmarks={landmarks}
                onToggleLandmark={toggleLandmark}
                radius={radius}
                onRadiusChange={setRadius}
              />
            </div>

            <div className="mt-6 border-t border-border pt-6">
              <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Facilities{" "}
                <span className="normal-case text-muted-foreground/70">
                  (select all that you need)
                </span>
              </p>
              <FacilityPicker selected={facilities} onToggle={toggleFacility} />
            </div>

            <StallSearchAdvancedFilters
              open={advancedOpen}
              onOpenChange={setAdvancedOpen}
              bepMonths={bepMonths}
              onBepMonthsChange={setBepMonths}
              capital={capital}
              onCapitalChange={setCapital}
              rentRange={rentRange}
              onRentRangeChange={setRentRange}
              depositRange={depositRange}
              onDepositRangeChange={setDepositRange}
            />
          </>
        )}
      </div>

      {!isFull && <StallSearchFooter />}
    </div>
  );
}
