"use client";

import { useState } from "react";
import {
  CheckCircle2,
  FileSignature,
  KeyRound,
  Percent,
  ScanSearch,
} from "lucide-react";
import { SectionHeading } from "./SectionHeader";
import { FeatureCard } from "./FeatureCard";
import { cn } from "@/lib/utils";

const LIFECYCLE_STEPS = [
  {
    label: "Active",
    description:
      "Tenant is operating under a signed, price-locked digital contract.",
  },
  {
    label: "Extend Pending",
    description:
      "Tenant requests renewal; owner reviews terms without unilateral price changes.",
  },
  {
    label: "Emptying",
    description: "Tenant vacates the stall within the agreed notice period.",
  },
  {
    label: "Inspection",
    description:
      "Both parties submit photo evidence for a fair, dispute-proof deposit review.",
  },
  {
    label: "Available",
    description:
      "Stall is re-listed and ready for the next data-matched tenant.",
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
          description="Replacing informal, risky verbal agreements with legally-binding digital contracts, photo-verified inspections, and automated escrow billing."
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
            title="Digital Contracts & Locked Terms"
            description="Contracts signed digitally with explicit price freeze. Terms cannot be changed unilaterally by stall owners mid-lease."
            roles={["primary", "owner"]}
          />
          <FeatureCard
            icon={KeyRound}
            title="Request Key Protocol"
            description="Photo-verified key handover protocol. Owners upload timestamped photos upon handover; the platform auto-verifies to protect tenant entry rights."
            roles={["primary", "owner"]}
          />
          <FeatureCard
            icon={Percent}
            title="Gradual Late Payment System"
            description="No sudden heavy fines. Grace periods with transparent, daily-capped late fees, preventing sudden evictions or locked stalls without notice."
            roles={["primary"]}
          />
          <FeatureCard
            icon={ScanSearch}
            title="Photo-Based Audit & Exit Inspections"
            description="Move-out and security deposit refunds are strictly governed by photo evidence from both parties, preventing unfair deposit withholding."
            roles={["primary", "owner"]}
          />
        </div>
      </div>
    </section>
  );
}
