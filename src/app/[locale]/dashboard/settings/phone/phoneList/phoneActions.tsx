"use client";

import { DeleteConfirmDialog } from "@/components/common/DeleteDialog";
import DialogWrapper from "@/components/common/DialogWrapper";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { deletePhoneNumber } from "@/lib/data/api/user";
import { PhoneNumberItem } from "@/lib/data/schema/user/phone_number";
import { handleError } from "@/lib/error";
import { showToast } from "@/lib/toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { PhoneForm } from "../component/form";

interface PhoneActionProps {
  row: PhoneNumberItem;
}

export function PhoneEditAction({ row }: PhoneActionProps) {
  const [editOpen, setEditOpen] = useState(false);

  return (
    <>
      <DropdownMenuItem onSelect={() => setEditOpen(true)}>
        Edit
      </DropdownMenuItem>
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

export function PhoneDeleteAction({ row }: PhoneActionProps) {
  const queryClient = useQueryClient();
  const deleteMutation = useMutation({
    mutationFn: () => deletePhoneNumber(row.number),
    onSuccess: () => {
      showToast.success("Phone number deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["phone-numbers"] });
    },
    onError: handleError,
  });

  return (
    <DeleteConfirmDialog
      onConfirm={() => deleteMutation.mutate()}
      itemName={row.number}
      isLoading={deleteMutation.isPending}
    >
      <DropdownMenuItem
        onSelect={(event) => event.preventDefault()}
        variant="destructive"
      >
        Delete
      </DropdownMenuItem>
    </DeleteConfirmDialog>
  );
}
