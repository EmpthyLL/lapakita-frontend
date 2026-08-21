"use client";

import { Spinner } from "@/components/common/Spinner";
import { Button } from "@/components/ui/button";
import { useInfiniteSearch } from "@/hooks/use-infinite-search";
import { getStallReviews } from "@/lib/data/api/review";
import { BasePaginationQuery } from "@/lib/data/schema/base";
import {
  MOCK_STALL_REVIEW_SUMMARY,
  StallReview,
} from "@/lib/data/schema/review/get_stall_review";
import { ChevronDown } from "lucide-react";
import { StallReviewCard } from "./StallReviewCard";
import { StallReviewSummary } from "./StallReviewSummary";

export function StallReviewsSection({ stallId }: { stallId: string }) {
  const {
    data: reviews,
    isLoading,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
    meta,
  } = useInfiniteSearch<StallReview, BasePaginationQuery & { stallId: string }>(
    {
      queryKey: ["stall-reviews", stallId],
      queryFn: getStallReviews,
      params: { stallId },
      initialLimit: 5,
    },
  );

  const summary = MOCK_STALL_REVIEW_SUMMARY;
  const remaining = meta ? Math.max(meta.totalItems - reviews.length, 0) : 0;

  return (
    <div id="reviews">
      <h2 className="text-lg font-semibold text-foreground">
        Reviews from Tenants
      </h2>

      <div className="mt-4">
        <StallReviewSummary summary={summary} />
      </div>

      <div className="mt-5 space-y-4">
        {isLoading ? (
          <Spinner className="py-16" />
        ) : (
          reviews.map((review) => (
            <StallReviewCard key={review.id} review={review} />
          ))
        )}
      </div>
      {!isLoading && hasNextPage && (
        <div className="mt-5 flex flex-col items-center gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => fetchNextPage()}
            disabled={isFetchingNextPage}
            className="gap-1.5 rounded-full px-5"
          >
            {isFetchingNextPage ? (
              <>
                <Spinner className="h-4 w-4 p-0" />
                Showing...
              </>
            ) : (
              <>
                Show more reviews
                <ChevronDown className="h-4 w-4" />
              </>
            )}
          </Button>
          {remaining > 0 && (
            <span className="text-xs text-muted-foreground">
              {remaining} more review{remaining > 1 ? "s" : ""}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
