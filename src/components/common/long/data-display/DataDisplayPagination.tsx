"use client";

import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";
import { useTranslations } from "next-intl";

interface DataDisplayPaginationProps {
  currentPage: number;
  totalPages: number;
  hasPrevPage: boolean;
  hasNextPage: boolean;
  onPageChange: (page: number) => void;
}

function getPageList(current: number, total: number) {
  const pages = new Set<number>([1, total, current]);
  if (current - 1 > 1) pages.add(current - 1);
  if (current + 1 < total) pages.add(current + 1);
  return Array.from(pages)
    .filter((p) => p >= 1 && p <= total)
    .sort((a, b) => a - b);
}

export function DataDisplayPagination({
  currentPage,
  totalPages,
  hasPrevPage,
  hasNextPage,
  onPageChange,
}: DataDisplayPaginationProps) {
  const t = useTranslations("common.display_table");
  if (totalPages <= 1) return null;
  const pageList = getPageList(currentPage, totalPages);

  return (
    <nav
      aria-label={t("page_indicator", {
        current: currentPage,
        total: totalPages,
      })}
    >
      {/* Compact: mobile */}
      <div className="flex items-center gap-1 rounded-full border border-border bg-card p-1 shadow-xs sm:hidden">
        <button
          type="button"
          disabled={!hasPrevPage}
          onClick={() => onPageChange(currentPage - 1)}
          className="flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground disabled:pointer-events-none disabled:opacity-30"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <span className="px-2 text-xs font-medium text-muted-foreground">
          {currentPage} / {totalPages}
        </span>
        <button
          type="button"
          disabled={!hasNextPage}
          onClick={() => onPageChange(currentPage + 1)}
          className="flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground disabled:pointer-events-none disabled:opacity-30"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      {/* Full pill bar: desktop */}
      <div className="hidden items-center gap-1 rounded-full border border-border bg-card p-1 shadow-xs sm:flex">
        <button
          type="button"
          disabled={!hasPrevPage}
          onClick={() => onPageChange(currentPage - 1)}
          className="flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground disabled:pointer-events-none disabled:opacity-30"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>

        {pageList.map((page, i) => {
          const prev = pageList[i - 1];
          const showEllipsis = prev !== undefined && page - prev > 1;
          return (
            <span key={page} className="flex items-center">
              {showEllipsis && (
                <span className="flex h-8 w-6 items-center justify-center text-muted-foreground">
                  <MoreHorizontal className="h-3.5 w-3.5" />
                </span>
              )}
              <button
                type="button"
                onClick={() => onPageChange(page)}
                className={cn(
                  "flex h-8 min-w-8 items-center justify-center rounded-full px-2.5 text-xs font-semibold transition-all",
                  page === currentPage
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground",
                )}
              >
                {page}
              </button>
            </span>
          );
        })}

        <button
          type="button"
          disabled={!hasNextPage}
          onClick={() => onPageChange(currentPage + 1)}
          className="flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground disabled:pointer-events-none disabled:opacity-30"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </nav>
  );
}
