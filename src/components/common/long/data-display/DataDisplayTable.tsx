"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { ChevronRight } from "lucide-react";
import { Fragment } from "react";
import {
  ColumnDef,
  DataDisplayActionContext,
  DataDisplayDetail,
  DataDisplayForm,
  DataDisplaySurface,
  FieldColumnDef,
} from "./Constant";
import { EmptyState, RowIndexBadge, SkeletonRows } from "./TableStates";

interface DataDisplayTableProps<TData> {
  columns: ColumnDef<TData>[];
  rows: TData[];
  rowKey: keyof TData;
  isLoading: boolean;
  isRefetching: boolean;
  emptyText?: string;
  detailIsExpandable: boolean;
  formIsExpandable: boolean;
  detail?: DataDisplayDetail<TData>;
  form?: DataDisplayForm<TData>;
  activeDetail: {
    row?: TData;
    index?: number;
    type: DataDisplaySurface;
  } | null;
  activeForm: {
    kind: "create" | "edit";
    row?: TData;
    index?: number;
    type: DataDisplaySurface;
    close: () => void;
  } | null;
  onRowClick?: (
    row: TData,
    index: number,
    action: DataDisplayActionContext<TData>,
  ) => void;
  getActionContext: (
    row: TData,
    index: number,
  ) => DataDisplayActionContext<TData>;
  openDetailExpandable: (row: TData, index: number) => void;
}

export function DataDisplayTable<TData>({
  columns,
  rows,
  rowKey,
  isLoading,
  isRefetching,
  emptyText,
  detailIsExpandable,
  formIsExpandable,
  detail,
  form,
  activeDetail,
  activeForm,
  onRowClick,
  getActionContext,
  openDetailExpandable,
}: DataDisplayTableProps<TData>) {
  return (
    <div className="overflow-hidden rounded-2xl border border-border shadow-sm">
      <div className="overflow-auto">
        <Table>
          <TableHeader>
            <TableRow className="border-b border-primary/15 bg-primary/5 hover:bg-primary/5">
              <TableHead className="w-10" />
              {columns.map((col, idx) => {
                if ("kind" in col && col.kind === "action") {
                  return (
                    <TableHead
                      key={`action-head-${idx}`}
                      className={cn(
                        "w-24 text-right text-xs font-semibold tracking-wide text-primary/80",
                        col.className,
                      )}
                    >
                      <span className="flex items-center justify-end gap-1.5">
                        {col.icon && <col.icon className="h-3 w-3" />}
                        {col.header ?? "Actions"}
                      </span>
                    </TableHead>
                  );
                }

                const fieldCol = col as FieldColumnDef<TData, keyof TData>;
                const Icon = fieldCol.icon;
                return (
                  <TableHead
                    key={String(fieldCol.key)}
                    className={cn(
                      "text-xs font-semibold tracking-wide text-primary/80",
                      fieldCol.className,
                    )}
                  >
                    <span className="flex items-center gap-1.5">
                      {Icon && <Icon className="h-3 w-3 text-primary" />}
                      {fieldCol.header}
                    </span>
                  </TableHead>
                );
              })}
            </TableRow>
          </TableHeader>

          <TableBody
            className={cn(isRefetching && "opacity-60 transition-opacity")}
          >
            {isLoading ? (
              <SkeletonRows columnCount={columns.length + 1} />
            ) : rows.length === 0 ? (
              <EmptyState columnCount={columns.length + 1} text={emptyText} />
            ) : (
              rows.map((row, index) => {
                const rowActionCtx = getActionContext(row, index);
                const isDetailExpanded =
                  detailIsExpandable &&
                  activeDetail?.row === row &&
                  activeDetail.type === "expandable";
                const isFormExpanded =
                  formIsExpandable &&
                  activeForm?.row === row &&
                  activeForm.type === "expandable";

                return (
                  <Fragment key={String(row[rowKey])}>
                    <TableRow
                      className={cn(
                        "group border-l-2 border-l-transparent transition-colors",
                        "hover:border-l-primary hover:bg-primary/4",
                        onRowClick && "cursor-pointer",
                        index % 2 === 1 && "bg-secondary/20",
                      )}
                      onClick={() => onRowClick?.(row, index, rowActionCtx)}
                      tabIndex={onRowClick ? 0 : undefined}
                      role={onRowClick ? "button" : undefined}
                    >
                      <TableCell className="w-10">
                        <div className="flex items-center gap-1">
                          {detailIsExpandable && (
                            <button
                              type="button"
                              aria-label="Toggle details"
                              className="rounded p-1 text-muted-foreground transition-colors hover:bg-primary/10 hover:text-primary"
                              onClick={(event) => {
                                event.stopPropagation();
                                openDetailExpandable(row, index);
                              }}
                            >
                              <ChevronRight
                                className={cn(
                                  "h-4 w-4 transition-transform duration-300",
                                  isDetailExpanded && "rotate-90",
                                )}
                              />
                            </button>
                          )}
                          <RowIndexBadge index={index} />
                        </div>
                      </TableCell>
                      {columns.map((col, colIdx) => {
                        if ("kind" in col && col.kind === "action") {
                          return (
                            <TableCell
                              key={`action-cell-${colIdx}`}
                              className={cn("w-24 text-right", col.className)}
                              onClick={(event) => event.stopPropagation()}
                            >
                              <div className="flex justify-end">
                                {col.render(row, index, rowActionCtx)}
                              </div>
                            </TableCell>
                          );
                        }

                        const fieldCol = col as FieldColumnDef<
                          TData,
                          keyof TData
                        >;
                        const val = row[fieldCol.key];

                        return (
                          <TableCell
                            key={String(fieldCol.key)}
                            className={fieldCol.className}
                          >
                            {fieldCol.render
                              ? fieldCol.render(val, row, index)
                              : String(val ?? "")}
                          </TableCell>
                        );
                      })}
                    </TableRow>

                    {detailIsExpandable && detail && detail.component && (
                      <TableRow key={`${String(row[rowKey])}-detail`}>
                        <TableCell colSpan={columns.length + 1}>
                          <div
                            className={cn(
                              "grid transition-[grid-template-rows] duration-300 ease-out",
                              isDetailExpanded
                                ? "grid-rows-[1fr]"
                                : "grid-rows-[0fr]",
                            )}
                          >
                            <div className="min-h-0 overflow-hidden">
                              <div className="border-t border-border/60 py-3">
                                {detail.component({ row, index })}
                              </div>
                            </div>
                          </div>
                        </TableCell>
                      </TableRow>
                    )}

                    {formIsExpandable && form && (
                      <TableRow key={`${String(row[rowKey])}-form`}>
                        <TableCell colSpan={columns.length + 1}>
                          <div
                            className={cn(
                              "grid transition-[grid-template-rows] duration-300 ease-out",
                              isFormExpanded
                                ? "grid-rows-[1fr]"
                                : "grid-rows-[0fr]",
                            )}
                          >
                            <div className="min-h-0 overflow-hidden">
                              <div className="border-t border-border/60 py-3">
                                {form.component({
                                  row: activeForm?.row,
                                  index: activeForm?.index,
                                  mode: activeForm?.kind ?? "edit",
                                  close: activeForm?.close ?? (() => {}),
                                })}
                              </div>
                            </div>
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </Fragment>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
