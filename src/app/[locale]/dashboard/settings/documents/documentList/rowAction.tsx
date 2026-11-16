"use client";

import { DataDisplayRowActionProps } from "@/components/common/long/data-display/constant";
import { Button } from "@/components/ui/button";
import { deleteDocument } from "@/lib/data/api/user";
import { GetDocumentData } from "@/lib/data/schema/user/document";
import { handleError } from "@/lib/error";
import { showToast } from "@/lib/toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Trash2 } from "lucide-react";

export function DocumentRowActions({
  row,
  action,
}: DataDisplayRowActionProps<GetDocumentData>) {
  const queryClient = useQueryClient();

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
    <Button
      variant="destructive"
      size="icon-sm"
      onClick={(e) => {
        e.stopPropagation();
        action.openDelete(() => deleteMutation.mutate(), row.document_number);
      }}
      isLoading={deleteMutation.isPending}
    >
      <Trash2 className="size-4" />
    </Button>
  );
}
