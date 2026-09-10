"use client";

import { cn } from "@/lib/utils";
import { ChevronRight } from "lucide-react";
import { ActionColumnDef, ColumnDef, FieldColumnDef } from "../Constant";

const NUMBER_BADGE_COLORS = [
  "text-info bg-info/10 border-info/20",
  "text-destructive bg-destructive/10 border-destructive/20",
  "text-success bg-success/10 border-success/20",
  "text-warning bg-warning/10 border-warning/20",
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
  const fieldColumns = columns.filter(
    (c): c is FieldColumnDef<TData, keyof TData> =>
      !("kind" in c && c.kind === "action"),
  ) as FieldColumnDef<TData, keyof TData>[];

  const titleColumn = fieldColumns.find((c) => c.primary) ?? fieldColumns[0];
  const titleKey = titleColumn?.key;

  const metaColumns: FieldColumnDef<TData, keyof TData>[] = [];
  for (const column of fieldColumns) {
    if (column.key !== titleKey && !column.hideInPreset) {
      metaColumns.push(column);
    }
  }

  const actionColumns: ActionColumnDef<TData>[] = [];
  for (const column of columns) {
    if ("kind" in column && column.kind === "action" && !column.hideInPreset) {
      actionColumns.push(column);
    }
  }

  const titleValue = titleColumn
    ? titleColumn.render
      ? titleColumn.render(row[titleColumn.key], row, index)
      : String(row[titleColumn.key] ?? "")
    : null;

  const displayIndex = String(index + 1).padStart(2, "0");
  const badgeColorClass =
    NUMBER_BADGE_COLORS[index % NUMBER_BADGE_COLORS.length];

  return (
    <div className="group flex items-center gap-4 rounded-2xl border border-border bg-card p-4 transition-all hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-md hover:shadow-primary/5">
      <span
        className={cn(
          "flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border font-mono font-bold",
          badgeColorClass,
        )}
      >
        {displayIndex}
      </span>

      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold text-foreground">
          {titleValue}
        </p>
        <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
          {metaColumns.map((col) => {
            const Icon = col.icon;
            const value = col.render
              ? col.render(row[col.key], row, index)
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

      <div className="ml-auto flex items-center gap-2">
        {actionColumns.map((col, cIdx) => {
          const actionNode = col.render(row, index);

          return (
            <div
              key={`list-action-${cIdx}`}
              className="flex items-center justify-end"
            >
              {actionNode}
            </div>
          );
        })}

        <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground/50 transition-transform group-hover:translate-x-0.5 group-hover:text-primary" />
      </div>
    </div>
  );
}
