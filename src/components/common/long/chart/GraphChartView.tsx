"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Download } from "lucide-react";
import {
  useMemo,
  useRef,
  useState,
  type MouseEvent,
  type RefObject,
} from "react";
import { ChartDetailConfig, GraphChartConfig, SVG_WIDTH } from "./types";
import {
  downloadCsv,
  downloadPng,
  downloadSvg,
  formatAxisNumber,
  formatNumber,
  getColor,
  getLabelValue,
  getNumericValue,
  useChartSurfaces,
} from "./utils";

function DownloadMenu({
  containerRef,
  filename,
  csvRows,
}: {
  containerRef: RefObject<HTMLDivElement | null>;
  filename: string;
  csvRows: unknown[][];
}) {
  const download = (format: "svg" | "png") => {
    const svg = containerRef.current?.querySelector("svg");
    if (!svg) {
      console.error("Unable to find chart SVG for download.");
      return;
    }
    if (format === "svg") downloadSvg(svg, filename);
    else downloadPng(svg, filename);
  };

  return (
    <div className="mb-2 flex justify-end gap-2">
      <Button
        size="sm"
        variant="outline"
        className="gap-1.5"
        onClick={() => download("svg")}
      >
        <Download size={14} />
        Download SVG
      </Button>
      <Button size="sm" variant="outline" onClick={() => download("png")}>
        Download PNG
      </Button>
      <Button
        size="sm"
        variant="outline"
        onClick={() => downloadCsv(csvRows, filename)}
      >
        Download CSV
      </Button>
    </div>
  );
}

export function GraphChartView<TData extends object>({
  charts,
  data,
  xAxisKey,
  height,
  className,
  isDownload,
  downloadFilename,
  detailConfig,
}: {
  charts: readonly GraphChartConfig<TData>[];
  data: TData[];
  xAxisKey: Extract<keyof TData, string>;
  height: number;
  className?: string;
  isDownload: boolean;
  downloadFilename: string;
  detailConfig?: ChartDetailConfig<TData>;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { getActionContext, renderer } = useChartSurfaces<TData>(detailConfig);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const margin = { top: 24, right: 24, bottom: 56, left: 76 };
  const plotWidth = SVG_WIDTH - margin.left - margin.right;
  const plotHeight = Math.max(40, height - margin.top - margin.bottom);
  const xStep = plotWidth / Math.max(data.length, 1);
  const xPosition = (index: number) => margin.left + xStep * (index + 0.5);

  const barCharts = charts.filter((chart) => chart.chartType === "bar");
  const lineCharts = charts.filter((chart) => chart.chartType === "line");

  const stackedValues = data.flatMap((row) => {
    let positiveTotal = 0;
    let negativeTotal = 0;
    for (const chart of barCharts) {
      const value = getNumericValue(row, chart.dataKey);
      if (value >= 0) positiveTotal += value;
      else negativeTotal += value;
    }
    return [positiveTotal, negativeTotal];
  });

  const lineValues = lineCharts.flatMap((chart) =>
    data.map((row) => getNumericValue(row, chart.dataKey)),
  );

  const values = [...stackedValues, ...lineValues, 0];
  const minValue = values.reduce(
    (minimum, value) => Math.min(minimum, value),
    0,
  );
  const maxValue = values.reduce(
    (maximum, value) => Math.max(maximum, value),
    0,
  );
  const valuePadding = Math.max((maxValue - minValue) * 0.08, 1);
  const domainMin = minValue < 0 ? minValue - valuePadding : 0;
  const domainMax = maxValue + valuePadding;
  const yPosition = (value: number) =>
    margin.top + ((domainMax - value) / (domainMax - domainMin)) * plotHeight;

  const colorMap = useMemo(
    () =>
      new Map(
        charts.map((chart, index) => [chart, chart.color ?? getColor(index)]),
      ),
    [charts],
  );

  const csvRows = useMemo(
    () => [
      [
        String(xAxisKey),
        ...charts.map((chart) => chart.label ?? String(chart.dataKey)),
      ],
      ...data.map((row) => [
        getLabelValue(row, xAxisKey),
        ...charts.map((chart) =>
          formatNumber(getNumericValue(row, chart.dataKey)),
        ),
      ]),
    ],
    [charts, data, xAxisKey],
  );

  const tickIndexes = data
    .map((_, index) => index)
    .filter(
      (index) =>
        data.length <= 10 ||
        index === 0 ||
        index === data.length - 1 ||
        index % Math.ceil(data.length / 8) === 0,
    );

  const tickValues = Array.from({ length: 5 }, (_, index) => {
    const value = domainMin + ((domainMax - domainMin) * index) / 4;
    return { value, y: yPosition(value) };
  });

  const handleItemAction = (row: TData, index: number) => {
    const context = getActionContext(row, index);
    if (detailConfig?.onItemClick) {
      detailConfig.onItemClick(row, index, context);
    } else if (detailConfig?.detail) {
      context.openDetail();
    }
  };

  const isInteractive = Boolean(
    detailConfig?.detail || detailConfig?.onItemClick,
  );
  const activeHoverRow = hoveredIndex !== null ? data[hoveredIndex] : null;

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left + 14,
      y: e.clientY - rect.top + 14,
    });
  };

  return (
    <div
      ref={containerRef}
      className={cn("w-full relative", className)}
      onMouseMove={handleMouseMove}
    >
      {isDownload && (
        <DownloadMenu
          containerRef={containerRef}
          filename={downloadFilename}
          csvRows={csvRows}
        />
      )}

      {hoveredIndex !== null && activeHoverRow && (
        <div
          className="absolute z-30 rounded-lg border border-border bg-popover/95 px-3 py-2 text-xs shadow-md backdrop-blur-xs pointer-events-none transition-all min-w-[180px]"
          style={{ left: `${mousePos.x}px`, top: `${mousePos.y}px` }}
        >
          <div className="font-semibold text-foreground mb-1.5 pb-1 border-b border-border">
            {getLabelValue(activeHoverRow, xAxisKey)}
          </div>
          <div className="space-y-1">
            {charts.map((chart, index) => {
              const val = getNumericValue(activeHoverRow, chart.dataKey);
              const color = colorMap.get(chart) ?? getColor(index);
              return (
                <div
                  key={String(chart.dataKey)}
                  className="flex items-center justify-between gap-4"
                >
                  <span className="flex items-center gap-1.5 text-muted-foreground">
                    <span
                      className="size-2 rounded-full"
                      style={{ backgroundColor: color }}
                    />
                    {chart.label ?? String(chart.dataKey)}:
                  </span>
                  <strong className="text-foreground">
                    {formatNumber(val)}
                  </strong>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <svg
        viewBox={`0 0 ${SVG_WIDTH} ${height}`}
        width="100%"
        height={height}
        role="img"
        aria-label={charts.length > 1 ? "Combined graph chart" : "Graph chart"}
        className="overflow-visible"
      >
        {tickValues.map(({ value, y }) => (
          <g key={value}>
            <line
              x1={margin.left}
              x2={SVG_WIDTH - margin.right}
              y1={y}
              y2={y}
              stroke="#E5E7EB"
              strokeDasharray="3 3"
            />
            <text
              x={margin.left - 10}
              y={y}
              textAnchor="end"
              dominantBaseline="middle"
              fill="#9CA3AF"
              fontSize={12}
            >
              {formatAxisNumber(value)}
            </text>
          </g>
        ))}

        {hoveredIndex !== null && (
          <rect
            x={xPosition(hoveredIndex) - xStep / 2}
            y={margin.top}
            width={xStep}
            height={plotHeight}
            fill="currentColor"
            className="text-muted/15 pointer-events-none"
            rx={4}
          />
        )}

        {data.map((row, dataIndex) => {
          let positiveTotal = 0;
          let negativeTotal = 0;
          const x = xPosition(dataIndex);

          return (
            <g
              key={`bar-group-${dataIndex}`}
              onMouseEnter={() => setHoveredIndex(dataIndex)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              {barCharts.map((chart) => {
                const value = getNumericValue(row, chart.dataKey);
                const startValue = value >= 0 ? positiveTotal : negativeTotal;
                const endValue = startValue + value;
                if (value >= 0) positiveTotal = endValue;
                else negativeTotal = endValue;
                const startY = yPosition(startValue);
                const endY = yPosition(endValue);
                const width = Math.min(48, xStep * 0.62);
                const color = colorMap.get(chart) ?? getColor(0);

                return (
                  <rect
                    key={`${String(chart.dataKey)}-${dataIndex}`}
                    x={x - width / 2}
                    y={Math.min(startY, endY)}
                    width={width}
                    height={Math.max(1, Math.abs(startY - endY))}
                    rx={4}
                    fill={color}
                    role={isInteractive ? "button" : undefined}
                    tabIndex={isInteractive ? 0 : undefined}
                    aria-label={`${chart.label ?? String(chart.dataKey)}: ${formatNumber(value)}`}
                    className={cn(
                      "transition-opacity duration-150 outline-none",
                      isInteractive && "cursor-pointer",
                      hoveredIndex !== null && hoveredIndex !== dataIndex
                        ? "opacity-60"
                        : "opacity-100",
                    )}
                    onClick={() => handleItemAction(row, dataIndex)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter" || event.key === " ") {
                        event.preventDefault();
                        handleItemAction(row, dataIndex);
                      }
                    }}
                  />
                );
              })}
            </g>
          );
        })}

        {lineCharts.map((chart) => {
          const color = colorMap.get(chart) ?? getColor(0);
          const points = data.map((row, index) => ({
            x: xPosition(index),
            y: yPosition(getNumericValue(row, chart.dataKey)),
            row,
            index,
            value: getNumericValue(row, chart.dataKey),
          }));
          const path = points
            .map(
              (point, index) =>
                `${index === 0 ? "M" : "L"} ${point.x} ${point.y}`,
            )
            .join(" ");

          return (
            <g key={String(chart.dataKey)}>
              <path
                d={path}
                fill="none"
                stroke={color}
                strokeWidth={3}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              {points.map((point) => {
                const isHovered = hoveredIndex === point.index;
                return (
                  <circle
                    key={point.index}
                    cx={point.x}
                    cy={point.y}
                    r={isHovered ? 6 : 4}
                    fill={color}
                    stroke="#ffffff"
                    strokeWidth={2}
                    role={isInteractive ? "button" : undefined}
                    tabIndex={isInteractive ? 0 : undefined}
                    aria-label={`${chart.label ?? String(chart.dataKey)}: ${formatNumber(point.value)}`}
                    className={cn(
                      "transition-all duration-150 outline-none",
                      isInteractive && "cursor-pointer",
                    )}
                    onMouseEnter={() => setHoveredIndex(point.index)}
                    onMouseLeave={() => setHoveredIndex(null)}
                    onClick={() => handleItemAction(point.row, point.index)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter" || event.key === " ") {
                        event.preventDefault();
                        handleItemAction(point.row, point.index);
                      }
                    }}
                  />
                );
              })}
            </g>
          );
        })}

        {tickIndexes.map((index) => (
          <text
            key={`x-tick-${index}`}
            x={xPosition(index)}
            y={height - margin.bottom + 22}
            textAnchor="middle"
            fill="#9CA3AF"
            fontSize={12}
          >
            {getLabelValue(data[index], xAxisKey)}
          </text>
        ))}
      </svg>
      <div className="mt-2 flex flex-wrap justify-center gap-x-4 gap-y-2">
        {charts.map((chart, index) => (
          <span
            key={`${String(chart.dataKey)}-${index}`}
            className="inline-flex items-center gap-1.5 text-xs text-muted-foreground"
          >
            <span
              className="size-2.5 rounded-full"
              style={{
                backgroundColor: colorMap.get(chart) ?? getColor(index),
              }}
            />
            {chart.label ?? String(chart.dataKey)}
          </span>
        ))}
      </div>
      {renderer}
    </div>
  );
}
