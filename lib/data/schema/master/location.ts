/* ---------------------------------------------------------------------- */
/* 5. Dummy location autocomplete "API"                                    */
/* ---------------------------------------------------------------------- */

export interface LocationSuggestion {
  id: string;
  primary: string; // street / place name
  secondary: string; // city / district
  type: "street" | "area" | "city";
}

const DUMMY_LOCATIONS: LocationSuggestion[] = [
  {
    id: "1",
    primary: "Jl. Gatot Subroto",
    secondary: "Medan, North Sumatra",
    type: "street",
  },
  {
    id: "2",
    primary: "Jl. Sisingamangaraja",
    secondary: "Medan, North Sumatra",
    type: "street",
  },
  {
    id: "3",
    primary: "Jl. Setiabudi",
    secondary: "Medan, North Sumatra",
    type: "street",
  },
  {
    id: "4",
    primary: "Padang Bulan",
    secondary: "Medan, North Sumatra",
    type: "area",
  },
  {
    id: "5",
    primary: "Medan Baru",
    secondary: "Medan, North Sumatra",
    type: "area",
  },
  {
    id: "6",
    primary: "Jl. Malioboro",
    secondary: "Yogyakarta",
    type: "street",
  },
  {
    id: "7",
    primary: "Jl. Sudirman",
    secondary: "Jakarta Selatan",
    type: "street",
  },
  {
    id: "8",
    primary: "Jl. Braga",
    secondary: "Bandung, West Java",
    type: "street",
  },
  { id: "9", primary: "Medan", secondary: "North Sumatra", type: "city" },
  {
    id: "10",
    primary: "Jakarta",
    secondary: "Special Capital Region",
    type: "city",
  },
  { id: "11", primary: "Bandung", secondary: "West Java", type: "city" },
  {
    id: "12",
    primary: "Yogyakarta",
    secondary: "Special Region",
    type: "city",
  },
  { id: "13", primary: "Surabaya", secondary: "East Java", type: "city" },
];

/**
 * Dummy async "API" — simulates network latency.
 * Replace with a real geocoding call later (Google Places, Mapbox, etc).
 */
export interface SearchLocationResult {
  results: LocationSuggestion[];
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
      loc.primary.toLowerCase().includes(q) ||
      loc.secondary.toLowerCase().includes(q),
  );

  const start = (page - 1) * pageSize;
  const paginated = allFiltered.slice(start, start + pageSize);

  return {
    results: paginated,
    hasMore: start + pageSize < allFiltered.length,
  };
}
