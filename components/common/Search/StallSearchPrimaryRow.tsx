"use client";

import { Button } from "@/components/ui/button";
import { BUSINESS_CATEGORIES } from "@/lib/data/schema/master/business_type";
import { LANDMARK_CATEGORIES } from "@/lib/data/schema/master/landmark";
import { cn } from "@/lib/utils";
import { Search } from "lucide-react";
import { Autocomplete } from "../input/Autocomplete";
import { LocationAutocomplete } from "./LocationAutocomplete";

// Flatten grouped business categories into a single option list with a `group` field,
// which is what Autocomplete's groupKey expects.
const BUSINESS_TYPE_OPTIONS = BUSINESS_CATEGORIES.flatMap((g) =>
  g.types.map((t) => ({ ...t, group: g.group })),
);

interface StallSearchPrimaryRowProps {
  isFull: boolean;
  location: string;
  onLocationChange: (value: string) => void;
  businessType: string;
  onBusinessTypeChange: (value: string) => void;
  singleLandmark: string;
  onSingleLandmarkChange: (value: string) => void;
  onSearch: () => void;
}

export function StallSearchPrimaryRow({
  isFull,
  location,
  onLocationChange,
  businessType,
  onBusinessTypeChange,
  singleLandmark,
  onSingleLandmarkChange,
  onSearch,
}: StallSearchPrimaryRowProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-3",
        isFull ? "lg:flex-row" : "sm:flex-row",
      )}
    >
      <LocationAutocomplete
        value={location}
        onChange={onLocationChange}
        onCommit={onSearch}
        className="flex-1"
        inputClassName="h-12"
      />

      {isFull ? (
        <Autocomplete
          value={businessType}
          onSelect={(v) => onBusinessTypeChange(String(v))}
          options={BUSINESS_TYPE_OPTIONS}
          groupKey="group"
          placeholder="Business type"
          mode="solid"
          className="lg:w-60"
        />
      ) : (
        <Autocomplete
          value={singleLandmark}
          onSelect={(v) => onSingleLandmarkChange(String(v))}
          options={LANDMARK_CATEGORIES}
          placeholder="Any landmark"
          mode="solid"
          className="sm:w-45"
        />
      )}

      <Button
        onClick={onSearch}
        className="flex h-12 shrink-0 items-center justify-center gap-2 bg-primary px-6 text-primary-foreground hover:bg-primary/90"
      >
        <Search className="h-4 w-4" />
        <span className={isFull ? undefined : "hidden sm:inline"}>
          {isFull ? "Search Stalls" : "Search"}
        </span>
      </Button>
    </div>
  );
}
