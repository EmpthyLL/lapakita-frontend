"use client";

import { useState } from "react";
import { MapPin, Radar, Utensils, Search, TrendingUp } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const RADIUS_OPTIONS = ["1 km", "3 km", "5 km", "10 km", "20 km"];
const CATEGORY_OPTIONS = [
  "Food & Beverage",
  "Fashion & Apparel",
  "Groceries",
  "Electronics",
  "Services",
];

export function HeroSearch() {
  const [location, setLocation] = useState("");

  return (
    <div className="w-full rounded-2xl border border-border bg-card p-3 shadow-lg shadow-primary/5 sm:p-4">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-[1.3fr_0.8fr_1fr_auto]">
        <div className="relative">
          <MapPin className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="City, district, or landmark"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="h-12 pl-9"
          />
        </div>

        <Select defaultValue={RADIUS_OPTIONS[1]}>
          <SelectTrigger className="h-12">
            <Radar className="mr-1 h-4 w-4 text-muted-foreground" />
            <SelectValue placeholder="Radius" />
          </SelectTrigger>
          <SelectContent>
            {RADIUS_OPTIONS.map((r) => (
              <SelectItem key={r} value={r}>
                {r} radius
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select defaultValue={CATEGORY_OPTIONS[0]}>
          <SelectTrigger className="h-12">
            <Utensils className="mr-1 h-4 w-4 text-muted-foreground" />
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            {CATEGORY_OPTIONS.map((c) => (
              <SelectItem key={c} value={c}>
                {c}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Button className="justify-center flex items-center gap-2 h-12">
          <Search className="h-4 w-4" />
          Search
        </Button>
      </div>
    </div>
  );
}

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-background">
      {/* subtle data-grid backdrop */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(90deg, var(--border) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      <div className="relative mx-auto flex max-w-5xl flex-col items-center px-4 py-20 text-center sm:px-6 sm:py-28 lg:px-8">
        <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-transparent bg-gradient-brand/10 px-3 py-1 text-xs font-medium text-primary">
          <TrendingUp className="h-3.5 w-3.5" />
          Data-driven stall matching for SMEs
        </div>

        <h1 className="font-heading max-w-3xl text-balance text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
          Find the Perfect Stall.
          <br />
          Run Your POS.{" "}
          <span className="text-gradient-brand">Scale Your Business.</span>
        </h1>

        <p className="mt-5 max-w-xl text-pretty text-base text-muted-foreground sm:text-lg">
          Lapakita connects tenants, stall owners, and suppliers on one platform
          — backed by footfall data, turnover forecasts, and built-in
          point-of-sale.
        </p>

        <div className="mt-10 w-full max-w-3xl">
          <HeroSearch />
        </div>
      </div>
    </section>
  );
}
