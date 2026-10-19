"use client";

import ConfirmDialog from "@/components/common/ConfirmDialog";
import { DeleteConfirmDialog } from "@/components/common/DeleteDialog";
import DialogWrapper from "@/components/common/DialogWrapper";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { X } from "lucide-react";

import type { ReactNode } from "react";

export type SurfaceType = "dialog" | "sidebar" | "expandable" | "link";

export interface SurfaceConfig {
  type?: SurfaceType;
  title?: ReactNode;
  description?: ReactNode;
  href?: string;
  size?: "sm" | "md" | "lg" | "xl" | "full";
}

export interface SurfaceComponentProps<TData> {
  row?: TData;
  index?: number;
  mode?: "create" | "edit" | "view";
  close: () => void;
}

export type SurfaceDetail<TData> = SurfaceConfig & {
  component: (props: SurfaceComponentProps<TData>) => ReactNode;
};

export type SurfaceForm<TData> = SurfaceConfig & {
  component: (props: SurfaceComponentProps<TData>) => ReactNode;
};

export type DataDisplaySurface = SurfaceType;
export type DataDisplaySurfaceComponentProps<TData> =
  SurfaceComponentProps<TData>;
export type DataDisplayForm<TData> = SurfaceForm<TData>;
export type DataDisplayDetail<TData> = SurfaceDetail<TData>;
export type DataDisplayConfirmOptions = ConfirmDialogOptions;

export interface AddActionConfig<TData> {
  label?: ReactNode;
  form: SurfaceForm<TData>;
}

export interface ConfirmDialogOptions {
  title?: string;
  description?: ReactNode;
  confirmText?: string;
  cancelText?: string;
  itemName?: string;
  variant?: "destructive" | "warning" | "info" | "success";
}

interface ActiveForm<TData> {
  kind: "create" | "edit";
  row?: TData;
  index?: number;
  type: SurfaceType;
  close: () => void;
}

interface ActiveDetail<TData> {
  row?: TData;
  index?: number;
  type: SurfaceType;
}

interface SurfaceRendererProps<TData> {
  form?: SurfaceForm<TData>;
  activeForm?: ActiveForm<TData> | null;
  onCloseForm?: () => void;
  detail?: SurfaceDetail<TData>;
  activeDetail?: ActiveDetail<TData> | null;
  onCloseDetail?: () => void;
  activeConfirm?: {
    onConfirm: () => void;
    options: ConfirmDialogOptions;
  } | null;
  onCloseConfirm?: () => void;
  activeDelete?: { onDelete: () => void; itemName?: string } | null;
  onCloseDelete?: () => void;
}

export function SurfaceRenderer<TData>({
  form,
  activeForm = null,
  onCloseForm = () => activeForm?.close(),
  detail,
  activeDetail = null,
  onCloseDetail = () => {},
  activeConfirm = null,
  onCloseConfirm = () => {},
  activeDelete = null,
  onCloseDelete = () => {},
}: SurfaceRendererProps<TData>) {
  const formIsRenderable =
    form && (activeForm?.kind === "create" || activeForm?.row !== undefined);
  const detailIsRenderable = detail && activeDetail?.row !== undefined;

  const renderForm = () =>
    formIsRenderable && activeForm
      ? form.component({
          row: activeForm.row,
          index: activeForm.index,
          mode: activeForm.kind,
          close: onCloseForm,
        })
      : null;

  const renderDetail = () =>
    detailIsRenderable && activeDetail
      ? detail.component({
          row: activeDetail.row,
          index: activeDetail.index ?? 0,
          mode: "view",
          close: onCloseDetail,
        })
      : null;

  return (
    <>
      <>
        <>
          <Sheet
            open={activeForm?.type === "sidebar"}
            onOpenChange={(open) => !open && onCloseForm()}
          >
            <SheetContent
              side="left"
              className="flex w-full max-w-96 flex-col gap-4 overflow-hidden p-5"
            >
              {formIsRenderable && activeForm?.type === "sidebar" && (
                <>
                  <SheetHeader className="space-y-1 p-0 text-left">
                    {form.title && (
                      <SheetTitle className="text-base font-semibold">
                        {form.title}
                      </SheetTitle>
                    )}
                    {form.description && (
                      <SheetDescription className="truncate text-xs">
                        {form.description}
                      </SheetDescription>
                    )}
                  </SheetHeader>
                  <div className="flex-1 overflow-y-auto p-0">
                    {renderForm()}
                  </div>
                </>
              )}
            </SheetContent>
          </Sheet>

          <Sheet
            open={activeDetail?.type === "sidebar"}
            onOpenChange={(open) => !open && onCloseDetail()}
          >
            <SheetContent
              side="right"
              className="flex w-full max-w-96 flex-col gap-4 overflow-hidden p-5"
            >
              {detailIsRenderable && activeDetail?.type === "sidebar" && (
                <>
                  <SheetHeader className="space-y-1 p-0 text-left">
                    {detail.title && (
                      <SheetTitle className="text-base font-semibold">
                        {detail.title}
                      </SheetTitle>
                    )}
                    {detail.description && (
                      <SheetDescription className="truncate text-xs">
                        {detail.description}
                      </SheetDescription>
                    )}
                  </SheetHeader>
                  <div className="flex-1 overflow-y-auto p-0">
                    {renderDetail()}
                  </div>
                </>
              )}
            </SheetContent>
          </Sheet>
        </>
      </>

      <>
        <>
          {form && (
            <DialogWrapper
              open={activeForm?.type === "dialog"}
              onOpenChange={(open) => !open && onCloseForm()}
              title={form.title}
              desc={form.description}
              size={form.size ?? "lg"}
            >
              {activeForm?.type === "dialog" && renderForm()}
            </DialogWrapper>
          )}

          {detail && (
            <DialogWrapper
              open={activeDetail?.type === "dialog"}
              onOpenChange={(open) => !open && onCloseDetail()}
              title={detail.title}
              desc={detail.description}
              size={detail.size ?? "lg"}
            >
              {activeDetail?.type === "dialog" && renderDetail()}
            </DialogWrapper>
          )}
        </>
      </>

      <>
        <ConfirmDialog
          open={Boolean(activeConfirm)}
          onOpenChange={(open) => !open && onCloseConfirm()}
          onContinue={() => {
            activeConfirm?.onConfirm();
            onCloseConfirm();
          }}
          {...(activeConfirm?.options ?? {})}
        />

        <DeleteConfirmDialog
          open={Boolean(activeDelete)}
          onOpenChange={(open) => !open && onCloseDelete()}
          onConfirm={() => {
            activeDelete?.onDelete();
            onCloseDelete();
          }}
          itemName={activeDelete?.itemName}
        />
      </>

      {activeForm?.type === "expandable" && formIsRenderable && (
        <section className="overflow-hidden rounded-2xl border border-border bg-card p-5 shadow-sm">
          <header className="mb-3 flex items-center justify-between border-b border-border pb-3">
            <div>
              {form.title && (
                <h3 className="text-sm font-semibold text-foreground">
                  {form.title}
                </h3>
              )}
              {form.description && (
                <p className="text-xs text-muted-foreground">
                  {form.description}
                </p>
              )}
            </div>
            <Button
              variant="ghost"
              size="icon-sm"
              aria-label="Close form"
              title="Close"
              onClick={onCloseForm}
              className="shrink-0"
            >
              <X aria-hidden="true" />
            </Button>
          </header>
          {renderForm()}
        </section>
      )}

      {activeDetail?.type === "expandable" && detailIsRenderable && (
        <section className="overflow-hidden rounded-2xl border border-border bg-card p-5 shadow-sm">
          <header className="mb-3 flex items-center justify-between border-b border-border pb-3">
            <div>
              {detail.title && (
                <h3 className="text-sm font-semibold text-foreground">
                  {detail.title}
                </h3>
              )}
              {detail.description && (
                <p className="text-xs text-muted-foreground">
                  {detail.description}
                </p>
              )}
            </div>
            <Button
              variant="ghost"
              size="icon-sm"
              aria-label="Close details"
              title="Close"
              onClick={onCloseDetail}
              className="shrink-0"
            >
              <X aria-hidden="true" />
            </Button>
          </header>
          {renderDetail()}
        </section>
      )}
    </>
  );
}
