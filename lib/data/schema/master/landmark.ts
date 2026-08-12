import type { LucideIcon } from "lucide-react";
import {
  Building2,
  GraduationCap,
  HeartPulse,
  Home,
  School,
  ShoppingBag,
  TrainFront,
} from "lucide-react";

/* ---------------------------------------------------------------------- */
/* 1. Landmark categories                                                  */
/* ---------------------------------------------------------------------- */

export interface LandmarkCategory {
  value: string;
  label: string;
  icon: LucideIcon;
}

export const LANDMARK_CATEGORIES: LandmarkCategory[] = [
  { value: "campus", label: "Campus & University Area", icon: GraduationCap },
  { value: "school", label: "School District", icon: School },
  { value: "office", label: "Office & Commercial District", icon: Building2 },
  { value: "market", label: "Market & Shopping Area", icon: ShoppingBag },
  { value: "residential", label: "Residential & Housing Complex", icon: Home },
  { value: "transit", label: "Transit & Station Area", icon: TrainFront },
  {
    value: "healthcare",
    label: "Hospital & Healthcare Area",
    icon: HeartPulse,
  },
];
