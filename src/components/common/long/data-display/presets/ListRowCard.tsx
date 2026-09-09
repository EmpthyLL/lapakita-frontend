"use client";

import { cn } from "@/lib/utils";
import { ChevronRight } from "lucide-react";
import { ColumnDef } from "../Constant";

const ACCENT_TINTS = [
  "bg-info/10 text-info",
  "bg-destructive/10 text-destructive",
  "bg-success/10 text-success",
  "bg-warning/10 text-warning",
];

export function ListRowCard<TData>({
  row,
  index,
  columns,
}: {
  row: TData;
  index: number;
  columns: ColumnDef<TData>[];
}) {
  const titleColumn = columns.find((c) => c.primary) ?? columns[0];
  const metaColumns = columns.filter(
    (c) => c.key !== titleColumn?.key && !c.hideInPreset,
  );

  const titleValue = titleColumn
    ? titleColumn.render
      ? titleColumn.render(row[titleColumn.key], row)
      : String(row[titleColumn.key] ?? "")
    : null;

  const initial =
    typeof titleValue === "string" && titleValue.length > 0
      ? titleValue.charAt(0).toUpperCase()
      : "•";

  return (
    <div className="group flex items-center gap-4 rounded-2xl border border-border bg-card p-4 transition-all hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-md hover:shadow-primary/5">
      <span
        className={cn(
          "flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl text-sm font-bold",
          ACCENT_TINTS[index % ACCENT_TINTS.length],
        )}
      >
        {initial}
      </span>

      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold text-foreground">
          {titleValue}
        </p>
        <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
          {metaColumns.map((col) => {
            const Icon = col.icon;
            const value = col.render
              ? col.render(row[col.key], row)
              : String(row[col.key] ?? "");
            return (
              <span
                key={String(col.key)}
                className="flex items-center gap-1 rounded-lg bg-secondary/60 px-2 py-0.5 text-[11px] font-medium text-muted-foreground"
              >
                {Icon && <Icon className="h-3 w-3 text-primary" />}
                {value}
              </span>
            );
          })}
        </div>
      </div>

      <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground/50 transition-transform group-hover:translate-x-0.5 group-hover:text-primary" />
    </div>
  );
}
