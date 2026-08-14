"use client";

import { Loader2 } from "lucide-react";

export function Spinner() {
  return (
    <div className="flex w-full flex-col items-center justify-center py-10">
      <div className="relative flex items-center justify-center">
        {/* Glow Aura Layer */}
        <div className="absolute h-12 w-12 animate-ping rounded-full bg-primary/20" />

        {/* Outer Ring Accent */}
        <div className="absolute h-10 w-10 rounded-full border-2 border-primary/20" />

        {/* Core Spinning Loader */}
        <Loader2 className="relative h-8 w-8 animate-spin text-primary stroke-[2.5]" />
      </div>
    </div>
  );
}
