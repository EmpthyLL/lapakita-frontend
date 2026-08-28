import { BasePaginationQuery, PaginatedResponse } from "@/lib/data/schema/base";
import { keepPreviousData, useQuery } from "@tanstack/react-query";

interface UsePaginationOptions<TData, TParams extends BasePaginationQuery> {
  queryKey: unknown[];
  queryFn: (params: TParams) => Promise<PaginatedResponse<TData>>;
  params: TParams;
  enabled?: boolean;
}

/**
 * Same PaginatedResponse<T> shape as useInfiniteSearch, but drives classic
 * page-by-page navigation instead of accumulating pages. Keeps the previous
 * page's data on screen while the next page loads (no flash to empty/loading).
 */
export function usePagination<TData, TParams extends BasePaginationQuery>({
  queryKey,
  queryFn,
  params,
  enabled = true,
}: UsePaginationOptions<TData, TParams>) {
  const query = useQuery({
    queryKey,
    queryFn: () => queryFn(params),
    enabled,
    placeholderData: keepPreviousData,
  });

  return {
    rows: query.data?.data ?? [],
    meta: query.data?.meta,
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    isPlaceholderData: query.isPlaceholderData,
    isError: query.isError,
  };
}
