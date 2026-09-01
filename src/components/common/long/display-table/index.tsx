/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Button } from "@/components/ui/button";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useInfiniteSearch } from "@/hooks/use-infinite-search";
import { usePagination } from "@/hooks/use-pagination";
import { BasePaginationQuery } from "@/lib/data/schema/base";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { ReactNode, useState } from "react";

import { ColumnDef, DisplayTableQuery, FilterOption } from "./Constant";
import { FilterItem } from "./FilterItem";
import { FilterOptions } from "./FilterOptions";
import { EmptyState, RowIndexBadge, SkeletonRows } from "./TableStates";

interface DisplayTableProps<TData, TParams extends Record<string, any>> {
  columns: ColumnDef<TData>[];
  query: DisplayTableQuery<TData, TParams>;
  rowKey: keyof TData;
  emptyText?: string;
  showFilter?: boolean;
  showCount?: boolean;
  countList?: number[];
  paginationMode?: "load-more" | "pagination";
}

function PageNumbers({
  currentPage,
  totalPages,
  onPageChange,
}: {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}) {
  const pages = new Set<number>([1, totalPages, currentPage]);
  if (currentPage - 1 > 1) pages.add(currentPage - 1);
  if (currentPage + 1 < totalPages) pages.add(currentPage + 1);

  const sorted = Array.from(pages)
    .filter((p) => p >= 1 && p <= totalPages)
    .sort((a, b) => a - b);

  const items: ReactNode[] = [];
  sorted.forEach((page, i) => {
    if (i > 0 && page - sorted[i - 1] > 1) {
      items.push(
        <PaginationItem key={`ellipsis-${page}`}>
          <PaginationEllipsis />
        </PaginationItem>,
      );
    }
    items.push(
      <PaginationItem key={page}>
        <PaginationLink
          isActive={page === currentPage}
          onClick={(e) => {
            e.preventDefault();
            onPageChange(page);
          }}
          className={cn(
            "rounded-full border-none transition-all shadow-none",
            page === currentPage
              ? "bg-primary text-primary-foreground font-semibold hover:bg-primary hover:text-primary-foreground"
              : "text-muted-foreground hover:bg-muted hover:text-foreground",
          )}
        >
          {page}
        </PaginationLink>
      </PaginationItem>,
    );
  });

  return <>{items}</>;
}

export function DisplayTable<TData, TParams extends BasePaginationQuery>({
  columns,
  query,
  emptyText,
  rowKey,
  showFilter = false,
  showCount = false,
  countList = [10, 20, 50, 100],
  paginationMode = "load-more",
}: DisplayTableProps<TData, TParams>) {
  const t = useTranslations("common.display_table");
  const [selectedOptions, setSelectedOptions] = useState<FilterOption<TData>[]>(
    [],
  );
  const [filterValues, setFilterValues] = useState<Partial<TParams>>({});
  const [pageSize, setPageSize] = useState(10);
  const [page, setPage] = useState(1);

  const isPagination = paginationMode === "pagination";

  const mergedParams = {
    ...query.defaultParams,
    ...filterValues,
    limit: pageSize,
    ...(isPagination ? { page } : {}),
  } as TParams;

  function updateFilterValues(updater: React.SetStateAction<Partial<TParams>>) {
    setFilterValues(updater);
    setPage(1);
  }

  const infinite = useInfiniteSearch<TData, TParams>({
    queryKey: [...query.queryKey(mergedParams), filterValues, pageSize],
    queryFn: query.queryFn,
    params: mergedParams,
    searchKey: query.searchKey,
    enabled: (query.enabled ?? true) && !isPagination,
    initialLimit: pageSize,
  });

  const paginated = usePagination<TData, TParams>({
    queryKey: [...query.queryKey(mergedParams), filterValues, pageSize, page],
    queryFn: query.queryFn,
    params: mergedParams,
    enabled: (query.enabled ?? true) && isPagination,
  });

  const rows = isPagination ? paginated.rows : infinite.data;
  const isLoading = isPagination
    ? paginated.isLoading
    : infinite.isFetching && !infinite.isFetchingNextPage;
  const isRefetching =
    isPagination && paginated.isFetching && !paginated.isLoading;

  const handleRemoveFilter = (option: FilterOption<TData>) => {
    setSelectedOptions((prev) => prev.filter((o) => o.id !== option.id));
  };

  return (
    <div className="space-y-3">
      {/* Filter Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        {showFilter && query.filterOptions && query.filterToParamKey && (
          <div className="flex flex-wrap items-center gap-2">
            <FilterOptions
              options={query.filterOptions}
              selectedOptions={selectedOptions}
              setSelectedOptions={setSelectedOptions}
            />
            <div className="flex flex-wrap gap-2">
              {selectedOptions.map((option) => (
                <FilterItem
                  key={option.id as string}
                  option={option}
                  filterValues={filterValues}
                  setFilterValues={updateFilterValues}
                  filterToParamKey={query.filterToParamKey!}
                  onRemove={handleRemoveFilter}
                />
              ))}
            </div>
          </div>
        )}
        {showCount && (
          <Select
            value={String(pageSize)}
            onValueChange={(value) => {
              setPageSize(Number(value));
              setPage(1);
            }}
          >
            <SelectTrigger className="w-40 rounded-full border-primary/20 bg-primary/5">
              <SelectValue placeholder={t("select_page_size")} />
            </SelectTrigger>
            <SelectContent>
              {countList.map((size) => (
                <SelectItem key={size} value={String(size)}>
                  {t("rows_count", { count: size })}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-2xl border border-border shadow-sm">
        <div className="overflow-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-b border-primary/15 bg-primary/5 hover:bg-primary/5">
                <TableHead className="w-10" />
                {columns.map((col) => {
                  const Icon = col.icon;
                  return (
                    <TableHead
                      key={String(col.key)}
                      className={cn(
                        "text-xs font-semibold tracking-wide text-primary/80",
                        col.className,
                      )}
                    >
                      <span className="flex items-center gap-1.5">
                        {Icon && <Icon className="h-3.5 w-3.5 text-primary" />}
                        {col.header}
                      </span>
                    </TableHead>
                  );
                })}
              </TableRow>
            </TableHeader>

            <TableBody
              className={cn(isRefetching && "opacity-60 transition-opacity")}
            >
              {isLoading ? (
                <SkeletonRows columnCount={columns.length + 1} />
              ) : rows.length === 0 ? (
                <EmptyState columnCount={columns.length + 1} text={emptyText} />
              ) : (
                rows.map((row, index) => (
                  <TableRow
                    key={String(row[rowKey])}
                    className={cn(
                      "group border-l-2 border-l-transparent transition-colors",
                      "hover:border-l-primary hover:bg-primary/4",
                      index % 2 === 1 && "bg-secondary/20",
                    )}
                  >
                    <TableCell className="w-10">
                      <RowIndexBadge index={index} />
                    </TableCell>
                    {columns.map((col) => (
                      <TableCell
                        key={String(col.key)}
                        className={col.className}
                      >
                        {col.render
                          ? col.render(row[col.key as keyof TData], row)
                          : String(row[col.key as keyof TData] ?? "")}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Unified Table Footer */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-sm">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2.5 w-2.5 items-center justify-center">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary/40 opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
          </span>

          <span className="text-muted-foreground font-medium">
            {t("showing")}{" "}
            <span className="font-semibold text-foreground">{rows.length}</span>
            {isPagination
              ? paginated.meta && (
                  <>
                    {" "}
                    {t("of")}{" "}
                    <span className="font-semibold text-foreground">
                      {paginated.meta.totalItems}
                    </span>
                  </>
                )
              : infinite.data && (
                  <>
                    {" "}
                    {t("of")}{" "}
                    <span className="font-semibold text-foreground">
                      {infinite?.meta?.totalItems ?? rows.length}
                    </span>
                  </>
                )}{" "}
            {t("rows")}
          </span>

          {((isPagination && isRefetching) ||
            (!isPagination &&
              infinite.isFetching &&
              !infinite.isFetchingNextPage)) && (
            <span className="bg-primary/10 text-primary flex items-center gap-1.5 rounded-full px-2 py-0.5 text-xs font-medium animate-in fade-in zoom-in-95">
              <Loader2 className="h-3 w-3 animate-spin" />
              {t("updating")}
            </span>
          )}
        </div>

        {isPagination
          ? paginated.meta &&
            paginated.meta.totalPages > 1 && (
              <Pagination className="mx-0 w-auto">
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      className={cn(
                        "rounded-full transition-transform active:scale-95",
                        !paginated.meta.hasPrevPage &&
                          "pointer-events-none opacity-40",
                      )}
                      onClick={(e) => {
                        e.preventDefault();
                        if (paginated.meta?.hasPrevPage) setPage((p) => p - 1);
                      }}
                    />
                  </PaginationItem>

                  <PageNumbers
                    currentPage={paginated.meta.currentPage}
                    totalPages={paginated.meta.totalPages}
                    onPageChange={setPage}
                  />

                  <PaginationItem>
                    <PaginationNext
                      className={cn(
                        "rounded-full transition-transform active:scale-95",
                        !paginated.meta.hasNextPage &&
                          "pointer-events-none opacity-40",
                      )}
                      onClick={(e) => {
                        e.preventDefault();
                        if (paginated.meta?.hasNextPage) setPage((p) => p + 1);
                      }}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            )
          : infinite.hasNextPage && (
              <Button
                variant="outline"
                size="sm"
                disabled={infinite.isFetchingNextPage}
                onClick={() => infinite.fetchNextPage()}
                className="border-primary/30 text-primary hover:bg-primary/10 hover:text-primary rounded-full px-4 font-semibold shadow-xs transition-all active:scale-95"
              >
                {infinite.isFetchingNextPage ? (
                  <>
                    <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
                    {t("loading")}
                  </>
                ) : (
                  t("load_more")
                )}
              </Button>
            )}
      </div>
    </div>
  );
}
