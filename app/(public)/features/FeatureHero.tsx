import { RoleTab } from "@/components/common/RoleTab";

export function FeaturesHero() {
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
      <div className="relative mx-auto flex max-w-4xl flex-col items-center px-4 py-20 text-center sm:px-6 sm:py-28 lg:px-8">
        <span className="inline-flex items-center rounded-full bg-primary-secondary px-3 py-1 text-xs font-semibold uppercase tracking-wider text-primary">
          Lapakita Core Capabilities
        </span>
        <h1 className="font-heading mt-5 max-w-3xl text-balance text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
          Data-Backed Stall Operations. Built on Absolute Transparency.
        </h1>
        <p className="mt-5 max-w-2xl text-pretty text-muted-foreground sm:text-lg">
          Simplifying physical stall rentals, operational business intelligence,
          and SME supply chains into one seamless ecosystem — without complex
          hardware, hidden fees, or black-box algorithms.
        </p>
        <div className="mt-10">
          <RoleTab />
        </div>
      </div>
    </section>
  );
}
