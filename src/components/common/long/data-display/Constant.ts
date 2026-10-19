/* eslint-disable @typescript-eslint/no-explicit-any */

import { PaginatedResponse } from "@/lib/data/schema/base";
import {
  Calendar as CalendarIcon,
  ListFilter,
  LucideIcon,
  SlidersHorizontal,
} from "lucide-react";
import { ReactNode } from "react";
import { IconValue } from "../../input/OptionIcon";
import { ConfirmDialogOptions, SurfaceType } from "../../SurfaceRenderer";

export interface FilterOption<TData> {
  id: keyof TData;
  title: string;
  type?: "input" | "date" | "select";
  options?: { label: string; value: string | number; icon?: IconValue }[];
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
  render?: (
    value: TData[K] | undefined,
    row: TData,
    index: number,
  ) => ReactNode;
};

export type ActionColumnDef<TData> = BaseColumnDef & {
  kind?: "action";
  render: (
    row: TData,
    index: number,
    context: DataDisplayActionContext<TData>,
  ) => ReactNode;
};

export type ColumnDef<TData> =
  | FieldColumnDef<TData, keyof TData>
  | ActionColumnDef<TData>;

export interface ColumnConfig<TData> {
  fields?: FieldColumnDef<TData, keyof TData>[];
  actions?: ActionColumnDef<TData>[];
}

// --- COLUMN HELPERS DENGAN RESOLVE OTOMATIS ---
export function createColumnHelpers<TData>() {
  function field<K extends keyof TData>(
    def: FieldColumnDef<TData, K>,
  ): ColumnDef<TData> {
    return def as ColumnDef<TData>;
  }

  function action(def: Omit<ActionColumnDef<TData>, "kind">): ColumnDef<TData> {
    return { kind: "action", ...def } as ColumnDef<TData>;
  }

  function resolve(columns: ColumnDef<TData>[] = []): ColumnConfig<TData> {
    const fields: FieldColumnDef<TData, keyof TData>[] = [];
    const actions: ActionColumnDef<TData>[] = [];

    for (const col of columns) {
      if ("kind" in col && col.kind === "action") {
        actions.push(col as ActionColumnDef<TData>);
      } else {
        fields.push(col as FieldColumnDef<TData, keyof TData>);
      }
    }

    return { fields, actions };
  }

  return { field, action, resolve };
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
  columns: ColumnConfig<TData>,
  action: DataDisplayActionContext<TData>,
) => ReactNode;

export interface DataDisplayActionContext<TData> {
  row: TData;
  index: number;
  openDetail: (type?: SurfaceType) => void;
  openEdit: (type?: SurfaceType) => void;
  openCreate: (type?: SurfaceType) => void;
  openConfirm: (onConfirm: () => void, options?: ConfirmDialogOptions) => void;
  openDelete: (onDelete: () => void, itemName?: string) => void;
}

export interface DataDisplayToolbarActionContext<TData> {
  openCreate: (type?: SurfaceType) => void;
  isLoading: boolean;
  rows: TData[];
}

export type ToolbarExtraAction<TData> =
  | ReactNode
  | ((context: DataDisplayToolbarActionContext<TData>) => ReactNode);

export type RowAction<TData> = (
  row: TData,
  index: number,
  action: DataDisplayActionContext<TData>,
) => void;

export type DataDisplayVariant = "table" | "list" | "card";
export type DataDisplayLoadMode =
  | "infinite-scroll"
  | "load-more"
  | "pagination";
