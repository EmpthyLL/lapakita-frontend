/* eslint-disable @typescript-eslint/no-explicit-any */
import { PaginatedResponse } from "@/lib/data/schema/base";
import { useInfiniteQuery } from "@tanstack/react-query";

export type DefaultOption = {
  label: string;
  value: string | number;
};

type UseInfiniteSearchProps<
  TData,
  TQuery extends Record<string, any>,
  TOutput,
> = {
  queryKey: any[];
  queryFn: (params: TQuery) => Promise<PaginatedResponse<TData>>;
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
  TQuery extends Record<string, any>,
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
  initialPageParam = 1, // Reset ke 1 agar selaras dengan 1-based index backend
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
    ],
    queryFn: async ({ pageParam = initialPageParam }) => {
      const isInitialPage = pageParam === initialPageParam;

      const finalParams: TQuery = {
        ...params,
        page: pageParam,
        limit: initialLimit,
        ...(isInitialPage && selected_id !== undefined ? { selected_id } : {}),
      } as TQuery;

      if (search && searchKey) {
        (finalParams as any)[searchKey] = search;
      }

      const raw = await queryFn(finalParams);

      return {
        data: raw.data,
        hasMore: raw.meta.hasNextPage,
        hasPrev: raw.meta.hasPrevPage,
        page: pageParam,
        meta: raw.meta,
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
