"use client";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import type { RoleAndAll, VariantColor } from "@/types";

interface FaqTabsProps {
  value: RoleAndAll;
  onValueChange: (value: RoleAndAll) => void;
}

const TABS: { value: RoleAndAll; label: string; color?: VariantColor }[] = [
  { value: "all", label: "All Topics" },
  { value: "tenant", label: "Tenant", color: "primary" },
  { value: "owner", label: "Stall Owner", color: "owner" },
  { value: "supplier", label: "Supplier", color: "supplier" },
];

export function FaqTabs({ value, onValueChange }: FaqTabsProps) {
  return (
    <Tabs value={value} onValueChange={(v) => onValueChange(v as RoleAndAll)}>
      <TabsList className="h-auto flex-wrap gap-1.5 rounded-2xl border border-border bg-card p-1.5 shadow-sm">
        {TABS.map((tab) => {
          const active = value === tab.value;
          return (
            <TabsTrigger
              key={tab.value}
              value={tab.value}
              className={cn(
                "rounded-xl border-0 px-4 py-2 text-sm font-medium text-muted-foreground shadow-none transition-all",
                "data-[state=active]:shadow-sm",
                !active && "hover:text-foreground",
              )}
              style={
                active
                  ? {
                      backgroundColor: `var(--${tab.color ?? "foreground"})`,
                      color: "white",
                    }
                  : undefined
              }
            >
              {tab.label}
            </TabsTrigger>
          );
        })}
      </TabsList>
    </Tabs>
  );
}
