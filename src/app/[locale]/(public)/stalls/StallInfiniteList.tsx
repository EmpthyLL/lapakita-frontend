"use client";

import { useStallSearchQuery } from "@/components/common/search/util/UseStallSearchQuery";
import { Spinner } from "@/components/common/Spinner";
import { StallCard } from "@/components/common/StallCard";
import { Button } from "@/components/ui/button";
import { useInfiniteScrollTrigger } from "@/hooks/use-infinite-scroll-trigger";
import { useInfiniteSearch } from "@/hooks/use-infinite-search";
import { getStalls } from "@/lib/data/api/stall";
import {
  Stall,
  StallSearchSchemaType,
} from "@/lib/data/schema/stall/get_stall";
import { RotateCcw, SearchX, Store } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useCallback } from "react";
import { StallResultsToolbar } from "./StallResultsToolbar";

export function StallInfiniteList() {
  const { params, setParamValues, commitPrimarySearch } = useStallSearchQuery();
  const searchParams = useSearchParams();

  // Gunakan string serialization dari searchParams sebagai bagian dari queryKey agar re-fetch terpanggil reaktif
  const searchString = searchParams.toString();
  const queryFromUrl = Object.fromEntries(searchParams.entries());
  const effectiveQuery = {
    permanenceType: "permanent",
    ...queryFromUrl,
  };

  const {
    data: stalls,
    isLoading,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
    meta,
  } = useInfiniteSearch<Stall, StallSearchSchemaType>({
    queryKey: ["stalls", searchString],
    queryFn: (query) =>
      getStalls({ ...query, ...effectiveQuery } as StallSearchSchemaType),
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
    commitPrimarySearch("full", { sortBy });
  }

  function handleResetFilters() {
    setParamValues({
      permanenceType: "permanent",
      location: "",
      propertyType: [],
      placement: "",
      businessType: "",
      facilities: [],
      landmarkEntries: [],
    });
    commitPrimarySearch("full");
  }

  if (isLoading) {
    return <Spinner className="py-24" />;
  }

  const totalCount = meta?.totalItems ?? stalls.length;

  if (totalCount === 0 && !isLoading) {
    const hasActiveFilters = Boolean(
      params.location ||
      params.businessType ||
      params.propertyType.length > 0 ||
      params.facilities.length > 0 ||
      params.placement,
    );

    return (
      <div className="space-y-4">
        <StallResultsToolbar
          count={0}
          sort={params.sortBy}
          onSortChange={handleSortChange}
        />

        <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            {hasActiveFilters ? (
              <SearchX className="h-8 w-8 stroke-2" />
            ) : (
              <Store className="h-8 w-8 stroke-2" />
            )}
          </div>

          <h3 className="text-base font-bold text-foreground">
            {hasActiveFilters ? "No stalls found" : "No stalls available"}
          </h3>

          <p className="mt-1.5 max-w-sm text-xs text-muted-foreground leading-relaxed">
            {hasActiveFilters
              ? "We couldn't find any stalls matching your current search criteria or filter configuration. Try adjusting your filters."
              : "There are currently no stalls registered or available in this listing category."}
          </p>

          {hasActiveFilters && (
            <Button
              onClick={handleResetFilters}
              className="mt-6 h-10 gap-2 rounded-xl bg-primary px-5 text-xs font-semibold text-primary-foreground hover:bg-primary/90"
            >
              <RotateCcw className="h-4 w-4" />
              Reset all filters
            </Button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <StallResultsToolbar
        count={totalCount}
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
