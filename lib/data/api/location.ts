import {
  AreaGeneralResponseData,
  DUMMY_LOCATIONS,
} from "../schema/master/location";

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
