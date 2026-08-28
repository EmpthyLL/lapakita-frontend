"use client";

import { Autocomplete } from "@/components/common/input/Autocomplete";
import { ArrowUpDown } from "lucide-react";
import { useState } from "react";

const SORT_OPTIONS = [
  { value: "recommended", label: "Recommended" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "rating", label: "Highest Rated" },
  { value: "size-desc", label: "Largest Space" },
];

interface StallResultsToolbarProps {
  count: number;
}

export function StallResultsToolbar({ count }: StallResultsToolbarProps) {
  const [sort, setSort] = useState("recommended");

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
          onSelect={(v) => setSort(String(v))}
          options={SORT_OPTIONS}
          placeholder="Sort by"
          mode="solid"
          className="w-48"
        />
      </div>
    </div>
  );
}
