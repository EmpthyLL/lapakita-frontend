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

export const FILTER_TYPE_ICON: Record<
  NonNullable<FilterOption<any>["type"]>,
  LucideIcon
> = {
  input: SlidersHorizontal,
  date: CalendarIcon,
  select: ListFilter,
};
