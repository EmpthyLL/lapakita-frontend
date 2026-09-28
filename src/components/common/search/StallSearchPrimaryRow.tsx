"use client";

import { Button } from "@/components/ui/button";
import { getBusinessTypes } from "@/lib/data/api/business_type";
import {
  BusinessType,
  GetBusinessTypesQuery,
} from "@/lib/data/schema/master/business_type";
import { cn } from "@/lib/utils";
import { Search, Sparkles } from "lucide-react";
import { useTranslations } from "next-intl";
import { Autocomplete } from "../long/autocomplete";
import { LocationAutocomplete } from "../long/location-autocomplete";
import { StallPermanenceTabs } from "./StallPermanenceTabs";
import { StallPermanenceType } from "./constants/types";

interface StallSearchPrimaryRowProps {
  isFull: boolean;
  location: string;
  onLocationChange: (value: string) => void;
  businessType: string;
  onBusinessTypeChange: (value: string, selectedType?: BusinessType) => void;
  hasBusinessTypePreset: boolean;
  onApplyBusinessPreset: () => void;
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
  hasBusinessTypePreset,
  onApplyBusinessPreset,
  permanenceType,
  onPermanenceChange,
  onSearch,
}: StallSearchPrimaryRowProps) {
  const t = useTranslations("common.search");

  return (
    <div className="flex flex-col gap-3">
      <div className={cn("flex flex-col gap-3", "lg:flex-row")}>
        <LocationAutocomplete
          value={location}
          onChange={onLocationChange}
          className="flex-1"
        />

        <Autocomplete<BusinessType, GetBusinessTypesQuery>
          value={businessType}
          onSelect={(v, option) => onBusinessTypeChange(String(v), option)}
          asyncConfig={{
            queryFn: getBusinessTypes,
            queryKey: ["business-types", permanenceType],
            searchKey: "search",
          }}
          valueKey="id"
          labelKey="label"
          groupKey="group_name"
          placeholder={t("business_type_placeholder")}
          mode="solid"
          className={"lg:w-90"}
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

      {hasBusinessTypePreset && businessType && (
        <button
          type="button"
          onClick={onApplyBusinessPreset}
          className="flex w-fit items-center gap-1.5 text-xs font-semibold text-primary hover:underline"
        >
          <Sparkles className="h-3.5 w-3.5" />
          {t("apply_business_preset")}
        </button>
      )}

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
