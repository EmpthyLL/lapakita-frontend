/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

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
import { useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";

import { Spinner } from "../../Spinner";
import {
  ColumnDef,
  DataDisplayLoadMode,
  DataDisplayQuery,
  DataDisplayVariant,
  ListItemRenderer,
} from "./Constant";
import { DataDisplayPagination } from "./DataDisplayPagination";
import {
  CardSkeleton,
  DataEmptyState,
  ListFooterCount,
  ListRowSkeleton,
} from "./ListStates";
import { LoadMoreFooter } from "./LoadMoreFooter";
import { CardGridCard } from "./presets/CardGridCard";
import { ListRowCard } from "./presets/ListRowCard";
import { SearchFilterBar } from "./SearchFilterBar";
import { EmptyState, RowIndexBadge, SkeletonRows } from "./TableStates";

interface DataDisplayProps<TData, TParams extends Record<string, any>> {
  query: DataDisplayQuery<TData, TParams>;
  rowKey: keyof TData;
  emptyText?: string;
  /** Visual shape — independent of how more rows get loaded. */
  variant?: DataDisplayVariant;
  /** How the next batch loads — works with any variant. */
  loadMode?: DataDisplayLoadMode;
  /** Fully overrides the built-in "list"/"card" preset. Not used for "table". */
  renderItem?: ListItemRenderer<TData>;
  columns?: ColumnDef<TData>[];
  showFilter?: boolean;
  showCount?: boolean;
  countList?: number[];
  toolbarExtraAction?: React.ReactNode;
}

export function DataDisplay<TData, TParams extends BasePaginationQuery>({
  query,
  emptyText,
  rowKey,
  variant = "list",
  loadMode = "infinite-scroll",
  renderItem,
  columns = [],
  showFilter = false,
  showCount = false,
  countList = [10, 20, 50, 100],
  toolbarExtraAction,
}: DataDisplayProps<TData, TParams>) {
  const t = useTranslations("common.data_display");
  const [searchValue, setSearchValue] = useState("");
  const [selectedOptions, setSelectedOptions] = useState<any[]>([]);
  const [filterValues, setFilterValues] = useState<Partial<TParams>>({});
  const [pageSize, setPageSize] = useState(10);
  const [page, setPage] = useState(1);

  const loadMoreRef = useRef<HTMLDivElement>(null);

  const isPagination = loadMode === "pagination";
  const isInfiniteScroll = loadMode === "infinite-scroll";

  const searchParam =
    query.searchKey && searchValue ? { [query.searchKey]: searchValue } : {};

  const mergedParams = {
    ...query.defaultParams,
    ...filterValues,
    ...searchParam,
    limit: pageSize,
    ...(isPagination ? { page } : {}),
  } as TParams;

  function updateFilterValues(updater: React.SetStateAction<Partial<TParams>>) {
    setFilterValues(updater);
    setPage(1);
  }

  function updateSearch(value: string) {
    setSearchValue(value);
    setPage(1);
  }

  const infinite = useInfiniteSearch<TData, TParams>({
    queryKey: [
      ...query.queryKey(mergedParams),
      filterValues,
      searchValue,
      pageSize,
    ],
    queryFn: query.queryFn,
    params: mergedParams,
    searchKey: query.searchKey,
    enabled: (query.enabled ?? true) && !isPagination,
    initialLimit: pageSize,
  });

  const paginated = usePagination<TData, TParams>({
    queryKey: [
      ...query.queryKey(mergedParams),
      filterValues,
      searchValue,
      pageSize,
      page,
    ],
    queryFn: query.queryFn,
    params: mergedParams,
    enabled: (query.enabled ?? true) && isPagination,
  });

  // Only "infinite-scroll" auto-fetches on scroll — "load-more" fetches the
  // same underlying pages, just gated behind a click instead of a sentinel.
  useEffect(() => {
    if (
      !isInfiniteScroll ||
      !infinite.hasNextPage ||
      infinite.isFetchingNextPage
    )
      return;

    const currentRef = loadMoreRef.current;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) infinite.fetchNextPage();
      },
      { threshold: 0.1 },
    );

    if (currentRef) observer.observe(currentRef);
    return () => {
      if (currentRef) observer.unobserve(currentRef);
    };
  }, [
    isInfiniteScroll,
    infinite.hasNextPage,
    infinite.isFetchingNextPage,
    infinite,
  ]);

  const rows = isPagination ? paginated.rows : infinite.data;
  const isLoading = isPagination
    ? paginated.isLoading
    : infinite.isFetching && !infinite.isFetchingNextPage;
  const isRefetching =
    isPagination && paginated.isFetching && !paginated.isLoading;
  const isUpdating =
    (isPagination && isRefetching) ||
    (!isPagination && infinite.isFetching && !infinite.isFetchingNextPage);

  const total = isPagination
    ? paginated.meta?.totalItems
    : infinite.meta?.totalItems;

  function renderPresetItem(row: TData, index: number) {
    if (renderItem) return renderItem(row, index);
    return variant === "card" ? (
      <CardGridCard row={row} index={index} columns={columns} />
    ) : (
      <ListRowCard row={row} index={index} columns={columns} />
    );
  }

  return (
    <div className="space-y-4">
      {/* Search + Filters */}
      {(showFilter || query.searchKey) && (
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex-1">
            <SearchFilterBar
              searchValue={searchValue}
              onSearchChange={updateSearch}
              filterOptions={showFilter ? query.filterOptions : undefined}
              selectedOptions={selectedOptions}
              setSelectedOptions={setSelectedOptions}
              filterValues={filterValues}
              setFilterValues={updateFilterValues}
              filterToParamKey={query.filterToParamKey}
              toolbarExtraAction={toolbarExtraAction}
            />
          </div>

          {showCount && (
            <Select
              value={String(pageSize)}
              onValueChange={(value) => {
                setPageSize(Number(value));
                setPage(1);
              }}
            >
              <SelectTrigger className="h-11 w-44 shrink-0 rounded-full border-border bg-secondary/30">
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
      )}

      {/* Body */}
      {variant === "table" ? (
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
                          {Icon && (
                            <Icon className="h-3.5 w-3.5 text-primary" />
                          )}
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
                  <EmptyState
                    columnCount={columns.length + 1}
                    text={emptyText}
                  />
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
      ) : isLoading ? (
        variant === "card" ? (
          <CardSkeleton />
        ) : (
          <ListRowSkeleton />
        )
      ) : rows.length === 0 ? (
        <DataEmptyState text={emptyText} />
      ) : (
        <div
          className={cn(
            "transition-opacity",
            variant === "card"
              ? "grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
              : "flex flex-col gap-3",
            isRefetching && "opacity-60",
          )}
        >
          {rows.map((row, index) => (
            <div key={String(row[rowKey])}>{renderPresetItem(row, index)}</div>
          ))}
        </div>
      )}

      {/* Footer */}
      <div className="flex flex-col gap-3 pt-2">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <ListFooterCount
            count={rows.length}
            total={total}
            updating={isUpdating}
          />
          {isPagination && paginated.meta && (
            <DataDisplayPagination
              currentPage={paginated.meta.currentPage}
              totalPages={paginated.meta.totalPages}
              hasPrevPage={paginated.meta.hasPrevPage}
              hasNextPage={paginated.meta.hasNextPage}
              onPageChange={setPage}
            />
          )}
        </div>

        {isInfiniteScroll && (
          <div ref={loadMoreRef}>
            {infinite.hasNextPage && infinite.isFetchingNextPage && <Spinner />}
          </div>
        )}

        {loadMode === "load-more" && infinite.hasNextPage && (
          <LoadMoreFooter
            onClick={() => infinite.fetchNextPage()}
            isLoading={infinite.isFetchingNextPage}
          />
        )}
      </div>
    </div>
  );
}
