"use client";

import { useRoleFilter } from "@/lib/role_provider";
import { cn } from "@/lib/utils";
import type { RoleAndAll, VariantColor } from "@/types";

interface RoleTabItem {
  value: RoleAndAll;
  label: string;
  color?: VariantColor;
}

const TABS: RoleTabItem[] = [
  { value: "all", label: "All" },
  { value: "tenant", label: "Tenant", color: "primary" },
  { value: "owner", label: "Stall Owner", color: "owner" },
  { value: "supplier", label: "Supplier", color: "supplier" },
];

export function RoleTab() {
  const { activeRole, setActiveRole } = useRoleFilter();

  return (
    <div
      role="tablist"
      className="inline-flex flex-wrap items-center justify-center gap-1.5 rounded-2xl border border-border bg-card p-1.5 shadow-sm"
    >
      {TABS.map((tab) => {
        const active = activeRole === tab.value;
        return (
          <button
            key={tab.value}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => setActiveRole(tab.value)}
            className={cn(
              "rounded-xl px-4 py-2 text-sm font-medium transition-all",
              active
                ? "text-white shadow-sm"
                : "text-muted-foreground hover:text-foreground",
            )}
            style={
              active
                ? { backgroundColor: `var(--${tab.color ?? "foreground"})` }
                : undefined
            }
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}
