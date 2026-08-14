"use client";

import { cn } from "@/lib/utils";
import { Role, VariantColor } from "@/types";
import type { LucideIcon } from "lucide-react";
import {
  Building2,
  FileCheck2,
  Handshake,
  PackagePlus,
  Search,
  Store,
  TrendingUp,
  UserCheck2,
  Vault,
} from "lucide-react";
import { useState } from "react";

interface StepItem {
  number: string;
  icon: LucideIcon;
  title: string;
  description: string;
}

interface RoleWorkflow {
  role: Role;
  label: string;
  color: VariantColor;
  steps: StepItem[];
}

const WORKFLOWS: Record<Role, RoleWorkflow> = {
  tenant: {
    role: "tenant",
    label: "For Tenants / Business Operators",
    color: "primary",
    steps: [
      {
        number: "01",
        icon: Search,
        title: "Discover & Filter",
        description:
          "Search stalls by landmark, radius, format (Ruko, Mall Island, Market), and match your available capital with target break-even timelines.",
      },
      {
        number: "02",
        icon: FileCheck2,
        title: "Apply & Secure Contract",
        description:
          "Submit your business profile and select custom start dates. Upon owner approval, pay initial rent and deposit safely via neutral Escrow.",
      },
      {
        number: "03",
        icon: Store,
        title: "Operate POS & Procurement",
        description:
          "Run daily operations using built-in POS cashier tools, manage cashier staff logins, and restock supplies from matched B2B suppliers in 1 click.",
      },
    ],
  },
  owner: {
    role: "owner",
    label: "For Stall Owners",
    color: "owner",
    steps: [
      {
        number: "01",
        icon: Building2,
        title: "Publish Listing & Terms",
        description:
          "List your space with photos, dimensions, facilities, allowed payment cycles (Monthly to Yearly), and custom start date options.",
      },
      {
        number: "02",
        icon: UserCheck2,
        title: "Vet & Approve Applicants",
        description:
          "Review applicant business types, profile ratings, and rental history from a single queue before locking digital lease terms.",
      },
      {
        number: "03",
        icon: Vault,
        title: "Automate Rent & Escrow Protection",
        description:
          "Track real-time occupancy and rent due-dates. Security deposits remain safely in Escrow to guarantee physical property conditions upon exit.",
      },
    ],
  },
  supplier: {
    role: "supplier",
    label: "For B2B Suppliers",
    color: "supplier",
    steps: [
      {
        number: "01",
        icon: PackagePlus,
        title: "Upload Catalog & MOQ Rules",
        description:
          "Set up wholesale products with minimum order quantities and tiered pricing controls directly inside your supplier dashboard.",
      },
      {
        number: "02",
        icon: Handshake,
        title: "Automatic SME Matchmaking",
        description:
          "Your items automatically appear inside procurement dashboards of matching active tenants — zero advertising budget required.",
      },
      {
        number: "03",
        icon: TrendingUp,
        title: "Fulfill & Lock Recurring Demand",
        description:
          "Process incoming orders, generate digital delivery notes, and get designated as 'Primary Supplier' for 1-click tenant reorders.",
      },
    ],
  },
};

export function HowItWorks() {
  const [activeRole, setActiveRole] = useState<Role>("tenant");
  const currentWorkflow = WORKFLOWS[activeRole];

  return (
    <section id="how-it-works" className="bg-secondary/30 py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-sm font-semibold uppercase tracking-wider text-primary">
            Simple & Transparent
          </span>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            How Lapakita Operates
          </h2>
          <p className="mt-3 text-base text-muted-foreground">
            Tailored digital workflows for every participant in the local
            commerce ecosystem.
          </p>

          {/* Role Tab Switcher — active tab now takes the role's color, not just a flat white pill */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-2 rounded-2xl border border-border bg-muted/60 p-1.5">
            {(["tenant", "owner", "supplier"] as Role[]).map((role) => {
              const isActive = activeRole === role;
              const color = WORKFLOWS[role].color;
              return (
                <button
                  key={role}
                  type="button"
                  onClick={() => setActiveRole(role)}
                  className={cn(
                    "flex-1 rounded-xl px-4 py-2.5 text-xs font-semibold outline-none transition-all sm:flex-none sm:text-sm",
                    isActive
                      ? "text-white shadow-sm"
                      : "text-muted-foreground hover:bg-background/50 hover:text-foreground",
                  )}
                  style={
                    isActive
                      ? { backgroundColor: `var(--${color})` }
                      : undefined
                  }
                >
                  {WORKFLOWS[role].label}
                </button>
              );
            })}
          </div>
        </div>

        {/* 3-Step Cards Grid */}
        <div className="mt-14 grid grid-cols-1 gap-8 md:grid-cols-3">
          {currentWorkflow.steps.map((step) => {
            const Icon = step.icon;
            return (
              <div
                key={step.number}
                className="relative flex flex-col justify-between overflow-hidden rounded-3xl border border-border bg-card p-6 shadow-xs transition-all hover:shadow-md"
                style={{ borderColor: undefined }}
              >
                {/* Top accent bar in the active role's color */}
                <span
                  className="absolute inset-x-0 top-0 h-1"
                  style={{ backgroundColor: `var(--${currentWorkflow.color})` }}
                />

                <div>
                  <div className="flex items-center justify-between">
                    <span
                      className="flex h-12 w-12 items-center justify-center rounded-2xl"
                      style={{
                        backgroundColor: `var(--${currentWorkflow.color}-secondary)`,
                        color: `var(--${currentWorkflow.color})`,
                      }}
                    >
                      <Icon className="h-6 w-6" />
                    </span>
                    <span className="text-3xl font-black text-muted-foreground/30">
                      {step.number}
                    </span>
                  </div>

                  <h3 className="mt-6 text-lg font-bold text-foreground">
                    {step.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {step.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
