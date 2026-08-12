/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
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
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
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
import { BasePaginationQuery, PaginatedResponse } from "@/lib/data/schema/base";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import {
  Calendar as CalendarIcon,
  Inbox,
  ListFilter,
  Loader2,
  LucideIcon,
  Plus,
  SlidersHorizontal,
  Sparkles,
  Trash2,
} from "lucide-react";
import { ReactNode, useState } from "react";
import { Input } from "../ui/input";
import { DatePicker } from "./input/DatePicker";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface FilterOption<TData> {
  id: keyof TData;
  title: string;
  type?: "input" | "date" | "select";
  options?: { label: string; value: string | number }[];
}

export interface ColumnDef<TData> {
  key: keyof TData;
  header: string;
  /** Optional icon shown next to the header label — makes columns easier to scan. */
  icon?: LucideIcon;
  className?: string;
  render?: (value: unknown, row: TData) => ReactNode;
}

export interface DisplayTableQuery<TData, TParams extends Record<string, any>> {
  queryFn: (params: TParams) => Promise<PaginatedResponse<TData>>;
  queryKey: (params: TParams) => any[];
  enabled?: boolean;
  defaultParams?: Omit<TParams, "limit">;
  filterOptions?: FilterOption<TData>[];
  filterToParamKey?: Record<string, keyof TParams>;
  searchKey?: keyof TParams;
}

interface DisplayTableProps<TData, TParams extends Record<string, any>> {
  columns: ColumnDef<TData>[];
  query: DisplayTableQuery<TData, TParams>;
  rowKey: keyof TData;
  emptyText?: string;
  showFilter?: boolean;
  showCount?: boolean;
  countList?: number[];
  /** "load-more" accumulates pages with a button. "pagination" shows page numbers, one page at a time. */
  paginationMode?: "load-more" | "pagination";
}

const FILTER_TYPE_ICON: Record<
  NonNullable<FilterOption<any>["type"]>,
  LucideIcon
> = {
  input: SlidersHorizontal,
  date: CalendarIcon,
  select: ListFilter,
};

// ─── FilterOptions ────────────────────────────────────────────────────────────

interface FilterOptionsProps<TData> {
  options: FilterOption<TData>[];
  selectedOptions: FilterOption<TData>[];
  setSelectedOptions: React.Dispatch<
    React.SetStateAction<FilterOption<TData>[]>
  >;
}

function FilterOptions<TData>({
  options,
  selectedOptions,
  setSelectedOptions,
}: FilterOptionsProps<TData>) {
  const [open, setOpen] = useState(false);
  const unselected = options.filter(
    (o) => !selectedOptions.find((s) => s.id === o.id),
  );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="rounded-full border-dashed border-primary/40 text-primary hover:border-primary hover:bg-primary/5 hover:text-primary"
        >
          <Plus className="mr-1.5 h-3.5 w-3.5" />
          Add filter
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-56 p-0" align="start">
        <Command>
          <CommandInput
            className="border-b px-4 py-2"
            placeholder="Filter by..."
          />
          {unselected.length < 1 ? (
            <div className="flex flex-col items-center gap-2 py-8 text-center text-sm text-muted-foreground">
              <Sparkles className="h-4 w-4 text-primary/50" />
              All filters added
            </div>
          ) : (
            <CommandEmpty>Nothing found</CommandEmpty>
          )}
          <CommandGroup>
            <ScrollArea className="max-h-[60vh] overflow-y-scroll">
              {unselected.map((option, index) => {
                const Icon = FILTER_TYPE_ICON[option.type ?? "input"];
                return (
                  <CommandItem
                    key={String(index)}
                    className="gap-2 capitalize"
                    value={String(option.id).split("_").join(" ")}
                    onSelect={() => {
                      setOpen(false);
                      setSelectedOptions((prev) => {
                        const isSelected = prev.some(
                          (item) => item.id === option.id,
                        );
                        if (isSelected)
                          return prev.filter((item) => item.id !== option.id);
                        return [...prev, option];
                      });
                    }}
                  >
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                      <Icon className="h-3.5 w-3.5" />
                    </span>
                    {option.title}
                  </CommandItem>
                );
              })}
            </ScrollArea>
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

// ─── FilterItem ────────────────────────────────────────────────────────────────

interface FilterItemProps<TData, TParams extends Record<string, unknown>> {
  option: FilterOption<TData>;
  filterValues: Partial<TParams>;
  setFilterValues: React.Dispatch<React.SetStateAction<Partial<TParams>>>;
  filterToParamKey: Record<string, keyof TParams>;
  onRemove: (option: FilterOption<TData>) => void;
}

function FilterItem<TData, TParams extends Record<string, unknown>>({
  option,
  filterValues,
  setFilterValues,
  filterToParamKey,
  onRemove,
}: FilterItemProps<TData, TParams>) {
  const [open, setOpen] = useState(true);
  const paramKey = filterToParamKey[option.id as string];
  const value = paramKey
    ? ((filterValues[paramKey] as string | number | Date | undefined) ?? "")
    : "";
  const hasValue = value !== "" && value !== undefined && value !== null;
  const Icon = FILTER_TYPE_ICON[option.type ?? "input"];

  const handleChange = (val: string | number | Date | null | undefined) => {
    if (!paramKey) return;
    setFilterValues((prev) => ({
      ...prev,
      [paramKey]: val ?? undefined,
    }));
  };

  const displayLabel = () => {
    if (!value && value !== 0)
      return <span className="capitalize">{option.title}</span>;

    if (option.type === "date" && value instanceof Date) {
      return (
        <span>
          {option.title} : {format(value, "dd MMM yyyy")}
        </span>
      );
    }

    if (option.type === "select" && option.options) {
      const found = option.options.find((o) => o.value === value);
      return (
        <span>
          {option.title} : {found?.label ?? String(value)}
        </span>
      );
    }

    return (
      <span>
        {option.title} : {String(value)}
      </span>
    );
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className={cn(
            "gap-1.5 rounded-full transition-colors",
            hasValue
              ? "border-primary/40 bg-primary/10 text-primary hover:bg-primary/15 hover:text-primary"
              : "border-border text-muted-foreground",
          )}
        >
          <Icon className="h-3.5 w-3.5" />
          {displayLabel()}
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-60 space-y-2 text-sm" align="start">
        {/* Header */}
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-1.5 text-sm font-medium capitalize text-foreground">
            <Icon className="h-3.5 w-3.5 text-primary" />
            {option.title}
          </span>
          <Button
            aria-label="Remove filter"
            variant="ghost"
            size="icon"
            className="h-7 w-7 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
            onClick={() => {
              handleChange(undefined);
              onRemove(option);
            }}
          >
            <Trash2 className="size-3.5" />
          </Button>
        </div>

        {/* Input */}
        {option.type === "date" ? (
          <DatePicker
            value={
              value instanceof Date
                ? value
                : value
                  ? new Date(String(value))
                  : null
            }
            onChange={(date) => {
              handleChange(date ?? undefined);
              if (date) setOpen(false);
            }}
          />
        ) : option.type === "select" && option.options ? (
          <Select
            value={String(value)}
            onValueChange={(val) => {
              handleChange(val);
              setOpen(false);
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select option" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {option.options.map((op) => (
                  <SelectItem key={op.value} value={String(op.value)}>
                    {op.label}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        ) : (
          <Input
            placeholder="Type here..."
            className="h-8"
            value={String(value)}
            autoFocus
            onChange={(e) =>
              handleChange(e.target.value === "" ? undefined : e.target.value)
            }
            onKeyDown={(e) => {
              if (e.key === "Enter") setOpen(false);
            }}
          />
        )}
      </PopoverContent>
    </Popover>
  );
}

// ─── ActiveFilters ─────────────────────────────────────────────────────────────

interface ActiveFiltersProps<TData, TParams extends Record<string, unknown>> {
  selectedOptions: FilterOption<TData>[];
  filterValues: Partial<TParams>;
  setFilterValues: React.Dispatch<React.SetStateAction<Partial<TParams>>>;
  filterToParamKey: Record<string, keyof TParams>;
  onRemove: (option: FilterOption<TData>) => void;
}

function ActiveFilters<TData, TParams extends Record<string, unknown>>({
  selectedOptions,
  filterValues,
  setFilterValues,
  filterToParamKey,
  onRemove,
}: ActiveFiltersProps<TData, TParams>) {
  if (selectedOptions.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2">
      {selectedOptions.map((option) => (
        <FilterItem
          key={option.id as string}
          option={option}
          filterValues={filterValues}
          setFilterValues={setFilterValues}
          filterToParamKey={filterToParamKey}
          onRemove={onRemove}
        />
      ))}
    </div>
  );
}

// ─── Row-index chip ────────────────────────────────────────────────────────

function RowIndexBadge({ index }: { index: number }) {
  // Cycles through a few soft primary tints so long lists don't look flat
  const tints = [
    "bg-primary/10 text-primary",
    "bg-primary/15 text-primary",
    "bg-primary/[0.08] text-primary/80",
  ];
  const tint = tints[index % tints.length];
  return (
    <span
      className={cn(
        "flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[11px] font-semibold",
        tint,
      )}
    >
      {index + 1}
    </span>
  );
}

// ─── Skeleton rows ───────────────────────────────────────────────────────────

function SkeletonRows({
  columnCount,
  rows = 6,
}: {
  columnCount: number;
  rows?: number;
}) {
  return (
    <>
      {Array.from({ length: rows }).map((_, r) => (
        <TableRow key={`skeleton-${r}`} className="hover:bg-transparent">
          {Array.from({ length: columnCount }).map((_, c) => (
            <TableCell key={c}>
              <Skeleton
                className="h-4 rounded-full bg-primary/10"
                style={{
                  width: c === 0 ? "60%" : `${60 + ((r + c) % 3) * 10}%`,
                }}
              />
            </TableCell>
          ))}
        </TableRow>
      ))}
    </>
  );
}

// ─── Empty state ─────────────────────────────────────────────────────────────

function EmptyState({
  columnCount,
  text,
}: {
  columnCount: number;
  text: string;
}) {
  return (
    <TableRow className="hover:bg-transparent">
      <TableCell colSpan={columnCount} className="py-14 text-center">
        <div className="flex flex-col items-center gap-2">
          <span className="flex h-11 w-11 items-center justify-center rounded-full bg-primary/10 text-primary">
            <Inbox className="h-5 w-5" />
          </span>
          <p className="text-sm font-medium text-foreground">{text}</p>
          <p className="text-xs text-muted-foreground">
            Try adjusting or clearing your filters.
          </p>
        </div>
      </TableCell>
    </TableRow>
  );
}

// ─── Pagination bar ──────────────────────────────────────────────────────────

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
            "rounded-full",
            page === currentPage &&
              "border-primary bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground",
          )}
        >
          {page}
        </PaginationLink>
      </PaginationItem>,
    );
  });

  return <>{items}</>;
}

// ─── DisplayTable ──────────────────────────────────────────────────────────

export function DisplayTable<TData, TParams extends BasePaginationQuery>({
  columns,
  query,
  emptyText = "No data found",
  rowKey,
  showFilter = false,
  showCount = false,
  countList = [10, 20, 50, 100],
  paginationMode = "load-more",
}: DisplayTableProps<TData, TParams>) {
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

  // Reset to page 1 whenever filters or page size change
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
            <ActiveFilters
              selectedOptions={selectedOptions}
              filterValues={filterValues}
              setFilterValues={updateFilterValues}
              filterToParamKey={query.filterToParamKey}
              onRemove={handleRemoveFilter}
            />
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
              <SelectValue placeholder="Select page size" />
            </SelectTrigger>
            <SelectContent>
              {countList.map((size) => (
                <SelectItem key={size} value={String(size)}>
                  {size} rows
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

      {/* Footer: load-more or pagination */}
      {/* ─── Unified Table Footer ────────────────────────────────────────────── */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-sm">
        {/* SISI KIRI (Pasti muncul di kedua mode) */}
        <div className="flex items-center gap-2">
          {/* Animated Status Dot */}
          <span className="relative flex h-2.5 w-2.5 items-center justify-center">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary/40 opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
          </span>

          {/* Counter Info */}
          <span className="text-muted-foreground font-medium">
            Showing{" "}
            <span className="font-semibold text-foreground">{rows.length}</span>
            {isPagination
              ? paginated.meta && (
                  <>
                    {" "}
                    of{" "}
                    <span className="font-semibold text-foreground">
                      {paginated.meta.totalItems}
                    </span>
                  </>
                )
              : infinite.data && (
                  <>
                    {" "}
                    of{" "}
                    <span className="font-semibold text-foreground">
                      {infinite?.meta?.totalItems ?? rows.length}
                    </span>
                  </>
                )}{" "}
            rows
          </span>

          {/* Refetching Alert Badge */}
          {((isPagination && isRefetching) ||
            (!isPagination &&
              infinite.isFetching &&
              !infinite.isFetchingNextPage)) && (
            <span className="bg-primary/10 text-primary flex items-center gap-1.5 rounded-full px-2 py-0.5 text-xs font-medium animate-in fade-in zoom-in-95">
              <Loader2 className="h-3 w-3 animate-spin" />
              Updating...
            </span>
          )}
        </div>

        {/* SISI KANAN (Action bergantung pada `paginationMode`) */}
        {isPagination
          ? /* Mode 1: Numbered Pagination */
            paginated.meta &&
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
          : /* Mode 2: Load More Button */
            infinite.hasNextPage && (
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
                    Loading...
                  </>
                ) : (
                  "Load more"
                )}
              </Button>
            )}
      </div>
    </div>
  );
}
