"use client";

import {
  ColumnDef,
  DisplayTable,
  DisplayTableQuery,
} from "@/components/common/DisplayTable";
import { DatePicker } from "@/components/common/input/DatePicker";
import { DateRangePicker } from "@/components/common/input/DateRangePicker";
import { Button } from "@/components/ui/button";
import { PaginatedResponse } from "@/lib/data/schema/base";
import { showToast } from "@/lib/toast";
import {
  Building,
  Calendar,
  CheckCircle2,
  ShieldCheck,
  User,
} from "lucide-react";
import { useState } from "react";
import { DateRange } from "react-day-picker";

// ─── 1. Dummy Data & API Mock ───────────────────────────────────────────────

interface StallOwnerDummy {
  id: string;
  stallName: string;
  ownerName: string;
  category: string;
  status: "verified" | "pending" | "rejected";
  createdAt: Date;
}

const MOCK_STALLS: StallOwnerDummy[] = Array.from({ length: 65 }, (_, i) => ({
  id: `stl-${i + 1}`,
  stallName: `Lapak Kuliner #${i + 1}`,
  ownerName: `Mitra ${i + 1}`,
  category: i % 3 === 0 ? "F&B" : i % 3 === 1 ? "Retail" : "Services",
  status: i % 4 === 0 ? "pending" : i % 4 === 3 ? "rejected" : "verified",
  createdAt: new Date(2026, 0, (i % 28) + 1),
}));

interface StallQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  status?: string;
  createdAt?: Date;
}

// Simulated API Call dengan metadata standar PaginatedResponse
const fetchStallsApi = async (
  params: StallQueryParams,
): Promise<PaginatedResponse<StallOwnerDummy>> => {
  await new Promise((resolve) => setTimeout(resolve, 500)); // Latency simulasi

  let filtered = [...MOCK_STALLS];

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
    message: "Data retrieved successfully",
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

// Config Columns
const columns: ColumnDef<StallOwnerDummy>[] = [
  {
    key: "stallName",
    header: "Stall Name",
    icon: Building,
    className: "font-semibold text-foreground",
  },
  {
    key: "ownerName",
    header: "Owner",
    icon: User,
  },
  {
    key: "category",
    header: "Category",
    render: (val) => (
      <span className="inline-flex items-center rounded-md bg-primary/10 px-2 py-0.5 text-xs font-semibold text-primary">
        {String(val)}
      </span>
    ),
  },
  {
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
  },
  {
    key: "createdAt",
    header: "Registered",
    icon: Calendar,
    render: (val) =>
      val instanceof Date ? val.toLocaleDateString("id-ID") : "-",
  },
];

// Query Config & Filters
const displayTableQueryConfig: DisplayTableQuery<
  StallOwnerDummy,
  StallQueryParams
> = {
  queryFn: fetchStallsApi,
  queryKey: (params) => ["stalls-list", params],
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

// ─── 2. Halaman Sandbox Utama ───────────────────────────────────────────────

export default function ComponentSandboxPage() {
  // Single DatePicker State
  const [singleDate, setSingleDate] = useState<Date | null | undefined>(
    new Date(),
  );

  // DateRangePicker State
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: new Date(2026, 7, 1),
    to: new Date(2026, 7, 15),
  });

  return (
    <div className="container mx-auto max-w-6xl space-y-10 p-6">
      {/* Header */}
      <div className="border-b border-border pb-5">
        <h1 className="text-2xl font-bold tracking-tight">Component Sandbox</h1>
        <p className="text-sm text-muted-foreground">
          Pengujian integrasi DatePicker, DateRangePicker, dan DisplayTable (2
          Mode Pagination).
        </p>
      </div>

      {/* Date Pickers Section */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* DatePicker */}
        <section className="space-y-3 rounded-2xl border border-border bg-card p-5 shadow-xs">
          <h2 className="text-base font-semibold text-foreground">
            1. DatePicker (Single Date)
          </h2>
          <div className="max-w-xs space-y-2">
            <DatePicker
              value={singleDate}
              onChange={(date) => setSingleDate(date)}
              placeholder="Pick a date..."
            />
            <p className="text-xs text-muted-foreground">
              Selected Value:{" "}
              <span className="font-mono text-foreground font-medium">
                {singleDate ? singleDate.toISOString().split("T")[0] : "null"}
              </span>
            </p>
          </div>
        </section>

        {/* DateRangePicker */}
        <section className="space-y-3 rounded-2xl border border-border bg-card p-5 shadow-xs">
          <h2 className="text-base font-semibold text-foreground">
            2. DateRangePicker (Range)
          </h2>
          <div className="space-y-2">
            <DateRangePicker
              value={dateRange}
              onUpdate={(range) => setDateRange(range)}
            />
            <p className="text-xs text-muted-foreground">
              Selected Range:{" "}
              <span className="font-mono text-foreground font-medium">
                {dateRange?.from
                  ? dateRange.from.toISOString().split("T")[0]
                  : "null"}{" "}
                —{" "}
                {dateRange?.to
                  ? dateRange.to.toISOString().split("T")[0]
                  : "null"}
              </span>
            </p>
          </div>
        </section>
      </div>

      {/* DisplayTable Mode 1: Load More */}
      <section className="space-y-4 rounded-2xl border border-border bg-card p-6 shadow-xs">
        <div>
          <h2 className="text-lg font-semibold text-foreground">
            3. DisplayTable (Mode:{" "}
            <code className="text-primary font-mono text-sm">load-more</code>)
          </h2>
          <p className="text-xs text-muted-foreground">
            Akumulasi data secara bertahap saat menekan tombol &quot;Load
            more&quot;.
          </p>
        </div>

        <DisplayTable
          columns={columns}
          query={displayTableQueryConfig}
          rowKey="id"
          paginationMode="load-more"
          showFilter
          showCount
        />
      </section>

      {/* DisplayTable Mode 2: Pagination */}
      <section className="space-y-4 rounded-2xl border border-border bg-card p-6 shadow-xs">
        <div>
          <h2 className="text-lg font-semibold text-foreground">
            4. DisplayTable (Mode:{" "}
            <code className="text-primary font-mono text-sm">pagination</code>)
          </h2>
          <p className="text-xs text-muted-foreground">
            Menampilkan halaman per halaman dengan bilah angka halaman dan
            navigasi Previous/Next.
          </p>
        </div>

        <DisplayTable
          columns={columns}
          query={displayTableQueryConfig}
          rowKey="id"
          paginationMode="pagination"
          showFilter
          showCount
        />
      </section>

      <div className="flex flex-wrap gap-3">
        {/* Success */}
        <Button
          variant="outline"
          onClick={() =>
            showToast.success("Lapak berhasil ditambahkan!", {
              description: "Data lapak baru telah tersimpan di sistem.",
            })
          }
        >
          Test Success
        </Button>

        {/* Error */}
        <Button
          variant="outline"
          onClick={() =>
            showToast.error("Gagal menyimpan data", {
              description: "Terjadi kesalahan pada koneksi jaringan server.",
            })
          }
        >
          Test Error
        </Button>

        {/* Info */}
        <Button
          variant="outline"
          onClick={() =>
            showToast.info("Pembaruan Sistem", {
              description:
                "Fitur analytics footfall akan diperbarui malam ini.",
            })
          }
        >
          Test Info
        </Button>

        {/* Warning */}
        <Button
          variant="outline"
          onClick={() =>
            showToast.warning("Masa sewa hampir habis", {
              description: "Sisa masa sewa lapak Anda tinggal 3 hari lagi.",
              action: {
                label: "Perpanjang",
                onClick: () => console.log("Perpanjang diklik"),
              },
            })
          }
        >
          Test Warning
        </Button>
      </div>
    </div>
  );
}
