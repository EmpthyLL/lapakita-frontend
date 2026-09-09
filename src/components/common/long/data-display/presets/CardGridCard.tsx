"use client";

import { cn } from "@/lib/utils";
import { ColumnDef } from "../Constant";

const GLOW_TINTS = [
  "bg-info/15",
  "bg-destructive/15",
  "bg-success/15",
  "bg-warning/15",
];

export function CardGridCard<TData>({
  row,
  index,
  columns,
}: {
  row: TData;
  index: number;
  columns: ColumnDef<TData>[];
}) {
  const titleColumn = columns.find((c) => c.primary) ?? columns[0];
  const badgeColumn = columns.find(
    (c) => c.key !== titleColumn?.key && !c.hideInPreset,
  );
  const metaColumns = columns.filter(
    (c) =>
      c.key !== titleColumn?.key &&
      c.key !== badgeColumn?.key &&
      !c.hideInPreset,
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
    <div className="group relative overflow-hidden rounded-3xl border border-border bg-card p-5 shadow-xs transition-all hover:-translate-y-1 hover:border-primary/40 hover:shadow-md">
      <div
        className={cn(
          "pointer-events-none absolute right-0 top-0 h-24 w-24 -translate-y-6 translate-x-6 rounded-full blur-2xl transition-opacity group-hover:opacity-80",
          GLOW_TINTS[index % GLOW_TINTS.length],
        )}
      />

      <div className="relative flex min-w-0 items-center gap-3">
        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-base font-bold text-primary shadow-xs transition-transform group-hover:scale-105">
          {initial}
        </span>
        <div className="min-w-0">
          <h3 className="truncate text-sm font-bold text-foreground">
            {titleValue}
          </h3>
          {badgeColumn && (
            <p className="mt-0.5 truncate text-xs text-muted-foreground">
              {badgeColumn.render
                ? badgeColumn.render(row[badgeColumn.key], row)
                : String(row[badgeColumn.key] ?? "")}
            </p>
          )}
        </div>
      </div>

      {metaColumns.length > 0 && (
        <div className="relative mt-4 flex flex-wrap items-center gap-1.5 border-t border-border/60 pt-3">
          {metaColumns.map((col) => {
            const Icon = col.icon;
            const value = col.render
              ? col.render(row[col.key], row)
              : String(row[col.key] ?? "");
            return (
              <span
                key={String(col.key)}
                className="flex items-center gap-1 rounded-lg bg-secondary px-2 py-1 text-[11px] font-medium text-foreground"
              >
                {Icon && <Icon className="h-3 w-3 text-primary" />}
                {value}
              </span>
            );
          })}
        </div>
      )}
    </div>
  );
}
