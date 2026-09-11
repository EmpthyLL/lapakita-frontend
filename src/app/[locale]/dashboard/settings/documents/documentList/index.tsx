"use client";

import DialogWrapper from "@/components/common/DialogWrapper";
import { DataDisplay } from "@/components/common/long/data-display";
import { DataDisplayQuery } from "@/components/common/long/data-display/Constant";
import { Button } from "@/components/ui/button";
import { getDocument } from "@/lib/data/api/user";
import {
  DocumentQueryParams,
  GetDocumentData,
} from "@/lib/data/schema/user/document";
import { Plus } from "lucide-react";
import { useState } from "react";
import { DocumentCard } from "../component/card";
import { DocumentForm } from "../component/form";
import { useDocumentColumns } from "./column";

export default function DocumentList() {
  const [createOpen, setCreateOpen] = useState(false);
  const columns = useDocumentColumns();

  const queryConfig: DataDisplayQuery<GetDocumentData, DocumentQueryParams> = {
    queryFn: async (params) => {
      const response = await getDocument(params);
      return response;
    },
    queryKey: (params) => ["user-document", params],
    searchKey: "nik",
    defaultParams: { page: 1 },
    filterOptions: [
      {
        id: "name",
        type: "input",
        title: "Full Name",
      },
    ],
    filterToParamKey: {
      name: "name",
    },
  };

  return (
    <>
      <div className="rounded-3xl border border-border bg-card p-6 shadow-sm sm:p-8">
        <DataDisplay
          query={queryConfig}
          columns={columns}
          rowKey="id"
          variant="card"
          loadMode="pagination"
          showFilter
          showCount
          renderItem={(row, index, itemColumns) => (
            <DocumentCard row={row} index={index} columns={itemColumns} />
          )}
          toolbarExtraAction={
            <Button
              onClick={() => setCreateOpen(true)}
              size="sm"
              className="h-10 gap-1.5 rounded-xl px-3.5 text-xs"
            >
              <Plus className="h-4 w-4" /> Upload Document
            </Button>
          }
        />
      </div>

      <DialogWrapper
        open={createOpen}
        onOpenChange={setCreateOpen}
        title="Upload Verification Document"
        desc="Lengkapi data diri dan unggah foto KTP Anda untuk verifikasi akun."
        size="md"
      >
        <DocumentForm
          onSuccess={() => setCreateOpen(false)}
          onCancel={() => setCreateOpen(false)}
        />
      </DialogWrapper>
    </>
  );
}
