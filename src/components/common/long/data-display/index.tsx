/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useInfiniteSearch } from "@/hooks/use-infinite-search";
import { usePagination } from "@/hooks/use-pagination";
import { BasePaginationQuery } from "@/lib/data/schema/base";
import { cn } from "@/lib/utils";
import { ChevronRight } from "lucide-react";
import { useTranslations } from "next-intl";
import { Fragment, useEffect, useRef, useState } from "react";

import ConfirmDialog from "@/components/common/ConfirmDialog";
import { DeleteConfirmDialog } from "@/components/common/DeleteDialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { Spinner } from "../../Spinner";
import {
  ColumnDef,
  DataDisplayActionContext,
  DataDisplayConfirmOptions,
  DataDisplayDetail,
  DataDisplayForm,
  DataDisplayLoadMode,
  DataDisplayQuery,
  DataDisplaySurface,
  DataDisplayVariant,
  FieldColumnDef,
  ListItemRenderer,
  RowAction,
} from "./Constant";
import { DataDisplayPagination } from "./DataDisplayPagination";
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
import { EmptyState, RowIndexBadge, SkeletonRows } from "./TableStates";

interface DataDisplayProps<TData, TParams extends Record<string, any>> {
  query: DataDisplayQuery<TData, TParams>;
  rowKey: keyof TData;
  emptyText?: string;
  variant?: DataDisplayVariant;
  loadMode?: DataDisplayLoadMode;
  renderItem?: ListItemRenderer<TData>;
  onRowClick?: RowAction<TData>;
  columns?: ColumnDef<TData>[];
  showFilter?: boolean;
  showCount?: boolean;
  countList?: number[];
  toolbarExtraAction?: React.ReactNode;
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
  columns = [],
  showFilter = false,
  showCount = false,
  countList = [10, 20, 50, 100],
  toolbarExtraAction,
  detail,
  form,
}: DataDisplayProps<TData, TParams>) {
  const t = useTranslations("common.data_display");
  const [searchValue, setSearchValue] = useState("");
  const [selectedOptions, setSelectedOptions] = useState<any[]>([]);
  const [filterValues, setFilterValues] = useState<Partial<TParams>>({});
  const [pageSize, setPageSize] = useState(10);
  const [page, setPage] = useState(1);

  // State aktif untuk popup / expandable detail
  const [activeDetail, setActiveDetail] = useState<{
    row: TData;
    index: number;
    type: DataDisplaySurface;
  } | null>(null);

  // State aktif untuk form (create/edit)
  const [activeForm, setActiveForm] = useState<{
    kind: "create" | "edit";
    row?: TData;
    index?: number;
    type: DataDisplaySurface;
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

  const mergedParams = {
    ...query.defaultParams,
    ...filterValues,
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

  function getActionContext(
    row: TData,
    index: number,
  ): DataDisplayActionContext<TData> {
    const openConfirm = (
      onConfirm: () => void,
      options: DataDisplayConfirmOptions = {},
    ) => setActiveConfirm({ onConfirm, options });

    const openFormAction = (
      kind: "create" | "edit",
      type?: DataDisplaySurface,
    ) => {
      if (!form) return;
      const targetType = type ?? form.type ?? "dialog";
      if (targetType === "link" && form.href) {
        window.location.assign(form.href);
        return;
      }
      if (targetType === "expandable") {
        setActiveForm((prev) =>
          prev?.row === row &&
          prev?.kind === kind &&
          prev?.type === "expandable"
            ? null
            : {
                kind,
                type: "expandable",
                ...(kind === "edit" ? { row, index } : {}),
              },
        );
        return;
      }
      setActiveForm({
        kind,
        type: targetType,
        ...(kind === "edit" ? { row, index } : {}),
      });
    };

    return {
      row,
      index,
      openDetail: (type) => {
        const targetType = type ?? detail?.type ?? "dialog";
        if (targetType === "link" && detail?.href) {
          window.location.assign(detail.href);
          return;
        }
        if (targetType === "expandable") {
          setActiveDetail((prev) =>
            prev?.row === row && prev?.type === "expandable"
              ? null
              : { row, index, type: "expandable" },
          );
          return;
        }
        setActiveDetail({ row, index, type: targetType });
      },
      openEdit: (type) => openFormAction("edit", type),
      openCreate: (type) => openFormAction("create", type),
      openConfirm,
      openDelete: (onDelete, itemName) =>
        setActiveDelete({ onDelete, itemName }),
    };
  }

  const tableColumns: ColumnDef<TData>[] = columns;

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

  function renderPresetItem(row: TData, index: number) {
    const action = getActionContext(row, index);
    if (renderItem) return renderItem(row, index, columns, action);
    return variant === "card" ? (
      <CardGridCard row={row} index={index} columns={columns} action={action} />
    ) : (
      <ListRowCard row={row} index={index} columns={columns} action={action} />
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
              toolbarExtraAction={toolbarExtraAction}
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

      {variant === "table" ? (
        <div className="overflow-hidden rounded-2xl border border-border shadow-sm">
          <div className="overflow-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-b border-primary/15 bg-primary/5 hover:bg-primary/5">
                  <TableHead className="w-10" />
                  {tableColumns.map((col, idx) => {
                    if ("kind" in col && col.kind === "action") {
                      return (
                        <TableHead
                          key={`action-head-${idx}`}
                          className={cn(
                            "w-24 text-right text-xs font-semibold tracking-wide text-primary/80",
                            col.className,
                          )}
                        >
                          <span className="flex items-center justify-end gap-1.5">
                            {col.icon &&
                              (() => {
                                const Icon = col.icon;
                                return <Icon className="h-3 w-3" />;
                              })()}
                            {col.header ?? "Actions"}
                          </span>
                        </TableHead>
                      );
                    }

                    const fieldCol = col as FieldColumnDef<TData, keyof TData>;
                    const Icon = fieldCol.icon;
                    return (
                      <TableHead
                        key={String(fieldCol.key)}
                        className={cn(
                          "text-xs font-semibold tracking-wide text-primary/80",
                          fieldCol.className,
                        )}
                      >
                        <span className="flex items-center gap-1.5">
                          {Icon && <Icon className="h-3 w-3 text-primary" />}
                          {fieldCol.header}
                        </span>
                      </TableHead>
                    );
                  })}
                </TableRow>
              </TableHeader>

              <TableBody
                className={cn(isRefetching && "opacity-60 transition-opacity")}
              >
                {isLoading ? (
                  <SkeletonRows columnCount={tableColumns.length + 1} />
                ) : rows.length === 0 ? (
                  <EmptyState
                    columnCount={tableColumns.length + 1}
                    text={emptyText}
                  />
                ) : (
                  rows.map((row, index) => {
                    const rowActionCtx = getActionContext(row, index);
                    const isDetailExpanded =
                      detailIsExpandable &&
                      activeDetail?.row === row &&
                      activeDetail.type === "expandable";
                    const isFormExpanded =
                      formIsExpandable &&
                      activeForm?.row === row &&
                      activeForm.type === "expandable";

                    return (
                      <Fragment key={String(row[rowKey])}>
                        <TableRow
                          className={cn(
                            "group border-l-2 border-l-transparent transition-colors",
                            "hover:border-l-primary hover:bg-primary/4",
                            onRowClick && "cursor-pointer",
                            index % 2 === 1 && "bg-secondary/20",
                          )}
                          onClick={() => onRowClick?.(row, index, rowActionCtx)}
                          tabIndex={onRowClick ? 0 : undefined}
                          role={onRowClick ? "button" : undefined}
                        >
                          <TableCell className="w-10">
                            <div className="flex items-center gap-1">
                              {detailIsExpandable && (
                                <button
                                  type="button"
                                  aria-label="Toggle details"
                                  className="rounded p-1 text-muted-foreground transition-colors hover:bg-primary/10 hover:text-primary"
                                  onClick={(event) => {
                                    event.stopPropagation();
                                    rowActionCtx.openDetail("expandable");
                                  }}
                                >
                                  <ChevronRight
                                    className={cn(
                                      "h-4 w-4 transition-transform duration-300",
                                      isDetailExpanded && "rotate-90",
                                    )}
                                  />
                                </button>
                              )}
                              <RowIndexBadge index={index} />
                            </div>
                          </TableCell>
                          {tableColumns.map((col, colIdx) => {
                            if ("kind" in col && col.kind === "action") {
                              return (
                                <TableCell
                                  key={`action-cell-${colIdx}`}
                                  className={cn(
                                    "w-24 text-right",
                                    col.className,
                                  )}
                                  onClick={(event) => event.stopPropagation()}
                                >
                                  <div className="flex justify-end">
                                    {col.render(row, index, rowActionCtx)}
                                  </div>
                                </TableCell>
                              );
                            }

                            const fieldCol = col as FieldColumnDef<
                              TData,
                              keyof TData
                            >;
                            const val = row[fieldCol.key];

                            return (
                              <TableCell
                                key={String(fieldCol.key)}
                                className={fieldCol.className}
                              >
                                {fieldCol.render
                                  ? fieldCol.render(val, row, index)
                                  : String(val ?? "")}
                              </TableCell>
                            );
                          })}
                        </TableRow>

                        {/* Expandable Detail Row */}
                        {detailIsExpandable && detail && (
                          <TableRow key={`${String(row[rowKey])}-detail`}>
                            <TableCell colSpan={tableColumns.length + 1}>
                              <div
                                className={cn(
                                  "grid transition-[grid-template-rows] duration-300 ease-out",
                                  isDetailExpanded
                                    ? "grid-rows-[1fr]"
                                    : "grid-rows-[0fr]",
                                )}
                              >
                                <div className="min-h-0 overflow-hidden">
                                  <div className="border-t border-border/60 py-3">
                                    {detail.component?.({ row, index })}
                                  </div>
                                </div>
                              </div>
                            </TableCell>
                          </TableRow>
                        )}

                        {/* Expandable Form Row */}
                        {formIsExpandable && form && (
                          <TableRow key={`${String(row[rowKey])}-form`}>
                            <TableCell colSpan={tableColumns.length + 1}>
                              <div
                                className={cn(
                                  "grid transition-[grid-template-rows] duration-300 ease-out",
                                  isFormExpanded
                                    ? "grid-rows-[1fr]"
                                    : "grid-rows-[0fr]",
                                )}
                              >
                                <div className="min-h-0 overflow-hidden">
                                  <div className="border-t border-border/60 py-3">
                                    {form.component({
                                      row: activeForm?.row,
                                      index: activeForm?.index,
                                      mode: activeForm?.kind ?? "edit",
                                      close: () => setActiveForm(null),
                                    })}
                                  </div>
                                </div>
                              </div>
                            </TableCell>
                          </TableRow>
                        )}
                      </Fragment>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      ) : isLoading ? (
        variant === "card" ? (
          <CardSkeleton />
        ) : (
          <ListRowSkeleton />
        )
      ) : rows.length === 0 ? (
        <DataEmptyState text={emptyText} />
      ) : (
        <div
          className={cn(
            "transition-opacity",
            variant === "card"
              ? "grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
              : "flex flex-col gap-3",
            isRefetching && "opacity-60",
          )}
        >
          {rows.map((row, index) => {
            const rowActionCtx = getActionContext(row, index);
            const isDetailExpanded =
              detailIsExpandable &&
              activeDetail?.row === row &&
              activeDetail.type === "expandable";
            const isFormExpanded =
              formIsExpandable &&
              activeForm?.row === row &&
              activeForm.type === "expandable";

            return (
              <div
                key={String(row[rowKey])}
                className={cn(
                  "flex flex-col",
                  variant === "card" && (detailIsExpandable || formIsExpandable)
                    ? "col-span-full sm:col-span-1"
                    : "",
                )}
              >
                <div
                  className={cn(
                    "flex items-start gap-2",
                    onRowClick && "cursor-pointer",
                  )}
                  onClick={() => onRowClick?.(row, index, rowActionCtx)}
                  tabIndex={onRowClick ? 0 : undefined}
                  role={onRowClick ? "button" : undefined}
                >
                  {detailIsExpandable && (
                    <button
                      type="button"
                      aria-label="Toggle details"
                      className="mt-4 shrink-0 rounded p-1 text-muted-foreground transition-colors hover:bg-primary/10 hover:text-primary"
                      onClick={(event) => {
                        event.stopPropagation();
                        rowActionCtx.openDetail("expandable");
                      }}
                    >
                      <ChevronRight
                        className={cn(
                          "h-4 w-4 transition-transform duration-300",
                          isDetailExpanded && "rotate-90",
                        )}
                      />
                    </button>
                  )}
                  <div className="min-w-0 flex-1">
                    {renderPresetItem(row, index)}
                  </div>
                </div>

                {/* Card Expandable Detail */}
                {detailIsExpandable && detail && (
                  <div
                    className={cn(
                      "grid transition-[grid-template-rows] duration-300 ease-out w-full",
                      isDetailExpanded ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
                    )}
                  >
                    <div className="min-h-0 overflow-hidden">
                      <div className="border-t border-border/60 pt-3 pb-2 mt-2 px-1">
                        {detail.component?.({ row, index })}
                      </div>
                    </div>
                  </div>
                )}

                {/* Card Expandable Form */}
                {formIsExpandable && form && (
                  <div
                    className={cn(
                      "grid transition-[grid-template-rows] duration-300 ease-out w-full",
                      isFormExpanded ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
                    )}
                  >
                    <div className="min-h-0 overflow-hidden">
                      <div className="border-t border-border/60 pt-3 pb-2 mt-2 px-1">
                        {form.component({
                          row: activeForm?.row,
                          index: activeForm?.index,
                          mode: activeForm?.kind ?? "edit",
                          close: () => setActiveForm(null),
                        })}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Footer Nav / Infinite scroll */}
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

      {/* Render Non-Expandable Form (Sidebar / Dialog) */}
      {form &&
        form.type !== "expandable" &&
        activeForm &&
        activeForm.type !== "expandable" &&
        (activeForm.kind === "create" || activeForm.row) &&
        (activeForm.type === "sidebar" ? (
          <Drawer
            swipeDirection="left"
            open
            onOpenChange={(open) => !open && setActiveForm(null)}
          >
            <DrawerContent>
              <DrawerHeader>
                {form.title && <DrawerTitle>{form.title}</DrawerTitle>}
                {form.description && (
                  <DrawerDescription>{form.description}</DrawerDescription>
                )}
              </DrawerHeader>
              <div className="overflow-y-auto p-4">
                {form.component({
                  row: activeForm.row,
                  index: activeForm.index,
                  mode: activeForm.kind,
                  close: () => setActiveForm(null),
                })}
              </div>
            </DrawerContent>
          </Drawer>
        ) : (
          <Dialog open onOpenChange={(open) => !open && setActiveForm(null)}>
            <DialogContent>
              {(form.title || form.description) && (
                <DialogHeader>
                  {form.title && <DialogTitle>{form.title}</DialogTitle>}
                  {form.description && (
                    <DialogDescription>{form.description}</DialogDescription>
                  )}
                </DialogHeader>
              )}
              {form.component({
                row: activeForm.row,
                index: activeForm.index,
                mode: activeForm.kind,
                close: () => setActiveForm(null),
              })}
            </DialogContent>
          </Dialog>
        ))}

      {/* Render Non-Expandable Detail (Sidebar / Dialog) */}
      {detail &&
        detail.type !== "expandable" &&
        activeDetail &&
        activeDetail.type !== "expandable" &&
        (activeDetail.type === "sidebar" ? (
          <Drawer open onOpenChange={(open) => !open && setActiveDetail(null)}>
            <DrawerContent>
              <DrawerHeader>
                {detail.title && <DrawerTitle>{detail.title}</DrawerTitle>}
                {detail.description && (
                  <DrawerDescription>{detail.description}</DrawerDescription>
                )}
              </DrawerHeader>
              <div className="overflow-y-auto p-4">
                {detail.component?.({
                  row: activeDetail.row,
                  index: activeDetail.index,
                })}
              </div>
            </DrawerContent>
          </Drawer>
        ) : (
          <Dialog open onOpenChange={(open) => !open && setActiveDetail(null)}>
            <DialogContent>
              {(detail.title || detail.description) && (
                <DialogHeader>
                  {detail.title && <DialogTitle>{detail.title}</DialogTitle>}
                  {detail.description && (
                    <DialogDescription>{detail.description}</DialogDescription>
                  )}
                </DialogHeader>
              )}
              {detail.component?.({
                row: activeDetail.row,
                index: activeDetail.index,
              })}
            </DialogContent>
          </Dialog>
        ))}

      {/* Dialog Konfirmasi */}
      {activeConfirm &&
        (() => {
          const { itemName: _itemName, ...dialogOptions } =
            activeConfirm.options;
          void _itemName;
          return (
            <ConfirmDialog
              open
              onOpenChange={(open) => !open && setActiveConfirm(null)}
              onContinue={() => {
                activeConfirm.onConfirm();
                setActiveConfirm(null);
              }}
              {...dialogOptions}
            />
          );
        })()}

      {/* Dialog Hapus */}
      {activeDelete && (
        <DeleteConfirmDialog
          open
          onOpenChange={(open) => !open && setActiveDelete(null)}
          onConfirm={() => {
            activeDelete.onDelete();
            setActiveDelete(null);
          }}
          itemName={activeDelete.itemName}
        />
      )}
    </div>
  );
}
