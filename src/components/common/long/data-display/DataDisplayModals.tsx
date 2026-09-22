/* eslint-disable @typescript-eslint/no-explicit-any */
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
    options: any;
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
      {/* Non-Expandable Form (Sidebar / Dialog menggunakan DialogWrapper) */}
      {form &&
        form.type !== "expandable" &&
        activeForm &&
        activeForm.type !== "expandable" &&
        (activeForm.kind === "create" || activeForm.row !== undefined) &&
        (activeForm.type === "sidebar" ? (
          <Drawer
            swipeDirection="left"
            open
            onOpenChange={(open) => !open && onCloseForm()}
          >
            <DrawerContent>
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
            </DrawerContent>
          </Drawer>
        ) : (
          <DialogWrapper
            open
            onOpenChange={(open) => !open && onCloseForm()}
            title={form.title}
            desc={form.description}
            size={form.size ?? "lg"}
          >
            {form.component({
              row: activeForm.row,
              index: activeForm.index,
              mode: activeForm.kind,
              close: onCloseForm,
            })}
          </DialogWrapper>
        ))}

      {/* Non-Expandable Detail (Sidebar / Dialog menggunakan DialogWrapper) */}
      {detail &&
        detail.type !== "expandable" &&
        activeDetail &&
        activeDetail.type !== "expandable" &&
        activeDetail.row !== undefined &&
        (activeDetail.type === "sidebar" ? (
          <Drawer open onOpenChange={(open) => !open && onCloseDetail()}>
            <DrawerContent>
              <DrawerHeader>
                {detail.title && <DrawerTitle>{detail.title}</DrawerTitle>}
                {detail.description && (
                  <DrawerDescription>{detail.description}</DrawerDescription>
                )}
              </DrawerHeader>
              <div className="overflow-y-auto p-4">
                {detail.component?.({
                  row: activeDetail.row,
                  index: activeDetail.index ?? 0,
                })}
              </div>
            </DrawerContent>
          </Drawer>
        ) : (
          <DialogWrapper
            open
            onOpenChange={(open) => !open && onCloseDetail()}
            title={detail.title}
            desc={detail.description}
            size={detail.size ?? "lg"}
          >
            {detail.component?.({
              row: activeDetail.row,
              index: activeDetail.index ?? 0,
            })}
          </DialogWrapper>
        ))}

      {/* Dialog Konfirmasi */}
      {activeConfirm &&
        (() => {
          const { itemName: _itemName, ...dialogOptions } =
            activeConfirm.options;
          void _itemName;
          return (
            <ConfirmDialog
              open
              onOpenChange={(open) => !open && onCloseConfirm()}
              onContinue={() => {
                activeConfirm.onConfirm();
                onCloseConfirm();
              }}
              {...dialogOptions}
            />
          );
        })()}

      {/* Dialog Hapus */}
      {activeDelete && (
        <DeleteConfirmDialog
          open
          onOpenChange={(open) => !open && onCloseDelete()}
          onConfirm={() => {
            activeDelete.onDelete();
            onCloseDelete();
          }}
          itemName={activeDelete.itemName}
        />
      )}
    </>
  );
}
