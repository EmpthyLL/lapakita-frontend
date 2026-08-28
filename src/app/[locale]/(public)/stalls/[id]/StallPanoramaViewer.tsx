/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { loadPannellum } from "@/lib/load-pannellum";
import { Loader2, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface StallPanoramaViewerProps {
  imageUrl: string;
  title: string;
  open: boolean;
  onClose: () => void;
}

export function StallPanoramaViewer({
  imageUrl,
  title,
  open,
  onClose,
}: StallPanoramaViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const viewerRef = useRef<{ destroy: () => void } | null>(null);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!open) return;
    let cancelled = false;
    setReady(false);
    setError(false);

    loadPannellum()
      .then(() => {
        if (cancelled || !containerRef.current) return;
        viewerRef.current = window.pannellum.viewer(containerRef.current, {
          type: "equirectangular",
          panorama: imageUrl,
          autoLoad: true,
          showControls: true,
          showZoomCtrl: true,
          compass: false,
          hfov: 110,
          minHfov: 50,
          maxHfov: 130,
        });
        setReady(true);
      })
      .catch(() => {
        if (!cancelled) setError(true);
      });

    return () => {
      cancelled = true;
      viewerRef.current?.destroy?.();
      viewerRef.current = null;
    };
  }, [open, imageUrl]);

  useEffect(() => {
    if (!open) return;
    function handleEscape(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-100 flex flex-col bg-black">
      <div className="flex items-center justify-between px-4 py-3">
        <p className="truncate text-sm font-medium text-white">
          {title} — 360° Virtual Tour
        </p>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close 360° viewer"
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
        >
          <X className="h-4.5 w-4.5" />
        </button>
      </div>

      <div className="relative flex-1">
        <div ref={containerRef} className="absolute inset-0" />

        {!ready && !error && (
          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center gap-2 text-white/80">
            <Loader2 className="h-8 w-8 animate-spin" />
            <span className="text-xs">Loading panorama…</span>
          </div>
        )}

        {error && (
          <div className="absolute inset-0 flex items-center justify-center text-sm text-white/70">
            Couldn&apos;t load the 360° viewer. Try again in a moment.
          </div>
        )}

        {ready && (
          <p className="pointer-events-none absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-black/50 px-3 py-1.5 text-xs text-white/80">
            Drag to look around · Scroll to zoom
          </p>
        )}
      </div>
    </div>
  );
}
