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
  ColumnConfig,
  DataDisplayActionContext,
  DataDisplayDetail,
  DataDisplayForm,
  DataDisplaySurface,
} from "./Constant";
import { EmptyState, RowIndexBadge, SkeletonRows } from "./TableStates";

interface DataDisplayTableProps<TData> {
  columns: ColumnConfig<TData>;
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
  const fieldColumns = columns.fields ?? [];
  const actionColumns = columns.actions ?? [];
  const totalColumnCount = fieldColumns.length + actionColumns.length + 1; // ditambah kolom checkbox/index

  return (
    <div className="overflow-hidden rounded-2xl border border-border shadow-sm">
      <div className="overflow-auto">
        <Table>
          <TableHeader>
            <TableRow className="border-b border-primary/15 bg-primary/5 hover:bg-primary/5">
              <TableHead className="w-10" />
              {/* Render Field Headers */}
              {fieldColumns.map((fieldCol) => {
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

              {/* Render Action Headers */}
              {actionColumns.map((actionCol, idx) => (
                <TableHead
                  key={`action-head-${idx}`}
                  className={cn(
                    "w-24 text-right text-xs font-semibold tracking-wide text-primary/80",
                    actionCol.className,
                  )}
                >
                  <span className="flex items-center justify-end gap-1.5">
                    {actionCol.icon && <actionCol.icon className="h-3 w-3" />}
                    {actionCol.header ?? "Actions"}
                  </span>
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>

          <TableBody
            className={cn(isRefetching && "opacity-60 transition-opacity")}
          >
            {isLoading ? (
              <SkeletonRows columnCount={totalColumnCount} />
            ) : rows.length === 0 ? (
              <EmptyState columnCount={totalColumnCount} text={emptyText} />
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

                      {/* Render Field Cells */}
                      {fieldColumns.map((fieldCol) => {
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

                      {/* Render Action Cells */}
                      {actionColumns.map((actionCol, colIdx) => (
                        <TableCell
                          key={`action-cell-${colIdx}`}
                          className={cn("w-24 text-right", actionCol.className)}
                          onClick={(event) => event.stopPropagation()}
                        >
                          <div className="flex justify-end">
                            {actionCol.render(row, index, rowActionCtx)}
                          </div>
                        </TableCell>
                      ))}
                    </TableRow>

                    {/* Expandable Detail Row */}
                    {detailIsExpandable && detail && detail.component && (
                      <TableRow key={`${String(row[rowKey])}-detail`}>
                        <TableCell colSpan={totalColumnCount}>
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
                                {detail.component({
                                  row,
                                  index,
                                  mode: "view",
                                  close: () => openDetailExpandable(row, index),
                                })}
                              </div>
                            </div>
                          </div>
                        </TableCell>
                      </TableRow>
                    )}

                    {/* Expandable Form Row */}
                    {formIsExpandable && form && (
                      <TableRow key={`${String(row[rowKey])}-form`}>
                        <TableCell colSpan={totalColumnCount}>
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
