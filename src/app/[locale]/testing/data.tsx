import {
  createColumnHelpers,
  DataDisplayQuery,
} from "@/components/common/long/data-display/Constant";
import { Button } from "@/components/ui/button";
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

// Komponen Detail View untuk Modal / Expandable
export function StallDetailView({ row }: { row: StallItem }) {
  return (
    <div className="space-y-3 py-2 text-sm">
      <div className="grid grid-cols-2 gap-2">
        <span className="text-muted-foreground">ID Lapak:</span>
        <span className="font-medium text-foreground">{row.id}</span>
        <span className="text-muted-foreground">Nama Lapak:</span>
        <span className="font-medium text-foreground">{row.stallName}</span>
        <span className="text-muted-foreground">Pemilik:</span>
        <span className="font-medium text-foreground">{row.ownerName}</span>
        <span className="text-muted-foreground">Kategori:</span>
        <span className="font-medium text-foreground">{row.category}</span>
        <span className="text-muted-foreground">Status:</span>
        <span className="font-medium text-foreground capitalize">
          {row.status}
        </span>
      </div>
    </div>
  );
}

// Tambahkan di dalam file data.ts Anda
export function StallExpandableDetail({ row }: { row: StallItem }) {
  return (
    <div className="rounded-xl border border-border/60 bg-background/60 p-4 space-y-3 my-2 shadow-inner">
      <div className="flex items-center justify-between border-b border-border/40 pb-2">
        <h4 className="text-xs font-semibold uppercase tracking-wider text-primary">
          Informasi Tambahan & Log Aktivitas — {row.stallName}
        </h4>
        <span className="text-[11px] text-muted-foreground font-mono">
          ID: {row.id}
        </span>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
        <div>
          <span className="text-muted-foreground block mb-0.5">
            Pemilik Lapak
          </span>
          <strong className="text-foreground">{row.ownerName}</strong>
        </div>
        <div>
          <span className="text-muted-foreground block mb-0.5">
            Kategori Usaha
          </span>
          <strong className="text-foreground">{row.category}</strong>
        </div>
        <div>
          <span className="text-muted-foreground block mb-0.5">
            Tanggal Registrasi
          </span>
          <strong className="text-foreground">
            {row.createdAt.toLocaleDateString("id-ID")}
          </strong>
        </div>
      </div>
    </div>
  );
}

// Komponen Form untuk Sidebar (Drawer) / Dialog (Create & Edit)
export function StallForm({
  mode,
  row,
  close,
}: {
  mode: "create" | "edit";
  row?: StallItem;
  close: () => void;
}) {
  return (
    <div className="space-y-4 py-2">
      <p className="text-xs text-muted-foreground">
        Mode saat ini:{" "}
        <strong className="text-foreground uppercase">{mode}</strong>{" "}
        {row ? `— Mengubah data: ${row.stallName}` : "— Menambahkan data baru"}
      </p>
      <div className="space-y-2">
        <label className="text-xs font-semibold">Nama Lapak</label>
        <input
          type="text"
          defaultValue={row?.stallName ?? ""}
          placeholder="Masukkan nama lapak..."
          className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm"
        />
      </div>
      <div className="flex justify-end gap-2 pt-4">
        <Button variant="outline" size="sm" onClick={close}>
          Batal
        </Button>
        <Button size="sm" onClick={() => close()}>
          Simpan Perubahan
        </Button>
      </div>
    </div>
  );
}
