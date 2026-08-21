import { StallReviewSummary as StallReviewSummaryType } from "@/lib/data/schema/review/get_stall_review";
import { Star } from "lucide-react";

const STAR_LEVELS = [5, 4, 3, 2, 1] as const;

export function StallReviewSummary({
  summary,
}: {
  summary: StallReviewSummaryType;
}) {
  return (
    <div className="grid grid-cols-1 gap-6 rounded-2xl border border-border bg-card p-5 sm:grid-cols-[auto_1fr] sm:gap-8">
      {/* Big number */}
      <div className="flex flex-col items-center justify-center gap-1 sm:items-start">
        <span className="text-4xl font-bold text-foreground">
          {summary.averageRating.toFixed(1)}
        </span>
        <div className="flex items-center gap-0.5">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              className={
                i < Math.round(summary.averageRating)
                  ? "h-4 w-4 fill-amber-400 text-amber-400"
                  : "h-4 w-4 fill-muted text-muted"
              }
            />
          ))}
        </div>
        <span className="text-xs text-muted-foreground">
          {summary.totalReviews} reviews
        </span>
      </div>

      {/* Breakdown bars */}
      <div className="space-y-1.5">
        {STAR_LEVELS.map((level) => {
          const count = summary.breakdown[level];
          const percent = summary.totalReviews
            ? Math.round((count / summary.totalReviews) * 100)
            : 0;
          return (
            <div key={level} className="flex items-center gap-2 text-xs">
              <span className="flex w-8 shrink-0 items-center gap-0.5 text-muted-foreground">
                {level}
                <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
              </span>
              <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-secondary">
                <div
                  className="h-full rounded-full bg-primary transition-all"
                  style={{ width: `${percent}%` }}
                />
              </div>
              <span className="w-6 shrink-0 text-right text-muted-foreground">
                {count}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
