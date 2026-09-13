"use client";

import { createColumnHelpers } from "@/components/common/long/data-display/Constant";
import { GetDocumentData } from "@/lib/data/schema/user/document";
import { CreditCard, Hash, User } from "lucide-react";
import { useMemo } from "react";
import { DocumentRowActions } from "./rowAction";

const formatDocType = (type: string) => {
  switch (type) {
    case "national_id":
      return "National ID (KTP)";
    case "passport":
      return "Passport";
    case "residence_permit":
      return "Residence Permit";
    default:
      return type;
  }
};

export function useDocumentColumns() {
  const { field, action } = createColumnHelpers<GetDocumentData>();

  return useMemo(
    () => [
      field({
        key: "full_name_identity",
        header: "Full Name",
        icon: User,
        primary: true,
        className: "font-semibold text-foreground",
      }),
      field({
        key: "document_number",
        header: "Document Number",
        icon: Hash,
        className: "font-mono text-muted-foreground",
      }),
      field({
        key: "document_type",
        header: "Type",
        icon: CreditCard,
        render: (val) => (
          <span className="inline-flex items-center rounded-md bg-primary/10 px-2 py-0.5 text-xs font-semibold text-primary">
            {formatDocType(String(val))}
          </span>
        ),
      }),
      field({
        key: "document_photo_url",
        header: "Preview URL",
        hideInPreset: true,
        render: (val) => String(val || ""),
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
