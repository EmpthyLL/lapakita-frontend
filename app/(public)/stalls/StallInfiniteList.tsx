"use client";

import { StallCard } from "@/components/common/StallCard";
import { useInfiniteSearch } from "@/hooks/use-infinite-search";
import { BasePaginationQuery, PaginatedResponse } from "@/lib/data/schema/base";
import { Stall } from "@/lib/data/schema/stall/get_stall";
import { Loader2 } from "lucide-react";
import { useEffect } from "react";
import { useInView } from "react-intersection-observer";

interface StallInfiniteListProps {
  queryFn: (params: BasePaginationQuery) => Promise<PaginatedResponse<Stall>>;
  initialData?: Stall[];
}

export function StallInfiniteList({
  queryFn,
  initialData,
}: StallInfiniteListProps) {
  const { ref, inView } = useInView({
    threshold: 0.2, // Trigger saat 20% sentinel terlihat
    rootMargin: "200px", // Trigger 200px SEBELUM user mencapai paling bawah (seamless experience)
  });

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useInfiniteSearch<Stall, BasePaginationQuery>({
      queryKey: ["stalls-infinite-directory"],
      queryFn,
      initialLimit: 10,
    });

  const stalls = data.length > 0 ? data : (initialData ?? []);

  // Picu fetch page berikutnya otomatis saat sentinel masuk viewport
  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  if (isLoading && stalls.length === 0) {
    return (
      <div className="flex h-64 w-full items-center justify-center">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* List Card Memanjang */}
      <div className="flex flex-col gap-4">
        {stalls.map((stall) => (
          <StallCard key={stall.id} stall={stall} />
        ))}
      </div>

      {/* Sentinel & Spinner Loader Bawah */}
      <div ref={ref} className="py-6 flex justify-center items-center min-h-16">
        {isFetchingNextPage && <Spinner />}
      </div>
    </div>
  );
}

// ─── Component Spinner Keren (Glow Dual-Ring) ──────────────────────────────

function Spinner() {
  return (
    <div className="relative flex items-center justify-center p-4">
      {/* Backdrop Glow Accent */}
      <div className="absolute h-12 w-12 rounded-full bg-gradient-brand opacity-40 blur-md animate-pulse" />

      {/* Outer Pulse Ring */}
      <span className="absolute inline-flex h-11 w-11 animate-ping rounded-full bg-primary/20 opacity-75" />

      {/* Main Spinning Icon */}
      <div className="relative flex h-10 w-10 items-center justify-center rounded-full bg-card shadow-md border border-primary/20 text-primary">
        <Loader2 className="h-5 w-5 animate-spin" />
      </div>
    </div>
  );
}
