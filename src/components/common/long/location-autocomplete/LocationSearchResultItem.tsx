"use client";

import { AreaGeneralResponseData } from "@/lib/data/schema/master/location";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";
import { useTranslations } from "next-intl";

interface LocationSearchResultItemProps {
  area: AreaGeneralResponseData;
  isSelected: boolean;
  config: {
    icon: LucideIcon;
    bgClass: string;
    iconClass: string;
  };
  onSelect: (area: AreaGeneralResponseData) => void;
}

export function LocationSearchResultItem({
  area,
  isSelected,
  config,
  onSelect,
}: LocationSearchResultItemProps) {
  const t = useTranslations("common.location_autocomplete");
  const Icon = config.icon;

  return (
    <button
      type="button"
      onMouseDown={(e) => e.preventDefault()}
      onClick={() => onSelect(area)}
      className={cn(
        "flex w-full items-center gap-3 rounded-lg px-2.5 py-2 text-left text-xs font-semibold transition-colors outline-none cursor-pointer",
        isSelected
          ? "bg-secondary text-foreground"
          : "text-foreground hover:bg-secondary/60",
      )}
    >
      <span
        className={cn(
          "flex size-7 shrink-0 items-center justify-center rounded-md border border-border/50",
          config.bgClass,
        )}
      >
        <Icon className={cn("size-3.5", config.iconClass)} />
      </span>
      <span className="min-w-0 flex-1">
        <span className="flex items-center gap-1.5">
          <span className="truncate font-semibold text-foreground">
            {area.title}
          </span>
          <span
            className={cn(
              "shrink-0 rounded-md px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider",
              config.bgClass,
              config.iconClass,
            )}
          >
            {t(`types.${area.type}`)}
          </span>
        </span>
        <span className="block truncate text-[11px] font-normal text-muted-foreground mt-0.5">
          {area.subtitle}
        </span>
      </span>
    </button>
  );
}
