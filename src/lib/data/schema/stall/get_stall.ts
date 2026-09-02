import {
  PaymentCycle,
  StallPermanenceType,
  StallPlacement,
  StallPropertyTypeValue,
} from "@/components/common/search/constants/types";
import z from "zod";
import { basePaginationQuerySchema } from "../base";

/* ─── 1. DISCRIMINATED INTERFACES FOR STALL ENTITY ─── */

export interface StallLocationSummary {
  area: string;
  city: string;
  countryCode: string;
}

export interface BaseStall {
  id: string;
  title: string;
  imageUrl: string;
  location: StallLocationSummary;
  propertyType: StallPropertyTypeValue;
  placement: StallPlacement;
  cheapestPriceFormatted: string;
  cheapestPricePeriod: PaymentCycle;
  rating: number;
  reviewCount: number;
}

// 1. Permanent: Fokus pada Ruang & Fisik Bangunan Mandiri
export interface PermanentStall extends BaseStall {
  permanenceType: "permanent";
  space: {
    sizeSqm: number;
    floorCount: number;
  };
}

// 2. Semi-Permanent: Terikat Jam Operasional Kompleks/Gedung Induk
export interface SemiPermanentStall extends BaseStall {
  permanenceType: "semi-permanent";
  operatingHours: {
    open: string; // e.g. "10:00"
    close: string; // e.g. "22:00"
  };
}

// 3. Temporary: Terikat Jadwal Event & Window Pendaftaran
export interface TemporaryStall extends BaseStall {
  permanenceType: "temporary";
  event: {
    registrationDeadlineDays: number; // Deadline pendaftaran (H-X)
    durationDays: number; // Durasi event berlangsung
  };
}

// Union Type Utama untuk Entity Lapak
export type Stall = PermanentStall | SemiPermanentStall | TemporaryStall;

export const landmarkRadiusEntrySchema = z.object({
  landmark: z.string(),
  radius: z.string(),
});

export const stallSearchSchema = basePaginationQuerySchema.extend({
  location: z.string(),
  permanenceType: z.custom<StallPermanenceType>(),
  landmarkEntries: z.array(landmarkRadiusEntrySchema),
  propertyType: z.array(z.custom<StallPropertyTypeValue>()),
  placement: z.union([z.custom<StallPlacement>(), z.literal("")]),
  businessType: z.string(),
  facilities: z.array(z.string()),
  bepMonths: z.string(),
  capital: z.number(),
  rentRange: z.tuple([z.number(), z.number()]),
  depositRange: z.tuple([z.number(), z.number()]),
  startDate: z.string(),
  minLeasePeriod: z.string(),
  eventOperatingDays: z.string(),
  attendanceRequirement: z.string(),
  cancellationPolicy: z.string(),
  paymentCycle: z.union([z.custom<PaymentCycle>(), z.literal("")]),
  sizeRange: z.tuple([z.number(), z.number()]),
  floorCountRange: z.tuple([z.number(), z.number()]),
  openingTime: z.string(),
  closingTime: z.string(),
  registrationDeadlineDays: z.number().nullable(),
  eventDurationDays: z.number().nullable(),
  sortBy: z.string(),
});

export type StallSearchSchemaType = z.infer<typeof stallSearchSchema>;
