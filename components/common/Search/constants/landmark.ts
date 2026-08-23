import {
  Building2,
  Bus,
  Fuel,
  GraduationCap,
  HeartPulse,
  Home,
  Landmark,
  Plane,
  School,
  ShoppingBag,
  TrainFront,
  Utensils,
} from "lucide-react";
import { LandmarkCategory } from "./types";

export const LANDMARK_CATEGORIES: LandmarkCategory[] = [
  { value: "campus", label: "Campus & University Area", icon: GraduationCap },
  { value: "school", label: "School District (SD/SMP/SMA)", icon: School },
  { value: "office", label: "Office & Commercial District", icon: Building2 },
  { value: "market", label: "Traditional & Modern Market", icon: ShoppingBag },
  { value: "residential", label: "Housing Complex & Settlement", icon: Home },
  {
    value: "transit-station",
    label: "Train & MRT/LRT Station",
    icon: TrainFront,
  },
  { value: "transit-bus", label: "Bus Terminal & Stop", icon: Bus },
  { value: "healthcare", label: "Hospital & Medical Center", icon: HeartPulse },
  {
    value: "culinary-center",
    label: "Food Court & Culinary Street",
    icon: Utensils,
  },
  { value: "government", label: "Government & Public Office", icon: Landmark },
  { value: "gas-station", label: "Gas Station (SPBU) Area", icon: Fuel },
  { value: "airport", label: "Airport / Logistics Hub", icon: Plane },
];
