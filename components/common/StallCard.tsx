"use client";

import { Badge } from "@/components/ui/badge";
import { Stall } from "@/lib/data/schema/stall/get_stall";
import { cn } from "@/lib/utils";
import { ArrowUpRight, Heart, MapPin, Maximize2, Star } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import {
  STALL_PERMANENCE_TABS,
  STALL_PROPERTY_TYPES,
} from "./search/constants/permanance";
import { PAYMENT_CYCLE_OPTIONS } from "./search/constants/range";

interface StallCardProps {
  stall: Stall;
  /** "row": wide horizontal card for the main listing. "grid": vertical card for multi-column grids like Similar Stalls. */
  variant?: "row" | "grid";
}

// Distinct tint per permanence tab so the badge reads at a glance, matching
// the same taxonomy used in StallPermanenceTabs during search.
const PERMANENCE_BADGE_STYLE: Record<string, string> = {
  permanent: "bg-emerald-500/90 text-white",
  "semi-permanent": "bg-sky-500/90 text-white",
  temporary: "bg-amber-500/90 text-white",
};

export function StallCard({ stall, variant = "row" }: StallCardProps) {
  const [saved, setSaved] = useState(false);

  const propertyTypeObj = STALL_PROPERTY_TYPES.find(
    (p) => p.value === stall.propertyType,
  );
  const PropertyIcon = propertyTypeObj?.icon;
  const propertyLabel = propertyTypeObj?.label ?? stall.propertyType;

  const permanenceTab = STALL_PERMANENCE_TABS.find(
    (t) => t.value === stall.permanenceType,
  );
  const PermanenceIcon = permanenceTab?.icon;

  const paymentPeriodObj = PAYMENT_CYCLE_OPTIONS.find(
    (p) => p.value === stall.cheapestPricePeriod,
  );
  const periodLabel =
    paymentPeriodObj?.label.toLowerCase() ?? stall.cheapestPricePeriod;

  function handleToggleSave(e: React.MouseEvent) {
    e.preventDefault();
    setSaved((s) => !s);
  }

  const topBadges = (
    <div className="flex flex-wrap items-center gap-1.5">
      <Badge className="gap-1 border-none bg-black/60 text-[10px] font-medium text-white backdrop-blur-md">
        {PropertyIcon && <PropertyIcon className="h-3 w-3" />}
        {propertyLabel}
      </Badge>
      {permanenceTab && (
        <Badge
          className={cn(
            "gap-1 border-none text-[10px] font-medium backdrop-blur-md",
            PERMANENCE_BADGE_STYLE[stall.permanenceType],
          )}
        >
          {PermanenceIcon && <PermanenceIcon className="h-3 w-3" />}
          {permanenceTab.shortLabel}
        </Badge>
      )}
    </div>
  );

  if (variant === "grid") {
    return (
      <a
        href={`/stalls/${stall.id}`}
        className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-xs transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md hover:shadow-primary/5"
      >
        <div className="relative h-44 w-full shrink-0 overflow-hidden bg-muted">
          <Image
            src={stall.imageUrl}
            alt={stall.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-black/60 via-black/5 to-black/25" />

          <div className="absolute inset-x-2.5 top-2.5 flex items-start justify-between gap-2">
            {topBadges}
            <button
              type="button"
              onClick={handleToggleSave}
              aria-label={saved ? "Remove from saved" : "Save this stall"}
              aria-pressed={saved}
              className={cn(
                "flex h-7 w-7 shrink-0 items-center justify-center rounded-full backdrop-blur-md transition-all outline-none",
                saved
                  ? "bg-white text-destructive shadow-xs"
                  : "bg-black/40 text-white opacity-0 hover:bg-black/60 group-hover:opacity-100",
              )}
            >
              <Heart
                className={cn(
                  "h-3.5 w-3.5 transition-transform",
                  saved && "scale-110 fill-destructive",
                )}
              />
            </button>
          </div>

          <div className="absolute bottom-2.5 inset-x-2.5 flex items-center justify-between gap-1.5">
            {stall.reviewCount > 0 ? (
              <div className="flex items-center gap-1 rounded-lg bg-white/95 px-2 py-1 text-xs font-bold text-slate-900 shadow-xs backdrop-blur-md">
                <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                <span>{stall.rating.toFixed(1)}</span>
              </div>
            ) : (
              <div />
            )}
            <div className="flex items-center gap-1 rounded-lg bg-black/70 px-2 py-1 text-xs font-bold text-white backdrop-blur-md">
              <Maximize2 className="h-3 w-3 text-primary-secondary" />
              <span>{stall.sizeSqm} m²</span>
            </div>
          </div>
        </div>

        <div className="flex flex-1 flex-col p-3.5">
          <h3 className="line-clamp-2 text-sm font-semibold leading-snug text-foreground transition-colors group-hover:text-primary">
            {stall.title}
          </h3>

          <div className="mt-2 flex min-w-0 items-center gap-1.5 text-xs font-medium text-muted-foreground">
            <MapPin className="h-3.5 w-3.5 shrink-0 text-primary" />
            <span className="truncate">
              {stall.location.area}, {stall.location.city}
            </span>
          </div>

          <div className="mt-3 border-t border-border/60 pt-2.5">
            <span className="block text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
              Starts from
            </span>
            <div className="flex items-baseline gap-1">
              <span className="text-base font-bold text-primary">
                {stall.cheapestPriceFormatted}
              </span>
              <span className="text-[11px] font-medium text-muted-foreground">
                / {periodLabel}
              </span>
            </div>
          </div>
        </div>
      </a>
    );
  }

  return (
    <a
      href={`/stalls/${stall.id}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-xs transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md hover:shadow-primary/5 sm:flex-row sm:items-stretch"
    >
      <div className="relative h-48 w-full shrink-0 overflow-hidden bg-muted sm:h-auto sm:w-52 md:w-56">
        <Image
          src={stall.imageUrl}
          alt={stall.title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-black/60 via-black/10 to-black/30" />

        <div className="absolute inset-x-2.5 top-2.5 flex items-start justify-between gap-2">
          {topBadges}
          <button
            type="button"
            onClick={handleToggleSave}
            aria-label={saved ? "Remove from saved" : "Save this stall"}
            aria-pressed={saved}
            className={cn(
              "flex h-7 w-7 shrink-0 items-center justify-center rounded-full backdrop-blur-md transition-all outline-none",
              saved
                ? "bg-white text-destructive shadow-xs"
                : "bg-black/40 text-white opacity-0 hover:bg-black/60 group-hover:opacity-100",
            )}
          >
            <Heart
              className={cn(
                "h-3.5 w-3.5 transition-transform",
                saved && "scale-110 fill-destructive",
              )}
            />
          </button>
        </div>

        <div className="absolute bottom-2.5 inset-x-2.5 flex items-center justify-between gap-1.5">
          {stall.reviewCount > 0 ? (
            <div className="flex items-center gap-1 rounded-lg bg-white/95 px-2 py-1 text-xs font-bold text-slate-900 shadow-xs backdrop-blur-md">
              <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
              <span>{stall.rating.toFixed(1)}</span>
              <span className="text-[10px] font-normal text-muted-foreground">
                ({stall.reviewCount})
              </span>
            </div>
          ) : (
            <div />
          )}
          <div className="flex items-center gap-1 rounded-lg bg-black/70 px-2 py-1 text-xs font-bold text-white backdrop-blur-md">
            <Maximize2 className="h-3 w-3 text-primary-secondary" />
            <span>{stall.sizeSqm} m²</span>
          </div>
        </div>
      </div>

      <div className="flex flex-1 flex-col justify-between p-4">
        <div>
          <div className="flex items-start justify-between gap-2">
            <h3 className="line-clamp-2 font-semibold text-foreground transition-colors group-hover:text-primary sm:text-base">
              {stall.title}
            </h3>
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-secondary/80 text-muted-foreground transition-all group-hover:bg-primary group-hover:text-primary-foreground">
              <ArrowUpRight className="h-4 w-4" />
            </span>
          </div>

          <div className="mt-2 flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
            <MapPin className="h-3.5 w-3.5 shrink-0 text-primary" />
            {stall.location.countryCode && (
              <span className="rounded bg-primary/10 px-1.5 py-0.5 text-[10px] font-bold tracking-wider text-primary">
                {stall.location.countryCode}
              </span>
            )}
            <span className="truncate">
              {stall.location.area}, {stall.location.city}
            </span>
          </div>
        </div>

        <div className="mt-3 border-t border-border/60 pt-2.5">
          <span className="block text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
            Starts from
          </span>
          <div className="flex items-baseline gap-1">
            <span className="text-lg font-bold text-primary sm:text-xl">
              {stall.cheapestPriceFormatted}
            </span>
            <span className="text-xs font-medium text-muted-foreground">
              / {periodLabel}
            </span>
          </div>
        </div>
      </div>
    </a>
  );
}
