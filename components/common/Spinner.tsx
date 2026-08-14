"use client";

import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

export function Spinner({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center justify-center py-10", className)}>
      <span className="relative flex h-12 w-12 items-center justify-center">
        <span className="absolute inset-0 animate-ping rounded-full bg-primary/20" />
        <Loader2
          className="h-9 w-9 animate-spin text-primary"
          strokeWidth={2.5}
        />
      </span>
    </div>
  );
}
