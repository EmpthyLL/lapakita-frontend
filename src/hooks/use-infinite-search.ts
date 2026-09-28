import { PaginatedResponse } from "@/lib/data/schema/base";
import { useInfiniteQuery } from "@tanstack/react-query";

export type DefaultOption = {
  label: string;
  value: string | number;
};

export type ApiResponse<TData> =
  | PaginatedResponse<TData>
  | TData[]
  | { data: TData[] };

type UseInfiniteSearchProps<
  TData,
  TQuery extends Record<string, unknown>,
  TOutput,
> = {
  queryKey: readonly unknown[];
  queryFn: (params: TQuery) => Promise<ApiResponse<TData>>;
  search?: string;
  searchKey?: keyof TQuery;
  enabled?: boolean;
  params?: TQuery;
  mapFn?: (data: TData[]) => TOutput[];
  initialLimit?: number;
  initialPageParam?: number;
  selected_id?: string | number;
};

export function useInfiniteSearch<
  TData,
  TQuery extends Record<string, unknown>,
  TOutput = TData,
>({
  queryKey,
  queryFn,
  search,
  searchKey,
  enabled = true,
  params = {} as TQuery,
  mapFn,
  initialLimit = 10,
  initialPageParam = 1,
  selected_id,
}: UseInfiniteSearchProps<TData, TQuery, TOutput>) {
  const query = useInfiniteQuery({
    queryKey: [
      ...queryKey,
      search,
      initialLimit,
      initialPageParam,
      params,
      selected_id,
    ] as const,
    queryFn: async ({ pageParam = initialPageParam }) => {
      const isInitialPage = pageParam === initialPageParam;

      const finalParams: TQuery = {
        ...params,
        page: pageParam,
        limit: initialLimit,
        ...(isInitialPage && selected_id !== undefined ? { selected_id } : {}),
      } as unknown as TQuery;

      if (search && searchKey) {
        (finalParams as Record<string, unknown>)[String(searchKey)] = search;
      }

      const raw = await queryFn(finalParams);

      // Normalisasi berbagai bentuk respons API (Paginated, Array mentah, atau { data })
      let dataList: TData[] = [];
      let meta = undefined;
      let hasMore = false;
      let hasPrev = false;

      if (Array.isArray(raw)) {
        dataList = raw;
      } else if (
        raw &&
        typeof raw === "object" &&
        "data" in raw &&
        Array.isArray(raw.data)
      ) {
        dataList = raw.data;
        if ("meta" in raw && raw.meta && typeof raw.meta === "object") {
          meta = raw.meta as PaginatedResponse<TData>["meta"];
          hasMore = Boolean(meta.hasNextPage);
          hasPrev = Boolean(meta.hasPrevPage);
        }
      }

      return {
        data: dataList,
        hasMore,
        hasPrev,
        page: pageParam as number,
        meta,
      };
    },
    getNextPageParam: (lastPage) =>
      lastPage.hasMore ? lastPage.page + 1 : undefined,
    getPreviousPageParam: (firstPage) =>
      firstPage.hasPrev ? firstPage.page - 1 : undefined,
    initialPageParam,
    enabled,
    placeholderData: (prev) => prev,
  });

  const flatData = query.data?.pages.flatMap((p) => p.data) ?? [];
  const lastPage = query.data?.pages.at(-1);

  const finalData = mapFn
    ? mapFn(flatData)
    : (flatData as unknown as TOutput[]);

  return {
    data: finalData,
    isLoading: query.isLoading,
    fetchNextPage: query.fetchNextPage,
    fetchPreviousPage: query.fetchPreviousPage,
    isFetching: query.isFetching,
    hasNextPage: query.hasNextPage,
    hasPreviousPage: query.hasPreviousPage,
    isFetchingNextPage: query.isFetchingNextPage,
    isFetchingPreviousPage: query.isFetchingPreviousPage,
    meta: lastPage?.meta,
  };
}
