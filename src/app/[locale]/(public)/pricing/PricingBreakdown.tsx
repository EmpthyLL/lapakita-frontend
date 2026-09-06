"use client";

import { RoleTab } from "@/components/common/RoleTab";
import { useRoleFilter } from "@/components/providers/role_provider";
import type { Role } from "@/types";
import { PRICING_FEATURE_TABLES, ROLE_LABELS } from "./PricingData";
import { PricingFeatureTable } from "./PricingFeatureTable";

export function PricingBreakdown() {
  const { activeRole } = useRoleFilter();
  const isAll = activeRole === "all";
  const role: Role = isAll ? "tenant" : activeRole;

  const rawRows = isAll
    ? Array.from(
        new Map(
          [
            ...PRICING_FEATURE_TABLES.tenant,
            ...PRICING_FEATURE_TABLES.owner,
            ...PRICING_FEATURE_TABLES.supplier,
          ].map((item) => [item.feature, item]),
        ).values(),
      )
    : PRICING_FEATURE_TABLES[role];

  const sortedRows = [...rawRows].sort((a, b) => {
    if (a.free === b.free) return 0;
    return a.free ? -1 : 1;
  });

  return (
    <section className="bg-secondary/40 py-20 sm:py-28">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-sm font-semibold uppercase tracking-wider text-primary">
            Feature Breakdown
          </span>
          <h2 className="font-heading mt-3 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            {isAll
              ? "All Ecosystem Features: Free vs Premium"
              : `${ROLE_LABELS[role]}: Free vs Premium`}
          </h2>
        </div>

        <div className="mt-10 flex justify-center">
          <RoleTab />
        </div>

        <div className="mt-10">
          <PricingFeatureTable role={role} customRows={sortedRows} />
        </div>
      </div>
    </section>
  );
}
