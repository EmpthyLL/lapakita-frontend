"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { Download, ExternalLink, FileText, X } from "lucide-react";
import { useState } from "react";

type PDFViewerProps = {
  src: string;
  title?: string;
  documentType?: string;
  subtitle?: string;
  className?: string;
  type?: "display" | "icon";
  children?: React.ReactNode;
};

const PDFViewer: React.FC<PDFViewerProps> = ({
  src,
  title = "PDF Preview",
  documentType = "PDF Document",
  subtitle = "",
  className = "",
  type = "display",
  children,
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen} defaultOpen={false}>
      <DialogTrigger
        asChild
        onClick={(e: React.MouseEvent) => {
          e.preventDefault();
          e.stopPropagation();
          setIsOpen(true);
        }}
      >
        {children ? (
          children
        ) : type === "icon" ? (
          <div className="inline-flex h-12 w-12 cursor-pointer items-center justify-center rounded-2xl border border-border bg-muted/40 text-primary transition-all hover:bg-muted">
            <FileText className="h-6 w-6" />
          </div>
        ) : (
          <div
            className={cn(
              "relative aspect-video w-full overflow-hidden rounded-3xl border border-border/80 bg-muted/50 shadow-inner flex items-center justify-center group cursor-pointer",
              className,
            )}
          >
            <iframe
              src={src}
              title={title}
              className="pointer-events-none h-full w-full transition-transform duration-300 group-hover:scale-105"
            />
          </div>
        )}
      </DialogTrigger>

      <DialogContent
        hideClose
        className={cn(
          "relative flex flex-col gap-0 overflow-hidden rounded-3xl border border-border bg-card p-0 shadow-2xl sm:max-w-3xl md:max-w-4xl max-h-[92vh]",
        )}
        onClick={(e: React.MouseEvent) => e.stopPropagation()}
      >
        {/* Soft Background Gradient Ornaments */}
        <div className="pointer-events-none absolute -top-16 -right-16 h-48 w-48 rounded-full bg-gradient-brand opacity-15 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-16 -left-16 h-48 w-48 rounded-full bg-primary opacity-10 blur-3xl" />

        {/* Top Header Bar */}
        <div className="relative z-10 flex items-center justify-between border-b border-border/80 bg-secondary/50 backdrop-blur-md px-5 py-3.5">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary shadow-xs">
              <FileText className="h-4 w-4" />
            </div>
            <div className="min-w-0">
              <DialogTitle className="truncate text-xs font-bold uppercase tracking-wider text-foreground">
                {title}
              </DialogTitle>
              {subtitle && (
                <p className="truncate text-[11px] text-muted-foreground">
                  {subtitle}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <a
              href={src}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-8 items-center gap-1.5 rounded-xl border border-border bg-background px-3 text-xs font-medium text-foreground transition-colors hover:bg-muted"
              title="Open in new tab"
            >
              <ExternalLink className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Open</span>
            </a>
            <a
              href={src}
              download
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-8 items-center gap-1.5 rounded-xl border border-border bg-background px-3 text-xs font-medium text-foreground transition-colors hover:bg-muted"
              title="Download PDF"
            >
              <Download className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Download</span>
            </a>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="ml-1 inline-flex h-8 w-8 items-center justify-center rounded-xl border border-border bg-background text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              title="Close"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* PDF Body */}
        <div className="relative z-10 h-[70vh] w-full bg-muted/30">
          <iframe src={src} title={title} className="h-full w-full border-0" />
        </div>

        {/* Footer Bar */}
        <div className="relative z-10 flex flex-wrap items-center justify-between gap-2 border-t border-border/80 bg-secondary/50 backdrop-blur-md px-5 py-3 text-xs">
          <div className="flex items-center gap-2 min-w-0">
            <span className="inline-flex items-center rounded-full bg-primary/15 px-2.5 py-0.5 text-[11px] font-semibold text-primary">
              {documentType}
            </span>
            <span className="font-semibold text-foreground truncate max-w-50 sm:max-w-md">
              {title}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsOpen(false)}
              className="h-8 rounded-xl px-4 text-xs font-semibold"
            >
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PDFViewer;
