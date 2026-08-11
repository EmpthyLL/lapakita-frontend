"use client";

import { cn } from "@/lib/utils";
import {
  CheckCircle2,
  FileSignature,
  Key,
  ShieldAlert,
  Vault,
} from "lucide-react";
import { useState } from "react";
import { FeatureCard } from "./FeatureCard";
import { SectionHeading } from "./SectionHeader";

const LIFECYCLE_STEPS = [
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

export function LifecycleSection() {
  const [activeStep, setActiveStep] = useState(0);
  const current = LIFECYCLE_STEPS[activeStep];

  return (
    <section id="lifecycle" className="bg-secondary/40 py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          badge="2 · Legal & Operational Security"
          title="Transparent Rental Lifecycle & Protection Engine"
          description="Replacing informal, risky verbal agreements with legally-binding digital contracts, escrow-held security deposits, and owner-controlled relisting."
          color="primary"
        />

        {/* Interactive lifecycle diagram */}
        <div className="mx-auto mt-14 max-w-4xl">
          <div className="flex items-center justify-between">
            {LIFECYCLE_STEPS.map((step, i) => (
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
                      i === activeStep
                        ? "border-primary bg-primary text-primary-foreground"
                        : i < activeStep
                          ? "border-primary bg-primary-secondary text-primary"
                          : "border-border bg-card text-muted-foreground",
                    )}
                  >
                    {i < activeStep ? (
                      <CheckCircle2 className="h-5 w-5" />
                    ) : (
                      i + 1
                    )}
                  </span>
                  <span
                    className={cn(
                      "hidden text-xs font-medium sm:block",
                      i === activeStep
                        ? "text-primary"
                        : "text-muted-foreground",
                    )}
                  >
                    {step.label}
                  </span>
                </button>
                {i < LIFECYCLE_STEPS.length - 1 && (
                  <div
                    className={cn(
                      "mx-1 h-0.5 flex-1 sm:mx-2",
                      i < activeStep ? "bg-primary" : "bg-border",
                    )}
                  />
                )}
              </div>
            ))}
          </div>

          <div className="mt-6 rounded-2xl border border-border bg-card p-6 text-center shadow-sm">
            <p className="text-sm font-semibold text-primary sm:hidden">
              {current.label}
            </p>
            <p className="mt-1 text-sm text-muted-foreground sm:mt-0">
              {current.description}
            </p>
          </div>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <FeatureCard
            icon={FileSignature}
            title="Digital Contracts & Price Freeze"
            description="Contracts signed digitally with explicit price freeze. Monthly rent and deposit terms cannot be changed unilaterally mid-lease."
            roles={["primary", "owner"]}
          />
          <FeatureCard
            icon={ShieldAlert}
            title="Red Overdue Badges"
            description="Clear visual alerts show up only once a payment deadline passes — empowering owners to issue manual reminders or terminate leases."
            roles={["primary", "owner"]}
          />
          <FeatureCard
            icon={Vault}
            title="Escrow Security Deposit"
            description="Deposits sit safely in a neutral escrow gateway account during the lease — strictly used as a guarantee against property damage or key loss."
            roles={["primary", "owner"]}
          />
          <FeatureCard
            icon={Key}
            title="Flexible Key Management"
            description="Keys are handed over directly. Lost keys or duplication requests are handled seamlessly with clear deposit deduction rules."
            roles={["primary", "owner"]}
          />
        </div>
      </div>
    </section>
  );
}
