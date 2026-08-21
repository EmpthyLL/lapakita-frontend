"use client";

import { cn } from "@/lib/utils";
import {
  CheckCircle2,
  FileSignature,
  Handshake,
  Key,
  Radar,
  Repeat,
  ShieldAlert,
  Truck,
  Vault,
  type LucideIcon,
} from "lucide-react";
import { useState } from "react";
import { FeatureCard } from "./FeatureCard";
import { SectionHeading } from "./SectionHeader";

interface LifecycleStep {
  label: string;
  description: string;
}

type CycleColor = "owner" | "supplier";

interface LifecycleFlow {
  key: "owner" | "supplier";
  tabLabel: string;
  /** End color of the gradient this flow interpolates toward, from --primary */
  toColor: "owner" | "supplier";
  badge: string;
  title: string;
  description: string;
  steps: LifecycleStep[];
  featureCards: {
    icon: LucideIcon;
    title: string;
    description: string;
    roles: CycleColor;
  }[];
}

const RENTAL_STEPS: LifecycleStep[] = [
  {
    label: "Active",
    description:
      "Tenant operates under a signed, price-locked digital contract with automated billing schedules.",
  },
  {
    label: "Extend Pending",
    description:
      "Tenant requests a lease renewal; owner reviews terms without mid-lease price surges.",
  },
  {
    label: "Emptying",
    description:
      "Tenant vacates the stall and clears out all personal inventory within the agreed notice period.",
  },
  {
    label: "Inspection",
    description:
      "Owner inspects physical conditions and submits photo evidence for damage or missing key deposit claims.",
  },
  {
    label: "Manual Relist",
    description:
      "Once cleaned and prepped, owner manually reactivates the listing to make it visible to new tenants again.",
  },
];

const SUPPLIER_STEPS: LifecycleStep[] = [
  {
    label: "Catalog & MOQ Setup",
    description:
      "Supplier uploads wholesale catalog with minimum order quantities (MOQ) and volume-based tiered pricing rules.",
  },
  {
    label: "Automatic Matchmaking",
    description:
      "Products automatically surface inside procurement dashboards of matching active UMKM tenants without ad spend.",
  },
  {
    label: "1-Click Reorder",
    description:
      "Tenants designate primary suppliers to trigger instant 1-click inventory restocks directly from POS low-stock alerts.",
  },
  {
    label: "Digital Fulfillment",
    description:
      "Supplier confirms order, generates digital delivery notes, and tracks delivery status in real-time.",
  },
  {
    label: "Escrow Payout",
    description:
      "Upon tenant delivery confirmation, funds held in the payment gateway are automatically disbursed to the supplier's bank account.",
  },
];

const FLOWS: Record<"owner" | "supplier", LifecycleFlow> = {
  owner: {
    key: "owner",
    tabLabel: "Rental Lifecycle",
    toColor: "owner",
    badge: "2 · Legal & Operational Security",
    title: "Transparent Rental Lifecycle & Protection Engine",
    description:
      "Replacing informal, risky verbal agreements with legally-binding digital contracts, escrow-held security deposits, and owner-controlled relisting.",
    steps: RENTAL_STEPS,
    featureCards: [
      {
        icon: FileSignature,
        title: "Digital Contracts & Price Freeze",
        description:
          "Contracts signed digitally with explicit price freeze. Monthly rent and deposit terms cannot be changed unilaterally mid-lease.",
        roles: "owner",
      },
      {
        icon: ShieldAlert,
        title: "Red Overdue Badges",
        description:
          "Clear visual alerts show up only once a payment deadline passes — empowering owners to issue manual reminders or terminate leases.",
        roles: "owner",
      },
      {
        icon: Vault,
        title: "Escrow Security Deposit",
        description:
          "Deposits sit safely in a neutral escrow gateway account during the lease — strictly used as a guarantee against property damage or key loss.",
        roles: "owner",
      },
      {
        icon: Key,
        title: "Flexible Key Management",
        description:
          "Keys are handed over directly. Lost keys or duplication requests are handled seamlessly with clear deposit deduction rules.",
        roles: "owner",
      },
    ],
  },
  supplier: {
    key: "supplier",
    tabLabel: "Supplier Fulfillment",
    toColor: "supplier",
    badge: "3 · Supply Chain & Fulfillment",
    title: "Direct B2B Matchmaking & Fulfillment Engine",
    description:
      "Connecting suppliers directly with matched SME tenants — from catalog setup to escrow-protected payout, with zero advertising spend.",
    steps: SUPPLIER_STEPS,
    featureCards: [
      {
        icon: Handshake,
        title: "Direct SME Matchmaking",
        description:
          "Zero ad-spend catalog placement directly targeted at active tenant business categories.",
        roles: "supplier",
      },
      {
        icon: Repeat,
        title: "Primary Supplier Designation",
        description:
          "Tenants tag your catalog for automated 1-click reordering whenever POS stock runs low.",
        roles: "supplier",
      },
      {
        icon: Truck,
        title: "Digital Delivery Notes",
        description:
          "Streamlined order fulfillment with paperless digital delivery receipts and batch tracking.",
        roles: "supplier",
      },
      {
        icon: Radar,
        title: "Subscriber Demand Signals",
        description:
          "Aggregated, privacy-safe consumption forecasts across your tenant buyer network.",
        roles: "supplier",
      },
    ],
  },
};

/** Interpolates a step's color along the --primary -> toColor gradient based on its position. */
function stepColor(
  toColor: "owner" | "supplier",
  index: number,
  total: number,
) {
  const percent = total <= 1 ? 100 : Math.round((index / (total - 1)) * 100);
  return `color-mix(in oklch, var(--primary), var(--${toColor}) ${percent}%)`;
}

export function LifecycleSection() {
  const [activeFlow, setActiveFlow] = useState<"owner" | "supplier">("owner");
  const [activeStep, setActiveStep] = useState(0);

  const flow = FLOWS[activeFlow];
  const current = flow.steps[activeStep];
  const totalSteps = flow.steps.length;

  function handleFlowChange(key: "owner" | "supplier") {
    setActiveFlow(key);
    setActiveStep(0);
  }

  return (
    <section id="lifecycle" className="bg-secondary/40 py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          badge={flow.badge}
          title={flow.title}
          description={flow.description}
          color="tenant"
        />

        {/* Flow tab switcher */}
        <div className="mt-8 flex justify-center">
          <div className="inline-flex flex-wrap items-center gap-1.5 rounded-2xl border border-border bg-card p-1.5 shadow-sm">
            {(Object.keys(FLOWS) as ("owner" | "supplier")[]).map((key) => {
              const isActive = activeFlow === key;
              const f = FLOWS[key];
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => handleFlowChange(key)}
                  className={cn(
                    "rounded-xl px-4 py-2 text-sm font-semibold transition-all",
                    isActive
                      ? "text-white shadow-sm"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                  style={
                    isActive
                      ? {
                          backgroundImage: `linear-gradient(90deg, var(--primary), var(--${f.toColor}))`,
                        }
                      : undefined
                  }
                >
                  {f.tabLabel}
                </button>
              );
            })}
          </div>
        </div>

        {/* Interactive lifecycle diagram */}
        <div className="mx-auto mt-14 max-w-4xl">
          <div className="flex items-center justify-between">
            {flow.steps.map((step, i) => {
              const color = stepColor(flow.toColor, i, totalSteps);
              const nextColor = stepColor(flow.toColor, i + 1, totalSteps);
              const isActive = i === activeStep;
              const isPast = i < activeStep;

              return (
                <div
                  key={step.label}
                  className="flex flex-1 items-center last:flex-none"
                >
                  <button
                    type="button"
                    onClick={() => setActiveStep(i)}
                    className="flex flex-col items-center gap-2 outline-none"
                  >
                    <span
                      className={cn(
                        "flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 text-sm font-semibold transition-colors sm:h-12 sm:w-12",
                        isActive || isPast
                          ? "text-white"
                          : "bg-card text-muted-foreground",
                      )}
                      style={
                        isActive || isPast
                          ? { backgroundColor: color, borderColor: color }
                          : { borderColor: "var(--border)" }
                      }
                    >
                      {isPast ? <CheckCircle2 className="h-5 w-5" /> : i + 1}
                    </span>
                    <span
                      className={cn(
                        "hidden text-xs font-medium sm:block",
                        !isActive && "text-muted-foreground",
                      )}
                      style={isActive ? { color } : undefined}
                    >
                      {step.label}
                    </span>
                  </button>
                  {i < flow.steps.length - 1 && (
                    <div
                      className="mx-1 h-0.5 flex-1 sm:mx-2"
                      style={
                        isPast
                          ? {
                              backgroundImage: `linear-gradient(90deg, ${color}, ${nextColor})`,
                            }
                          : { backgroundColor: "var(--border)" }
                      }
                    />
                  )}
                </div>
              );
            })}
          </div>

          <div
            className="mt-6 rounded-2xl border bg-card p-6 text-center shadow-sm"
            style={{
              borderColor: stepColor(flow.toColor, activeStep, totalSteps),
            }}
          >
            <p
              className="text-sm font-semibold sm:hidden"
              style={{ color: stepColor(flow.toColor, activeStep, totalSteps) }}
            >
              {current.label}
            </p>
            <p className="mt-1 text-sm text-muted-foreground sm:mt-0">
              {current.description}
            </p>
          </div>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {flow.featureCards.map((card) => (
            <FeatureCard
              key={card.title}
              icon={card.icon}
              title={card.title}
              description={card.description}
              roles={[card.roles]}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
