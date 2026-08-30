import {
  AreaDetailResponseData,
  AreaGeneralResponseData,
  AreaType,
} from "@/lib/data/schema/master/location";
import {
  Building2,
  Globe,
  Home,
  Landmark,
  Map,
  MapPinned,
  type LucideIcon,
} from "lucide-react";

export interface AreaTypeConfig {
  icon: LucideIcon;
  label: string;
  iconClass: string;
  bgClass: string;
}

export const AREA_TYPE_CONFIG: Record<AreaType, AreaTypeConfig> = {
  country: {
    icon: Globe,
    label: "Country",
    iconClass: "text-slate-600 dark:text-slate-300",
    bgClass: "bg-slate-100 dark:bg-slate-800",
  },
  province: {
    icon: Map,
    label: "Province",
    iconClass: "text-purple-600 dark:text-purple-400",
    bgClass: "bg-purple-100 dark:bg-purple-950/50",
  },
  city: {
    icon: Building2,
    label: "City",
    iconClass: "text-blue-600 dark:text-blue-400",
    bgClass: "bg-blue-100 dark:bg-blue-950/50",
  },
  district: {
    icon: Landmark,
    label: "District",
    iconClass: "text-teal-600 dark:text-teal-400",
    bgClass: "bg-teal-100 dark:bg-teal-950/50",
  },
  suburb: {
    icon: Home,
    label: "Suburb",
    iconClass: "text-amber-600 dark:text-amber-400",
    bgClass: "bg-amber-100 dark:bg-amber-950/50",
  },
  street: {
    icon: MapPinned,
    label: "Street",
    iconClass: "text-primary",
    bgClass: "bg-primary/10",
  },
};

export interface DetailedLocationFormValues {
  formatted: string;
  street_address: string;
  suburb: string;
  district: string;
  city: string;
  province: string;
  postal_code: string;
  latitude?: number;
  longitude?: number;
}

export function buildDetailedLocationValues(
  area: AreaGeneralResponseData,
  detailData?: AreaDetailResponseData,
): DetailedLocationFormValues {
  return {
    formatted: detailData?.formatted || area.full_label,
    street_address: detailData?.street_address || area.title,
    suburb: detailData?.suburb || area.suburb || "",
    district: detailData?.district || area.district || "",
    city: detailData?.city || area.city || "",
    province: detailData?.province || area.province || "",
    postal_code: detailData?.postal_code || "",
    latitude: detailData?.latitude,
    longitude: detailData?.longitude,
  };
}
