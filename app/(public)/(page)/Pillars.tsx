import { Store, Building2, Truck, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { VariantColor } from "@/types";

interface Pillar {
  role: string;
  title: string;
  description: string;
  points: string[];
  icon: React.ElementType;
  colorVar: VariantColor;
  href: string;
}

const PILLARS: Pillar[] = [
  {
    role: "For Tenants",
    title: "Run Your Business — On or Off a Stall",
    description:
      "Manage POS, stock, and staff for every business you run — whether you rent a stall through Lapakita or sell from home.",
    points: [
      "Multi-business POS with isolated staff & records",
      "Budget & ROI match — filter stalls by your break-even target",
      "3-scenario financial forecast for existing or new businesses",
    ],
    icon: Store,
    colorVar: "primary",
    href: "/features?role=tenant",
  },
  {
    role: "For Stall Owners",
    title: "Manage a Portfolio, Not Just Rent",
    description:
      "Review tenant reputation before approving, lock in contract terms, and know exactly what a vacant day costs you.",
    points: [
      "Tenant vetting with price-locked digital contracts",
      "Escrow-held deposits with photo-verified damage claims",
      "Daily vacancy loss calculation & pricing recommendations",
    ],
    icon: Building2,
    colorVar: "owner",
    href: "/features?role=owner",
  },
  {
    role: "For Suppliers",
    title: "Get Matched With UMKM Ready to Order",
    description:
      "Your catalog shows up directly inside relevant tenant dashboards — no ad spend needed to reach ready buyers.",
    points: [
      "In-dashboard catalog placement, zero ad spend",
      "Subscriber system with 1-click reorder from tenants",
      "Order velocity analytics & subscriber demand signals",
    ],
    icon: Truck,
    colorVar: "supplier",
    href: "/features?role=supplier",
  },
];

export function EcosystemPillars() {
  return (
    <section id="features" className="bg-secondary/40 py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-sm font-semibold uppercase tracking-wider text-primary">
            The Ecosystem
          </span>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            One Platform, Three Roles
          </h2>
          <p className="mt-4 text-muted-foreground">
            Every stall runs on the same three relationships. Lapakita gives
            each one its own toolkit.
          </p>
        </div>

        <div className="relative mt-14">
          <div className="absolute left-0 right-0 top-13 hidden h-px bg-gradient-brand opacity-30 md:block" />

          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {PILLARS.map((pillar) => {
              const Icon = pillar.icon;
              return (
                <div
                  key={pillar.role}
                  className="group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-card p-6 shadow-sm transition-shadow hover:shadow-md"
                >
                  <span
                    className="absolute inset-x-0 top-0 h-1.5"
                    style={{ backgroundColor: `var(--${pillar.colorVar})` }}
                  />

                  <div
                    className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl"
                    style={{
                      backgroundColor: `var(--${pillar.colorVar}-secondary)`,
                      color: `var(--${pillar.colorVar})`,
                    }}
                  >
                    <Icon className="h-5 w-5" />
                  </div>

                  <span
                    className="mb-1 text-xs font-semibold uppercase tracking-wide"
                    style={{ color: `var(--${pillar.colorVar})` }}
                  >
                    {pillar.role}
                  </span>
                  <h3 className="text-lg font-semibold text-foreground">
                    {pillar.title}
                  </h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {pillar.description}
                  </p>

                  <ul className="mt-4 space-y-2 text-sm text-foreground/80">
                    {pillar.points.map((point) => (
                      <li key={point} className="flex items-start gap-2">
                        <span
                          className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full"
                          style={{
                            backgroundColor: `var(--${pillar.colorVar})`,
                          }}
                        />
                        {point}
                      </li>
                    ))}
                  </ul>

                  <Button
                    asChild
                    variant="ghost"
                    className="mt-6 justify-start px-0 hover:bg-transparent"
                    style={{ color: `var(--${pillar.colorVar})` }}
                  >
                    <Link href={pillar.href}>
                      Learn more
                      <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Link>
                  </Button>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
