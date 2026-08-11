import { Layers } from "lucide-react";
import Image from "next/image";

export function AboutHero() {
  return (
    <section className="relative overflow-hidden bg-background">
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(90deg, var(--border) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      <div className="relative mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 px-4 py-20 sm:px-6 sm:py-28 lg:grid-cols-2 lg:px-8">
        <div>
          <span className="inline-flex items-center rounded-full bg-primary-secondary px-3 py-1 text-xs font-semibold uppercase tracking-wider text-primary">
            About Lapakita
          </span>
          <h1 className="font-heading mt-5 text-balance text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
            Re-architecting Local Commerce Ecosystems for SMEs
          </h1>
          <p className="mt-5 text-pretty text-muted-foreground sm:text-lg">
            Lapakita is built to replace speculation with data, informal
            friction with price-locked digital contracts, and fragmented tools
            with a single operating system for business operators, stall owners,
            and B2B suppliers.
          </p>
        </div>

        <div className="relative">
          <div className="relative overflow-hidden rounded-3xl border border-border shadow-lg shadow-primary/10">
            <Image
              src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=900&h=700&fit=crop"
              alt="SME business operator using Lapakita POS on a smartphone"
              width={900}
              height={700}
              className="h-full w-full object-cover"
            />
          </div>

          <div className="absolute -bottom-5 left-4 flex items-center gap-2 rounded-2xl border border-border bg-card px-4 py-3 shadow-lg sm:-left-6">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-brand text-white">
              <Layers className="h-4.5 w-4.5" />
            </div>
            <span className="text-sm font-semibold text-foreground">
              3 Roles. 1 Unified Ecosystem.
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
