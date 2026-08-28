"use client";

import { TrendingUp } from "lucide-react";
import StallSearch from "../../../../components/common/search/StallSearch";

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
          <StallSearch mode="hero" />
        </div>
      </div>
    </section>
  );
}
