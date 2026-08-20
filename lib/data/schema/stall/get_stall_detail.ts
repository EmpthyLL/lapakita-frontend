import {
  FacilityValue,
  LandmarkCategoryValue,
  PaymentCycle,
  StallPermanenceType,
  StallPlacement,
  StallPropertyTypeValue,
  StartDateValue,
} from "@/components/common/search/SearchConstants";

type DayRange =
  | "1"
  | "2"
  | "3"
  | "4"
  | "5"
  | "6"
  | "7"
  | "8"
  | "9"
  | "10"
  | "11"
  | "12"
  | "13"
  | "14"
  | "15"
  | "16"
  | "17"
  | "18"
  | "19"
  | "20"
  | "21"
  | "22"
  | "23"
  | "24"
  | "25"
  | "26"
  | "27"
  | "28";

export interface MultiPeriodPricing {
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
  description: string;

  // Gallery & Media
  media: StallMedia;

  // Physical Specifications & Classification
  propertyType: string;
  propertyTypeValue: StallPropertyTypeValue;
  permanenceType: StallPermanenceType;
  placement: StallPlacement;
  sizeSqm: number;
  dimensions: {
    lengthMeters: number;
    widthMeters: number;
  };
  electricityCapacityVA: number;
  floorLevel?: number;

  // Operational Context (Disesuaikan berdasarkan permanenceType)
  operatingHours?: {
    openingTime: string;
    closingTime: string;
    is24Hours: boolean;
  };

  // Event Context (Khusus Temporary)
  eventMeta?: {
    eventName?: string;
    eventStartDate?: string;
    eventEndDate?: string;
    registrationDeadlineDaysBefore: number;
  };

  // Location & Navigation
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

  // Financials & Multi-Period Pricing
  pricing: MultiPeriodPricing;

  // Lease Rules & Timelines
  leaseRules: {
    minimumLeaseMonths: number;
    startDateOptions: (StartDateValue | DayRange)[];
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

/* ─── MOCK DATA: 3 CONTOH TIPE PERMANENSI ─── */

export const MOCK_STALL_DETAILS: Record<StallPermanenceType, StallDetail> = {
  // 1. PERMANENT / INDEPENDENT (Akses Mandiri 24/7)
  permanent: {
    id: "stl_bdg_dago_001",
    title: "Ruko Dago Commercial Space - Ground Floor Main Road",
    description:
      "Ruko komersial mandiri lokasi sangat strategis di koridor utama Jalan Ir. H. Juanda (Dago). Bebas jam operasional (akses 24/7), cocok untuk Cafe, Boutique, Office, atau Clinic. Dilengkapi halaman parkir sendiri, listrik 5500 VA, dan saluran air PDAM lancar.",
    media: {
      mainImage:
        "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200&h=800&fit=crop",
      facilityImages: [
        {
          id: "img_1",
          url: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200&h=800&fit=crop",
          caption: "Area Interior Lantai 1",
        },
        {
          id: "img_2",
          url: "https://images.unsplash.com/photo-1578916171728-46686eac8d58?w=1200&h=800&fit=crop",
          caption: "Area Parkir Depan Ruko",
        },
      ],
      virtualTour360Url: "https://pannellum.org/images/alma.jpg",
    },
    propertyType: "Shophouse / Standalone Store",
    propertyTypeValue: "shophouse",
    permanenceType: "permanent",
    placement: "indoor",
    sizeSqm: 45,
    dimensions: { lengthMeters: 9, widthMeters: 5 },
    electricityCapacityVA: 5500,
    floorLevel: 1,
    operatingHours: {
      openingTime: "00:00",
      closingTime: "23:59",
      is24Hours: true,
    },
    address: {
      street: "Jl. Ir. H. Juanda No. 102",
      suburb: "Lebak Siliwangi",
      district: "Coblong",
      city: "Bandung",
      country: "Indonesia",
      countryCode: "ID",
      province: "Jawa Barat",
      postalCode: "40132",
      mapUrl: "https://maps.google.com/?q=-6.8915,107.6106",
      embeddedMapUrl: "https://www.google.com/maps/embed?pb=!1m18...",
    },
    nearbyLandmarks: [
      {
        categoryValue: "campus",
        name: "Institut Teknologi Bandung (ITB)",
        distanceKm: 0.4,
      },
      {
        categoryValue: "office",
        name: "Dago Plaza & Business Hub",
        distanceKm: 0.2,
      },
    ],
    pricing: {
      monthlyRate: 7500000,
      quarterlyRate: 21000000,
      semesterlyRate: 40000000,
      yearlyRate: 75000000,
      securityDeposit: 5000000,
      allowedPaymentCycles: ["month", "quarter", "semester", "year"],
    },
    leaseRules: {
      minimumLeaseMonths: 3,
      startDateOptions: [1, 15, "eom"],
      utilityTerms:
        "Listrik PLN & PDAM dibayar mandiri sesuai pemakaian meteran.",
    },
    facilityValues: [
      "power",
      "high-power",
      "water",
      "drainage",
      "air-conditioner",
      "wifi",
      "parking",
      "toilet",
      "trash-area",
      "security",
      "cctv",
    ],
    houseRules: [
      "Penyewa memegang kunci mandiri dan bertanggung jawab penuh atas keamanan internal.",
      "Renovasi interior diperbolehkan dengan konfirmasi sebelum pengerjaan.",
    ],
    rating: 4.9,
    reviewCount: 22,
    owner: {
      id: "usr_owner_dago_01",
      name: "Rian Hidayat",
      contact: "+62 811-2233-4455",
      avatarUrl:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop",
      rating: 4.9,
      reviewCount: 45,
      joinedYear: "2024",
    },
  },

  // 2. SEMI-PERMANENT / MANAGED COMPLEX (Terikat Jam Induk)
  "semi-permanent": {
    id: "stl_depok_mrg_002",
    title: "Kios Ground Floor Plaza Margonda - Main Corridor",
    description:
      "Kios komersial strategis di koridor utama ground floor Plaza Margonda. Posisi hook dengan visibilitas tinggi dari eskalator utama. Sangat cocok untuk F&B Grab-and-Go atau Beverage Kiosk. Jam operasional wajib mengikuti aturan gedung.",
    media: {
      mainImage:
        "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1200&h=800&fit=crop",
      facilityImages: [
        {
          id: "img_1",
          url: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&h=800&fit=crop",
          caption: "Meteran PLN & Instalasi Air Grease-Trap",
        },
      ],
      virtualTour360Url: "https://pannellum.org/images/alma.jpg",
    },
    propertyType: "Mall Island / Kiosk Corridor",
    propertyTypeValue: "mall-island",
    permanenceType: "semi-permanent",
    placement: "indoor",
    sizeSqm: 12,
    dimensions: { lengthMeters: 4, widthMeters: 3 },
    electricityCapacityVA: 3500,
    floorLevel: 1,
    operatingHours: {
      openingTime: "10:00",
      closingTime: "22:00",
      is24Hours: false,
    },
    address: {
      street: "Jl. Margonda Raya No. 188, Ground Floor Blok G-05",
      suburb: "Pondok Cina",
      district: "Beji",
      city: "Depok",
      country: "Indonesia",
      countryCode: "ID",
      province: "Jawa Barat",
      postalCode: "16424",
      mapUrl: "https://maps.google.com/?q=-6.3732,106.8329",
      embeddedMapUrl: "https://www.google.com/maps/embed?pb=!1m18...",
    },
    nearbyLandmarks: [
      {
        categoryValue: "campus",
        name: "Universitas Indonesia (UI)",
        distanceKm: 0.6,
      },
      {
        categoryValue: "transit-station",
        name: "Stasiun Pondok Cina",
        distanceKm: 0.4,
      },
    ],
    pricing: {
      monthlyRate: 3500000,
      quarterlyRate: 9900000,
      securityDeposit: 2500000,
      allowedPaymentCycles: ["month", "quarter"],
    },
    leaseRules: {
      minimumLeaseMonths: 1,
      startDateOptions: [1, 15, "eom"],
      utilityTerms:
        "Listrik isi token mandiri. Kebersihan koridor dikelola manajemen Mall.",
    },
    facilityValues: [
      "power",
      "high-power",
      "water",
      "drainage",
      "grease-trap",
      "air-conditioner",
      "wifi",
      "toilet",
      "trash-area",
      "cleaning-service",
      "security",
      "cctv",
    ],
    houseRules: [
      "Wajib buka dan tutup sesuai jam operasional mall (10:00 - 22:00 WIB).",
      "Loading barang hanya diperbolehkan sebelum mall buka (07:00 - 09:30 WIB).",
    ],
    rating: 4.8,
    reviewCount: 14,
    owner: {
      id: "usr_owner_budi_01",
      name: "Budi Santoso",
      contact: "+62 812-3456-7890",
      avatarUrl:
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop",
      rating: 4.8,
      reviewCount: 38,
      joinedYear: "2025",
    },
  },

  // 3. TEMPORARY / POP-UP EVENT (Short-Term Event & Bazaar)
  temporary: {
    id: "stl_jkt_bzr_003",
    title: "Pop-Up Booth A-12 Kuliner Festival Ramadan Senayan",
    description:
      "Spot booth bazaar temporary pada event festival kuliner Ramadan di pelataran Parkir Timur Senayan. Paket sewa sudah mencakup fasitiltas meja, kursi, daya listrik 1300 VA, dan kebersihan event.",
    media: {
      mainImage:
        "https://images.unsplash.com/photo-1565123409695-7b5ef63a2efb?w=1200&h=800&fit=crop",
      facilityImages: [
        {
          id: "img_1",
          url: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1200&h=800&fit=crop",
          caption: "Layout Denah Booth Outdoor",
        },
      ],
    },
    propertyType: "Pop-Up Event / Bazaar Booth",
    propertyTypeValue: "bazaar-booth",
    permanenceType: "temporary",
    placement: "outdoor",
    sizeSqm: 9,
    dimensions: { lengthMeters: 3, widthMeters: 3 },
    electricityCapacityVA: 1300,
    eventMeta: {
      eventName: "Ramadan Culinary Fest 2026",
      eventStartDate: "2026-03-20",
      eventEndDate: "2026-03-23",
      registrationDeadlineDaysBefore: 5,
    },
    address: {
      street: "GBK Parkir Timur Senayan, Booth A-12",
      suburb: "Gelora",
      district: "Tanah Abang",
      city: "Jakarta Pusat",
      country: "Indonesia",
      countryCode: "ID",
      province: "DKI Jakarta",
      postalCode: "10270",
      mapUrl: "https://maps.google.com/?q=-6.2183,106.8022",
      embeddedMapUrl: "https://www.google.com/maps/embed?pb=!1m18...",
    },
    nearbyLandmarks: [
      {
        categoryValue: "office",
        name: "Kawasan Bisnis Sudirman (SCBD)",
        distanceKm: 0.8,
      },
      {
        categoryValue: "transit-station",
        name: "Stasiun MRT Istora Mandiri",
        distanceKm: 0.5,
      },
    ],
    pricing: {
      monthlyRate: 2500000, // Total biaya full durasi event
      securityDeposit: 500000,
      allowedPaymentCycles: ["month"],
    },
    leaseRules: {
      minimumLeaseMonths: 1,
      startDateOptions: [1],
      utilityTerms:
        "Listrik 1300 VA ter-include. Dilarang menggunakan alat beban listrik >1300 VA tanpa izin EO.",
    },
    facilityValues: [
      "power",
      "wifi",
      "seating",
      "parking",
      "trash-area",
      "cleaning-service",
      "security",
    ],
    houseRules: [
      "Loading barang dapat dilakukan H-1 sebelum event dimulai.",
      "Booth wajib terus dijaga selama jam operasional festival (15:00 - 22:00 WIB).",
    ],
    rating: 4.7,
    reviewCount: 9,
    owner: {
      id: "usr_eo_jakarta_03",
      name: "Jakarta Event Management",
      contact: "+62 813-9988-7766",
      avatarUrl:
        "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=200&h=200&fit=crop",
      rating: 4.7,
      reviewCount: 52,
      joinedYear: "2023",
    },
  },
};
