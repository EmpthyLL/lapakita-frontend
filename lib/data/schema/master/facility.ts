import type { LucideIcon } from "lucide-react";
import {
  Zap,
  Droplets,
  Waves,
  Flame,
  Wind,
  Armchair,
  Car,
  ToiletIcon,
  ShieldCheck,
  Warehouse,
} from "lucide-react";



/* ---------------------------------------------------------------------- */
/* 3. Facilities                                                           */
/* ---------------------------------------------------------------------- */

export interface Facility {
  value: string;
  label: string;
  icon: LucideIcon;
}

export const FACILITIES: Facility[] = [
  { value: "power", label: "Power Supply", icon: Zap },
  { value: "water", label: "Water Supply", icon: Droplets },
  { value: "drainage", label: "Drainage & Waste", icon: Waves },
  { value: "grease-trap", label: "Grease Trap", icon: Flame },
  { value: "ventilation", label: "Exhaust & Ventilation", icon: Wind },
  { value: "seating", label: "Customer Seating", icon: Armchair },
  { value: "parking", label: "Customer Parking", icon: Car },
  { value: "toilet", label: "Public Toilet", icon: ToiletIcon },
  { value: "security", label: "24/7 Security & CCTV", icon: ShieldCheck },
  { value: "storage", label: "Storage / Stock Room", icon: Warehouse },
];

