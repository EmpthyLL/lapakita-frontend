import {
  SurfaceDetail,
  SurfaceType,
} from "@/components/common/SurfaceRenderer";

export interface DataItem {
  name: string;
  value: number;
}

export type ChartType = "circle" | "graph";
export type CircleChartKind = "pie" | "donut";
export type GraphChartKind = "bar" | "line";

export interface CircleChartConfig {
  type: "circle";
  chartType: CircleChartKind;
  data: DataItem[];
  label?: string;
}

export interface GraphChartConfig<TData extends object> {
  type: "graph";
  chartType: GraphChartKind;
  dataKey: Extract<keyof TData, string>;
  label?: string;
  color?: string;
}

export interface ChartDetailConfig<TData> {
  detail: SurfaceDetail<TData>;
  onItemClick?: (
    row: TData,
    index: number,
    context: ChartActionContext<TData>,
  ) => void;
}

export interface ChartActionContext<TData> {
  row: TData;
  index: number;
  openDetail: (type?: SurfaceType) => void;
}

export interface ChartDisplayProps {
  height?: number;
  className?: string;
  isDownload?: boolean;
  downloadFilename?: string;
  showValue?: boolean;
  donutLabel?: string;
}

export type ChartProps<TData extends object = DataItem> = ChartDisplayProps &
  (
    | ({
        chart: CircleChartConfig | readonly CircleChartConfig[];
        xAxisKey?: never;
      } & { detailConfig?: ChartDetailConfig<DataItem> })
    | ({
        chart: GraphChartConfig<TData> | readonly GraphChartConfig<TData>[];
        data: TData[];
        xAxisKey?: Extract<keyof TData, string>;
      } & { detailConfig?: ChartDetailConfig<TData> })
  );

export const CHART_COLORS = [
  "#3B82F6",
  "#F43F5E",
  "#F59E0B",
  "#10B981",
  "#8B5CF6",
  "#EF4444",
  "#06B6D4",
  "#84CC16",
  "#EC4899",
  "#14B8A6",
  "#F97316",
  "#6366F1",
] as const;

export const SVG_WIDTH = 900;
export const DEFAULT_HEIGHT = 400;
