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
import { deleteDocument } from "@/lib/data/api/user";
import { GetDocumentData } from "@/lib/data/schema/user/document";
import { handleError } from "@/lib/error";
import { showToast } from "@/lib/toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Eye, MoreVertical, Trash2 } from "lucide-react";
import { useState } from "react";
import { DocumentDetail } from "../component/detail";

interface DocumentRowActionsProps {
  row: GetDocumentData;
  action: DataDisplayActionContext<GetDocumentData>;
}

export function DocumentRowActions({ row, action }: DocumentRowActionsProps) {
  const queryClient = useQueryClient();
  const [detailOpen, setDetailOpen] = useState(false);

  const deleteMutation = useMutation({
    mutationFn: async () => {
      await deleteDocument(row.id);
    },
    onSuccess: () => {
      showToast.success("Document deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["user-document"] });
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
            onClick={() => setDetailOpen(true)}
            className="cursor-pointer gap-2 text-xs"
          >
            <Eye className="h-3.5 w-3.5" /> View Detail
          </DropdownMenuItem>
          <DropdownMenuItem
            onSelect={(e) => {
              e.preventDefault();
              action.openDelete(
                () => deleteMutation.mutate(),
                row.full_name_identity,
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
        open={detailOpen}
        onOpenChange={setDetailOpen}
        title="Verification Document Detail"
        desc="Informasi lengkap data diri dan pratinjau dokumen KTP."
        size="md"
      >
        <DocumentDetail document={row} onClose={() => setDetailOpen(false)} />
      </DialogWrapper>
    </>
  );
}
