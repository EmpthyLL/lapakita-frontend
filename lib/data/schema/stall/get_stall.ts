export interface Stall {
  id: string;
  title: string;
  imageUrl: string;
  city: string;
  area: string;
  propertyType: string;
  sizeSqm: number;
  pricePerMonth: string;
  rating: number;
  reviewCount: number;
}

export const MOCK_STALL_LIST: Stall[] = [
  {
    id: "stl_depok_mrg_001",
    title: "Kios Ground Floor Plaza Margonda - Main Corridor",
    imageUrl:
      "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600&h=400&fit=crop",
    city: "Depok",
    area: "Margonda",
    propertyType: "Mall Island",
    sizeSqm: 12,
    pricePerMonth: "Rp 3.500.000",
    rating: 4.8,
    reviewCount: 14,
  },
  {
    id: "stl_jkt_tah_002",
    title: "Lapak Busana Blok B Pasar Tanah Abang",
    imageUrl:
      "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=600&h=400&fit=crop",
    city: "Central Jakarta",
    area: "Tanah Abang",
    propertyType: "Market Stall",
    sizeSqm: 8,
    pricePerMonth: "Rp 4.200.000",
    rating: 4.9,
    reviewCount: 28,
  },
  {
    id: "stl_bdg_dago_003",
    title: "Space Ruko Lantai 1 Akses Utama Kampus ITB Dago",
    imageUrl:
      "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&h=400&fit=crop",
    city: "Bandung",
    area: "Dago",
    propertyType: "Ruko / Shophouse",
    sizeSqm: 36,
    pricePerMonth: "Rp 6.800.000",
    rating: 4.7,
    reviewCount: 9,
  },
  {
    id: "stl_jks_psm_004",
    title: "Container Booth Street Food Kuliner Pasar Minggu",
    imageUrl:
      "https://images.unsplash.com/photo-1578916171728-46686eac8d58?w=600&h=400&fit=crop",
    city: "South Jakarta",
    area: "Pasar Minggu",
    propertyType: "Street Kiosk",
    sizeSqm: 6,
    pricePerMonth: "Rp 1.800.000",
    rating: 4.6,
    reviewCount: 19,
  },
  {
    id: "stl_sbr_sub_005",
    title: "Counter Food Court Area Utama Tunjungan Plaza",
    imageUrl:
      "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=600&h=400&fit=crop",
    city: "Surabaya",
    area: "Tunjungan",
    propertyType: "Food Court Counter",
    sizeSqm: 15,
    pricePerMonth: "Rp 5.500.000",
    rating: 5.0,
    reviewCount: 31,
  },
  {
    id: "stl_bks_tmr_006",
    title: "Kios Toko Sembako & Kelontong Kompleks Depsos",
    imageUrl:
      "https://images.unsplash.com/photo-1604719312566-8912e9227c6a?w=600&h=400&fit=crop",
    city: "Bekasi",
    area: "Bekasi Timur",
    propertyType: "Traditional Market",
    sizeSqm: 18,
    pricePerMonth: "Rp 2.200.000",
    rating: 4.5,
    reviewCount: 6,
  },
  {
    id: "stl_tng_bsd_007",
    title: "Outdoor Courtyard Spot Food Truck Breeze BSD",
    imageUrl:
      "https://images.unsplash.com/photo-1565123409695-7b5ef63a2efb?w=600&h=400&fit=crop",
    city: "Tangerang Selatan",
    area: "BSD City",
    propertyType: "Food Truck Spot",
    sizeSqm: 20,
    pricePerMonth: "Rp 3.000.000",
    rating: 4.8,
    reviewCount: 15,
  },
  {
    id: "stl_ygy_ugm_008",
    title: "Kios Garasi Komersial Jalan Kaliurang KM 5",
    imageUrl:
      "https://images.unsplash.com/photo-1521017432531-fbd92d768814?w=600&h=400&fit=crop",
    city: "Sleman",
    area: "Jakal / UGM",
    propertyType: "Garage / Yard Space",
    sizeSqm: 24,
    pricePerMonth: "Rp 2.700.000",
    rating: 4.9,
    reviewCount: 22,
  },
];
