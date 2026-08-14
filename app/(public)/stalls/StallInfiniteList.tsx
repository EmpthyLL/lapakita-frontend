"use client";

import { Spinner } from "@/components/common/Spinner";
import { StallCard } from "@/components/common/StallCard";
import { useInfiniteScrollTrigger } from "@/hooks/use-infinite-scroll-trigger";
import { useInfiniteSearch } from "@/hooks/use-infinite-search";
import { getStalls } from "@/lib/data/api/stall";
import { BasePaginationQuery } from "@/lib/data/schema/base";
import { Stall } from "@/lib/data/schema/stall/get_stall";
import { useCallback } from "react";
import { StallResultsToolbar } from "./StallResultsToolbar";

export function StallInfiniteList() {
  const {
    data: stalls,
    isLoading,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
    meta,
  } = useInfiniteSearch<Stall, BasePaginationQuery>({
    queryKey: ["stalls"],
    queryFn: getStalls,
    initialLimit: 6,
  });

  const loadMore = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) fetchNextPage();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const sentinelRef = useInfiniteScrollTrigger({
    onIntersect: loadMore,
    enabled: hasNextPage && !isLoading,
  });

  if (isLoading) {
    return <Spinner className="py-24" />;
  }

  return (
    <div className="space-y-4">
      <StallResultsToolbar count={meta?.totalItems ?? stalls.length} />

      <div className="flex flex-col gap-4">
        {stalls.map((stall) => (
          <StallCard key={stall.id} stall={stall} />
        ))}
      </div>

      {/* Sentinel — as soon as this scrolls into view, the next page loads */}
      {hasNextPage && (
        <div ref={sentinelRef}>
          <Spinner />
        </div>
      )}
    </div>
  );
}
