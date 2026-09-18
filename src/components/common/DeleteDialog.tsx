// components/common/DeleteConfirmDialog.tsx
"use client";

import { Trash2 } from "lucide-react";
import { ReactNode } from "react";
import { Button } from "../ui/button";
import ConfirmDialog from "./ConfirmDialog";

interface DeleteConfirmDialogProps {
  children?: ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  onConfirm: () => void;
  title?: string;
  description?: string;
  itemName?: string;
  isLoading?: boolean;
}

export function DeleteConfirmDialog({
  children,
  open,
  onOpenChange,
  onConfirm,
  title = "Are you sure?",
  description,
  itemName,
  isLoading = false,
}: DeleteConfirmDialogProps) {
  const defaultDescription = itemName
    ? `This action cannot be undone. This will permanently delete "${itemName}".`
    : "This action cannot be undone. This will permanently delete this item.";

  return (
    <ConfirmDialog
      open={open}
      onOpenChange={onOpenChange}
      onContinue={onConfirm}
      title={title}
      description={description || defaultDescription}
      confirmText="Delete"
      variant="destructive"
      isLoading={isLoading}
    >
      {open === undefined &&
        (children ?? (
          <Button variant="destructive" size="icon">
            <Trash2 className="h-4 w-4" />
          </Button>
        ))}
    </ConfirmDialog>
  );
}
