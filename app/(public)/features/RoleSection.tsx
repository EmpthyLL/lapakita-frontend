"use client";

import { cn } from "@/lib/utils";
import { Role } from "@/types";
import { Lock } from "lucide-react";
import type { FeatureGroup, FeatureItem, RoleContent } from "./FeatureData";

function PremiumBadge() {
  return (
    <span className="absolute -right-2 -top-2 flex items-center gap-1 rounded-full bg-linear-to-r from-amber-400 to-amber-500 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-amber-950 shadow-sm shadow-amber-500/40">
      <Lock className="h-2.5 w-2.5" />
      Premium
    </span>
  );
}

function FeatureIcon({
  item,
  color,
  size = "md",
}: {
  item: FeatureItem;
  color: string;
  size?: "md" | "lg";
}) {
  return (
    <div
      className={cn(
        "flex shrink-0 items-center justify-center rounded-xl",
        size === "lg" ? "h-14 w-14" : "h-11 w-11",
      )}
      style={{
        backgroundColor: `var(--${color}-secondary)`,
        color: `var(--${color})`,
      }}
    >
      <item.icon className={size === "lg" ? "h-6 w-6" : "h-5 w-5"} />
    </div>
  );
}

/** TENANT — Bento/Spotlight: first item is a large hero card, rest sit beside it. */
function TenantGroup({ group, color }: { group: FeatureGroup; color: string }) {
  const [spotlight, ...rest] = group.items;

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
      {spotlight && (
        <div
          className={cn(
            "relative overflow-hidden rounded-2xl border border-border bg-card p-7 shadow-sm lg:col-span-2 lg:row-span-2",
            spotlight.tier === "premium" && "ring-1 ring-amber-400/50",
          )}
        >
          {spotlight.tier === "premium" && <PremiumBadge />}
          <div
            className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full opacity-[0.07]"
            style={{ backgroundColor: `var(--${color})` }}
          />
          <FeatureIcon item={spotlight} color={color} size="lg" />
          <h4 className="mt-5 text-xl font-semibold text-foreground">
            {spotlight.title}
          </h4>
          <p className="mt-2 max-w-md text-sm text-muted-foreground">
            {spotlight.description}
          </p>
        </div>
      )}

      {rest.map((item) => (
        <div
          key={item.title}
          className={cn(
            "relative rounded-2xl border border-border bg-card p-5 shadow-sm",
            item.tier === "premium" && "ring-1 ring-amber-400/50",
          )}
        >
          {item.tier === "premium" && <PremiumBadge />}
          <FeatureIcon item={item} color={color} />
          <h4 className="mt-3 font-semibold text-foreground">{item.title}</h4>
          <p className="mt-1.5 text-sm text-muted-foreground">
            {item.description}
          </p>
        </div>
      ))}
    </div>
  );
}

/** OWNER — Ledger/List: numbered rows with dividers, like a portfolio statement. */
function OwnerGroup({ group, color }: { group: FeatureGroup; color: string }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
      {group.items.map((item, i) => (
        <div
          key={item.title}
          className={cn(
            "relative flex items-start gap-4 p-5 sm:items-center",
            i !== group.items.length - 1 && "border-b border-border",
            item.tier === "premium" && "bg-amber-50/50 dark:bg-amber-500/5",
          )}
        >
          <span
            className="hidden w-6 shrink-0 text-sm font-bold tabular-nums sm:block"
            style={{ color: `var(--${color})` }}
          >
            {String(i + 1).padStart(2, "0")}
          </span>
          <FeatureIcon item={item} color={color} />
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h4 className="font-semibold text-foreground">{item.title}</h4>
              {item.tier === "premium" && (
                <span className="inline-flex items-center gap-1 rounded-full bg-linear-to-r from-amber-400 to-amber-500 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-amber-950 shadow-sm shadow-amber-500/40">
                  <Lock className="h-2.5 w-2.5" />
                  Premium
                </span>
              )}
            </div>
            <p className="mt-1 text-sm text-muted-foreground">
              {item.description}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}

/** SUPPLIER — Network/Flow: cards chained by a connecting line + arrow. */
function SupplierGroup({
  group,
  color,
}: {
  group: FeatureGroup;
  color: string;
}) {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {group.items.map((item, i) => (
        <div key={item.title} className="relative">
          {i !== group.items.length - 1 && (
            <div
              className="absolute left-full top-11 z-0 hidden h-px w-6 lg:block"
              style={{
                backgroundImage: `repeating-linear-gradient(to right, var(--${color}) 0 4px, transparent 4px 8px)`,
              }}
            />
          )}
          <div
            className={cn(
              "relative z-10 rounded-2xl border border-border bg-card p-6 shadow-sm",
              item.tier === "premium" && "ring-1 ring-amber-400/50",
            )}
          >
            {item.tier === "premium" && <PremiumBadge />}
            <div className="flex items-center gap-3">
              <FeatureIcon item={item} color={color} />
              <span
                className="flex h-6 w-6 items-center justify-center rounded-full text-[11px] font-bold text-white"
                style={{ backgroundColor: `var(--${color})` }}
              >
                {i + 1}
              </span>
            </div>
            <h4 className="mt-4 font-semibold text-foreground">{item.title}</h4>
            <p className="mt-1.5 text-sm text-muted-foreground">
              {item.description}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}

function FeatureGroupLayout({
  group,
  color,
}: {
  group: FeatureGroup;
  color: Role;
}) {
  if (color === "tenant") return <TenantGroup group={group} color={color} />;
  if (color === "owner") return <OwnerGroup group={group} color={color} />;
  return <SupplierGroup group={group} color={color} />;
}

export function RoleContentSection({ content }: { content: RoleContent }) {
  const { badge, headline, description, groups, color } = content;

  return (
    <section className="py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <span
            className="inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wider"
            style={{
              backgroundColor: `var(--${color}-secondary)`,
              color: `var(--${color})`,
            }}
          >
            {badge}
          </span>
          <h2 className="font-heading mt-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            {headline}
          </h2>
          <p className="mt-4 text-muted-foreground">{description}</p>
        </div>

        <div className="mt-14 space-y-16">
          {groups.map((group) => (
            <div key={group.title}>
              <div
                className="mb-6 flex items-baseline gap-3 border-l-2 pl-4"
                style={{ borderColor: `var(--${color})` }}
              >
                <h3 className="text-lg font-semibold text-foreground">
                  {group.title}
                </h3>
              </div>
              {group.description && (
                <p className="mb-6 -mt-4 pl-4 text-sm text-muted-foreground">
                  {group.description}
                </p>
              )}

              <FeatureGroupLayout group={group} color={color} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
