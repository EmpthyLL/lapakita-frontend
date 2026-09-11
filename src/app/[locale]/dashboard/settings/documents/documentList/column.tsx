"use client";

import { createColumnHelpers } from "@/components/common/long/data-display/Constant";
import { GetDocumentData } from "@/lib/data/schema/user/document";
import { Building2, FileText, Hash, User } from "lucide-react";
import { useMemo } from "react";
import { DocumentRowActions } from "./rowAction";

export function useDocumentColumns() {
  const { field, action } = createColumnHelpers<GetDocumentData>();

  return useMemo(
    () => [
      field({
        key: "full_name_ktp",
        header: "Full Name (KTP)",
        icon: User,
        primary: true,
        className: "font-semibold text-foreground",
      }),
      field({
        key: "nik",
        header: "NIK",
        icon: Hash,
        className: "font-mono text-muted-foreground",
      }),
      field({
        key: "domicile_city",
        header: "Domicile City",
        icon: Building2,
      }),
      field({
        key: "ktp_photo_url",
        header: "KTP Document",
        icon: FileText,
        render: (val) =>
          val ? (
            <a
              href={String(val)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline"
            >
              <FileText className="size-3.5" /> View KTP
            </a>
          ) : (
            <span className="text-xs text-muted-foreground italic">
              No file
            </span>
          ),
      }),
      action({
        header: "Actions",
        className: "w-20 text-right",
        render: (row) => <DocumentRowActions row={row} />,
      }),
    ],
    [field, action],
  );
}
