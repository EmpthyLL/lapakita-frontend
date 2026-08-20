import { AreaType } from "@/lib/data/schema/master/location";
import {
  Building2,
  Globe,
  Landmark,
  Map,
  MapPinned,
  type LucideIcon,
} from "lucide-react";

interface AreaTypeConfig {
  icon: LucideIcon;
  label: string;
  /** Tailwind classes — intentionally NOT tied to role brand colors, since
   * location specificity is a separate concept from tenant/owner/supplier. */
  iconClass: string;
  bgClass: string;
}

export const AREA_TYPE_CONFIG: Record<AreaType, AreaTypeConfig> = {
  country: {
    icon: Globe,
    label: "Country",
    iconClass: "text-slate-500",
    bgClass: "bg-slate-100",
  },
  province: {
    icon: Map,
    label: "Province",
    iconClass: "text-purple-600",
    bgClass: "bg-purple-100",
  },
  city: {
    icon: Building2,
    label: "City",
    iconClass: "text-blue-600",
    bgClass: "bg-blue-100",
  },
  district: {
    icon: Landmark,
    label: "District",
    iconClass: "text-teal-600",
    bgClass: "bg-teal-100",
  },
  street: {
    icon: MapPinned,
    label: "Street",
    iconClass: "text-primary",
    bgClass: "bg-primary-secondary",
  },
};
