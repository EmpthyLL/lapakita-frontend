"use client";

import { Button } from "@/components/ui/button";
import { useInfiniteSearch } from "@/hooks/use-infinite-search";
import { getBusinessTypes } from "@/lib/data/api/business_type";
import {
  BusinessType,
  GetBusinessTypesQuery,
} from "@/lib/data/schema/master/business_type";
import { cn } from "@/lib/utils";
import { Search } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { Autocomplete } from "../input/Autocomplete";
import { LocationAutocomplete } from "../long/location-autocomplete";
import { StallPermanenceTabs } from "./StallPermanenceTabs";
import { StallPermanenceType } from "./constants/types";

interface StallSearchPrimaryRowProps {
  isFull: boolean;
  location: string;
  onLocationChange: (value: string) => void;
  businessType: string;
  onBusinessTypeChange: (value: string, selectedType?: BusinessType) => void;
  permanenceType: StallPermanenceType;
  onPermanenceChange: (value: StallPermanenceType) => void;
  onSearch: () => void;
}

export function StallSearchPrimaryRow({
  isFull,
  location,
  onLocationChange,
  businessType,
  onBusinessTypeChange,
  permanenceType,
  onPermanenceChange,
  onSearch,
}: StallSearchPrimaryRowProps) {
  const t = useTranslations("common.search");
  const [searchTerm, setSearchTerm] = useState("");

  const {
    data: businessTypes,
    isLoading,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
  } = useInfiniteSearch<BusinessType, GetBusinessTypesQuery>({
    queryKey: ["business-types", permanenceType],
    queryFn: getBusinessTypes,
    search: searchTerm,
    searchKey: "search",
    enabled: true,
  });

  const businessTypeOptions = businessTypes
    .filter((bt) => Boolean(bt.permanence_presets?.[permanenceType]))
    .map((bt) => ({
      ...bt,
      value: bt.id,
      label: bt.label,
      group: bt.group_name,
    }));

  return (
    <div className="flex flex-col gap-3">
      <div className={cn("flex flex-col gap-3", "lg:flex-row")}>
        <LocationAutocomplete
          value={location}
          onChange={onLocationChange}
          className="flex-1"
          inputClassName="h-12"
        />

        <Autocomplete
          value={businessType}
          onSelect={(v, option) => onBusinessTypeChange(String(v), option)}
          options={businessTypeOptions}
          valueKey="value"
          labelKey="label"
          groupKey="group"
          placeholder={t("business_type_placeholder")}
          mode="solid"
          className={"lg:w-90"}
          onFilterChange={setSearchTerm}
          isLoading={isLoading}
          isFetchingMore={isFetchingNextPage}
          hasMore={hasNextPage}
          fetchMore={fetchNextPage}
        />

        <Button
          onClick={onSearch}
          className="flex h-12 shrink-0 items-center justify-center gap-2 bg-primary px-6 text-primary-foreground hover:bg-primary/90"
        >
          <Search className="h-4 w-4" />
          <span className={isFull ? undefined : "hidden sm:inline"}>
            {isFull ? t("search_stalls") : t("search_button")}
          </span>
        </Button>
      </div>

      {!isFull && (
        <div className="pt-1">
          <StallPermanenceTabs
            value={permanenceType}
            onChange={onPermanenceChange}
            mode="compact"
          />
        </div>
      )}
    </div>
  );
}
