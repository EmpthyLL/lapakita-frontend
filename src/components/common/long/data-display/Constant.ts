/* eslint-disable @typescript-eslint/no-explicit-any */
import { PaginatedResponse } from "@/lib/data/schema/base";
import {
  Calendar as CalendarIcon,
  ListFilter,
  LucideIcon,
  SlidersHorizontal,
} from "lucide-react";
import { ReactNode } from "react";

export interface FilterOption<TData> {
  id: keyof TData;
  title: string;
  type?: "input" | "date" | "select";
  options?: { label: string; value: string | number }[];
}

export interface ColumnDef<TData> {
  key: keyof TData;
  header: string;
  icon?: LucideIcon;
  className?: string;
  render?: (value: unknown, row: TData) => ReactNode;
  /** Marks this as the title field used by the "list" and "card" presets.
   *  Defaults to the first column in the array when none is marked. */
  primary?: boolean;
  /** Excludes this column from "list"/"card" preset meta chips — still
   *  shown normally in "table" variant. Use for fields that don't read
   *  well as a small chip (raw IDs, long text, etc). */
  hideInPreset?: boolean;
}

export interface DataDisplayQuery<TData, TParams extends Record<string, any>> {
  queryFn: (params: TParams) => Promise<PaginatedResponse<TData>>;
  queryKey: (params: TParams) => any[];
  enabled?: boolean;
  defaultParams?: Omit<TParams, "limit">;
  filterOptions?: FilterOption<TData>[];
  filterToParamKey?: Record<string, keyof TParams>;
  searchKey?: keyof TParams;
}

export const FILTER_TYPE_ICON: Record<
  NonNullable<FilterOption<any>["type"]>,
  LucideIcon
> = {
  input: SlidersHorizontal,
  date: CalendarIcon,
  select: ListFilter,
};

/** Fully overrides the built-in "list"/"card" preset for a row. */
export type ListItemRenderer<TData> = (row: TData, index: number) => ReactNode;

export type DataDisplayVariant = "table" | "list" | "card";
export type DataDisplayLoadMode =
  | "infinite-scroll"
  | "load-more"
  | "pagination";
