"use client";

import DialogWrapper from "@/components/common/DialogWrapper";
import { DataDisplayActionContext } from "@/components/common/long/data-display/Constant";
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
import { useSession } from "next-auth/react";
import { useState } from "react";
import { PhoneForm } from "../component/form";

interface PhoneRowActionsProps {
  row: PhoneNumberItem;
  action: DataDisplayActionContext<PhoneNumberItem>;
}

export function PhoneRowActions({ row, action }: PhoneRowActionsProps) {
  const queryClient = useQueryClient();
  const { data: session, update: updateSession } = useSession();
  const [editOpen, setEditOpen] = useState(false);

  const deleteMutation = useMutation({
    mutationFn: async () => {
      await deletePhoneNumber(row.index);
    },
    onSuccess: async () => {
      showToast.success("Phone number deleted successfully");

      if (session?.user) {
        const updatedPersonas = { ...(session.user.personas || {}) };
        const deletedPhoneObj = row; // Ini berupa objek { dial_code, number }
        const linkedRoles = row.roles || [];

        linkedRoles.forEach((role) => {
          const persona = updatedPersonas[role];
          if (persona && persona.phone) {
            // Cocokkan berdasarkan dial_code dan number
            const isSamePhone =
              persona.phone.dial_code === deletedPhoneObj.dial_code &&
              persona.phone.number === deletedPhoneObj.number;

            if (isSamePhone) {
              const hasDisplayName = Boolean(
                persona.display_name && persona.display_name.trim() !== "",
              );
              const hasAvatarUrl = Boolean(
                persona.avatar_url && persona.avatar_url.trim() !== "",
              );

              if (!hasDisplayName && !hasAvatarUrl) {
                delete updatedPersonas[role];
              } else {
                updatedPersonas[role] = {
                  ...persona,
                  phone: { dial_code: "+62", number: "" },
                };
              }
            }
          }
        });

        await updateSession({
          ...session,
          user: {
            ...session.user,
            personas: updatedPersonas,
          },
        });
        queryClient.invalidateQueries({ queryKey: ["phone-numbers"] });
      }
    },
    onError: handleError,
  });

  const phoneDisplayLabel = `${row.number || "+62"} ${row.dial_code || ""}`;

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
          <DropdownMenuItem
            onSelect={(e) => {
              e.preventDefault();
              action.openDelete(
                () => deleteMutation.mutate(),
                phoneDisplayLabel,
              );
            }}
            className="cursor-pointer gap-2 text-xs text-destructive focus:text-destructive w-full"
          >
            <Trash2 className="h-3.5 w-3.5" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <DialogWrapper
        open={editOpen}
        onOpenChange={setEditOpen}
        title="Edit Phone Number"
        desc="Pastikan nomor minimal 5 digit. Setiap role hanya boleh terikat ke satu nomor unik."
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
