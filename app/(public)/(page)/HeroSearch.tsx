"use client";

import { useState } from "react";
import {
  MapPin,
  Search,
  Target,
  Store,
  Building2,
  Users,
  Zap,
  Droplets,
  UtensilsCrossed,
  Snowflake,
  Armchair,
} from "lucide-react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

const RADIUS_OPTIONS = ["1 km", "3 km", "5 km", "10 km", "20 km"];

const LANDMARK_OPTIONS = [
  { value: "any", label: "Any landmark" },
  { value: "campus", label: "Near Campus" },
  { value: "office", label: "Office District" },
  { value: "school", label: "Near School" },
  { value: "mall", label: "Shopping Center" },
];

const FACILITY_OPTIONS = [
  { value: "power", label: "Electrical", icon: Zap },
  { value: "water", label: "Water", icon: Droplets },
  { value: "kitchen", label: "Kitchen", icon: UtensilsCrossed },
  { value: "ac", label: "AC", icon: Snowflake },
  { value: "seating", label: "Seating", icon: Armchair },
];

const TRUST_STATS = [
  { icon: Store, value: "500+", label: "active stalls" },
  { icon: Building2, value: "40+", label: "cities" },
  { icon: Users, value: "1,200+", label: "tenants matched" },
];

export function HeroSearch() {
  const [location, setLocation] = useState("");
  const [radius, setRadius] = useState(RADIUS_OPTIONS[1]);
  const [facilities, setFacilities] = useState<string[]>([]);

  function toggleFacility(value: string) {
    setFacilities((prev) =>
      prev.includes(value) ? prev.filter((f) => f !== value) : [...prev, value],
    );
  }

  return (
    <div className="w-full">
      <div className="rounded-2xl border border-border bg-card p-3 shadow-lg shadow-primary/5 sm:p-4">
        {/* Row 1: free-text location + landmark select + search button */}
        <div className="flex flex-col gap-3 sm:flex-row">
          <div className="relative flex-1">
            <MapPin className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Street, area, or city"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="h-12 pl-9"
            />
          </div>

          <Select defaultValue="any">
            <SelectTrigger className="h-12 sm:w-45">
              <SelectValue placeholder="Landmark" />
            </SelectTrigger>
            <SelectContent>
              {LANDMARK_OPTIONS.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button className="flex h-12 shrink-0 items-center justify-center gap-2 bg-primary px-6 text-primary-foreground hover:bg-primary/90">
            <Search className="h-4 w-4" />
            <span className="hidden sm:inline">Search</span>
          </Button>
        </div>

        {/* Row 2: radius as pill segmented control */}
        <div className="mt-3 flex flex-wrap items-center gap-2 border-t border-border pt-3">
          <span className="text-xs font-medium text-muted-foreground">
            Radius:
          </span>
          <div className="flex flex-wrap gap-1.5">
            {RADIUS_OPTIONS.map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => setRadius(r)}
                className={cn(
                  "rounded-full px-3 py-1 text-xs font-medium transition-colors",
                  radius === r
                    ? "bg-primary text-primary-foreground"
                    : "border border-border bg-secondary/50 text-muted-foreground hover:border-primary/40 hover:text-foreground",
                )}
              >
                {r}
              </button>
            ))}
          </div>
        </div>

        {/* Row 3: facility filter chips */}
        <div className="mt-3 flex flex-wrap items-center gap-2 border-t border-border pt-3">
          <span className="text-xs font-medium text-muted-foreground">
            Facilities:
          </span>
          <div className="flex flex-wrap gap-1.5">
            {FACILITY_OPTIONS.map((facility) => {
              const active = facilities.includes(facility.value);
              return (
                <button
                  key={facility.value}
                  type="button"
                  onClick={() => toggleFacility(facility.value)}
                  className={cn(
                    "flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium transition-colors",
                    active
                      ? "bg-primary-secondary text-primary ring-1 ring-inset ring-primary/30"
                      : "border border-border bg-secondary/50 text-muted-foreground hover:border-primary/40 hover:text-foreground",
                  )}
                >
                  <facility.icon className="h-3 w-3" />
                  {facility.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Below the box: ROI link (left) and trust stats (right), cleanly separated */}
      <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Link
          href="/stalls/match"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
        >
          <Target className="h-3.5 w-3.5" />
          Have a budget & break-even target instead? Try Budget & ROI Match
        </Link>

        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          {TRUST_STATS.map((stat, i) => (
            <span key={stat.label} className="flex items-center gap-4">
              <span className="flex items-center gap-1.5">
                <stat.icon className="h-3.5 w-3.5 text-primary/60" />
                <span className="font-semibold text-foreground">
                  {stat.value}
                </span>
                {stat.label}
              </span>
              {i < TRUST_STATS.length - 1 && (
                <span className="h-3 w-px bg-border" />
              )}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
