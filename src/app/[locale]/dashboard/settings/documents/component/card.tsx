"use client";

import {
  ActionColumnDef,
  ColumnDef,
  FieldColumnDef,
} from "@/components/common/long/data-display/Constant";
import { GetDocumentData } from "@/lib/data/schema/user/document";
import { FileText } from "lucide-react";

interface DocumentCardProps {
  row: GetDocumentData;
  index: number;
  columns: ColumnDef<GetDocumentData>[];
}

export function DocumentCard({ row, index, columns }: DocumentCardProps) {
  const fieldColumns = columns.filter(
    (
      column,
    ): column is FieldColumnDef<GetDocumentData, keyof GetDocumentData> =>
      !("kind" in column && column.kind === "action") && !column.hideInPreset,
  );
  const actionColumns = columns.filter(
    (column): column is ActionColumnDef<GetDocumentData> =>
      "kind" in column && column.kind === "action" && !column.hideInPreset,
  );
  const primaryColumn =
    fieldColumns.find((column) => column.primary) ?? fieldColumns[0];
  const secondaryColumns = fieldColumns.filter(
    (column) => column.key !== primaryColumn?.key,
  );

  const renderField = (
    column: FieldColumnDef<GetDocumentData, keyof GetDocumentData>,
  ) =>
    column.render
      ? column.render(row[column.key], row, index)
      : String(row[column.key] ?? "");

  return (
    <div className="group relative overflow-hidden rounded-3xl border border-border bg-card shadow-xs transition-all hover:shadow-md hover:border-primary/40 flex flex-col justify-between">
      <div className="relative aspect-video w-full overflow-hidden bg-muted/40 border-b border-border flex items-center justify-center">
        {row.ktp_photo_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={row.ktp_photo_url}
            alt="KTP Preview"
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="text-muted-foreground text-xs flex flex-col items-center">
            <FileText className="h-8 w-8 mb-1 text-primary" />
            <span>No image available</span>
          </div>
        )}
      </div>

      <div className="p-5 space-y-4">
        <div className="space-y-3">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <h4 className="truncate text-sm font-semibold text-foreground">
                {primaryColumn ? renderField(primaryColumn) : ""}
              </h4>
              {secondaryColumns[0] && (
                <p className="truncate text-[11px] text-muted-foreground font-mono">
                  {secondaryColumns[0].header}:{" "}
                  {renderField(secondaryColumns[0])}
                </p>
              )}
            </div>

            <div className="flex shrink-0 items-center gap-2">
              {actionColumns.map((column, actionIndex) => (
                <div key={`action-${actionIndex}`}>
                  {column.render(row, index)}
                </div>
              ))}
            </div>
          </div>

          <div className="grid gap-2 border-t border-border pt-3 text-xs text-muted-foreground">
            {secondaryColumns.slice(1).map((column) => (
              <div
                key={String(column.key)}
                className="flex min-w-0 items-start gap-2"
              >
                {column.icon && (
                  <column.icon className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" />
                )}
                <span className="min-w-0 truncate">
                  {column.header}:{" "}
                  <strong className="font-medium text-foreground">
                    {renderField(column)}
                  </strong>
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
