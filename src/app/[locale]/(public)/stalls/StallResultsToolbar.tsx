"use client";

import { Autocomplete } from "@/components/common/input/Autocomplete";
import { ArrowUpDown } from "lucide-react";

const SORT_OPTIONS = [
  { value: "recommended", label: "Recommended & Popular" },
  { value: "price-asc", label: "Cheapest Price" },
  { value: "price-desc", label: "Highest Price" },
  { value: "rating", label: "Top Rated (4.8+)" },
  { value: "reviews", label: "Most Reviewed" },
  { value: "size-desc", label: "Largest Area / Size" },
];

interface StallResultsToolbarProps {
  count: number;
  sort: string;
  onSortChange: (sort: string) => void;
}

export function StallResultsToolbar({
  count,
  sort,
  onSortChange,
}: StallResultsToolbarProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <p className="text-sm text-muted-foreground">
        <span className="font-semibold text-foreground">{count}</span> stalls
        found
      </p>

      <div className="flex items-center gap-2">
        <ArrowUpDown className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
        <Autocomplete
          value={sort}
          onSelect={(v) => onSortChange(String(v))}
          options={SORT_OPTIONS}
          placeholder="Sort by"
          mode="solid"
          className="w-52"
        />
      </div>
    </div>
  );
}
