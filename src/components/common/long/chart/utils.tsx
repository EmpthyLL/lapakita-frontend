import type { SurfaceType } from "@/components/common/SurfaceRenderer";
import { SurfaceRenderer } from "@/components/common/SurfaceRenderer";
import type { ReactNode } from "react";
import { useState } from "react";
import {
  CHART_COLORS,
  DEFAULT_HEIGHT,
  SVG_WIDTH,
  type ChartDetailConfig,
} from "./types";

export function getColor(index: number) {
  return CHART_COLORS[index % CHART_COLORS.length];
}

export function getNumericValue<TData extends object>(
  row: TData,
  key: Extract<keyof TData, string>,
) {
  const rawValue: unknown = Reflect.get(row, key);
  if (typeof rawValue === "number")
    return Number.isFinite(rawValue) ? rawValue : 0;
  if (typeof rawValue === "string" && rawValue.trim() !== "") {
    const value = Number(rawValue);
    return Number.isFinite(value) ? value : 0;
  }
  return 0;
}

export function getLabelValue(row: object, key: string) {
  return String(Reflect.get(row, key) ?? "");
}

function csvCell(value: unknown) {
  const text = String(value ?? "");
  return `"${text.replace(/"/g, '""')}"`;
}

export function downloadCsv(rows: unknown[][], filename: string) {
  const csv = rows.map((row) => row.map(csvCell).join(",")).join("\n");
  const url = URL.createObjectURL(
    new Blob([csv], { type: "text/csv;charset=utf-8;" }),
  );
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = `${filename}.csv`;
  anchor.click();
  URL.revokeObjectURL(url);
}

function serializeSvg(svg: SVGSVGElement) {
  const clone = svg.cloneNode(true) as SVGSVGElement;
  const viewBox = clone.viewBox.baseVal;
  clone.setAttribute("xmlns", "http://www.w3.org/2000/svg");
  clone.setAttribute("width", String(viewBox.width || SVG_WIDTH));
  clone.setAttribute("height", String(viewBox.height || DEFAULT_HEIGHT));
  return new XMLSerializer().serializeToString(clone);
}

export function downloadSvg(svg: SVGSVGElement, filename: string) {
  const url = URL.createObjectURL(
    new Blob([serializeSvg(svg)], { type: "image/svg+xml;charset=utf-8" }),
  );
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = `${filename}.svg`;
  anchor.click();
  URL.revokeObjectURL(url);
}

export function downloadPng(svg: SVGSVGElement, filename: string) {
  const svgUrl = URL.createObjectURL(
    new Blob([serializeSvg(svg)], { type: "image/svg+xml;charset=utf-8" }),
  );
  const image = new Image();
  image.onerror = () => {
    URL.revokeObjectURL(svgUrl);
    console.error("Unable to render chart for PNG download.");
  };
  image.onload = () => {
    const viewBox = svg.viewBox.baseVal;
    const width = viewBox.width || svg.clientWidth;
    const height = viewBox.height || svg.clientHeight;
    const canvas = document.createElement("canvas");
    canvas.width = width * 2;
    canvas.height = height * 2;
    const context = canvas.getContext("2d");
    if (!context) {
      URL.revokeObjectURL(svgUrl);
      console.error("Unable to create a canvas for chart PNG download.");
      return;
    }

    context.scale(2, 2);
    context.fillStyle = "#ffffff";
    context.fillRect(0, 0, width, height);
    context.drawImage(image, 0, 0, width, height);
    URL.revokeObjectURL(svgUrl);

    const anchor = document.createElement("a");
    anchor.href = canvas.toDataURL("image/png");
    anchor.download = `${filename}.png`;
    anchor.click();
  };
  image.src = svgUrl;
}

export function getSlicePath(
  cx: number,
  cy: number,
  innerRadius: number,
  outerRadius: number,
  startAngle: number,
  endAngle: number,
) {
  const point = (radius: number, angle: number) => {
    const radians = (angle * Math.PI) / 180;
    return {
      x: cx + radius * Math.cos(radians),
      y: cy + radius * Math.sin(radians),
    };
  };
  const outerStart = point(outerRadius, startAngle);
  const outerEnd = point(outerRadius, endAngle);
  const largeArc = endAngle - startAngle > 180 ? 1 : 0;

  if (endAngle - startAngle >= 359.999) {
    const outerTop = cy - outerRadius;
    const outerBottom = cy + outerRadius;
    if (innerRadius <= 0) {
      return `M ${cx} ${outerTop} A ${outerRadius} ${outerRadius} 0 1 1 ${cx} ${outerBottom} A ${outerRadius} ${outerRadius} 0 1 1 ${cx} ${outerTop} Z`;
    }
    const innerTop = cy - innerRadius;
    const innerBottom = cy + innerRadius;
    return `M ${cx} ${outerTop} A ${outerRadius} ${outerRadius} 0 1 1 ${cx} ${outerBottom} A ${outerRadius} ${outerRadius} 0 1 1 ${cx} ${outerTop} Z M ${cx} ${innerTop} A ${innerRadius} ${innerRadius} 0 1 0 ${cx} ${innerBottom} A ${innerRadius} ${innerRadius} 0 1 0 ${cx} ${innerTop} Z`;
  }

  if (innerRadius <= 0) {
    return `M ${cx} ${cy} L ${outerStart.x} ${outerStart.y} A ${outerRadius} ${outerRadius} 0 ${largeArc} 1 ${outerEnd.x} ${outerEnd.y} Z`;
  }

  const innerEnd = point(innerRadius, endAngle);
  const innerStart = point(innerRadius, startAngle);
  return `M ${outerStart.x} ${outerStart.y} A ${outerRadius} ${outerRadius} 0 ${largeArc} 1 ${outerEnd.x} ${outerEnd.y} L ${innerEnd.x} ${innerEnd.y} A ${innerRadius} ${innerRadius} 0 ${largeArc} 0 ${innerStart.x} ${innerStart.y} Z`;
}

export function useChartSurfaces<TData extends object>(
  detailConfig?: ChartDetailConfig<TData>,
) {
  const [activeDetail, setActiveDetail] = useState<{
    row: TData;
    index: number;
    type: SurfaceType;
  } | null>(null);

  const getActionContext = (row: TData, index: number) => {
    return {
      row,
      index,
      openDetail: (type?: SurfaceType) => {
        const detail = detailConfig?.detail;
        const targetType = type ?? detail?.type ?? "dialog";
        if (targetType === "link" && detail?.href) {
          window.location.assign(detail.href);
          return;
        }
        if (targetType === "expandable") {
          setActiveDetail((previous) =>
            previous?.row === row && previous.type === "expandable"
              ? null
              : { row, index, type: "expandable" },
          );
          return;
        }
        setActiveDetail({ row, index, type: targetType });
      },
    };
  };

  const renderer: ReactNode = (
    <SurfaceRenderer
      detail={detailConfig?.detail}
      activeDetail={activeDetail}
      onCloseDetail={() => setActiveDetail(null)}
    />
  );

  return { getActionContext, renderer };
}
