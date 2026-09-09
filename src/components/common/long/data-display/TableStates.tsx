"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { TableCell, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { Inbox } from "lucide-react";
import { useTranslations } from "next-intl";

export function RowIndexBadge({ index }: { index: number }) {
  const tints = [
    "bg-primary/10 text-primary",
    "bg-primary/15 text-primary",
    "bg-primary/[0.08] text-primary/80",
  ];
  const tint = tints[index % tints.length];
  return (
    <span
      className={cn(
        "flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[11px] font-semibold",
        tint,
      )}
    >
      {index + 1}
    </span>
  );
}

export function SkeletonRows({
  columnCount,
  rows = 6,
}: {
  columnCount: number;
  rows?: number;
}) {
  return (
    <>
      {Array.from({ length: rows }).map((_, r) => (
        <TableRow key={`skeleton-${r}`} className="hover:bg-transparent">
          {Array.from({ length: columnCount }).map((_, c) => (
            <TableCell key={c}>
              <Skeleton
                className="h-4 rounded-full bg-primary/10"
                style={{
                  width: c === 0 ? "60%" : `${60 + ((r + c) % 3) * 10}%`,
                }}
              />
            </TableCell>
          ))}
        </TableRow>
      ))}
    </>
  );
}

export function EmptyState({
  columnCount,
  text,
}: {
  columnCount: number;
  text?: string;
}) {
  const t = useTranslations("common.display_table");

  return (
    <TableRow className="hover:bg-transparent">
      <TableCell colSpan={columnCount} className="py-14 text-center">
        <div className="flex flex-col items-center gap-2">
          <span className="flex h-11 w-11 items-center justify-center rounded-full bg-primary/10 text-primary">
            <Inbox className="h-5 w-5" />
          </span>
          <p className="text-sm font-medium text-foreground">
            {text || t("empty_title")}
          </p>
          <p className="text-xs text-muted-foreground">{t("empty_subtitle")}</p>
        </div>
      </TableCell>
    </TableRow>
  );
}
