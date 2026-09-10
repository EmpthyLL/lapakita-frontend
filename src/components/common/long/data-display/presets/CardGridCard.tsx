"use client";

import { cn } from "@/lib/utils";
import { ActionColumnDef, ColumnDef, FieldColumnDef } from "../Constant";
import { renderActionConfig } from "./ActionRenderer";

const GLOW_TINTS = [
  "bg-info/15",
  "bg-destructive/15",
  "bg-success/15",
  "bg-warning/15",
];

const NUMBER_BADGE_COLORS = [
  "text-info bg-info/10 border-info/20",
  "text-destructive bg-destructive/10 border-destructive/20",
  "text-success bg-success/10 border-success/20",
  "text-warning bg-warning/10 border-warning/20",
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
  const titleColumn =
    columns.find((c) => "key" in c && c.primary) ?? columns[0];
  const titleKey = "key" in titleColumn ? titleColumn.key : undefined;

  const allFieldColumns: FieldColumnDef<TData, keyof TData>[] = [];
  for (const column of columns) {
    if ("key" in column && column.key !== titleKey) {
      allFieldColumns.push(column as FieldColumnDef<TData, keyof TData>);
    }
  }
  const badgeColumn = allFieldColumns.find((c) => !c.hideInPreset);
  const metaColumns = allFieldColumns.filter(
    (c) => c.key !== badgeColumn?.key && !c.hideInPreset,
  );

  const actionColumns: ActionColumnDef<TData>[] = [];
  for (const column of columns) {
    if ("kind" in column && column.kind === "action" && !column.hideInPreset) {
      actionColumns.push(column);
    }
  }

  const titleValue = titleColumn
    ? "key" in titleColumn && titleColumn.render
      ? titleColumn.render(row[titleColumn.key], row)
      : "key" in titleColumn
        ? String(row[titleColumn.key] ?? "")
        : ""
    : null;

  // Format nomor urut menjadi 2 digit (contoh: 01, 02, dst.)
  const displayIndex = String(index + 1).padStart(2, "0");
  const badgeColorClass =
    NUMBER_BADGE_COLORS[index % NUMBER_BADGE_COLORS.length];

  return (
    <div className="group relative overflow-hidden rounded-3xl border border-border bg-card p-5 shadow-xs transition-all hover:-translate-y-1 hover:border-primary/40 hover:shadow-md">
      <div
        className={cn(
          "pointer-events-none absolute right-0 top-0 h-24 w-24 -translate-y-6 translate-x-6 rounded-full blur-2xl transition-opacity group-hover:opacity-80",
          GLOW_TINTS[index % GLOW_TINTS.length],
        )}
      />

      <div className="relative flex min-w-0 items-center gap-3">
        <span
          className={cn(
            "flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border font-mono font-bold shadow-xs transition-transform group-hover:scale-105",
            badgeColorClass,
          )}
        >
          {displayIndex}
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

          {actionColumns.length > 0 && (
            <div className="ml-auto flex items-center justify-end gap-2 pt-1">
              {actionColumns.map((col) => {
                const actionRenderer = renderActionConfig(row, col.action);

                return (
                  <div
                    key={String(col.header ?? "action")}
                    className="flex items-center justify-end"
                  >
                    {actionRenderer}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {metaColumns.length === 0 && actionColumns.length > 0 && (
        <div className="relative mt-4 flex justify-end border-t border-border/60 pt-3">
          {actionColumns.map((col) => {
            const actionRenderer = renderActionConfig(row, col.action);

            return (
              <div
                key={String(col.header ?? "action")}
                className="flex items-center justify-end"
              >
                {actionRenderer}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
