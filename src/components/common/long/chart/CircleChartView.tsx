"use client";

import { Button } from "@/components/ui/button";
import { cn, formatNumber } from "@/lib/utils";
import { Download } from "lucide-react";
import {
  useMemo,
  useRef,
  useState,
  type MouseEvent,
  type RefObject,
} from "react";
import {
  ChartDetailConfig,
  CircleChartConfig,
  DataItem,
  SVG_WIDTH,
} from "./types";
import {
  downloadCsv,
  downloadPng,
  downloadSvg,
  getColor,
  getSlicePath,
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

export function CircleChartView({
  charts,
  height,
  className,
  showValue,
  donutLabel,
  isDownload,
  downloadFilename,
  detailConfig,
}: {
  charts: readonly CircleChartConfig[];
  height: number;
  className?: string;
  showValue: boolean;
  donutLabel: string;
  isDownload: boolean;
  downloadFilename: string;
  detailConfig?: ChartDetailConfig<DataItem>;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { getActionContext, renderer } =
    useChartSurfaces<DataItem>(detailConfig);
  const [hoveredIndex, setHoveredIndex] = useState<{
    layer: number;
    index: number;
  } | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const centerX = SVG_WIDTH / 2;
  const centerY = height / 2;
  const maxRadius = Math.max(12, Math.min(height / 2 - 20, 370));
  const hasMultiple = charts.length > 1;

  const csvRows = useMemo(
    () => [
      ["chart", "name", "value"],
      ...charts.flatMap((chart, index) =>
        chart.data.map((item) => [
          chart.label ?? `Chart ${index + 1}`,
          item.name,
          item.value,
        ]),
      ),
    ],
    [charts],
  );

  let colorIndex = 0;
  let centerTotal = 0;
  let centerCaption = donutLabel;
  const legend: {
    label: string;
    color: string;
    layer: number;
    index: number;
    name: string;
    value: number;
    total: number;
  }[] = [];

  const layers = charts.map((chart, chartIndex) => {
    const radius = maxRadius * ((chartIndex + 1) / Math.max(charts.length, 1));
    const outerRadius = hasMultiple ? radius : maxRadius;
    const innerRadius =
      chartIndex === 0
        ? chart.chartType === "donut"
          ? outerRadius * 0.52
          : 0
        : maxRadius * (chartIndex / charts.length);
    const positiveTotal = chart.data.reduce(
      (total, item) => total + Math.max(0, item.value),
      0,
    );
    if (chartIndex === 0 && chart.chartType === "donut") {
      centerTotal = positiveTotal;
      centerCaption = chart.label ?? donutLabel;
    }
    let currentAngle = -90;
    const segments = chart.data.map((item, itemIndex) => {
      const color = getColor(colorIndex++);
      const value = Math.max(0, item.value);
      const angle = positiveTotal > 0 ? (value / positiveTotal) * 360 : 0;
      const startAngle = currentAngle;
      const endAngle = currentAngle + angle;
      currentAngle = endAngle;

      legend.push({
        label:
          charts.length > 1 && chart.label
            ? `${chart.label}: ${item.name}`
            : item.name,
        color,
        layer: chartIndex,
        index: itemIndex,
        name: item.name,
        value,
        total: positiveTotal,
      });

      return { item, color, value, startAngle, endAngle, index: itemIndex };
    });

    return {
      chart,
      outerRadius,
      innerRadius,
      positiveTotal,
      segments,
      layerIndex: chartIndex,
    };
  });

  const handleItemAction = (item: DataItem, index: number) => {
    const context = getActionContext(item, index);
    if (detailConfig?.onItemClick) {
      detailConfig.onItemClick(item, index, context);
    } else if (detailConfig?.detail) {
      context.openDetail();
    }
  };

  const isInteractive = Boolean(
    detailConfig?.detail || detailConfig?.onItemClick,
  );

  const activeLegendItem =
    hoveredIndex !== null
      ? legend.find(
          (l) =>
            l.layer === hoveredIndex.layer && l.index === hoveredIndex.index,
        )
      : null;

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

      {hoveredIndex !== null && activeLegendItem && (
        <div
          className="absolute z-30 rounded-lg border border-border bg-popover/95 px-3 py-2 text-xs shadow-md backdrop-blur-xs pointer-events-none transition-all"
          style={{ left: `${mousePos.x}px`, top: `${mousePos.y}px` }}
        >
          <div className="font-semibold text-foreground mb-1">
            {activeLegendItem.label}
          </div>
          <div className="flex items-center gap-2">
            <span
              className="size-2 rounded-full"
              style={{ backgroundColor: activeLegendItem.color }}
            />
            <span className="text-muted-foreground">Nilai:</span>
            <strong className="text-foreground">
              {formatNumber(activeLegendItem.value)}
            </strong>
            <span className="text-muted-foreground">
              (
              {(
                (activeLegendItem.value / (activeLegendItem.total || 1)) *
                100
              ).toFixed(1)}
              %)
            </span>
          </div>
        </div>
      )}

      <svg
        viewBox={`0 0 ${SVG_WIDTH} ${height}`}
        width="100%"
        height={height}
        role="img"
        aria-label={hasMultiple ? "Combined circle chart" : "Circle chart"}
        className="overflow-visible"
      >
        {layers.map((layer) => (
          <g key={`${layer.chart.chartType}-${layer.layerIndex}`}>
            {layer.segments.map((segment) => {
              const percentage =
                layer.positiveTotal > 0
                  ? (segment.value / layer.positiveTotal) * 100
                  : 0;
              const midAngle = (segment.startAngle + segment.endAngle) / 2;
              const labelRadius = (layer.innerRadius + layer.outerRadius) / 2;
              const labelX =
                centerX + labelRadius * Math.cos((midAngle * Math.PI) / 180);
              const labelY =
                centerY + labelRadius * Math.sin((midAngle * Math.PI) / 180);
              const sliceLabel = showValue
                ? formatNumber(segment.value)
                : `${percentage.toFixed(1)}%`;

              const isHovered =
                hoveredIndex?.layer === layer.layerIndex &&
                hoveredIndex?.index === segment.index;

              return (
                <g
                  key={`${segment.item.name}-${segment.index}`}
                  onMouseEnter={() =>
                    setHoveredIndex({
                      layer: layer.layerIndex,
                      index: segment.index,
                    })
                  }
                  onMouseLeave={() => setHoveredIndex(null)}
                >
                  <path
                    d={getSlicePath(
                      centerX,
                      centerY,
                      layer.innerRadius,
                      layer.outerRadius,
                      segment.startAngle,
                      segment.endAngle,
                    )}
                    fill={segment.color}
                    fillRule="evenodd"
                    stroke="#ffffff"
                    strokeWidth={hasMultiple ? 1.5 : 2}
                    role={isInteractive ? "button" : undefined}
                    tabIndex={isInteractive ? 0 : undefined}
                    aria-label={`${segment.item.name}: ${formatNumber(segment.value)}`}
                    className={cn(
                      "transition-all duration-150 outline-none",
                      isInteractive && "cursor-pointer",
                      isHovered ? "opacity-90 scale-[1.01]" : "opacity-100",
                    )}
                    onClick={() =>
                      handleItemAction(segment.item, segment.index)
                    }
                    onKeyDown={(event) => {
                      if (event.key === "Enter" || event.key === " ") {
                        event.preventDefault();
                        handleItemAction(segment.item, segment.index);
                      }
                    }}
                  />
                </g>
              );
            })}
          </g>
        ))}
        {charts[0]?.chartType === "donut" && centerTotal > 0 && (
          <text
            x={centerX}
            y={centerY}
            textAnchor="middle"
            dominantBaseline="middle"
            fill="#111827"
          >
            <tspan x={centerX} dy="-0.15em" fontSize={24} fontWeight={700}>
              {formatNumber(centerTotal)}
            </tspan>
            <tspan x={centerX} dy="1.55em" fontSize={12} fill="#9CA3AF">
              {centerCaption}
            </tspan>
          </text>
        )}
      </svg>
      {legend.length > 0 && (
        <div className="mt-3 flex flex-wrap justify-center gap-x-4 gap-y-2">
          {legend.map((item, index) => {
            const isHovered =
              hoveredIndex?.layer === item.layer &&
              hoveredIndex?.index === item.index;
            return (
              <span
                key={`${item.label}-${index}`}
                onMouseEnter={() =>
                  setHoveredIndex({ layer: item.layer, index: item.index })
                }
                onMouseLeave={() => setHoveredIndex(null)}
                className={cn(
                  "inline-flex items-center gap-1.5 text-xs cursor-pointer transition-opacity px-2 py-1 rounded-md",
                  isHovered
                    ? "bg-muted font-semibold text-foreground"
                    : "text-muted-foreground",
                )}
              >
                <span
                  className="size-2.5 rounded-full"
                  style={{ backgroundColor: item.color }}
                />
                {item.label}: {formatNumber(item.value)}
              </span>
            );
          })}
        </div>
      )}
      {renderer}
    </div>
  );
}
