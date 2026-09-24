/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useInfiniteSearch } from "@/hooks/use-infinite-search";
import { usePagination } from "@/hooks/use-pagination";
import { BasePaginationQuery } from "@/lib/data/schema/base";
import { useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { Spinner } from "../../Spinner";
import {
  ColumnDef,
  createColumnHelpers, // <-- Import createColumnHelpers untuk resolve
  DataDisplayActionContext,
  DataDisplayConfirmOptions,
  DataDisplayDetail,
  DataDisplayForm,
  DataDisplayLoadMode,
  DataDisplayQuery,
  DataDisplaySurface,
  DataDisplayVariant,
  FilterOption,
  ListItemRenderer,
  RowAction,
  ToolbarExtraAction,
} from "./Constant";
import { DataDisplayModals } from "./DataDisplayModals";
import { DataDisplayPagination } from "./DataDisplayPagination";
import { DataDisplayPreset } from "./DataDisplayPreset";
import { DataDisplayTable } from "./DataDisplayTable";
import {
  CardSkeleton,
  DataEmptyState,
  ListFooterCount,
  ListRowSkeleton,
} from "./ListStates";
import { LoadMoreFooter } from "./LoadMoreFooter";
import { CardGridCard } from "./presets/CardGridCard";
import { ListRowCard } from "./presets/ListRowCard";
import { SearchFilterBar } from "./SearchFilterBar";

interface DataDisplayProps<TData, TParams extends Record<string, any>> {
  query: DataDisplayQuery<TData, TParams>;
  rowKey: keyof TData;
  emptyText?: string;
  variant?: DataDisplayVariant;
  loadMode?: DataDisplayLoadMode;
  renderItem?: ListItemRenderer<TData>;
  onRowClick?: RowAction<TData>;
  columns?: ColumnDef<TData>[]; // <-- Diubah dari ColumnConfig menjadi array ColumnDef[]
  showFilter?: boolean;
  showCount?: boolean;
  countList?: number[];
  toolbarExtraAction?: ToolbarExtraAction<TData>;
  detail?: DataDisplayDetail<TData>;
  form?: DataDisplayForm<TData>;
}

export function DataDisplay<TData, TParams extends BasePaginationQuery>({
  query,
  emptyText,
  rowKey,
  variant = "list",
  loadMode = "infinite-scroll",
  renderItem,
  onRowClick,
  columns = [], // <-- Default berupa array kosong
  showFilter = false,
  showCount = false,
  countList = [10, 20, 50, 100],
  toolbarExtraAction,
  detail,
  form,
}: DataDisplayProps<TData, TParams>) {
  const t = useTranslations("common.data_display");
  const [searchValue, setSearchValue] = useState("");
  const [selectedOptions, setSelectedOptions] = useState<
    FilterOption<TParams>[]
  >([]);
  const [filterValues, setFilterValues] = useState<Partial<TParams>>({});
  const [pageSize, setPageSize] = useState(10);
  const [page, setPage] = useState(1);

  // Menggunakan helper resolve untuk otomatis memecah array kolom menjadi fields & actions
  const { resolve } = createColumnHelpers<TData>();
  const columnConfig = resolve(columns);

  const [activeDetail, setActiveDetail] = useState<{
    row?: TData;
    index?: number;
    type: DataDisplaySurface;
  } | null>(null);

  const [activeForm, setActiveForm] = useState<{
    kind: "create" | "edit";
    row?: TData;
    index?: number;
    type: DataDisplaySurface;
    close: () => void;
  } | null>(null);

  const [activeConfirm, setActiveConfirm] = useState<{
    onConfirm: () => void;
    options: DataDisplayConfirmOptions;
  } | null>(null);

  const [activeDelete, setActiveDelete] = useState<{
    onDelete: () => void;
    itemName?: string;
  } | null>(null);

  const loadMoreRef = useRef<HTMLDivElement>(null);

  const isPagination = loadMode === "pagination";
  const isInfiniteScroll = loadMode === "infinite-scroll";

  const searchParam =
    query.searchKey && searchValue ? { [query.searchKey]: searchValue } : {};

  const resolvedFilterParams = Object.entries(filterValues).reduce(
    (acc, [key, val]) => {
      const mappedKey = query.filterToParamKey?.[key] ?? key;
      return { ...acc, [mappedKey]: val };
    },
    {},
  );

  const mergedParams = {
    ...query.defaultParams,
    ...resolvedFilterParams,
    ...searchParam,
    limit: pageSize,
    ...(isPagination ? { page } : {}),
  } as TParams;

  function updateFilterValues(updater: React.SetStateAction<Partial<TParams>>) {
    setFilterValues(updater);
    setPage(1);
  }

  function updateSearch(value: string) {
    setSearchValue(value);
    setPage(1);
  }

  const closeForm = () => setActiveForm(null);

  function getActionContext(
    row?: TData,
    index?: number,
  ): DataDisplayActionContext<TData> {
    const openConfirm = (
      onConfirm: () => void,
      options: DataDisplayConfirmOptions = {},
    ) => setActiveConfirm({ onConfirm, options });

    const openFormAction = (
      kind: "create" | "edit",
      type?: DataDisplaySurface,
      targetRow?: TData,
      targetIndex?: number,
    ) => {
      if (!form) return;
      const targetType = type ?? form.type ?? "dialog";
      if (targetType === "link" && form.href) {
        window.location.assign(form.href);
        return;
      }
      if (targetType === "expandable") {
        setActiveForm((prev) =>
          prev?.kind === kind &&
          prev?.type === "expandable" &&
          prev?.row === targetRow
            ? null
            : {
                kind,
                type: "expandable",
                close: closeForm,
                ...(targetRow !== undefined
                  ? { row: targetRow, index: targetIndex }
                  : {}),
              },
        );
        return;
      }
      setActiveForm({
        kind,
        type: targetType,
        close: closeForm,
        ...(targetRow !== undefined
          ? { row: targetRow, index: targetIndex }
          : {}),
      });
    };

    return {
      row: row as TData,
      index: index ?? -1,
      openDetail: (type) => {
        const targetType = type ?? detail?.type ?? "dialog";
        if (targetType === "link" && detail?.href) {
          window.location.assign(detail.href);
          return;
        }
        if (targetType === "expandable" && row !== undefined) {
          setActiveDetail((prev) =>
            prev?.row === row && prev?.type === "expandable"
              ? null
              : { row, index: index ?? 0, type: "expandable" },
          );
          return;
        }
        if (row !== undefined) {
          setActiveDetail({ row, index: index ?? 0, type: targetType });
        }
      },
      openEdit: (type) => openFormAction("edit", type, row, index),
      openCreate: (type) => openFormAction("create", type),
      openConfirm,
      openDelete: (onDelete, itemName) =>
        setActiveDelete({ onDelete, itemName }),
    };
  }

  const detailIsExpandable = detail?.type === "expandable";
  const formIsExpandable = form?.type === "expandable";

  const infinite = useInfiniteSearch<TData, TParams>({
    queryKey: [
      ...query.queryKey(mergedParams),
      filterValues,
      searchValue,
      pageSize,
    ],
    queryFn: query.queryFn,
    params: mergedParams,
    searchKey: query.searchKey,
    enabled: (query.enabled ?? true) && !isPagination,
    initialLimit: pageSize,
  });

  const paginated = usePagination<TData, TParams>({
    queryKey: [
      ...query.queryKey(mergedParams),
      filterValues,
      searchValue,
      pageSize,
      page,
    ],
    queryFn: query.queryFn,
    params: mergedParams,
    enabled: (query.enabled ?? true) && isPagination,
  });

  useEffect(() => {
    if (
      !isInfiniteScroll ||
      !infinite.hasNextPage ||
      infinite.isFetchingNextPage
    )
      return;
    const currentRef = loadMoreRef.current;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) infinite.fetchNextPage();
      },
      { threshold: 0.1 },
    );
    if (currentRef) observer.observe(currentRef);
    return () => {
      if (currentRef) observer.unobserve(currentRef);
    };
  }, [
    isInfiniteScroll,
    infinite.hasNextPage,
    infinite.isFetchingNextPage,
    infinite,
  ]);

  const rows = isPagination ? paginated.rows : infinite.data;
  const isLoading = isPagination
    ? paginated.isLoading
    : infinite.isFetching && !infinite.isFetchingNextPage;
  const isRefetching =
    isPagination && paginated.isFetching && !paginated.isLoading;
  const isUpdating =
    (isPagination && isRefetching) ||
    (!isPagination && infinite.isFetching && !infinite.isFetchingNextPage);
  const total = isPagination
    ? paginated.meta?.totalItems
    : infinite.meta?.totalItems;

  const globalActionCtx = getActionContext();
  const isCreateExpandableOpen =
    formIsExpandable &&
    activeForm?.kind === "create" &&
    activeForm?.type === "expandable";

  function renderPresetItem(row: TData, index: number) {
    const action = getActionContext(row, index);
    if (renderItem) return renderItem(row, index, columnConfig, action);
    return variant === "card" ? (
      <CardGridCard
        row={row}
        index={index}
        columns={columnConfig}
        action={action}
      />
    ) : (
      <ListRowCard
        row={row}
        index={index}
        columns={columnConfig}
        action={action}
      />
    );
  }

  return (
    <div className="space-y-4">
      {(showFilter || query.searchKey || toolbarExtraAction) && (
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex-1">
            <SearchFilterBar
              searchValue={searchValue}
              onSearchChange={updateSearch}
              filterOptions={showFilter ? query.filterOptions : undefined}
              selectedOptions={selectedOptions}
              setSelectedOptions={setSelectedOptions}
              filterValues={filterValues}
              setFilterValues={updateFilterValues}
              filterToParamKey={query.filterToParamKey}
              toolbarExtraAction={
                typeof toolbarExtraAction === "function"
                  ? toolbarExtraAction({
                      openCreate: (type) => globalActionCtx.openCreate(type),
                      isLoading,
                      rows,
                    })
                  : toolbarExtraAction
              }
            />
          </div>

          {showCount && (
            <Select
              value={String(pageSize)}
              onValueChange={(value) => {
                setPageSize(Number(value));
                setPage(1);
              }}
            >
              <SelectTrigger className="h-11 w-44 shrink-0 rounded-full border-border bg-secondary/30">
                <SelectValue placeholder={t("select_page_size")} />
              </SelectTrigger>
              <SelectContent>
                {countList.map((size) => (
                  <SelectItem key={size} value={String(size)}>
                    {t("rows_count", { count: size })}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>
      )}

      {/* Expandable Form Create di Bawah Search Bar */}
      {isCreateExpandableOpen && form && (
        <div className="overflow-hidden rounded-2xl border border-border bg-card p-5 shadow-sm transition-all duration-300">
          <div className="mb-3 flex items-center justify-between border-b border-border pb-3">
            <div>
              {form.title && (
                <h3 className="font-semibold text-foreground text-sm">
                  {form.title}
                </h3>
              )}
              {form.description && (
                <p className="text-xs text-muted-foreground">
                  {form.description}
                </p>
              )}
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={closeForm}
              className="h-8 text-xs"
            >
              Tutup
            </Button>
          </div>
          {form.component({
            row: activeForm?.row,
            index: activeForm?.index,
            mode: activeForm?.kind ?? "create",
            close: closeForm,
          })}
        </div>
      )}

      {variant === "table" ? (
        <DataDisplayTable
          columns={columnConfig}
          rows={rows}
          rowKey={rowKey}
          isLoading={isLoading}
          isRefetching={isRefetching}
          emptyText={emptyText}
          detailIsExpandable={detailIsExpandable}
          formIsExpandable={formIsExpandable}
          detail={detail}
          form={form}
          activeDetail={activeDetail}
          activeForm={activeForm}
          onRowClick={onRowClick}
          getActionContext={getActionContext}
          openDetailExpandable={(row, index) =>
            getActionContext(row, index).openDetail("expandable")
          }
        />
      ) : isLoading ? (
        variant === "card" ? (
          <CardSkeleton />
        ) : (
          <ListRowSkeleton />
        )
      ) : rows.length === 0 ? (
        <DataEmptyState text={emptyText} />
      ) : (
        <DataDisplayPreset
          rows={rows}
          rowKey={rowKey}
          variant={variant}
          detailIsExpandable={detailIsExpandable}
          formIsExpandable={formIsExpandable}
          detail={detail}
          form={form}
          activeDetail={activeDetail}
          activeForm={activeForm}
          onRowClick={onRowClick}
          getActionContext={getActionContext}
          openDetailExpandable={(row, index) =>
            getActionContext(row, index).openDetail("expandable")
          }
          renderPresetItem={renderPresetItem}
        />
      )}

      <div className="flex flex-col gap-3 pt-2">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <ListFooterCount
            count={rows.length}
            total={total}
            updating={isUpdating}
          />
          {isPagination && paginated.meta && (
            <DataDisplayPagination
              currentPage={paginated.meta.currentPage}
              totalPages={paginated.meta.totalPages}
              hasPrevPage={paginated.meta.hasPrevPage}
              hasNextPage={paginated.meta.hasNextPage}
              onPageChange={setPage}
            />
          )}
        </div>
        {isInfiniteScroll && (
          <div ref={loadMoreRef}>
            {infinite.hasNextPage && infinite.isFetchingNextPage && <Spinner />}
          </div>
        )}
        {loadMode === "load-more" && infinite.hasNextPage && (
          <LoadMoreFooter
            onClick={() => infinite.fetchNextPage()}
            isLoading={infinite.isFetchingNextPage}
          />
        )}
      </div>

      <DataDisplayModals
        form={form}
        activeForm={activeForm}
        onCloseForm={closeForm}
        detail={detail}
        activeDetail={activeDetail}
        onCloseDetail={() => setActiveDetail(null)}
        activeConfirm={activeConfirm}
        onCloseConfirm={() => setActiveConfirm(null)}
        activeDelete={activeDelete}
        onCloseDelete={() => setActiveDelete(null)}
      />
    </div>
  );
}
