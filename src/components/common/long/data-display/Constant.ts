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

export type ActionButtonVariant =
  | "default"
  | "primary"
  | "secondary"
  | "outline"
  | "destructive"
  | "ghost";

export interface DropdownActionItem<TData> {
  id: string;
  label: string;
  icon?: LucideIcon;
  action?: (row: TData) => void;
  onClick?: (row: TData) => void;
  href?: string;
  disabled?: boolean;
  destructive?: boolean;
  render?: (row: TData) => ReactNode;
}

export interface ActionItem<TData> {
  id: string;
  label?: string;
  icon?: LucideIcon;
  variant?: ActionButtonVariant;
  size?: ActionSize;
  action?: (row: TData) => void;
  onClick?: (row: TData) => void;
  href?: string;
  disabled?: boolean;
  render?: (row: TData) => ReactNode;
}

export type ActionSize =
  | "xs"
  | "sm"
  | "default"
  | "lg"
  | "icon"
  | "icon-xs"
  | "icon-sm"
  | "icon-lg";

export type ActionConfig<TData> =
  | {
      variant: "buttons";
      size?: ActionSize;
      items: ActionItem<TData>[];
    }
  | {
      variant: "dropdown";
      size?: ActionSize;
      items: DropdownActionItem<TData>[];
      align?: "start" | "end";
    }
  | {
      variant: "custom";
      render: (row: TData) => ReactNode;
    };

export interface BaseColumnDef {
  header?: string;
  icon?: LucideIcon;
  className?: string;
  primary?: boolean;
  hideInPreset?: boolean;
}

export interface FieldColumnDef<
  TData,
  K extends keyof TData = keyof TData,
> extends BaseColumnDef {
  key: K;
  render?: (value: TData[K], row: TData) => ReactNode;
}

export interface ActionColumnDef<TData> extends BaseColumnDef {
  kind: "action";
  action: ActionConfig<TData>;
}

export type ColumnDef<TData> =
  | FieldColumnDef<TData, keyof TData>
  | ActionColumnDef<TData>;

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
