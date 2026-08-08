"use client";

import { useRoleFilter } from "@/lib/role_provider";
import { cn } from "@/lib/utils";
import { Role, RoleAndAll, VariantColor } from "@/types";

const ROLES: {
  value: RoleAndAll;
  label: string;
  color?: VariantColor;
}[] = [
  { value: "all", label: "All Features" },
  { value: "tenant", label: "For Tenants", color: "primary" },
  { value: "owner", label: "For Owners", color: "owner" },
  { value: "supplier", label: "For Suppliers", color: "supplier" },
];

export function RoleFilterTabs() {
  const { activeRole, setActiveRole } = useRoleFilter();

  return (
    <div className="inline-flex flex-wrap items-center justify-center gap-1.5 rounded-2xl border border-border bg-card p-1.5 shadow-sm">
      {ROLES.map((role) => {
        const active = activeRole === role.value;
        return (
          <button
            key={role.value}
            type="button"
            onClick={() => setActiveRole(role.value as Role)}
            aria-pressed={active}
            className={cn(
              "rounded-xl px-4 py-2 text-sm font-medium transition-all",
              active
                ? "text-white shadow-sm"
                : "text-muted-foreground hover:text-foreground",
            )}
            style={
              active
                ? { backgroundColor: `var(--${role.color ?? "foreground"})` }
                : undefined
            }
          >
            {role.label}
          </button>
        );
      })}
    </div>
  );
}
