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
  render: (
    row: TData,
    index: number,
    context: DataDisplayActionContext<TData>,
  ) => ReactNode;
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
  filterOptions?: FilterOption<TParams>[];
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

export type ListItemRenderer<TData> = (
  row: TData,
  index: number,
  columns: ColumnDef<TData>[],
  action: DataDisplayActionContext<TData>,
) => ReactNode;

export type DataDisplaySurface = "dialog" | "sidebar" | "expandable" | "link";

export interface DataDisplayActionContext<TData> {
  row: TData;
  index: number;
  openDetail: (type?: DataDisplaySurface) => void;
  openEdit: (type?: DataDisplaySurface) => void;
  openCreate: (type?: DataDisplaySurface) => void;
  openConfirm: (
    onConfirm: () => void,
    options?: DataDisplayConfirmOptions,
  ) => void;
  openDelete: (onDelete: () => void, itemName?: string) => void;
}

// Konteks tambahan yang dikirim ke fungsi toolbarExtraAction
export interface DataDisplayToolbarActionContext<TData> {
  openCreate: (type?: DataDisplaySurface) => void;
  isLoading: boolean;
  rows: TData[];
}

export type ToolbarExtraAction<TData> =
  | ReactNode
  | ((context: DataDisplayToolbarActionContext<TData>) => ReactNode);

export interface DataDisplayConfirmOptions {
  title?: string;
  description?: ReactNode;
  confirmText?: string;
  cancelText?: string;
  itemName?: string;
  variant?: "destructive" | "warning" | "info" | "success";
}

export type RowAction<TData> = (
  row: TData,
  index: number,
  action: DataDisplayActionContext<TData>,
) => void;

interface DataDisplayBaseSurfaceConfig<TData> {
  type?: DataDisplaySurface;
  title?: ReactNode;
  description?: ReactNode;
  href?: string;
  component?: (props: { row: TData; index: number }) => ReactNode;
}

export type DataDisplayDetail<TData> = DataDisplayBaseSurfaceConfig<TData>;

export interface DataDisplayFormComponentProps<TData> {
  row?: TData;
  index?: number;
  mode: "create" | "edit";
  close: () => void;
}

export type DataDisplayForm<TData> = BaseColumnDef & {
  type?: DataDisplaySurface;
  title?: ReactNode;
  description?: ReactNode;
  href?: string;
  component: (props: DataDisplayFormComponentProps<TData>) => ReactNode;
};

export type DataDisplayVariant = "table" | "list" | "card";
export type DataDisplayLoadMode =
  | "infinite-scroll"
  | "load-more"
  | "pagination";
