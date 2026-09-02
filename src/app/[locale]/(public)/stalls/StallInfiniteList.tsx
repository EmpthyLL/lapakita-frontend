"use client";

import { useStallSearchQuery } from "@/components/common/search/util/UseStallSearchQuery";
import { Spinner } from "@/components/common/Spinner";
import { StallCard } from "@/components/common/StallCard";
import { useInfiniteScrollTrigger } from "@/hooks/use-infinite-scroll-trigger";
import { useInfiniteSearch } from "@/hooks/use-infinite-search";
import { getStalls } from "@/lib/data/api/stall";
import {
  Stall,
  StallSearchSchemaType,
} from "@/lib/data/schema/stall/get_stall";
import { useCallback } from "react";
import { StallResultsToolbar } from "./StallResultsToolbar";

export function StallInfiniteList() {
  const { params, setParamValues, commitSearch } = useStallSearchQuery();

  const {
    data: stalls,
    isLoading,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
    meta,
  } = useInfiniteSearch<Stall, StallSearchSchemaType>({
    queryKey: ["stalls", params.sortBy],
    queryFn: (query) => getStalls({ ...query, sortBy: params.sortBy }),
    initialLimit: 6,
  });

  const loadMore = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) fetchNextPage();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const sentinelRef = useInfiniteScrollTrigger({
    onIntersect: loadMore,
    enabled: hasNextPage && !isLoading,
  });

  function handleSortChange(sortBy: string) {
    setParamValues({ sortBy });
    commitSearch("full");
  }

  if (isLoading) {
    return <Spinner className="py-24" />;
  }

  return (
    <div className="space-y-4">
      <StallResultsToolbar
        count={meta?.totalItems ?? stalls.length}
        sort={params.sortBy}
        onSortChange={handleSortChange}
      />

      <div className="flex flex-col gap-4">
        {stalls.map((stall) => (
          <StallCard key={stall.id} stall={stall} />
        ))}
      </div>

      {hasNextPage && (
        <div ref={sentinelRef}>
          <Spinner />
        </div>
      )}
    </div>
  );
}
