"use client";

import { useRoleFilter } from "@/components/providers/role_provider";
import { cn } from "@/lib/utils";
import { ROLES_CONFIG, type RoleAndAll } from "@/types";
import { useTranslations } from "next-intl";

interface RoleTabItem {
  value: RoleAndAll;
  key: "all" | "tenant" | "owner" | "supplier";
}

const TABS: RoleTabItem[] = [
  { value: "all", key: "all" },
  { value: "tenant", key: "tenant" },
  { value: "owner", key: "owner" },
  { value: "supplier", key: "supplier" },
];

export function RoleTab() {
  const { activeRole, setActiveRole } = useRoleFilter();
  const t = useTranslations("common.role_tab");

  return (
    <div
      role="tablist"
      className="inline-flex flex-wrap items-center justify-center gap-1.5 rounded-2xl border border-border bg-card p-1.5 shadow-sm"
    >
      {TABS.map((tab) => {
        const active = activeRole === tab.value;
        const isAll = tab.value === "all";
        const optionConfig = ROLES_CONFIG[tab.value];

        return (
          <button
            key={tab.value}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => setActiveRole(tab.value)}
            className={cn(
              "rounded-xl px-4 py-2 text-sm font-medium transition-all select-none",
              active
                ? cn(
                    optionConfig.bgSoftClass,
                    "shadow-xs font-semibold ring-1 ring-inset ring-border/30",
                  )
                : "text-muted-foreground hover:bg-muted/50 hover:text-foreground",
              isAll && active && "bg-secondary text-foreground",
            )}
          >
            {t(tab.key)}
          </button>
        );
      })}
    </div>
  );
}
