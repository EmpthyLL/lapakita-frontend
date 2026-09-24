"use client";

import { DataDisplay } from "@/components/common/long/data-display";
import { DataDisplayQuery } from "@/components/common/long/data-display/Constant";
import { Button } from "@/components/ui/button";
import { getDocument } from "@/lib/data/api/user";
import {
  DocumentQueryParams,
  GetDocumentData,
} from "@/lib/data/schema/user/document";
import { Plus } from "lucide-react";
import { DocumentCard } from "../component/card";
import { DocumentDetail } from "../component/detail";
import { DocumentForm } from "../component/form";
import { useDocumentColumns } from "./column";

export default function DocumentList() {
  const columns = useDocumentColumns();

  const queryConfig: DataDisplayQuery<GetDocumentData, DocumentQueryParams> = {
    queryFn: async (params) => {
      const response = await getDocument(params);
      return response;
    },
    queryKey: (params) => ["user-document", params],
    searchKey: "document_number",
    defaultParams: { page: 1 },
    filterOptions: [
      {
        id: "name",
        title: "Full Name",
        type: "input",
      },
      {
        id: "document_type",
        title: "Document Type",
        type: "select",
        options: [
          { label: "National ID (KTP)", value: "national_id" },
          { label: "Passport", value: "passport" },
          { label: "Residence Permit", value: "residence_permit" },
        ],
      },
    ],
    filterToParamKey: {
      name: "name",
      document_type: "document_type",
    },
  };

  return (
    <div className="rounded-3xl border border-border bg-card p-6 shadow-sm sm:p-8">
      <DataDisplay
        query={queryConfig}
        columns={columns}
        rowKey="id"
        variant="card"
        loadMode="pagination"
        showFilter
        showCount
        onRowClick={(row, index, action) => {
          action.openDetail("dialog");
        }}
        detail={{
          type: "dialog",
          title: "Verification Document Detail",
          description: "Informasi lengkap data diri dan pratinjau dokumen KTP.",
          size: "lg",
          component: DocumentDetail,
        }}
        form={{
          type: "dialog",
          title: "Upload New Document",
          description: "Silakan lengkapi formulir dokumen identitas Anda.",
          size: "lg",
          component: DocumentForm,
        }}
        renderItem={(row, index, itemColumns, action) => (
          <DocumentCard
            row={row}
            index={index}
            columns={itemColumns}
            action={action}
          />
        )}
        toolbarExtraAction={({ openCreate, isLoading }) => (
          <Button
            onClick={() => openCreate("dialog")}
            disabled={isLoading}
            size="sm"
            className="h-10 gap-1.5 px-3.5 text-xs rounded-xl"
          >
            <Plus className="h-4 w-4" /> Upload Document
          </Button>
        )}
      />
    </div>
  );
}
