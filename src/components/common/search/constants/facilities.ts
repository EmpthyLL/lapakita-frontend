import {
  AirVent,
  Armchair,
  Cctv,
  ConciergeBell,
  Cylinder,
  Droplets,
  Flame,
  Plug,
  ShieldCheck,
  Sparkles,
  Store,
  ToiletIcon,
  Trash2,
  Tv,
  Warehouse,
  Waves,
  Wifi,
  Wind,
  Zap,
} from "lucide-react";
import { Facility, FacilityValue } from "./types";

export const MASTER_FACILITIES: Record<FacilityValue, Facility> = {
  power: { value: "power", label: "Standard Power Supply (PLN)", icon: Zap },
  "high-power": {
    value: "high-power",
    label: "High Power Capacity (>2200W)",
    icon: Plug,
  },
  water: { value: "water", label: "Clean Water Supply", icon: Droplets },
  drainage: { value: "drainage", label: "Drainage & Waste Water", icon: Waves },
  "grease-trap": {
    value: "grease-trap",
    label: "Grease Trap (F&B)",
    icon: Flame,
  },
  ventilation: {
    value: "ventilation",
    label: "Exhaust & Ventilation System",
    icon: Wind,
  },
  "air-conditioner": {
    value: "air-conditioner",
    label: "Air Conditioner (AC)",
    icon: AirVent,
  },
  "gas-pipeline": {
    value: "gas-pipeline",
    label: "LPG / Gas Line Access",
    icon: Cylinder,
  },
  wifi: { value: "wifi", label: "High-Speed Wi-Fi", icon: Wifi },
  seating: {
    value: "seating",
    label: "Customer Seating Area",
    icon: Armchair,
  },
  parking: {
    value: "parking",
    label: "Customer & Staff Parking",
    icon: AirVent,
  },
  toilet: {
    value: "toilet",
    label: "Restroom / Shared Toilet",
    icon: ToiletIcon,
  },
  "display-case": {
    value: "display-case",
    label: "Storefront Window / Display Case",
    icon: Store,
  },
  storage: {
    value: "storage",
    label: "Private Storage Room",
    icon: Warehouse,
  },
  "trash-area": {
    value: "trash-area",
    label: "Daily Waste Disposal Area",
    icon: Trash2,
  },
  "cleaning-service": {
    value: "cleaning-service",
    label: "Shared Area Cleaning Service",
    icon: Sparkles,
  },
  security: {
    value: "security",
    label: "24/7 Security Guard",
    icon: ShieldCheck,
  },
  cctv: { value: "cctv", label: "CCTV Surveillance", icon: Cctv },
  reception: {
    value: "reception",
    label: "Shared Lobby / Reception",
    icon: ConciergeBell,
  },
  "tv-display": {
    value: "tv-display",
    label: "Digital Signage / Display Area",
    icon: Tv,
  },
};
