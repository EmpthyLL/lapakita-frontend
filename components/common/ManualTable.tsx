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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useInfiniteSearch } from "@/hooks/use-infinite-search";
import { BasePaginationQuery, PaginatedResponse } from "@/lib/data/schema/base";
import { format } from "date-fns";
import { Plus, Trash2, Type } from "lucide-react";
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
  className?: string;
  render?: (value: unknown, row: TData) => ReactNode;
}

export interface ManualTableQuery<TData, TParams extends Record<string, any>> {
  queryFn: (params: TParams) => Promise<PaginatedResponse<TData>>;
  queryKey: (params: TParams) => any[];
  enabled?: boolean;
  defaultParams?: Omit<TParams, "limit">;
  filterOptions?: FilterOption<TData>[];
  filterToParamKey?: Record<string, keyof TParams>;
  searchKey?: keyof TParams;
}

interface ManualTableProps<TData, TParams extends Record<string, any>> {
  columns: ColumnDef<TData>[];
  query: ManualTableQuery<TData, TParams>;
  rowKey: keyof TData;
  emptyText?: string;
  showFilter?: boolean;
  showCount?: boolean;
  countList?: number[];
}

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
        <Button variant="outline" size="sm" className="rounded-full">
          <Plus className="mr-2 h-4 w-4 opacity-50" />
          Add filter
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-50 p-0" align="start">
        <Command>
          <CommandInput
            className="border-b px-4 py-2"
            placeholder="Filter by..."
          />
          {unselected.length < 1 ? (
            <div className="text-md py-6 text-center">Nothing Found</div>
          ) : (
            <CommandEmpty>Nothing Found</CommandEmpty>
          )}
          <CommandGroup>
            <ScrollArea className="max-h-[60vh] overflow-y-scroll">
              {unselected.map((option, index) => (
                <CommandItem
                  key={String(index)}
                  className="capitalize"
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
                  <Type className="mr-2 h-4 w-4" />
                  {option.title}
                </CommandItem>
              ))}
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
        <Button variant="outline" size="sm" className="rounded-full">
          {displayLabel()}
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-60 space-y-2 text-sm" align="start">
        {/* Header */}
        <div className="flex items-center justify-between">
          <span className="text-md font-medium capitalize">{option.title}</span>
          <Button
            aria-label="Remove filter"
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => {
              handleChange(undefined);
              onRemove(option);
            }}
          >
            <Trash2 className="size-4" />
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

// ─── ManualTable ──────────────────────────────────────────────────────────

export function ManualTable<TData, TParams extends BasePaginationQuery>({
  columns,
  query,
  emptyText = "No data found",
  rowKey,
  showFilter = false,
  showCount = false,
  countList = [10, 20, 50, 100],
}: ManualTableProps<TData, TParams>) {
  const [selectedOptions, setSelectedOptions] = useState<FilterOption<TData>[]>(
    [],
  );
  const [filterValues, setFilterValues] = useState<Partial<TParams>>({});
  const [pageSize, setPageSize] = useState(10);

  const mergedParams = {
    ...query.defaultParams,
    ...filterValues,
    limit: pageSize,
  } as TParams;

  const {
    data: rows,
    isFetching,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
  } = useInfiniteSearch<TData, TParams>({
    queryKey: [...query.queryKey(mergedParams), filterValues, pageSize],
    queryFn: query.queryFn,
    params: mergedParams,
    searchKey: query.searchKey,
    enabled: query.enabled ?? true,
    initialLimit: pageSize,
  });

  const handleRemoveFilter = (option: FilterOption<TData>) => {
    setSelectedOptions((prev) => prev.filter((o) => o.id !== option.id));
  };

  const isLoading = isFetching && !isFetchingNextPage;

  return (
    <div className="space-y-3">
      {/* Filter Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        {showFilter && query.filterOptions && query.filterToParamKey && (
          <div className="flex items-center space-x-2">
            <FilterOptions
              options={query.filterOptions}
              selectedOptions={selectedOptions}
              setSelectedOptions={setSelectedOptions}
            />
            <ActiveFilters
              selectedOptions={selectedOptions}
              filterValues={filterValues}
              setFilterValues={setFilterValues}
              filterToParamKey={query.filterToParamKey}
              onRemove={handleRemoveFilter}
            />
          </div>
        )}
        {showCount && (
          <Select
            value={String(pageSize)}
            onValueChange={(value) => setPageSize(Number(value))}
          >
            <SelectTrigger className="w-45">
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
      <div className="overflow-auto rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((col) => (
                <TableHead key={String(col.key)} className={col.className}>
                  {col.header}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>

          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="text-muted-foreground py-10 text-center"
                >
                  Loading...
                </TableCell>
              </TableRow>
            ) : rows.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="text-muted-foreground py-10 text-center"
                >
                  {emptyText}
                </TableCell>
              </TableRow>
            ) : (
              rows.map((row) => (
                <TableRow key={String(row[rowKey])}>
                  {columns.map((col) => (
                    <TableCell key={String(col.key)} className={col.className}>
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

      {/* Load More */}
      <div className="text-muted-foreground flex items-center justify-between text-sm">
        <span>Showing {rows.length} rows</span>
        {hasNextPage && (
          <Button
            variant="outline"
            size="sm"
            disabled={isFetchingNextPage}
            onClick={() => fetchNextPage()}
          >
            {isFetchingNextPage ? "Loading..." : "Load more"}
          </Button>
        )}
      </div>
    </div>
  );
}
