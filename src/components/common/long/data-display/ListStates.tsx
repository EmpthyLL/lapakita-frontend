"use client";

import { cn } from "@/lib/utils";
import { Inbox } from "lucide-react";
import { useTranslations } from "next-intl";

export function ListRowSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="flex flex-col gap-3">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="flex items-center gap-4 rounded-2xl border border-border bg-card p-4"
        >
          <div className="h-11 w-11 shrink-0 animate-pulse rounded-2xl bg-secondary" />
          <div className="flex-1 space-y-2">
            <div className="h-3.5 w-40 animate-pulse rounded-full bg-secondary" />
            <div className="flex gap-1.5">
              <div className="h-5 w-16 animate-pulse rounded-lg bg-secondary/70" />
              <div className="h-5 w-20 animate-pulse rounded-lg bg-secondary/70" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export function CardSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="space-y-4 rounded-3xl border border-border bg-card p-5 shadow-sm"
        >
          <div className="flex items-center gap-3">
            <div className="size-12 shrink-0 animate-pulse rounded-2xl bg-secondary" />
            <div className="space-y-2">
              <div className="h-4 w-32 animate-pulse rounded-full bg-secondary" />
              <div className="h-3 w-20 animate-pulse rounded-full bg-secondary/70" />
            </div>
          </div>
          <div className="space-y-2 border-t border-border/60 pt-3">
            <div className="h-3 w-full animate-pulse rounded-full bg-secondary" />
            <div className="h-3 w-3/4 animate-pulse rounded-full bg-secondary/70" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function DataEmptyState({ text }: { text?: string }) {
  const t = useTranslations("common.display_table");
  return (
    <div className="flex flex-col items-center justify-center gap-2 rounded-3xl border border-dashed border-border bg-card py-20 text-center">
      <span className="flex size-14 items-center justify-center rounded-2xl bg-primary/10 text-primary shadow-xs">
        <Inbox className="size-6" />
      </span>
      <p className="mt-2 text-base font-bold text-foreground">
        {text || t("empty_title")}
      </p>
      <p className="max-w-xs text-xs text-muted-foreground">
        {t("empty_subtitle")}
      </p>
    </div>
  );
}

export function ListFooterCount({
  count,
  total,
  updating,
  className,
}: {
  count: number;
  total?: number;
  updating?: boolean;
  className?: string;
}) {
  const t = useTranslations("common.display_table");
  return (
    <div
      className={cn(
        "flex items-center gap-2 text-sm text-muted-foreground",
        className,
      )}
    >
      <span className="relative flex h-2 w-2 items-center justify-center">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary/40 opacity-75" />
        <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-primary" />
      </span>
      <span>
        {t("showing")}{" "}
        <span className="font-semibold text-foreground">{count}</span>
        {total !== undefined && (
          <>
            {" "}
            {t("of")}{" "}
            <span className="font-semibold text-foreground">{total}</span>
          </>
        )}{" "}
        {t("rows")}
      </span>
      {updating && (
        <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
          {t("updating")}
        </span>
      )}
    </div>
  );
}
