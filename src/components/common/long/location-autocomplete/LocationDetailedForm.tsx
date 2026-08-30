"use client";

import { Input } from "@/components/ui/input";
import { CheckCircle2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { DetailedLocationFormValues } from "./LocationAutocompleteUtil";

interface LocationDetailedFormProps {
  details: DetailedLocationFormValues;
  onChange: (field: keyof DetailedLocationFormValues, val: string) => void;
}

export function LocationDetailedForm({
  details,
  onChange,
}: LocationDetailedFormProps) {
  const t = useTranslations("common.location_autocomplete");

  return (
    <div className="rounded-xl border border-border bg-card/60 p-4 space-y-3 animate-in fade-in zoom-in-95">
      <div className="flex items-center gap-1.5 text-xs font-semibold text-primary">
        <CheckCircle2 className="size-4" />
        <span>{t("auto_filled")}</span>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label className="text-[11px] font-semibold text-muted-foreground">
            {t("street_address")}
          </label>
          <Input
            value={details.street_address}
            onChange={(e) => onChange("street_address", e.target.value)}
            className="mt-1 h-9 text-xs"
          />
        </div>

        <div>
          <label className="text-[11px] font-semibold text-muted-foreground">
            {t("suburb")}
          </label>
          <Input
            value={details.suburb}
            onChange={(e) => onChange("suburb", e.target.value)}
            className="mt-1 h-9 text-xs"
          />
        </div>

        <div>
          <label className="text-[11px] font-semibold text-muted-foreground">
            {t("district")}
          </label>
          <Input
            value={details.district}
            onChange={(e) => onChange("district", e.target.value)}
            className="mt-1 h-9 text-xs"
          />
        </div>

        <div>
          <label className="text-[11px] font-semibold text-muted-foreground">
            {t("city")}
          </label>
          <Input
            value={details.city}
            onChange={(e) => onChange("city", e.target.value)}
            className="mt-1 h-9 text-xs"
          />
        </div>

        <div>
          <label className="text-[11px] font-semibold text-muted-foreground">
            {t("province")}
          </label>
          <Input
            value={details.province}
            onChange={(e) => onChange("province", e.target.value)}
            className="mt-1 h-9 text-xs"
          />
        </div>

        <div>
          <label className="text-[11px] font-semibold text-muted-foreground">
            {t("postal_code")}
          </label>
          <Input
            value={details.postal_code}
            onChange={(e) => onChange("postal_code", e.target.value)}
            className="mt-1 h-9 text-xs"
          />
        </div>
      </div>
    </div>
  );
}
