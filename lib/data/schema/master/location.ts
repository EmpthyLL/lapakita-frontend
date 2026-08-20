export type AreaType = "country" | "province" | "city" | "district" | "street";

export interface AreaGeneralResponseData {
  type: AreaType;
  title: string;
  subtitle: string;
  fullLabel: string;
  country: string;
  countryCode: string;
  city?: string;
  province?: string;
}

const DUMMY_LOCATIONS: AreaGeneralResponseData[] = [
  {
    type: "street",
    title: "Jalan Delimas",
    subtitle: "Surabaya, Jawa Timur, Indonesia",
    fullLabel: "Jalan Delimas, Surabaya, Jawa Timur, Indonesia",
    country: "Indonesia",
    countryCode: "ID",
    city: "Surabaya",
    province: "Jawa Timur",
  },
  {
    type: "street",
    title: "Jl. Gatot Subroto",
    subtitle: "Medan, Sumatera Utara, Indonesia",
    fullLabel: "Jl. Gatot Subroto, Medan, Sumatera Utara, Indonesia",
    country: "Indonesia",
    countryCode: "ID",
    city: "Medan",
    province: "Sumatera Utara",
  },
  {
    type: "district",
    title: "Pondok Cina",
    subtitle: "Depok, Jawa Barat, Indonesia",
    fullLabel: "Pondok Cina, Depok, Jawa Barat, Indonesia",
    country: "Indonesia",
    countryCode: "ID",
    city: "Depok",
    province: "Jawa Barat",
  },
  {
    type: "district",
    title: "Tanah Abang",
    subtitle: "Jakarta Pusat, DKI Jakarta, Indonesia",
    fullLabel: "Tanah Abang, Jakarta Pusat, DKI Jakarta, Indonesia",
    country: "Indonesia",
    countryCode: "ID",
    city: "Jakarta Pusat",
    province: "DKI Jakarta",
  },
  {
    type: "city",
    title: "Medan",
    subtitle: "Sumatera Utara, Indonesia",
    fullLabel: "Medan, Sumatera Utara, Indonesia",
    country: "Indonesia",
    countryCode: "ID",
    province: "Sumatera Utara",
  },
  {
    type: "city",
    title: "Bandung",
    subtitle: "Jawa Barat, Indonesia",
    fullLabel: "Bandung, Jawa Barat, Indonesia",
    country: "Indonesia",
    countryCode: "ID",
    province: "Jawa Barat",
  },
  {
    type: "city",
    title: "Surabaya",
    subtitle: "Jawa Timur, Indonesia",
    fullLabel: "Surabaya, Jawa Timur, Indonesia",
    country: "Indonesia",
    countryCode: "ID",
    province: "Jawa Timur",
  },
  {
    type: "province",
    title: "Jawa Timur",
    subtitle: "Indonesia",
    fullLabel: "Jawa Timur, Indonesia",
    country: "Indonesia",
    countryCode: "ID",
  },
  {
    type: "province",
    title: "DKI Jakarta",
    subtitle: "Indonesia",
    fullLabel: "DKI Jakarta, Indonesia",
    country: "Indonesia",
    countryCode: "ID",
  },
  {
    type: "country",
    title: "Indonesia",
    subtitle: "Southeast Asia",
    fullLabel: "Indonesia",
    country: "Indonesia",
    countryCode: "ID",
  },
];

export interface SearchLocationResult {
  results: AreaGeneralResponseData[];
  hasMore: boolean;
}

export async function searchLocations(
  query: string,
  page: number = 1,
  pageSize: number = 5,
): Promise<SearchLocationResult> {
  await new Promise((resolve) => setTimeout(resolve, 300));

  if (!query.trim()) return { results: [], hasMore: false };

  const q = query.toLowerCase();
  const allFiltered = DUMMY_LOCATIONS.filter(
    (loc) =>
      loc.title.toLowerCase().includes(q) ||
      loc.subtitle.toLowerCase().includes(q) ||
      loc.fullLabel.toLowerCase().includes(q),
  );

  const start = (page - 1) * pageSize;
  const paginated = allFiltered.slice(start, start + pageSize);

  return {
    results: paginated,
    hasMore: start + pageSize < allFiltered.length,
  };
}
