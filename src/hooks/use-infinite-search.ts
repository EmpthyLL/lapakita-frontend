/* eslint-disable @typescript-eslint/no-explicit-any */
import { PaginatedResponse } from "@/lib/data/schema/base";
import { useInfiniteQuery } from "@tanstack/react-query";
import React from "react";

export type DefaultOption = {
  label: string;
  value: string | number;
};

type SelectedIdType = string | number | (string | number)[];

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
  selected_id?: SelectedIdType;
  onError?: (error: unknown) => void;
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
  initialPageParam = 1,
  selected_id,
  onError,
}: UseInfiniteSearchProps<TData, TQuery, TOutput>) {
  const formattedSelectedId = React.useMemo(() => {
    if (!selected_id) return undefined;
    if (Array.isArray(selected_id)) {
      if (selected_id.length === 0) return undefined;
      return selected_id.map(String).join(",");
    }
    return String(selected_id);
  }, [selected_id]);

  const query = useInfiniteQuery({
    queryKey: [
      ...queryKey,
      search,
      initialLimit,
      initialPageParam,
      params,
      formattedSelectedId,
    ],
    queryFn: async ({ pageParam = initialPageParam }) => {
      try {
        const finalParams: TQuery = {
          ...params,
          page: pageParam,
          limit: initialLimit,
          ...(formattedSelectedId !== undefined
            ? { selected_id: formattedSelectedId }
            : {}),
        } as TQuery;

        if (search && searchKey) {
          (finalParams as any)[searchKey] = search;
        }

        const raw = await queryFn(finalParams);

        if (!raw || !raw.meta) {
          throw new Error("Invalid paginated response structure from server.");
        }

        return {
          data: raw.data ?? [],
          hasNext: raw.meta.hasNextPage ?? false,
          hasPrev: raw.meta.hasPrevPage ?? false,
          page: pageParam,
          meta: raw.meta,
        };
      } catch (err) {
        // Panggil handler opsional jika disuplai oleh pemanggil
        onError?.(err);
        // Lempar kembali error agar ditangkap oleh state internal TanStack Query
        throw err;
      }
    },
    getNextPageParam: (lastPage) =>
      lastPage?.hasNext ? lastPage.page + 1 : undefined,
    getPreviousPageParam: (firstPage) =>
      firstPage?.hasPrev ? firstPage.page - 1 : undefined,
    initialPageParam,
    enabled,
    placeholderData: (prev) => prev,
  });

  // Deduplikasi data antar-page berdasarkan ID / Value item
  const flatData = React.useMemo(() => {
    const rawData = query.data?.pages.flatMap((p) => p?.data ?? []) ?? [];
    const seen = new Set<string>();

    return rawData.filter((item) => {
      if (!item) return false;
      const id = String(
        (item as any).id ?? (item as any).value ?? JSON.stringify(item),
      );
      if (seen.has(id)) return false;
      seen.add(id);
      return true;
    });
  }, [query.data]);

  const firstPage = query.data?.pages[0];
  const lastPage = query.data?.pages.at(-1);

  const finalData = mapFn
    ? mapFn(flatData)
    : (flatData as unknown as TOutput[]);

  return {
    data: finalData,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
    fetchNextPage: query.fetchNextPage,
    fetchPreviousPage: query.fetchPreviousPage,
    isFetching: query.isFetching,
    hasNextPage: lastPage?.hasNext ?? false,
    hasPreviousPage: firstPage?.hasPrev ?? false,
    isFetchingNextPage: query.isFetchingNextPage,
    isFetchingPreviousPage: query.isFetchingPreviousPage,
    meta: lastPage?.meta,
  };
}
