import {
  PaymentCycle,
  StallPropertyTypeValue,
} from "@/components/common/search/SearchConstants";

export interface StallLocationSummary {
  area: string; // e.g. "Margonda" or "Orchard"
  city: string; // e.g. "Depok" or "Central Singapore"
  countryCode?: string; // e.g. "ID", "SG"
}

export interface Stall {
  id: string;
  title: string;
  imageUrl: string;
  location: StallLocationSummary; // Lokasi ringkas khusus Card
  propertyType: StallPropertyTypeValue; // e.g. "mall-island", "shophouse"
  sizeSqm: number;
  cheapestPriceFormatted: string;
  cheapestPricePeriod: PaymentCycle; // "month" | "quarter" | "semester" | "year"
  rating: number;
  reviewCount: number;
}

export const MOCK_STALL_LIST: Stall[] = [
  {
    id: "stl_depok_mrg_001",
    title: "Kios Ground Floor Plaza Margonda - Main Corridor",
    imageUrl:
      "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600&h=400&fit=crop",
    location: {
      area: "Margonda",
      city: "Depok",
      countryCode: "ID",
    },
    propertyType: "mall-island",
    sizeSqm: 12,
    cheapestPriceFormatted: "Rp 2.500.000",
    cheapestPricePeriod: "month",
    rating: 4.8,
    reviewCount: 14,
  },
  {
    id: "stl_jkt_tah_002",
    title: "Lapak Busana Blok B Pasar Tanah Abang",
    imageUrl:
      "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=600&h=400&fit=crop",
    location: {
      area: "Tanah Abang",
      city: "Central Jakarta",
      countryCode: "ID",
    },
    propertyType: "traditional-market",
    sizeSqm: 8,
    cheapestPriceFormatted: "Rp 22.000.000",
    cheapestPricePeriod: "year",
    rating: 4.9,
    reviewCount: 28,
  },
  {
    id: "stl_bdg_dago_003",
    title: "Space Ruko Lantai 1 Akses Utama Kampus ITB Dago",
    imageUrl:
      "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&h=400&fit=crop",
    location: {
      area: "Dago",
      city: "Bandung",
      countryCode: "ID",
    },
    propertyType: "shophouse",
    sizeSqm: 36,
    cheapestPriceFormatted: "Rp 18.000.000",
    cheapestPricePeriod: "semester",
    rating: 4.7,
    reviewCount: 9,
  },
  {
    id: "stl_jks_psm_004",
    title: "Container Booth Street Food Kuliner Pasar Minggu",
    imageUrl:
      "https://images.unsplash.com/photo-1578916171728-46686eac8d58?w=600&h=400&fit=crop",
    location: {
      area: "Pasar Minggu",
      city: "South Jakarta",
      countryCode: "ID",
    },
    propertyType: "street-kiosk",
    sizeSqm: 6,
    cheapestPriceFormatted: "Rp 5.000.000",
    cheapestPricePeriod: "quarter",
    rating: 4.6,
    reviewCount: 19,
  },
  {
    id: "stl_sbr_sub_005",
    title: "Counter Food Court Area Utama Tunjungan Plaza",
    imageUrl:
      "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=600&h=400&fit=crop",
    location: {
      area: "Tunjungan",
      city: "Surabaya",
      countryCode: "ID",
    },
    propertyType: "food-court-counter",
    sizeSqm: 15,
    cheapestPriceFormatted: "Rp 5.500.000",
    cheapestPricePeriod: "month",
    rating: 5.0,
    reviewCount: 31,
  },
  {
    id: "stl_bks_tmr_006",
    title: "Kios Toko Sembako & Kelontong Kompleks Depsos",
    imageUrl:
      "https://images.unsplash.com/photo-1604719312566-8912e9227c6a?w=600&h=400&fit=crop",
    location: {
      area: "Bekasi Timur",
      city: "Bekasi",
      countryCode: "ID",
    },
    propertyType: "traditional-market",
    sizeSqm: 18,
    cheapestPriceFormatted: "Rp 2.200.000",
    cheapestPricePeriod: "month",
    rating: 4.5,
    reviewCount: 6,
  },
  {
    id: "stl_tng_bsd_007",
    title: "Outdoor Courtyard Spot Food Truck Breeze BSD",
    imageUrl:
      "https://images.unsplash.com/photo-1565123409695-7b5ef63a2efb?w=600&h=400&fit=crop",
    location: {
      area: "BSD City",
      city: "Tangerang Selatan",
      countryCode: "ID",
    },
    propertyType: "food-truck-spot",
    sizeSqm: 20,
    cheapestPriceFormatted: "Rp 3.000.000",
    cheapestPricePeriod: "month",
    rating: 4.8,
    reviewCount: 15,
  },
  {
    id: "stl_ygy_ugm_008",
    title: "Kios Garasi Komersial Jalan Kaliurang KM 5",
    imageUrl:
      "https://images.unsplash.com/photo-1521017432531-fbd92d768814?w=600&h=400&fit=crop",
    location: {
      area: "Jakal / UGM",
      city: "Sleman",
      countryCode: "ID",
    },
    propertyType: "garage-driveway",
    sizeSqm: 24,
    cheapestPriceFormatted: "Rp 7.500.000",
    cheapestPricePeriod: "quarter",
    rating: 4.9,
    reviewCount: 22,
  },
];
