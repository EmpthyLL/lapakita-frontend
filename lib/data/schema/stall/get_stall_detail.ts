export type PaymentCycle = "monthly" | "quarterly" | "semesterly" | "yearly";
export type StartDateOption = "1st" | "15th" | "end-of-month" | "custom";
export type StallPlacement = "indoor" | "semi-outdoor" | "outdoor";

export interface MultiPeriodPricing {
  monthlyRate: number; // e.g. 2500000
  quarterlyRate?: number; // e.g. 7000000 (diskon jika sewa 3 bulan)
  semesterlyRate?: number; // e.g. 13500000 (diskon jika sewa 6 bulan)
  yearlyRate?: number; // e.g. 25000000 (diskon jika sewa 1 tahun)
  securityDeposit: number; // e.g. 2000000
  allowedPaymentCycles: PaymentCycle[]; // e.g. ["monthly", "yearly"]
}

export interface NearbyLandmark {
  categoryValue: string; // value dari LANDMARK_CATEGORIES (e.g. "campus")
  name: string; // e.g. "Universitas Indonesia"
  distanceKm: number; // e.g. 0.5
}

export interface OwnerProfileSummary {
  id: string;
  name: string;
  avatarUrl: string;
  isVerifiedKYC: boolean;
  rating: number; // e.g. 4.9
  reviewCount: number; // e.g. 24
  totalProperties: number; // e.g. 5
  responseTimeText: string; // e.g. "Responds in ~1 hour"
  joinedYear: string; // e.g. "2025"
}

export interface StallDetail {
  id: string;
  title: string;
  slug: string;
  description: string;

  // Gallery & Media
  coverImage: string;
  galleryImages: string[];

  // Physical Specifications & Placement
  propertyType: string; // e.g. "Mall Island", "Ruko", "Lapak Pasar"
  propertyTypeValue: string; // e.g. "mall-island"
  placement: StallPlacement; // "indoor" | "semi-outdoor" | "outdoor"
  sizeSqm: number; // e.g. 15
  dimensions: {
    lengthMeters: number; // e.g. 5
    widthMeters: number; // e.g. 3
  };
  electricityCapacityVA: number; // e.g. 2200 (Watt/VA)

  // Location & Navigation
  address: {
    street: string;
    neighborhood: string; // e.g. "Margonda"
    district: string; // e.g. "Beji"
    city: string; // e.g. "Depok"
    province: string; // e.g. "Jawa Barat"
    postalCode: string;
    coordinates: {
      lat: number;
      lng: number;
    };
    embeddedMapUrl: string;
  };
  nearbyLandmarks: NearbyLandmark[];

  // Financials & Multi-Period Pricing
  pricing: MultiPeriodPricing;

  // Lease Rules & Timelines (Owner Configurations)
  leaseRules: {
    minimumLeaseMonths: number; // e.g. 3
    startDateOptions: StartDateOption[]; // e.g. ["1st", "15th", "end-of-month"]
    customStartDateRange?: { minDay: number; maxDay: number }; // e.g. { minDay: 1, maxDay: 28 }
    utilityTerms: string; // e.g. "Electricity (PLN) and water usage are billed directly to the tenant."
  };

  // Amenities & Constraints
  facilityValues: string[]; // values dari FACILITIES (e.g. ["power", "water", "wifi", "security"])
  houseRules: string[]; // e.g. ["No non-halal food preparation", "Operational hours strictly 08:00 - 22:00"]

  // Community Rating
  rating: number; // e.g. 4.8
  reviewCount: number; // e.g. 18

  // Owner Relation
  owner: OwnerProfileSummary;
}

export const MOCK_STALL_DETAIL: StallDetail = {
  id: "stl_depok_mrg_001",
  title: "Kios Ground Floor Plaza Margonda - Main Corridor",
  slug: "kios-ground-floor-plaza-margonda-main-corridor",
  description:
    "Kios komersial strategis tepat di koridor utama ground floor Plaza Margonda. Posisi hook dengan visibilitas tinggi dari eskalator dan pintu masuk utama. Sangat cocok untuk usaha F&B Grab-and-Go, Coffee Shop Kiosk, Bakery, maupun konter aksesoris & retail modern. Sudah dilengkapi kran air bersih, saluran pembuangan grease-trap, dan daya listrik PLN 3500 VA.",

  coverImage:
    "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1200&h=800&fit=crop",
  galleryImages: [
    "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1200&h=800&fit=crop",
    "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200&h=800&fit=crop",
    "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&h=800&fit=crop",
    "https://images.unsplash.com/photo-1578916171728-46686eac8d58?w=1200&h=800&fit=crop",
  ],

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
    coordinates: {
      lat: -6.3732,
      lng: 106.8329,
    },
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
    quarterlyRate: 9900000, // Diskon ~5% untuk 3 bulan
    semesterlyRate: 19000000, // Diskon ~10% untuk 6 bulan
    yearlyRate: 36000000, // Diskon ~14% untuk 1 tahun
    securityDeposit: 2500000,
    allowedPaymentCycles: ["monthly", "quarterly", "yearly"],
  },

  leaseRules: {
    minimumLeaseMonths: 3,
    startDateOptions: ["1st", "15th", "end-of-month", "custom"],
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
    isVerifiedKYC: true,
    rating: 4.9,
    reviewCount: 38,
    totalProperties: 4,
    responseTimeText: "Responds in ~30 mins",
    joinedYear: "2025",
  },
};
