"use client";

import { StallReview } from "@/lib/data/schema/review/get_stall_review";
import { format } from "date-fns";
import { CornerDownRight, Star, X } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

export function StallReviewCard({ review }: { review: StallReview }) {
  const [lightbox, setLightbox] = useState<string | null>(null);

  return (
    <div className="rounded-2xl border border-border bg-card p-4 sm:p-5">
      <div className="flex items-start gap-3">
        <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full">
          <Image
            src={review.author.avatarUrl}
            alt={review.author.name}
            fill
            className="object-cover"
          />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center justify-between gap-x-2 gap-y-1">
            <p className="font-semibold text-foreground">
              {review.author.name}
            </p>
            <span className="text-xs text-muted-foreground">
              {format(new Date(review.createdAt), "d MMM yyyy")}
            </span>
          </div>
          {(review.author.businessName || review.author.tenancyDuration) && (
            <p className="mt-0.5 truncate text-xs text-muted-foreground">
              {review.author.businessName}
              {review.author.businessCategory &&
                ` · ${review.author.businessCategory}`}
              {review.author.tenancyDuration &&
                ` · ${review.author.tenancyDuration}`}
            </p>
          )}
          <div className="mt-1.5 flex items-center gap-0.5">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={
                  i < review.rating
                    ? "h-3.5 w-3.5 fill-amber-400 text-amber-400"
                    : "h-3.5 w-3.5 fill-muted text-muted"
                }
              />
            ))}
          </div>
          # stars
        </div>
      </div>

      <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-foreground">
        {review.comment}
      </p>

      {review.photos && review.photos.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-2">
          {review.photos.map((photo) => (
            <button
              key={photo}
              type="button"
              onClick={() => setLightbox(photo)}
              className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl border border-border"
            >
              <Image
                src={photo}
                alt="Review photo"
                fill
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}

      {review.ownerResponse && (
        <div className="mt-4 ml-2 flex gap-2 rounded-xl bg-secondary/40 p-3 sm:ml-4">
          <CornerDownRight className="mt-0.5 h-3.5 w-3.5 shrink-0 text-muted-foreground" />
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center justify-between gap-x-2 gap-y-0.5">
              <p className="flex items-center gap-1.5 text-xs font-semibold text-foreground">
                {review.ownerResponse.ownerName}
                <span className="rounded-full bg-primary/10 px-1.5 py-0.5 text-[10px] font-medium text-primary">
                  Owner
                </span>
              </p>
              <span className="text-[11px] text-muted-foreground">
                {format(new Date(review.ownerResponse.createdAt), "d MMM yyyy")}
              </span>
            </div>
            <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
              {review.ownerResponse.comment}
            </p>
          </div>
        </div>
      )}

      {lightbox && (
        <div
          className="fixed inset-0 z-100 flex items-center justify-center bg-black/90 p-4"
          onClick={() => setLightbox(null)}
        >
          <button
            type="button"
            onClick={() => setLightbox(null)}
            className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20"
          >
            <X className="h-5 w-5" />
          </button>
          <div className="relative h-[75vh] w-full max-w-2xl">
            <Image
              src={lightbox}
              alt="Review photo"
              fill
              className="object-contain"
            />
          </div>
        </div>
      )}
    </div>
  );
}
