"use client";

import { CircleChartView } from "./CircleChartView";
import { GraphChartView } from "./GraphChartView";
import {
  ChartDetailConfig,
  ChartProps,
  CircleChartConfig,
  DEFAULT_HEIGHT,
  DataItem,
  GraphChartConfig,
} from "./types";

export * from "./types";

export function Chart<TData extends object = DataItem>({
  height = DEFAULT_HEIGHT,
  isDownload = false,
  downloadFilename = "chart",
  showValue = true,
  donutLabel = "Items",
  detailConfig,
  ...props
}: ChartProps<TData>) {
  if ("data" in props) {
    const charts = Array.isArray(props.chart) ? props.chart : [props.chart];
    if (charts.some((chart) => chart.type !== "graph")) {
      throw new Error("A combo chart must contain only graph chart configs.");
    }
    const xAxisKey = props.xAxisKey ?? ("name" as Extract<keyof TData, string>);

    return (
      <GraphChartView
        charts={charts as readonly GraphChartConfig<TData>[]}
        data={props.data}
        xAxisKey={xAxisKey}
        height={height}
        className={props.className}
        isDownload={isDownload}
        downloadFilename={downloadFilename}
        detailConfig={detailConfig as ChartDetailConfig<TData>}
      />
    );
  }

  const charts = Array.isArray(props.chart) ? props.chart : [props.chart];
  if (charts.some((chart) => chart.type !== "circle")) {
    throw new Error("A combo chart must contain only circle chart configs.");
  }

  return (
    <CircleChartView
      charts={charts as readonly CircleChartConfig[]}
      height={height}
      className={props.className}
      showValue={showValue}
      donutLabel={donutLabel}
      isDownload={isDownload}
      downloadFilename={downloadFilename}
      detailConfig={detailConfig as ChartDetailConfig<DataItem>}
    />
  );
}

export default Chart;
