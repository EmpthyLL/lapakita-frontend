"use client";

import { DataDisplayRendererProps } from "@/components/common/long/data-display/constant";
import { GetDocumentData } from "@/lib/data/schema/user/document";
import { FileText } from "lucide-react";
import { DocumentRowActions } from "../documentList/rowAction";
import { formatDocType, getDocumentNumberLabel } from "./config";

export function DocumentCard({
  row,
  index,
  action,
}: DataDisplayRendererProps<GetDocumentData>) {
  const numLabel = getDocumentNumberLabel(row.document_type);

  return (
    <div className="group relative overflow-hidden rounded-3xl border border-border bg-card shadow-xs transition-all hover:shadow-md hover:border-primary/40 flex flex-col justify-between">
      <div className="relative aspect-video w-full overflow-hidden bg-muted/40 border-b border-border flex items-center justify-center">
        {row.document_photo_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={row.document_photo_url}
            alt="Document Preview"
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="text-muted-foreground text-xs flex flex-col items-center">
            <FileText className="h-8 w-8 mb-1 text-primary" />
            <span>No image available</span>
          </div>
        )}
      </div>

      <div className="p-5 space-y-4">
        <div className="space-y-3">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <div className="mb-1 min-w-0">
                <span className="line-clamp-2 text-[11px] font-semibold uppercase leading-tight tracking-wider text-muted-foreground">
                  {row.document_label}
                </span>
              </div>
              <h4 className="truncate text-sm font-semibold text-foreground">
                {row.full_name_identity}
              </h4>
              <p className="truncate text-[11px] text-muted-foreground font-mono mt-0.5">
                {numLabel}: {row.document_number}
              </p>
            </div>

            <div className="flex shrink-0 items-center gap-1">
              <DocumentRowActions row={row} index={index} action={action} />
            </div>
          </div>

          <div className="grid gap-2 border-t border-border pt-3 text-xs text-muted-foreground">
            <div className="flex min-w-0 items-center justify-between gap-2">
              <span className="flex items-center gap-1.5 truncate">
                Document type
              </span>
              <strong className="font-medium text-foreground">
                {formatDocType(row.document_type)}
              </strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
