"use client";

import { DeleteConfirmDialog } from "@/components/common/DeleteDialog";
import DialogWrapper from "@/components/common/DialogWrapper";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { deletePhoneNumber } from "@/lib/data/api/user";
import { PhoneNumberItem } from "@/lib/data/schema/user/phone_number";
import { handleError } from "@/lib/error";
import { showToast } from "@/lib/toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { MoreVertical, Pencil, Trash2 } from "lucide-react";
import { useState } from "react";
import { PhoneForm } from "../component/form";

interface PhoneRowActionsProps {
  row: PhoneNumberItem & { index: number };
}

export function PhoneRowActions({ row }: PhoneRowActionsProps) {
  const queryClient = useQueryClient();
  const [editOpen, setEditOpen] = useState(false);

  const deleteMutation = useMutation({
    mutationFn: async () => {
      await deletePhoneNumber(row.index);
    },
    onSuccess: () => {
      showToast.success("Phone number deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["phone-numbers-paginated"] });
    },
    onError: handleError,
  });

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-muted-foreground hover:text-foreground"
          >
            <MoreVertical className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-36">
          <DropdownMenuItem
            onClick={() => setEditOpen(true)}
            className="cursor-pointer gap-2 text-xs"
          >
            <Pencil className="h-3.5 w-3.5" /> Edit
          </DropdownMenuItem>
          <DeleteConfirmDialog
            onConfirm={() => deleteMutation.mutate()}
            itemName={row.number}
            isLoading={deleteMutation.isPending}
          >
            <DropdownMenuItem
              onSelect={(e) => e.preventDefault()}
              className="cursor-pointer gap-2 text-xs text-destructive focus:text-destructive w-full"
            >
              <Trash2 className="h-3.5 w-3.5" />
              Delete
            </DropdownMenuItem>
          </DeleteConfirmDialog>
        </DropdownMenuContent>
      </DropdownMenu>

      <DialogWrapper
        open={editOpen}
        onOpenChange={setEditOpen}
        title="Edit Phone Number"
        desc="Pastikan nomor minimal 10 digit. Setiap role hanya boleh terikat ke satu nomor unik."
        size="sm"
      >
        <PhoneForm
          mode="edit"
          initialData={row}
          onSuccess={() => setEditOpen(false)}
          onCancel={() => setEditOpen(false)}
        />
      </DialogWrapper>
    </>
  );
}
