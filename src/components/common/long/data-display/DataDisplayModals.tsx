"use client";

import ConfirmDialog from "@/components/common/ConfirmDialog";
import { DeleteConfirmDialog } from "@/components/common/DeleteDialog";
import DialogWrapper from "@/components/common/DialogWrapper";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  DataDisplayConfirmOptions,
  DataDisplayDetail,
  DataDisplayForm,
  DataDisplaySurface,
} from "./Constant";

interface DataDisplayModalsProps<TData> {
  form?: DataDisplayForm<TData>;
  activeForm: {
    kind: "create" | "edit";
    row?: TData;
    index?: number;
    type: DataDisplaySurface;
    close: () => void;
  } | null;
  onCloseForm: () => void;
  detail?: DataDisplayDetail<TData>;
  activeDetail: {
    row?: TData;
    index?: number;
    type: DataDisplaySurface;
  } | null;
  onCloseDetail: () => void;
  activeConfirm: {
    onConfirm: () => void;
    options: DataDisplayConfirmOptions;
  } | null;
  onCloseConfirm: () => void;
  activeDelete: {
    onDelete: () => void;
    itemName?: string;
  } | null;
  onCloseDelete: () => void;
}

export function DataDisplayModals<TData>({
  form,
  activeForm,
  onCloseForm,
  detail,
  activeDetail,
  onCloseDetail,
  activeConfirm,
  onCloseConfirm,
  activeDelete,
  onCloseDelete,
}: DataDisplayModalsProps<TData>) {
  return (
    <>
      {/* Form Sidebar (Sheet dari kiri) */}
      <Sheet
        open={activeForm?.type === "sidebar"}
        onOpenChange={(open) => {
          if (!open && activeForm) onCloseForm();
        }}
      >
        <SheetContent
          side="left"
          className="w-full max-w-96 p-5 flex flex-col gap-4 overflow-hidden"
        >
          {form &&
            activeForm?.type === "sidebar" &&
            (activeForm.kind === "create" || activeForm.row !== undefined) && (
              <>
                <SheetHeader className="p-0 space-y-1 text-left">
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
                  {form.component({
                    row: activeForm.row,
                    index: activeForm.index,
                    mode: activeForm.kind,
                    close: onCloseForm,
                  })}
                </div>
              </>
            )}
        </SheetContent>
      </Sheet>

      {/* Form Modal Dialog */}
      {form && (
        <DialogWrapper
          open={activeForm?.type === "dialog"}
          onOpenChange={(open) => !open && onCloseForm()}
          title={form.title}
          desc={form.description}
          size={form.size ?? "lg"}
        >
          {activeForm?.type === "dialog" &&
            (activeForm.kind === "create" || activeForm.row !== undefined) &&
            form.component({
              row: activeForm.row,
              index: activeForm.index,
              mode: activeForm.kind,
              close: onCloseForm,
            })}
        </DialogWrapper>
      )}

      {/* Detail Sidebar (Sheet dari kanan) */}
      <Sheet
        open={activeDetail?.type === "sidebar"}
        onOpenChange={(open) => {
          if (!open && activeDetail) onCloseDetail();
        }}
      >
        <SheetContent
          side="right"
          className="w-full max-w-96 p-5 flex flex-col gap-4 overflow-hidden"
        >
          {detail &&
            activeDetail?.type === "sidebar" &&
            activeDetail.row !== undefined && (
              <>
                <SheetHeader className="p-0 space-y-1 text-left">
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
                  {detail.component({
                    row: activeDetail.row,
                    index: activeDetail.index ?? 0,
                    mode: "view",
                    close: onCloseDetail,
                  })}
                </div>
              </>
            )}
        </SheetContent>
      </Sheet>

      {/* Detail Modal Dialog */}
      {detail && (
        <DialogWrapper
          open={activeDetail?.type === "dialog"}
          onOpenChange={(open) => !open && onCloseDetail()}
          title={detail.title}
          desc={detail.description}
          size={detail.size ?? "lg"}
        >
          {activeDetail?.type === "dialog" &&
            activeDetail.row !== undefined &&
            detail.component({
              row: activeDetail.row,
              index: activeDetail.index ?? 0,
              mode: "view",
              close: onCloseDetail,
            })}
        </DialogWrapper>
      )}

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
  );
}
