"use client";

import { useRoleFilter } from "@/lib/role_provider";
import { cn } from "@/lib/utils";
import { VariantColor } from "@/types";
import type { LucideIcon } from "lucide-react";

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  /** Roles this feature is relevant to. Omit or ["all"] = relevant to everyone. */
  roles?: (VariantColor | "all")[];
}

export function FeatureCard({
  icon: Icon,
  title,
  description,
  roles = ["all"],
}: FeatureCardProps) {
  const { activeRole } = useRoleFilter();
  const isDimmed =
    activeRole !== "all" &&
    !roles.includes("all") &&
    !roles.includes(activeRole === "tenant" ? "primary" : activeRole);
  const singleRole = roles.length === 1 && roles[0] !== "all" ? roles[0] : null;

  return (
    <div
      className={cn(
        "rounded-2xl border border-border bg-card p-6 shadow-sm transition-all duration-300",
        isDimmed && "opacity-40 saturate-50",
      )}
    >
      <div
        className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl"
        style={{
          backgroundColor: `var(--${singleRole ?? "primary"}-secondary)`,
          color: `var(--${singleRole ?? "primary"})`,
        }}
      >
        <Icon className="h-5 w-5" />
      </div>
      <h3 className="font-semibold text-foreground">{title}</h3>
      <p className="mt-2 text-sm text-muted-foreground">{description}</p>
    </div>
  );
}
