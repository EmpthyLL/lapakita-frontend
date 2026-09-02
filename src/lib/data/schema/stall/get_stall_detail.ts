import {
  AttendanceRequirementValue,
  CancellationPolicyValue,
  EventOperatingDaysValue,
  FacilityValue,
  LandmarkCategoryValue,
  PaymentCycle,
  StallPlacement,
  StallPropertyTypeValue,
  StartDateValue,
  TempStartDateValue,
} from "@/components/common/search/constants/types";

export interface MultiPeriodPricing {
  dailyRate?: number;
  monthlyRate?: number;
  quarterlyRate?: number;
  semesterlyRate?: number;
  yearlyRate?: number;
  securityDeposit: number;
  allowedPaymentCycles: PaymentCycle[];
}

export interface NearbyLandmark {
  categoryValue: LandmarkCategoryValue;
  name: string;
  distanceKm: number;
}

export interface OwnerProfileSummary {
  id: string;
  name: string;
  contact: string;
  avatarUrl: string;
  rating: number;
  reviewCount: number;
  joinedYear: string;
}

export interface StallMedia {
  mainImage: string;
  facilityImages: { id: string; url: string; caption: string }[];
  virtualTour360Url?: string;
}

export interface BaseStallDetail {
  id: string;
  title: string;
  description: string;
  media: StallMedia;
  propertyType: string;
  propertyTypeValue: StallPropertyTypeValue;
  placement: StallPlacement;
  electricityCapacityVA: number;

  address: {
    street: string;
    suburb: string;
    district: string;
    city: string;
    country: string;
    countryCode: string;
    province: string;
    postalCode: string;
    mapUrl: string;
    embeddedMapUrl: string;
  };
  nearbyLandmarks: NearbyLandmark[];
  pricing: MultiPeriodPricing;
  facilityValues: FacilityValue[];
  houseRules: string[];
  rating: number;
  reviewCount: number;
  owner: OwnerProfileSummary;
}

// 1. Permanent Detail
export interface PermanentStallDetail extends BaseStallDetail {
  permanenceType: "permanent";
  sizeSqm: number;
  dimensions: { lengthMeters: number; widthMeters: number };
  floorLevel: number;
  leaseRules: {
    minimumLeaseMonths: number;
    startDateOptions: (StartDateValue | number)[];
    utilityTerms: string;
  };
}

// 2. Semi-Permanent Detail
export interface SemiPermanentStallDetail extends BaseStallDetail {
  permanenceType: "semi-permanent";
  parentComplexName: string;
  operatingHours: {
    openingTime: string;
    closingTime: string;
    is24Hours: boolean;
  };
  leaseRules: {
    minimumLeaseMonths: number;
    startDateOptions: (StartDateValue | number)[];
    utilityTerms: string;
  };
}

// 3. Temporary Event Detail
export interface TemporaryStallDetail extends BaseStallDetail {
  permanenceType: "temporary";
  eventMeta: {
    eventName?: string;
    eventStartDate: string;
    eventEndDate: string;
    registrationDeadlineDaysBefore: number;
    totalSlots: number;
    availableSlots: number;
  };
  leaseRules: {
    minimumLeaseDays: number;
    startDateOptions: (TempStartDateValue | string)[];
    utilityTerms: string;
    // Opsi Ketentuan Event Baru
    operatingDays: EventOperatingDaysValue;
    attendanceRequirement: AttendanceRequirementValue;
    cancellationPolicy: CancellationPolicyValue;
  };
}

export type StallDetail =
  | PermanentStallDetail
  | SemiPermanentStallDetail
  | TemporaryStallDetail;
