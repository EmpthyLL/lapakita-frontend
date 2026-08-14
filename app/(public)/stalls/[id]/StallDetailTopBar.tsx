"use client";

import { ShareSheet } from "@/components/common/ShareSheet";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ArrowLeft, Heart, Share2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

interface StallDetailTopBarProps {
  title: string;
  backHref?: string;
}

export function StallDetailTopBar({
  title,
  backHref = "/stalls",
}: StallDetailTopBarProps) {
  const [saved, setSaved] = useState(false);

  return (
    <div className="sticky top-0 z-40 -mx-4 mb-5 border-b border-border bg-background/95 px-4 py-3 backdrop-blur-sm sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3">
        <Link
          href={backHref}
          className="flex shrink-0 items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to listings
        </Link>

        <p className="hidden min-w-0 flex-1 truncate text-center text-sm font-medium text-foreground sm:block">
          {title}
        </p>

        <div className="flex shrink-0 items-center gap-1.5">
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={() => setSaved((s) => !s)}
            aria-pressed={saved}
            aria-label={saved ? "Remove from saved" : "Save this stall"}
            className={cn(
              "h-9 w-9 rounded-full",
              saved &&
                "border-destructive/40 bg-destructive/5 text-destructive hover:bg-destructive/10 hover:text-destructive",
            )}
          >
            <Heart className={cn("h-4 w-4", saved && "fill-destructive")} />
          </Button>

          <ShareSheet
            title={title}
            trigger={
              <Button
                type="button"
                variant="outline"
                size="icon"
                aria-label="Share this stall"
                className="h-9 w-9 rounded-full"
              >
                <Share2 className="h-4 w-4" />
              </Button>
            }
          />
        </div>
      </div>
    </div>
  );
}
