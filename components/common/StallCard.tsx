"use client";

import { Badge } from "@/components/ui/badge";
import { Stall } from "@/lib/data/schema/stall/get_stall";
import { cn } from "@/lib/utils";
import { Heart, MapPin, Maximize2, Star } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

export function StallCard({ stall }: { stall: Stall }) {
  const [saved, setSaved] = useState(false);

  return (
    <a
      href={`/stalls/${stall.id}`}
      className="group block overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5"
    >
      {/* Image Banner */}
      <div className="relative h-48 w-full overflow-hidden bg-muted">
        <Image
          src={stall.imageUrl}
          alt={stall.title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {/* Gradient overlay for legibility, independent of photo content */}
        <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-black/50 via-black/0 to-black/10" />

        <div className="absolute inset-x-3 top-3 flex items-start justify-between gap-2">
          <Badge className="border-none bg-white/95 font-medium text-foreground shadow-sm backdrop-blur-sm">
            {stall.propertyType}
          </Badge>

          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              setSaved((s) => !s);
            }}
            aria-label={saved ? "Remove from saved" : "Save this stall"}
            aria-pressed={saved}
            className={cn(
              "flex h-8 w-8 shrink-0 items-center justify-center rounded-full backdrop-blur-sm transition-all",
              saved
                ? "bg-white text-destructive"
                : "bg-black/30 text-white opacity-0 hover:bg-black/50 group-hover:opacity-100",
            )}
          >
            <Heart
              className={cn(
                "h-4 w-4 transition-transform",
                saved && "scale-110 fill-destructive",
              )}
            />
          </button>
        </div>

        {stall.reviewCount > 0 && (
          <div className="absolute bottom-3 left-3 flex items-center gap-1 rounded-full bg-white/95 px-2 py-1 text-xs font-bold text-amber-600 shadow-sm backdrop-blur-sm">
            <Star className="h-3.5 w-3.5 fill-amber-500 text-amber-500" />
            <span>{stall.rating.toFixed(1)}</span>
            <span className="font-normal text-muted-foreground">
              ({stall.reviewCount})
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="truncate font-semibold text-foreground transition-colors group-hover:text-primary">
          {stall.title}
        </h3>

        <div className="mt-1.5 flex items-center gap-3 text-xs text-muted-foreground">
          <span className="flex min-w-0 items-center gap-1">
            <MapPin className="h-3.5 w-3.5 shrink-0 text-primary" />
            <span className="truncate">
              {stall.area}, {stall.city}
            </span>
          </span>
          <span className="flex shrink-0 items-center gap-1">
            <Maximize2 className="h-3.5 w-3.5 shrink-0" />
            {stall.sizeSqm} m²
          </span>
        </div>

        {/* Pricing Footer */}
        <div className="mt-4 flex items-end justify-between border-t border-border/60 pt-3">
          <div>
            <span className="block text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
              Starts from
            </span>
            <span className="text-lg font-bold leading-tight text-primary">
              {stall.pricePerMonth}
            </span>
          </div>
          <span className="pb-0.5 text-xs font-medium text-muted-foreground">
            / month
          </span>
        </div>
      </div>
    </a>
  );
}
