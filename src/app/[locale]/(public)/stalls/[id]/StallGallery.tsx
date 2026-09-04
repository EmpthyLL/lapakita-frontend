"use client";

import type { StallMedia } from "@/lib/data/schema/stall/get_stall_detail";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight, Rotate3d, X } from "lucide-react";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { StallPanoramaViewer } from "./StallPanoramaViewer";

export function StallGallery({
  media,
  title,
}: {
  media: StallMedia;
  title: string;
}) {
  const allImages = [
    media.mainImage,
    ...media.facilityImages.map((f) => f.url),
  ];
  const [active, setActive] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [panoramaOpen, setPanoramaOpen] = useState(false);

  // State untuk gesture geser (Swipe / Drag)
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const hasPanorama = Boolean(media.virtualTour360Url);
  const hasExtraThumbnails = allImages.length > 1 || hasPanorama;

  const smallThumbCount = hasPanorama ? 2 : 3;
  const smallThumbs = media.facilityImages.slice(0, smallThumbCount);
  const remainingCount = media.facilityImages.length - smallThumbs.length;

  const nextImage = useCallback(() => {
    setActive((prev) => (prev + 1) % allImages.length);
  }, [allImages.length]);

  const prevImage = useCallback(() => {
    setActive((prev) => (prev - 1 + allImages.length) % allImages.length);
  }, [allImages.length]);

  // Handle Touch/Swipe Events
  const minSwipeDistance = 50;

  const onTouchStart = (e: React.TouchEvent | React.MouseEvent) => {
    setIsDragging(true);
    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
    setTouchEnd(null);
    setTouchStart(clientX);
  };

  const onTouchMove = (e: React.TouchEvent | React.MouseEvent) => {
    if (!isDragging) return;
    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
    setTouchEnd(clientX);
  };

  const onTouchEnd = () => {
    setIsDragging(false);
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) {
      nextImage();
    } else if (isRightSwipe) {
      prevImage();
    }
  };

  // Keyboard navigation (Kiri, Kanan, Escape)
  useEffect(() => {
    if (!lightboxOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") nextImage();
      if (e.key === "ArrowLeft") prevImage();
      if (e.key === "Escape") setLightboxOpen(false);
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [lightboxOpen, nextImage, prevImage]);

  return (
    <div>
      {/* Gallery Layout: Jika tidak ada foto tambahan / 360 tour, ambil full width (col-span-full) */}
      <div
        className={cn(
          "grid grid-cols-1 gap-2 sm:gap-3",
          hasExtraThumbnails ? "sm:grid-cols-4" : "grid-cols-1",
        )}
      >
        <button
          type="button"
          onClick={() => {
            setActive(0);
            setLightboxOpen(true);
          }}
          className={cn(
            "relative h-72 overflow-hidden rounded-2xl sm:h-96",
            hasExtraThumbnails ? "col-span-1 sm:col-span-3" : "w-full",
          )}
        >
          <Image
            src={allImages[0]}
            alt={title}
            fill
            className="object-cover"
            priority
          />
        </button>

        {hasExtraThumbnails && (
          <div className="grid grid-cols-3 gap-2 sm:grid-cols-1 sm:gap-3">
            {smallThumbs.map((img, i) => {
              const isLastFacilityThumb = i === smallThumbs.length - 1;
              return (
                <button
                  key={img.id}
                  type="button"
                  onClick={() => {
                    setActive(i + 1);
                    setLightboxOpen(true);
                  }}
                  className="relative h-24 overflow-hidden rounded-xl sm:h-30"
                >
                  <Image
                    src={img.url}
                    alt={img.caption}
                    fill
                    className="object-cover"
                  />
                  {isLastFacilityThumb && remainingCount > 0 && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/50 text-sm font-semibold text-white">
                      +{remainingCount} more
                    </div>
                  )}
                </button>
              );
            })}

            {/* 360° tour tile */}
            {hasPanorama && (
              <button
                type="button"
                onClick={() => setPanoramaOpen(true)}
                className="group relative h-24 overflow-hidden rounded-xl sm:h-30"
              >
                <Image
                  src={media.virtualTour360Url!}
                  alt={`${title} — 360° tour preview`}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/45 transition-colors group-hover:bg-black/55" />
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-1 text-white">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/15 backdrop-blur-sm">
                    <Rotate3d className="h-4 w-4" />
                  </span>
                  <span className="text-[11px] font-bold tracking-wide">
                    360°
                  </span>
                </div>
              </button>
            )}
          </div>
        )}
      </div>

      {/* Lightbox Modal dengan Fitur Swipe & Keyboard Nav */}
      {lightboxOpen && (
        <div
          className="fixed inset-0 z-100 flex select-none flex-col items-center justify-between bg-black/95 p-4"
          onClick={() => setLightboxOpen(false)}
        >
          {/* Header Lightbox */}
          <div
            className="flex w-full max-w-5xl items-center justify-between text-white"
            onClick={(e) => e.stopPropagation()}
          >
            <span className="text-xs font-medium text-white/70">
              {active + 1} / {allImages.length}
            </span>
            <button
              type="button"
              onClick={() => setLightboxOpen(false)}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Main Container dengan Touch & Mouse Event Dragging */}
          <div
            className="relative flex h-[75vh] w-full max-w-5xl items-center justify-center"
            onClick={(e) => e.stopPropagation()}
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
            onMouseDown={onTouchStart}
            onMouseMove={onTouchMove}
            onMouseUp={onTouchEnd}
          >
            {/* Tombol Kiri */}
            {allImages.length > 1 && (
              <button
                type="button"
                onClick={prevImage}
                className="absolute left-2 z-10 hidden h-11 w-11 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-md transition-all hover:bg-black/80 sm:flex"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>
            )}

            {/* Gambar */}
            <div className="relative h-full w-full pointer-events-none">
              <Image
                src={allImages[active]}
                alt={`${title} - image ${active + 1}`}
                fill
                className="object-contain transition-all duration-300"
                priority
              />
            </div>

            {/* Tombol Kanan */}
            {allImages.length > 1 && (
              <button
                type="button"
                onClick={nextImage}
                className="absolute right-2 z-10 hidden h-11 w-11 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-md transition-all hover:bg-black/80 sm:flex"
              >
                <ChevronRight className="h-6 w-6" />
              </button>
            )}
          </div>

          {/* Indikator Titik (Dots) Navigasi */}
          <div className="flex gap-2 p-2" onClick={(e) => e.stopPropagation()}>
            {allImages.map((img, i) => (
              <button
                key={img}
                type="button"
                onClick={() => setActive(i)}
                className={cn(
                  "h-2 rounded-full transition-all duration-300",
                  i === active
                    ? "w-6 bg-white"
                    : "w-2 bg-white/40 hover:bg-white/60",
                )}
              />
            ))}
          </div>
        </div>
      )}

      {/* 360 Panorama Viewer */}
      {hasPanorama && (
        <StallPanoramaViewer
          imageUrl={media.virtualTour360Url!}
          title={title}
          open={panoramaOpen}
          onClose={() => setPanoramaOpen(false)}
        />
      )}
    </div>
  );
}
