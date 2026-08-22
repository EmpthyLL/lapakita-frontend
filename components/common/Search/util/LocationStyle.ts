import { AreaType } from "@/lib/data/schema/master/location";
import {
  Building2,
  Globe,
  Home,
  Landmark,
  Map,
  MapPinned,
  type LucideIcon,
} from "lucide-react";

interface AreaTypeConfig {
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
