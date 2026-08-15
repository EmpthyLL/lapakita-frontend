// Interface Penulis Ulasan (Tenant yang pernah menyewa)
export interface ReviewAuthor {
  id: string;
  name: string;
  avatarUrl: string;
  businessName?: string;
  businessCategory?: string;
  tenancyDuration?: string;
}

// Interface Balasan dari Owner Kios
export interface OwnerReviewResponse {
  ownerName: string;
  avatarUrl: string;
  comment: string;
  createdAt: string;
}

// Interface Item Ulasan Tunggal
export interface StallReview {
  id: string;
  stallId: string;
  author: ReviewAuthor;
  rating: number;
  createdAt: string;
  comment: string;
  photos?: string[];
  ownerResponse?: OwnerReviewResponse;
}

// Breakdown Statistik Rating (Bintang 5 - Bintang 1)
export interface RatingBreakdown {
  5: number;
  4: number;
  3: number;
  2: number;
  1: number;
}

export interface StallReviewSummary {
  stallId: string;
  averageRating: number;
  totalReviews: number;
  breakdown: RatingBreakdown;
}

export const MOCK_STALL_REVIEW_SUMMARY: StallReviewSummary = {
  stallId: "stl_depok_mrg_001",
  averageRating: 4.8,
  totalReviews: 14,
  breakdown: {
    5: 10,
    4: 3,
    3: 1,
    2: 0,
    1: 0,
  },
};

export const MOCK_STALL_REVIEWS: StallReview[] = [
  {
    id: "rev_001",
    stallId: "stl_depok_mrg_001",
    author: {
      id: "usr_tnt_01",
      name: "Rizky Ramadhan",
      avatarUrl:
        "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop",
      businessName: "Kopi Sudut Margonda",
      businessCategory: "Coffee Kiosk",
      tenancyDuration: "Sewa 1 Tahun (2025)",
    },
    rating: 5,
    createdAt: "2026-01-20",
    comment:
      "Lokasi sangat strategis persis di hook depan eskalator utama ground floor. Foot traffic pengunjung mall tinggi banget, terutama di jam makan siang dan weekend. Daya listrik 3500 VA sangat aman buat mesin espresso 2 group + grinder. Owner (Pak Budi) ramah dan proses escrow deposit saat serah terima sangat transparan.",
    photos: [
      "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=600&h=400&fit=crop",
      "https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=600&h=400&fit=crop",
    ],
    ownerResponse: {
      ownerName: "Budi Santoso",
      avatarUrl:
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop",
      comment:
        "Terima kasih Mas Rizky! Sukses terus untuk Kopi Sudut Margonda. Kios ditinggalkan dalam kondisi sangat bersih dan rapi.",
      createdAt: "2026-01-21",
    },
  },
  {
    id: "rev_002",
    stallId: "stl_depok_mrg_001",
    author: {
      id: "usr_tnt_02",
      name: "Siti Nurhaliza",
      avatarUrl:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop",
      businessName: "Bakery Pastry Box",
      businessCategory: "Bakery",
      tenancyDuration: "Sewa 6 Bulan (2025)",
    },
    rating: 5,
    createdAt: "2025-11-14",
    comment:
      "Instalasi air bersih dan grease-trap berfungsi sangat baik tanpa kendala bau. Pengelola gedung mall juga kooperatif untuk loading barang di pagi hari. Highly recommended buat yang cari lapak F&B siap pakai!",
  },
  {
    id: "rev_003",
    stallId: "stl_depok_mrg_001",
    author: {
      id: "usr_tnt_03",
      name: "Dimas Anggara",
      avatarUrl:
        "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&h=150&fit=crop",
      businessName: "Case Master Phone Accessories",
      businessCategory: "General Retail",
      tenancyDuration: "Sewa 3 Bulan (2025)",
    },
    rating: 4,
    createdAt: "2025-08-05",
    comment:
      "Secara tempat dan visibilitas 10/10. Sedikit catatan hanya di jam tutup mall (jam 22.00 WIB) AC central mall sudah mulai dimatikan jadi agak hangat kalau bongkar muatan malam. Tapi secara keseluruhan sangat memuaskan.",
  },
  {
    id: "rev_004",
    stallId: "stl_depok_mrg_001",
    author: {
      id: "usr_tnt_04",
      name: "Ayu Lestari",
      avatarUrl:
        "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=150&h=150&fit=crop",
      businessName: "Boba Bunda",
      businessCategory: "Beverage Kiosk",
      tenancyDuration: "Sewa 1 Tahun (2025)",
    },
    rating: 5,
    createdAt: "2025-12-02",
    comment:
      "Proses sewa dari survey sampai serah terima kunci cuma 3 hari, cepat banget. Titik keramaian pas di depan kios, gak perlu promosi berlebihan udah rame sendiri dari lalu-lalang mall.",
    photos: [
      "https://images.unsplash.com/photo-1558857563-b371033873b8?w=600&h=400&fit=crop",
    ],
  },
  {
    id: "rev_005",
    stallId: "stl_depok_mrg_001",
    author: {
      id: "usr_tnt_05",
      name: "Fajar Nugroho",
      avatarUrl:
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop",
      businessName: "Toko Sepatu Aktif",
      businessCategory: "Footwear",
      tenancyDuration: "Sewa 6 Bulan (2025)",
    },
    rating: 5,
    createdAt: "2025-10-19",
    comment:
      "Ukuran 12m² pas banget buat display rak sepatu + kasir. Storage tambahan di belakang kios sangat membantu buat stok musiman.",
  },
  {
    id: "rev_006",
    stallId: "stl_depok_mrg_001",
    author: {
      id: "usr_tnt_06",
      name: "Nadia Putri",
      avatarUrl:
        "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop",
      businessName: "Skin & Glow Beauty Corner",
      businessCategory: "Cosmetics",
      tenancyDuration: "Sewa 1 Tahun (2024)",
    },
    rating: 5,
    createdAt: "2025-06-30",
    comment:
      "Sudah 2 kali perpanjang sewa di sini. Owner selalu responsif kalau ada kendala teknis, dan CCTV area koridor bikin lebih tenang soal keamanan stok malam hari.",
    ownerResponse: {
      ownerName: "Budi Santoso",
      avatarUrl:
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop",
      comment:
        "Senang bisa jadi rumah kedua buat Skin & Glow, Mba Nadia! Ditunggu perpanjangan tahun depan.",
      createdAt: "2025-07-02",
    },
  },
  {
    id: "rev_007",
    stallId: "stl_depok_mrg_001",
    author: {
      id: "usr_tnt_07",
      name: "Bayu Setiawan",
      avatarUrl:
        "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=150&h=150&fit=crop",
      businessName: "Fried Chicken Kilat",
      businessCategory: "F&B - Fried Food",
      tenancyDuration: "Sewa 3 Bulan (2025)",
    },
    rating: 4,
    createdAt: "2025-05-11",
    comment:
      "Exhaust ventilasi lumayan bantu ngilangin bau minyak, tapi kalau lagi ramai banget jam makan siang agak kurang kuat. Selebihnya lokasi juara, deket pintu masuk parkiran motor.",
  },
  {
    id: "rev_008",
    stallId: "stl_depok_mrg_001",
    author: {
      id: "usr_tnt_08",
      name: "Intan Permata",
      avatarUrl:
        "https://images.unsplash.com/photo-1544723795-3fb6469f5b39?w=150&h=150&fit=crop",
      businessName: "Little Craft Studio",
      businessCategory: "Handicraft",
      tenancyDuration: "Sewa 6 Bulan (2024)",
    },
    rating: 5,
    createdAt: "2025-03-08",
    comment:
      "Display window depan kios bagus buat pajang kerajinan tangan, banyak pengunjung berhenti foto-foto dulu sebelum masuk. WiFi kios juga stabil buat live selling.",
    photos: [
      "https://images.unsplash.com/photo-1513694203232-719a280e022f?w=600&h=400&fit=crop",
      "https://images.unsplash.com/photo-1509penjelasan?w=600&h=400&fit=crop",
    ],
  },
  {
    id: "rev_009",
    stallId: "stl_depok_mrg_001",
    author: {
      id: "usr_tnt_09",
      name: "Reza Firmansyah",
      avatarUrl:
        "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&h=150&fit=crop",
      businessName: "Reza Print & Design",
      businessCategory: "Printing Service",
      tenancyDuration: "Sewa 1 Tahun (2024)",
    },
    rating: 5,
    createdAt: "2025-02-14",
    comment:
      "Daya listrik cukup buat 2 mesin printer besar + AC. Gak pernah ada masalah listrik turun (jeglek) selama setahun sewa di sini.",
  },
  {
    id: "rev_010",
    stallId: "stl_depok_mrg_001",
    author: {
      id: "usr_tnt_10",
      name: "Melati Wijaya",
      avatarUrl:
        "https://images.unsplash.com/photo-1544717305-2782549b5136?w=150&h=150&fit=crop",
      businessName: "Bunga & Kado Melati",
      businessCategory: "Florist & Gifts",
      tenancyDuration: "Sewa 3 Bulan (2025)",
    },
    rating: 3,
    createdAt: "2025-01-22",
    comment:
      "Lokasi ramai tapi khusus untuk bunga segar agak butuh suhu lebih dingin, AC standar mall belum cukup. Tetap terbantu dengan tingkat kunjungan yang tinggi.",
  },
  {
    id: "rev_011",
    stallId: "stl_depok_mrg_001",
    author: {
      id: "usr_tnt_11",
      name: "Hendra Kusuma",
      avatarUrl:
        "https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=150&h=150&fit=crop",
      businessName: "Hendra Watch Repair",
      businessCategory: "Repair Service",
      tenancyDuration: "Sewa 1 Tahun (2024)",
    },
    rating: 5,
    createdAt: "2024-12-19",
    comment:
      "Sebagai usaha jasa reparasi, saya butuh spot yang dilewati banyak orang tapi juga tenang buat kerja detail. Kios ini pas banget di kedua sisi itu.",
  },
  {
    id: "rev_012",
    stallId: "stl_depok_mrg_001",
    author: {
      id: "usr_tnt_12",
      name: "Citra Dewanti",
      avatarUrl:
        "https://images.unsplash.com/photo-1502685104226-ee32379fefbe?w=150&h=150&fit=crop",
      businessName: "Citra Bags & Accessories",
      businessCategory: "Fashion Accessories",
      tenancyDuration: "Sewa 6 Bulan (2024)",
    },
    rating: 4,
    createdAt: "2024-10-03",
    comment:
      "Overall puas, cuma proses checkout deposit di akhir masa sewa agak lama (sekitar seminggu) sampai dana balik ke rekening.",
  },
  {
    id: "rev_013",
    stallId: "stl_depok_mrg_001",
    author: {
      id: "usr_tnt_13",
      name: "Yusuf Maulana",
      avatarUrl:
        "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop",
      businessName: "Yusuf Fresh Juice",
      businessCategory: "Beverage Kiosk",
      tenancyDuration: "Sewa 3 Bulan (2024)",
    },
    rating: 5,
    createdAt: "2024-08-27",
    comment:
      "Air bersih lancar 24 jam, penting banget buat usaha jus setiap hari cuci alat. Owner juga fleksibel soal jam operasional booth.",
  },
  {
    id: "rev_014",
    stallId: "stl_depok_mrg_001",
    author: {
      id: "usr_tnt_14",
      name: "Wulan Sari",
      avatarUrl:
        "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=150&h=150&fit=crop",
      businessName: "Wulan Snack Corner",
      businessCategory: "Snack & Confectionery",
      tenancyDuration: "Sewa 1 Tahun (2023)",
    },
    rating: 5,
    createdAt: "2024-06-15",
    comment:
      "Sudah 2 tahun jualan di sini dan masih jadi salah satu titik terbaik saya. Rekomendasi banget buat yang mau mulai usaha kecil di area kampus & residensial Margonda.",
    ownerResponse: {
      ownerName: "Budi Santoso",
      avatarUrl:
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop",
      comment: "Terima kasih Mba Wulan atas kepercayaannya selama ini!",
      createdAt: "2024-06-16",
    },
  },
];
