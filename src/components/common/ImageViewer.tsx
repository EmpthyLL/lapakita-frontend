"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import {
  Ban,
  Download,
  ExternalLink,
  Image as ImageIcon,
  X,
} from "lucide-react";
import Image from "next/image";
import { useState } from "react";

type ImageViewerProps = {
  src: string;
  alt?: string;
  documentType?: string;
  subtitle?: string;
  type?: "display" | "icon";
  className?: string;
  onLoad?: () => void;
  children?: React.ReactNode;
};

const ImageViewer: React.FC<ImageViewerProps> = ({
  src,
  alt = "Document Preview",
  documentType = "Image Preview",
  subtitle = "",
  type = "display",
  className = "",
  onLoad,
  children,
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [hasError, setHasError] = useState<boolean>(false);

  if (hasError) {
    return (
      <div className="flex h-32 w-32 items-center justify-center rounded-3xl border border-destructive/30 bg-destructive/10 text-destructive">
        <Ban className="h-6 w-6" />
      </div>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen} defaultOpen={false}>
      <DialogTrigger
        onClick={(e: React.MouseEvent) => {
          e.preventDefault();
          e.stopPropagation();
          setIsOpen(true);
        }}
        asChild
      >
        {children ? (
          children
        ) : type === "icon" ? (
          <div className="relative h-14 w-14 cursor-pointer overflow-hidden rounded-2xl border border-border bg-muted/40 transition-transform hover:scale-105">
            <Image
              src={src}
              fill
              alt={alt}
              className="object-cover"
              sizes="56px"
              onLoad={onLoad}
              onError={() => setHasError(true)}
              unoptimized
            />
          </div>
        ) : (
          <div
            className={cn(
              "relative aspect-video w-full overflow-hidden rounded-3xl border border-border/80 bg-muted/50 shadow-inner flex items-center justify-center group cursor-pointer",
              className,
            )}
          >
            <Image
              src={src}
              fill
              alt={alt}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              onLoad={onLoad}
              onError={() => setHasError(true)}
              unoptimized
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
              <ImageIcon className="h-4 w-4" />
            </div>
            <div className="min-w-0">
              <DialogTitle className="truncate text-xs font-bold uppercase tracking-wider text-foreground">
                {alt}
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
              title="Open original image"
            >
              <ExternalLink className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Original</span>
            </a>
            <a
              href={src}
              download
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-8 items-center gap-1.5 rounded-xl border border-border bg-background px-3 text-xs font-medium text-foreground transition-colors hover:bg-muted"
              title="Download image"
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

        {/* Image Preview Body */}
        <div className="relative z-10 flex min-h-[50vh] max-h-[66vh] w-full items-center justify-center overflow-auto bg-neutral-900/5 dark:bg-neutral-950/40 p-4">
          <Image
            src={src}
            width={1600}
            height={1200}
            alt={alt}
            className="max-h-[62vh] w-auto rounded-xl object-contain shadow-xs"
            sizes="(max-width: 768px) 100vw"
            onLoad={onLoad}
            onError={() => setHasError(true)}
            unoptimized
          />
        </div>

        {/* Footer Bar */}
        <div className="relative z-10 flex flex-wrap items-center justify-between gap-2 border-t border-border/80 bg-secondary/50 backdrop-blur-md px-5 py-3 text-xs">
          <div className="flex items-center gap-2 min-w-0">
            <span className="inline-flex items-center rounded-full bg-primary/15 px-2.5 py-0.5 text-[11px] font-semibold text-primary">
              {documentType}
            </span>
            <span className="font-semibold text-foreground truncate max-w-50 sm:max-w-md">
              {alt}
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

export default ImageViewer;
