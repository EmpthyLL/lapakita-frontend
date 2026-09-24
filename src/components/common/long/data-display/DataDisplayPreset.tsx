"use client";

import { cn } from "@/lib/utils";
import { ChevronRight } from "lucide-react";
import {
  DataDisplayActionContext,
  DataDisplayDetail,
  DataDisplayForm,
  DataDisplaySurface,
} from "./Constant";

interface DataDisplayPresetProps<TData> {
  rows: TData[];
  rowKey: keyof TData;
  variant: "list" | "card";
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
  renderPresetItem: (row: TData, index: number) => React.ReactNode;
}

export function DataDisplayPreset<TData>({
  rows,
  rowKey,
  variant,
  detailIsExpandable,
  formIsExpandable,
  detail,
  form,
  activeDetail,
  activeForm,
  onRowClick,
  getActionContext,
  openDetailExpandable,
  renderPresetItem,
}: DataDisplayPresetProps<TData>) {
  return (
    <div
      className={cn(
        variant === "card"
          ? "grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
          : "flex flex-col gap-3",
      )}
    >
      {rows.map((row, index) => {
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
          <div
            key={String(row[rowKey])}
            className={cn(
              "flex flex-col",
              variant === "card" && (detailIsExpandable || formIsExpandable)
                ? "col-span-full sm:col-span-1"
                : "",
            )}
          >
            <div
              className={cn(
                "flex items-start gap-2",
                onRowClick && "cursor-pointer",
              )}
              onClick={() => onRowClick?.(row, index, rowActionCtx)}
              tabIndex={onRowClick ? 0 : undefined}
              role={onRowClick ? "button" : undefined}
            >
              {detailIsExpandable && (
                <button
                  type="button"
                  aria-label="Toggle details"
                  className="mt-4 shrink-0 rounded p-1 text-muted-foreground transition-colors hover:bg-primary/10 hover:text-primary"
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
              <div className="min-w-0 flex-1">
                {renderPresetItem(row, index)}
              </div>
            </div>

            {/* Expandable Detail */}
            {detailIsExpandable && detail && detail.component && (
              <div
                className={cn(
                  "grid transition-[grid-template-rows] duration-300 ease-out w-full",
                  isDetailExpanded ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
                )}
              >
                <div className="min-h-0 overflow-hidden">
                  <div className="border-t border-border/60 pt-3 pb-2 mt-2 px-1">
                    {detail.component({
                      row,
                      index,
                      mode: "view",
                      close: () => openDetailExpandable(row, index),
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* Expandable Form */}
            {formIsExpandable && form && (
              <div
                className={cn(
                  "grid transition-[grid-template-rows] duration-300 ease-out w-full",
                  isFormExpanded ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
                )}
              >
                <div className="min-h-0 overflow-hidden">
                  <div className="border-t border-border/60 pt-3 pb-2 mt-2 px-1">
                    {form.component({
                      row: activeForm?.row,
                      index: activeForm?.index,
                      mode: activeForm?.kind ?? "edit",
                      close: activeForm?.close ?? (() => {}),
                    })}
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
