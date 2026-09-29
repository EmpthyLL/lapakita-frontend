"use client";

import FileViewer from "@/components/common/FileViewer";
import { DataDisplaySurfaceComponentProps } from "@/components/common/long/data-display/Constant";
import { Button } from "@/components/ui/button";
import { getAllCountryOptions } from "@/lib/countries";
import { GetDocumentData } from "@/lib/data/schema/user/document";
import { CreditCard, FileText, Globe, Hash, Tag, User } from "lucide-react";
import { formatDocType, getDocumentNumberLabel } from "./config";

export function DocumentDetail({
  row: document,
  close,
}: DataDisplaySurfaceComponentProps<GetDocumentData>) {
  if (!document) return null;

  const numLabel = getDocumentNumberLabel(document.document_type);
  const countryOptions = getAllCountryOptions();
  const foundCountry = countryOptions.find(
    (c) => c.value.toLowerCase() === document.country_code?.toLowerCase(),
  );

  return (
    <div className="space-y-6 pt-2">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 rounded-3xl bg-linear-to-br from-secondary/50 to-secondary/10 p-5 border border-border/80 shadow-xs">
        <div className="space-y-1">
          <span className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            <User className="h-3.5 w-3.5 text-primary" /> Full Name
          </span>
          <p className="font-semibold text-foreground text-sm tracking-tight">
            {document.full_name_identity}
          </p>
        </div>

        <div className="space-y-1">
          <span className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            <Globe className="h-3.5 w-3.5 text-primary" /> Issuing Country
          </span>
          <div className="flex items-center gap-2 pt-0.5">
            {foundCountry?.flag && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={foundCountry.flag}
                alt={foundCountry.name}
                className="h-3.5 w-5 object-contain rounded-xs shadow-xs"
              />
            )}
            <p className="font-semibold text-foreground text-sm tracking-tight">
              {foundCountry?.name ?? document.country_code}
            </p>
          </div>
        </div>

        <div className="space-y-1">
          <span className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            <Tag className="h-3.5 w-3.5 text-primary" /> Document Label
          </span>
          <p className="font-semibold text-foreground text-sm tracking-tight">
            {document.document_label}
          </p>
        </div>

        <div className="space-y-1">
          <span className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            <Hash className="h-3.5 w-3.5 text-primary" /> {numLabel}
          </span>
          <p className="font-mono font-semibold text-foreground text-sm tracking-wide">
            {document.document_number}
          </p>
        </div>

        <div className="sm:col-span-2 space-y-1 pt-2 border-t border-border/60">
          <span className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            <CreditCard className="h-3.5 w-3.5 text-primary" /> Document Type
          </span>
          <p className="font-semibold text-foreground text-sm tracking-tight">
            {formatDocType(document.document_type)}
          </p>
        </div>
      </div>

      <div className="space-y-2.5">
        <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
          <FileText className="h-3.5 w-3.5 text-primary" /> Document Photo
          Preview
        </label>

        <FileViewer
          src={document.document_photo_url}
          title={document.full_name_identity}
          documentType={formatDocType(document.document_type)}
          subtitle={`No: ${document.document_number}`}
          type="display"
        />
      </div>

      <div className="pt-4 border-t border-border flex justify-end">
        <Button
          type="button"
          variant="default"
          onClick={close}
          className="rounded-2xl px-6 font-semibold shadow-sm transition-all hover:shadow"
        >
          Close Detail
        </Button>
      </div>
    </div>
  );
}
