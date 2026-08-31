"use client";

import { Button } from "@/components/ui/button";
import { AreaHistoryItemResponse } from "@/lib/data/schema/master/area_history";
import { AreaGeneralResponseData } from "@/lib/data/schema/master/location";
import { cn, formatRelativeTime } from "@/lib/utils";
import { X, type LucideIcon } from "lucide-react";

interface LocationHistoryItemProps {
  area: AreaHistoryItemResponse;
  isSelected: boolean;
  config: {
    icon: LucideIcon;
    bgClass: string;
    iconClass: string;
  };
  onSelect: (area: AreaGeneralResponseData) => void;
  onDelete: (fullLabel: string) => void;
}

export function LocationHistoryItem({
  area,
  isSelected,
  config,
  onSelect,
  onDelete,
}: LocationHistoryItemProps) {
  const Icon = config.icon;

  const formattedTime = area.searched_at
    ? formatRelativeTime(area.searched_at, { maxRelativeDays: 7 })
    : "";

  return (
    <div
      className={cn(
        "group/item flex w-full items-center justify-between rounded-lg px-2.5 py-2 text-left text-xs font-semibold transition-colors",
        isSelected
          ? "bg-secondary text-foreground"
          : "text-foreground hover:bg-secondary/60",
      )}
    >
      <button
        type="button"
        onMouseDown={(e) => e.preventDefault()}
        onClick={() => onSelect(area)}
        className="flex flex-1 items-center gap-3 min-w-0 outline-none cursor-pointer text-left"
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
              {area.title || area.full_label}
            </span>
            <span className="shrink-0 rounded-md bg-secondary px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">
              Recent
            </span>
            {formattedTime && (
              <span className="shrink-0 text-[10px] font-normal text-muted-foreground/80">
                • {formattedTime}
              </span>
            )}
          </span>

          {(area.subtitle || area.full_label) && (
            <span className="block truncate text-[11px] font-normal text-muted-foreground mt-0.5 text-left">
              {area.subtitle || area.full_label}
            </span>
          )}
        </span>
      </button>

      {/* Tombol Hapus Single Item Menggunakan Button Ghost */}
      <Button
        variant="ghost"
        size="icon-xs"
        onMouseDown={(e) => e.preventDefault()}
        onClick={(e) => {
          e.stopPropagation();
          onDelete(area.full_label);
        }}
        title="Delete history item"
        className="opacity-0 group-hover/item:opacity-100 text-muted-foreground hover:text-foreground transition-opacity ml-2"
      >
        <X className="size-3.5" />
      </Button>
    </div>
  );
}
