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

export interface BaseColumnDef {
  header?: string;
  icon?: LucideIcon;
  className?: string;
  primary?: boolean;
  hideInPreset?: boolean;
}

export type FieldColumnDef<
  TData,
  K extends keyof TData = keyof TData,
> = BaseColumnDef & {
  key: K;
  render?: (value: TData[K], row: TData, index: number) => ReactNode;
};

export type ActionColumnDef<TData> = BaseColumnDef & {
  kind: "action";
  render: (row: TData, index: number) => ReactNode;
};

export type ColumnDef<TData> =
  | FieldColumnDef<TData, keyof TData>
  | ActionColumnDef<TData>;

export function createColumnHelpers<TData>() {
  function field<K extends keyof TData>(
    def: FieldColumnDef<TData, K>,
  ): ColumnDef<TData> {
    return def as ColumnDef<TData>;
  }

  function action(def: Omit<ActionColumnDef<TData>, "kind">): ColumnDef<TData> {
    return { kind: "action", ...def };
  }

  return { field, action };
}

export interface DataDisplayQuery<TData, TParams extends Record<string, any>> {
  queryFn: (params: TParams) => Promise<PaginatedResponse<TData>>;
  queryKey: (params: TParams) => any[];
  enabled?: boolean;
  defaultParams?: Omit<TParams, "limit">;
  filterOptions?: FilterOption<TData>[];
  filterToParamKey?: Record<string, keyof TParams>;
  searchKey?: keyof TParams;
  searchPlaceholder?: string;
}

export const FILTER_TYPE_ICON: Record<
  NonNullable<FilterOption<any>["type"]>,
  LucideIcon
> = {
  input: SlidersHorizontal,
  date: CalendarIcon,
  select: ListFilter,
};

export type ListItemRenderer<TData> = (row: TData, index: number) => ReactNode;

export type DataDisplayVariant = "table" | "list" | "card";
export type DataDisplayLoadMode =
  | "infinite-scroll"
  | "load-more"
  | "pagination";
