import {
  createColumnHelpers,
  DataDisplayQuery,
} from "@/components/common/long/data-display/Constant";
import { PaginatedResponse } from "@/lib/data/schema/base";
import {
  Building,
  Calendar,
  CheckCircle2,
  ShieldCheck,
  User,
} from "lucide-react";
import { useMemo } from "react";

export interface StallItem {
  id: string;
  stallName: string;
  ownerName: string;
  category: string;
  status: "verified" | "pending" | "rejected";
  createdAt: Date;
}

const MOCK_STALLS: StallItem[] = Array.from({ length: 65 }, (_, i) => ({
  id: `stl-${i + 1}`,
  stallName: `Lapak Kuliner #${i + 1}`,
  ownerName: `Mitra ${i + 1}`,
  category: i % 3 === 0 ? "F&B" : i % 3 === 1 ? "Retail" : "Services",
  status: i % 4 === 0 ? "pending" : i % 4 === 3 ? "rejected" : "verified",
  createdAt: new Date(2026, 0, (i % 28) + 1),
}));

export interface StallQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  status?: string;
  createdAt?: Date;
}

export const fetchStallsApi = async (
  params: StallQueryParams,
): Promise<PaginatedResponse<StallItem>> => {
  await new Promise((resolve) => setTimeout(resolve, 400));

  let filtered = [...MOCK_STALLS];

  if (params.search) {
    const query = params.search.toLowerCase();
    filtered = filtered.filter(
      (s) =>
        s.stallName.toLowerCase().includes(query) ||
        s.ownerName.toLowerCase().includes(query),
    );
  }

  if (params.category) {
    filtered = filtered.filter(
      (s) => s.category.toLowerCase() === String(params.category).toLowerCase(),
    );
  }

  if (params.status) {
    filtered = filtered.filter((s) => s.status === params.status);
  }

  const limit = params.limit ?? 10;
  const page = params.page ?? 1;
  const start = (page - 1) * limit;
  const paginated = filtered.slice(start, start + limit);
  const totalPages = Math.ceil(filtered.length / limit);

  return {
    status: true,
    message: "Success",
    data: paginated,
    meta: {
      currentPage: page,
      totalPages,
      totalItems: filtered.length,
      perPage: limit,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
    },
  };
};

export function useStallColumns() {
  const { field } = createColumnHelpers<StallItem>();

  return useMemo(
    () => [
      field({
        key: "stallName",
        header: "Stall Name",
        icon: Building,
        primary: true,
        className: "font-semibold text-foreground",
      }),
      field({
        key: "ownerName",
        header: "Owner",
        icon: User,
      }),
      field({
        key: "category",
        header: "Category",
        render: (val) => (
          <span className="inline-flex items-center rounded-md bg-primary/10 px-2 py-0.5 text-xs font-semibold text-primary">
            {String(val)}
          </span>
        ),
      }),
      field({
        key: "status",
        header: "Status",
        icon: ShieldCheck,
        render: (val) => {
          const status = String(val);
          const isVerified = status === "verified";
          const isPending = status === "pending";

          return (
            <span
              className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${
                isVerified
                  ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                  : isPending
                    ? "bg-amber-500/10 text-amber-600 dark:text-amber-400"
                    : "bg-rose-500/10 text-rose-600 dark:text-rose-400"
              }`}
            >
              <CheckCircle2 className="h-3 w-3" />
              {status}
            </span>
          );
        },
      }),
      field({
        key: "createdAt",
        header: "Registered",
        icon: Calendar,
        hideInPreset: true,
        render: (val) =>
          val instanceof Date ? val.toLocaleDateString("id-ID") : "-",
      }),
    ],
    [field],
  );
}

export const stallQueryConfig: DataDisplayQuery<StallItem, StallQueryParams> = {
  queryFn: fetchStallsApi,
  queryKey: (params) => ["stalls-sandbox-list", params],
  searchKey: "search",
  defaultParams: { page: 1 },
  filterOptions: [
    {
      id: "category",
      title: "Category",
      type: "select",
      options: [
        { label: "F&B", value: "F&B" },
        { label: "Retail", value: "Retail" },
        { label: "Services", value: "Services" },
      ],
    },
    {
      id: "status",
      title: "Status",
      type: "select",
      options: [
        { label: "Verified", value: "verified" },
        { label: "Pending", value: "pending" },
        { label: "Rejected", value: "rejected" },
      ],
    },
    {
      id: "createdAt",
      title: "Registration Date",
      type: "date",
    },
  ],
  filterToParamKey: {
    category: "category",
    status: "status",
    createdAt: "createdAt",
  },
};
