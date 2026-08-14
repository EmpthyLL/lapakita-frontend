import {
  FacilityValue,
  LandmarkCategoryValue,
  PaymentCycle,
  StallPlacement,
  StallPropertyTypeValue,
  StartDate,
} from "@/components/common/search/SearchConstants";

type DayRange = number;

export interface MultiPeriodPricing {
  monthlyRate?: number;
  quarterlyRate?: number;
  semesterlyRate?: number;
  yearlyRate?: number;
  securityDeposit: number;
  allowedPaymentCycles: PaymentCycle[]; // e.g. ["month", "quarter", "year"]
}

export interface NearbyLandmark {
  categoryValue: LandmarkCategoryValue;
  name: string;
  distanceKm: number;
}

export interface OwnerProfileSummary {
  id: string;
  name: string;
  avatarUrl: string;
  rating: number;
  reviewCount: number;
  joinedYear: string;
}

export interface FacilityImage {
  id: string;
  url: string;
  caption: string;
}

export interface StallMedia {
  mainImage: string;
  facilityImages: FacilityImage[];
  virtualTour360Url?: string;
}

export interface StallDetail {
  id: string;
  title: string;
  slug: string;
  description: string;

  // Gallery & Media
  media: StallMedia;

  // Physical Specifications & Placement
  propertyType: string;
  propertyTypeValue: StallPropertyTypeValue;
  placement: StallPlacement;
  sizeSqm: number;
  dimensions: {
    lengthMeters: number;
    widthMeters: number;
  };
  electricityCapacityVA: number;

  // Location & Navigation
  address: {
    street: string;
    neighborhood: string;
    district: string;
    city: string;
    province: string;
    postalCode: string;
    mapUrl: string;
    embeddedMapUrl: string;
  };
  nearbyLandmarks: NearbyLandmark[];

  // Financials & Multi-Period Pricing
  pricing: MultiPeriodPricing;

  // Lease Rules & Timelines
  leaseRules: {
    minimumLeaseMonths: number;
    startDateOptions: (StartDate | DayRange | "custom")[];
    customStartDateRange?: {
      minDay: number;
      maxDay: number;
    };
    utilityTerms: string;
  };

  // Amenities & Constraints
  facilityValues: FacilityValue[];
  houseRules: string[];

  // Community Rating
  rating: number;
  reviewCount: number;

  // Owner Relation
  owner: OwnerProfileSummary;
}

export const MOCK_STALL_DETAIL: StallDetail = {
  id: "stl_depok_mrg_001",
  title: "Kios Ground Floor Plaza Margonda - Main Corridor",
  slug: "kios-ground-floor-plaza-margonda-main-corridor",
  description:
    "Kios komersial strategis tepat di koridor utama ground floor Plaza Margonda. Posisi hook dengan visibilitas tinggi dari eskalator dan pintu masuk utama. Sangat cocok untuk usaha F&B Grab-and-Go, Coffee Shop Kiosk, Bakery, maupun konter aksesoris & retail modern. Sudah dilengkapi kran air bersih, saluran pembuangan grease-trap, dan daya listrik PLN 3500 VA.",

  media: {
    mainImage:
      "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1200&h=800&fit=crop",
    facilityImages: [
      {
        id: "img_1",
        url: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200&h=800&fit=crop",
        caption: "Tampak Depan Koridor Utama",
      },
      {
        id: "img_2",
        url: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&h=800&fit=crop",
        caption: "Meteran PLN & Instalasi Air Grease-Trap",
      },
      {
        id: "img_3",
        url: "https://images.unsplash.com/photo-1578916171728-46686eac8d58?w=1200&h=800&fit=crop",
        caption: "Area Parkir Pengunjung Mall",
      },
    ],
    virtualTour360Url: "https://pannellum.org/images/alma.jpg",
  },

  propertyType: "Mall Island / Kiosk Corridor",
  propertyTypeValue: "mall-island",
  placement: "indoor",
  sizeSqm: 12,
  dimensions: {
    lengthMeters: 4,
    widthMeters: 3,
  },
  electricityCapacityVA: 3500,

  address: {
    street: "Jl. Margonda Raya No. 188, Ground Floor Blok G-05",
    neighborhood: "Pondok Cina",
    district: "Beji",
    city: "Depok",
    province: "Jawa Barat",
    postalCode: "16424",
    mapUrl: "https://maps.google.com/?q=-6.3732,106.8329",
    embeddedMapUrl:
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3965.1872123!2d106.8329!3d-6.3732!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNsKwMjInMjMuNSJTIDEwNsKwNDknNTguNCJF!5e0!3m2!1sen!2sid!4v1600000000000!5m2!1sen!2sid",
  },

  nearbyLandmarks: [
    {
      categoryValue: "campus",
      name: "Universitas Indonesia (UI) - Stasiun Pocin",
      distanceKm: 0.6,
    },
    {
      categoryValue: "transit-station",
      name: "Stasiun Pondok Cina",
      distanceKm: 0.4,
    },
    {
      categoryValue: "residential",
      name: "Apartemen Mares Margonda",
      distanceKm: 0.8,
    },
  ],

  pricing: {
    monthlyRate: 3500000,
    quarterlyRate: 9900000,
    semesterlyRate: 19000000,
    yearlyRate: 36000000,
    securityDeposit: 2500000,
    allowedPaymentCycles: ["month", "quarter", "year"],
  },

  leaseRules: {
    minimumLeaseMonths: 3,
    startDateOptions: [1, 15, "eom"],
    customStartDateRange: {
      minDay: 1,
      maxDay: 28,
    },
    utilityTerms:
      "Token listrik PLN prabayar diisi mandiri oleh tenant. Tagihan pemeliharaan kebersihan koridor mall dikelola oleh pengelola Plaza.",
  },

  facilityValues: [
    "power",
    "high-power",
    "water",
    "drainage",
    "grease-trap",
    "air-conditioner",
    "wifi",
    "seating",
    "parking",
    "toilet",
    "trash-area",
    "security",
    "cctv",
  ],

  houseRules: [
    "Tidak diperkenankan memproses bahan mentah berbau tajam berlebihan tanpa exhaust adekuat.",
    "Jam operasional mengikuti jam buka/tutup Plaza Margonda (10:00 - 22:00 WIB).",
    "Perubahan struktur fisik booth wajib dengan persetujuan tertulis dari Owner dan Pengelola Gedung.",
  ],

  rating: 4.8,
  reviewCount: 14,

  owner: {
    id: "usr_owner_budi_01",
    name: "Budi Santoso",
    avatarUrl:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop",
    rating: 4.9,
    reviewCount: 38,
    joinedYear: "2025",
  },
};
