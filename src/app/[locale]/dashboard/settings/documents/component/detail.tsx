/* eslint-disable @next/next/no-img-element */
"use client";

import { Button } from "@/components/ui/button";
import { GetDocumentData } from "@/lib/data/schema/user/document";
import { Building2, FileText, Hash, User } from "lucide-react";

interface DocumentDetailProps {
  document: GetDocumentData;
  onClose: () => void;
}

export function DocumentDetail({ document, onClose }: DocumentDetailProps) {
  return (
    <div className="space-y-6 pt-2">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 rounded-3xl bg-linear-to-br from-secondary/50 to-secondary/10 p-5 border border-border/80 shadow-xs">
        <div className="space-y-1">
          <span className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            <User className="h-3.5 w-3.5 text-primary" /> Full Name (KTP)
          </span>
          <p className="font-semibold text-foreground text-sm tracking-tight">
            {document.full_name_ktp}
          </p>
        </div>

        <div className="space-y-1">
          <span className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            <Hash className="h-3.5 w-3.5 text-primary" /> NIK
          </span>
          <p className="font-mono font-semibold text-foreground text-sm tracking-wide">
            {document.nik}
          </p>
        </div>

        <div className="sm:col-span-2 space-y-1 pt-2 border-t border-border/60">
          <span className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            <Building2 className="h-3.5 w-3.5 text-primary" /> Domicile City
          </span>
          <p className="font-semibold text-foreground text-sm tracking-tight">
            {document.domicile_city}
          </p>
        </div>
      </div>

      <div className="space-y-2.5">
        <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
          <FileText className="h-3.5 w-3.5 text-primary" /> KTP Photo Preview
        </label>

        <div className="relative aspect-video w-full overflow-hidden rounded-3xl border border-border/80 bg-muted/50 shadow-inner flex items-center justify-center group">
          {document.ktp_photo_url ? (
            <>
              <img
                src={document.ktp_photo_url}
                alt="KTP Preview"
                className="h-full w-full object-contain transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/20 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100 pointer-events-none" />
            </>
          ) : (
            <div className="text-muted-foreground text-xs flex flex-col items-center justify-center p-6 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-muted text-muted-foreground mb-2 shadow-xs">
                <FileText className="h-6 w-6" />
              </div>
              <span className="font-medium">No image available</span>
            </div>
          )}
        </div>
      </div>

      <div className="pt-4 border-t border-border flex justify-end">
        <Button type="button" variant="outline" onClick={onClose}>
          Close Detail
        </Button>
      </div>
    </div>
  );
}
