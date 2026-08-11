import { cn } from "@/lib/utils";
import Image from "next/image";

interface EcosystemCard {
  role: string;
  headline: string;
  detail: string;
  imageUrl: string;
  imageAlt: string;
  color: "primary" | "owner" | "supplier";
}

const CARDS: EcosystemCard[] = [
  {
    role: "For Tenants",
    headline: "Operator-First Business OS",
    detail:
      "Integrated POS, multi-business ledgers, inventory control, and 3-scenario financial forecasting — whether running from a physical stall, home cloud kitchen, or online shop.",
    imageUrl:
      "https://images.unsplash.com/photo-1556742111-a301076d9d18?w=700&h=500&fit=crop",
    imageAlt: "POS cashier screen on a tablet",
    color: "primary",
  },
  {
    role: "For Stall Owners",
    headline: "Transparent Space Monetization",
    detail:
      "Real-time occupancy tracking, tenant vetting, price-locked lease contracts, escrow-backed deposit protection, and daily vacancy loss analytics.",
    imageUrl:
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=700&h=500&fit=crop",
    imageAlt: "Portfolio dashboard on a desktop screen",
    color: "owner",
  },
  {
    role: "For B2B Suppliers",
    headline: "Direct Matchmaking & Recurring Orders",
    detail:
      "Zero-ad-spend catalog placement directly inside tenant procurement dashboards, 1-click reordering, and subscriber demand signals.",
    imageUrl:
      "https://images.unsplash.com/photo-1553413077-190dd305871c?w=700&h=500&fit=crop",
    imageAlt: "B2B wholesale catalog on a smartphone",
    color: "supplier",
  },
];

export function AboutEcosystem() {
  return (
    <section className="py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-sm font-semibold uppercase tracking-wider text-primary">
            The Ecosystem
          </span>
          <h2 className="font-heading mt-3 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            One Account, Three Roles in Sync
          </h2>
          <p className="mt-4 text-muted-foreground">
            Every stakeholder in local commerce gets their own toolkit, tied
            together in a single ecosystem.
          </p>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-6 lg:grid-cols-3">
          {CARDS.map((card) => (
            <div
              key={card.role}
              className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm"
            >
              <div className="relative h-44 w-full overflow-hidden">
                <Image
                  src={card.imageUrl}
                  alt={card.imageAlt}
                  fill
                  className="object-cover"
                />
                <div
                  className={cn("absolute inset-x-0 top-0 h-1")}
                  style={{ backgroundColor: `var(--${card.color})` }}
                />
              </div>

              <div className="p-6">
                <span
                  className="text-xs font-semibold uppercase tracking-wide"
                  style={{ color: `var(--${card.color})` }}
                >
                  {card.role}
                </span>
                <h3 className="mt-1 text-lg font-semibold text-foreground">
                  {card.headline}
                </h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  {card.detail}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
