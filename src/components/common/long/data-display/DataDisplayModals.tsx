"use client";

import ConfirmDialog from "@/components/common/ConfirmDialog";
import { DeleteConfirmDialog } from "@/components/common/DeleteDialog";
import DialogWrapper from "@/components/common/DialogWrapper";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
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
      <Drawer
        swipeDirection="left"
        open={activeForm?.type === "sidebar"}
        onOpenChange={(open) => {
          if (!open && activeForm) onCloseForm();
        }}
      >
        <DrawerContent>
          {form &&
            activeForm?.type === "sidebar" &&
            (activeForm.kind === "create" || activeForm.row !== undefined) && (
              <>
                <DrawerHeader>
                  {form.title && <DrawerTitle>{form.title}</DrawerTitle>}
                  {form.description && (
                    <DrawerDescription>{form.description}</DrawerDescription>
                  )}
                </DrawerHeader>
                <div className="overflow-y-auto p-4">
                  {form.component({
                    row: activeForm.row,
                    index: activeForm.index,
                    mode: activeForm.kind,
                    close: onCloseForm,
                  })}
                </div>
              </>
            )}
        </DrawerContent>
      </Drawer>

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

      <Drawer
        open={activeDetail?.type === "sidebar"}
        onOpenChange={(open) => {
          if (!open && activeDetail) onCloseDetail();
        }}
      >
        <DrawerContent>
          {detail &&
            activeDetail?.type === "sidebar" &&
            activeDetail.row !== undefined && (
              <>
                <DrawerHeader>
                  {detail.title && <DrawerTitle>{detail.title}</DrawerTitle>}
                  {detail.description && (
                    <DrawerDescription>{detail.description}</DrawerDescription>
                  )}
                </DrawerHeader>
                <div className="overflow-y-auto p-4">
                  {detail.component({
                    row: activeDetail.row,
                    index: activeDetail.index ?? 0,
                    mode: "view",
                    close: onCloseDetail,
                  })}
                </div>
              </>
            )}
        </DrawerContent>
      </Drawer>

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
