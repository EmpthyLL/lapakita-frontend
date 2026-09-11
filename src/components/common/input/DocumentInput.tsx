/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @next/next/no-img-element */
"use client";

import { cn } from "@/lib/utils";
import {
  FileSpreadsheet,
  FileText,
  ImageIcon,
  Plus,
  Trash2,
  UploadCloud,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

export interface DocumentFileItem {
  name: string;
  size: number;
  type: string;
  base64: string;
}

interface DocumentInputProps {
  title?: string;
  multiple?: boolean;
  value?: DocumentFileItem | DocumentFileItem[] | null;
  onChange: (value: DocumentFileItem | DocumentFileItem[] | null) => void;
  accept?: string;
  maxSizeMB?: number;
}

export function DocumentInput({
  title,
  multiple = false,
  value,
  onChange,
  accept = "image/*,application/pdf,.doc,.docx,.xls,.xlsx,.csv",
  maxSizeMB = 5,
}: DocumentInputProps) {
  const [items, setItems] = useState<DocumentFileItem[]>([]);
  const [isDragActive, setIsDragActive] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const convertFileToBase64 = (file: File): Promise<DocumentFileItem> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        resolve({
          name: file.name,
          size: file.size,
          type: file.type,
          base64: reader.result as string,
        });
      };
      reader.onerror = (error) => reject(error);
    });
  };

  const handleFiles = useCallback(
    async (acceptedFiles: File[]) => {
      const validFiles = acceptedFiles.filter(
        (f) => f.size <= maxSizeMB * 1024 * 1024,
      );

      if (validFiles.length === 0) return;

      try {
        const convertedItems = await Promise.all(
          validFiles.map((file) => convertFileToBase64(file)),
        );

        if (multiple) {
          const currentItems = Array.isArray(value) ? value : [];
          const nextItems = [...currentItems, ...convertedItems];
          onChange(nextItems);
          setItems(nextItems);
        } else {
          const targetItem = convertedItems[0] || null;
          onChange(targetItem);
          setItems(targetItem ? [targetItem] : []);
        }
      } catch (error) {
        console.error("Failed to convert files to base64", error);
      }
    },
    [multiple, value, onChange, maxSizeMB],
  );

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragActive(true);
  };

  const onDragLeave = () => setIsDragActive(false);

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragActive(false);
    const droppedFiles = Array.from(e.dataTransfer.files);
    if (droppedFiles.length) handleFiles(droppedFiles);
  };

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = Array.from(e.target.files || []);
    if (selected.length) handleFiles(selected);
    e.target.value = "";
  };

  useEffect(() => {
    if (!value || (Array.isArray(value) && value.length === 0)) {
      setItems([]);
      if (inputRef.current) inputRef.current.value = "";
    } else if (Array.isArray(value)) {
      setItems(value);
    } else if (value) {
      setItems([value]);
    }
  }, [value]);

  const removeFile = (index: number, e: React.MouseEvent) => {
    e.stopPropagation();

    if (multiple && Array.isArray(value)) {
      const nextItems = value.filter((_, i) => i !== index);
      onChange(nextItems.length > 0 ? nextItems : null);
      setItems(nextItems);
    } else {
      onChange(null);
      setItems([]);
    }
  };

  const hasFiles = items.length > 0;
  const singleItem = !multiple && items[0];

  const renderFileIcon = (type: string, name: string) => {
    if (type.startsWith("image/"))
      return <ImageIcon className="size-6 text-primary" />;
    if (
      type.includes("excel") ||
      type.includes("spreadsheet") ||
      name.endsWith(".xlsx") ||
      name.endsWith(".xls") ||
      name.endsWith(".csv")
    ) {
      return <FileSpreadsheet className="size-6 text-emerald-600" />;
    }
    if (
      type.includes("word") ||
      type.includes("document") ||
      name.endsWith(".docx") ||
      name.endsWith(".doc")
    ) {
      return <FileText className="size-6 text-blue-600" />;
    }
    return <FileText className="size-6 text-primary" />;
  };

  return (
    <div className="space-y-2">
      {title && (
        <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          {title}
        </label>
      )}

      <div
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        onClick={() => {
          if (!hasFiles || multiple) inputRef.current?.click();
        }}
        className={cn(
          "relative w-full overflow-hidden rounded-3xl border-2 border-dashed transition-all duration-300",
          isDragActive
            ? "border-primary bg-primary/10 scale-[1.01]"
            : hasFiles && multiple
              ? "border-border bg-secondary/20 cursor-default"
              : "border-border/80 hover:border-primary/50 hover:bg-muted/50 cursor-pointer shadow-xs",
        )}
      >
        <input
          ref={inputRef}
          type="file"
          multiple={multiple}
          accept={accept}
          className="hidden"
          onChange={onInputChange}
        />

        {!hasFiles && (
          <div className="flex flex-col items-center justify-center text-center p-6 sm:p-8">
            <div className="flex size-14 items-center justify-center rounded-2xl bg-primary/10 text-primary mb-3 shadow-inner transition-transform hover:scale-105">
              <UploadCloud className="size-7" />
            </div>
            <p className="text-sm font-semibold text-foreground">
              {isDragActive
                ? "Lepas dokumen di sini..."
                : "Seret & letakkan file atau klik"}
            </p>
            <p className="text-muted-foreground mt-1 text-xs">
              Mendukung Gambar, PDF, Word, Excel (Max {maxSizeMB}MB)
            </p>
          </div>
        )}

        {!multiple && singleItem && (
          <div className="relative flex items-center gap-4 p-4 bg-card rounded-3xl border border-border shadow-xs">
            <div className="relative size-16 shrink-0 overflow-hidden rounded-2xl bg-muted border border-border flex items-center justify-center">
              {singleItem.type.startsWith("image/") ? (
                <img
                  src={singleItem.base64}
                  alt="preview"
                  className="size-full object-cover"
                />
              ) : (
                renderFileIcon(singleItem.type, singleItem.name)
              )}
            </div>

            <div className="flex flex-col flex-1 min-w-0 pr-8">
              <span className="truncate text-sm font-semibold text-foreground">
                {singleItem.name}
              </span>
              <span className="text-xs text-muted-foreground mt-0.5 font-mono">
                {(singleItem.size / 1024).toFixed(1)} KB — Klik ganti file
              </span>
            </div>

            <button
              type="button"
              onClick={(e) => removeFile(0, e)}
              className="absolute top-3 right-3 flex size-7 items-center justify-center rounded-full bg-destructive/15 text-destructive border border-destructive/30 shadow-sm transition-transform hover:scale-110 active:scale-95 outline-none z-10"
              title="Hapus Dokumen"
            >
              <Trash2 className="size-3.5" />
            </button>

            <div
              className="absolute inset-0 z-0 cursor-pointer"
              onClick={() => inputRef.current?.click()}
            />
          </div>
        )}

        {multiple && (
          <div className="p-4 sm:p-5">
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
              {items.map((item, idx) => {
                const isImage = item.type.startsWith("image/");

                return (
                  <div
                    key={idx}
                    className="group bg-card relative overflow-hidden rounded-2xl border border-border shadow-xs transition-all hover:shadow-md hover:border-primary/40 flex flex-col"
                  >
                    <div className="flex aspect-video items-center justify-center overflow-hidden bg-muted/40">
                      {isImage ? (
                        <img
                          src={item.base64}
                          alt="preview"
                          className="size-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                      ) : (
                        <div className="flex flex-col items-center">
                          {renderFileIcon(item.type, item.name)}
                          <span className="text-[10px] uppercase font-bold mt-1 text-muted-foreground tracking-wider">
                            {item.name.split(".").pop() || "FILE"}
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center justify-between p-2.5 text-xs bg-card border-t border-border mt-auto">
                      <div className="flex flex-col min-w-0 pr-2">
                        <p className="truncate font-medium text-foreground">
                          {item.name}
                        </p>
                        <p className="text-[10px] text-muted-foreground font-mono mt-0.5">
                          {(item.size / 1024).toFixed(1)} KB
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={(e) => removeFile(idx, e)}
                        className="flex size-6 shrink-0 items-center justify-center rounded-full bg-destructive/15 text-destructive border border-destructive/30 transition-all hover:scale-110 active:scale-95 shadow-xs"
                        title="Hapus File"
                      >
                        <Trash2 className="size-3" />
                      </button>
                    </div>
                  </div>
                );
              })}

              <button
                type="button"
                onClick={() => inputRef.current?.click()}
                className="border-border text-muted-foreground hover:border-primary/50 hover:text-primary hover:bg-primary/5 flex aspect-video flex-col items-center justify-center rounded-2xl border-2 border-dashed transition-all"
              >
                <Plus className="size-5 mb-1" />
                <span className="text-xs font-semibold">Tambah</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
