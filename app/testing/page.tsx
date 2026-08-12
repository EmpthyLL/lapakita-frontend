"use client";

import { DatePicker } from "@/components/common/input/DatePicker";
import { DateRangePicker } from "@/components/common/input/DateRangePicker";
import {
  ColumnDef,
  ManualTable,
  ManualTableQuery,
} from "@/components/common/ManualTable";
import { PaginatedResponse } from "@/lib/data/schema/base";
import { useState } from "react";
import { DateRange } from "react-day-picker";

// ─── 1. Dummy Data & API Mock untuk ManualTable ───────────────────────────────

interface UserDummy {
  id: string;
  name: string;
  role: string;
  createdAt: Date;
  status: "active" | "inactive";
}

const MOCK_USERS: UserDummy[] = Array.from({ length: 45 }, (_, i) => ({
  id: `usr-${i + 1}`,
  name: `User ${i + 1}`,
  role: i % 3 === 0 ? "Owner" : i % 3 === 1 ? "Supplier" : "Tenant",
  createdAt: new Date(2026, 0, (i % 28) + 1),
  status: i % 2 === 0 ? "active" : "inactive",
}));

interface UserQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  role?: string;
  status?: string;
  createdAt?: Date;
}

// Simulated API Call
const fetchUsersApi = async (
  params: UserQueryParams,
): Promise<PaginatedResponse<UserDummy>> => {
  await new Promise((resolve) => setTimeout(resolve, 600));

  let filtered = [...MOCK_USERS];

  if (params.role) {
    filtered = filtered.filter(
      (u) => u.role.toLowerCase() === String(params.role).toLowerCase(),
    );
  }

  if (params.status) {
    filtered = filtered.filter((u) => u.status === params.status);
  }

  const limit = params.limit ?? 10;
  const page = params.page ?? 1;
  const totalPages = Math.ceil(filtered.length / limit) || 0;
  const start = (page - 1) * limit;
  const paginated = filtered.slice(start, start + limit);

  return {
    status: true,
    message: "Users fetched successfully",
    data: paginated,
    meta: {
      currentPage: page,
      perPage: limit,
      totalItems: filtered.length,
      totalPages,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
    },
  };
};

// Config Table Column
const columns: ColumnDef<UserDummy>[] = [
  { key: "id", header: "ID", className: "w-24 font-mono text-xs" },
  { key: "name", header: "Name", className: "font-semibold" },
  { key: "role", header: "Role" },
  {
    key: "status",
    header: "Status",
    render: (val) => (
      <span
        className={`inline-flex rounded-full px-2 py-0.5 text-xs font-semibold ${
          val === "active"
            ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
            : "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400"
        }`}
      >
        {String(val)}
      </span>
    ),
  },
  {
    key: "createdAt",
    header: "Created At",
    render: (val) =>
      val instanceof Date ? val.toLocaleDateString("id-ID") : "-",
  },
];

// Config Table Query & Filters
const tableQueryConfig: ManualTableQuery<UserDummy, UserQueryParams> = {
  queryFn: fetchUsersApi,
  queryKey: (params) => ["test-users", params],
  defaultParams: { page: 1 },
  filterOptions: [
    {
      id: "role",
      title: "Role",
      type: "select",
      options: [
        { label: "Owner", value: "Owner" },
        { label: "Supplier", value: "Supplier" },
        { label: "Tenant", value: "Tenant" },
      ],
    },
    {
      id: "status",
      title: "Status",
      type: "select",
      options: [
        { label: "Active", value: "active" },
        { label: "Inactive", value: "inactive" },
      ],
    },
    {
      id: "createdAt",
      title: "Created Date",
      type: "date",
    },
  ],
  filterToParamKey: {
    role: "role",
    status: "status",
    createdAt: "createdAt",
  },
};

// ─── 2. Halaman Utama Testing ──────────────────────────────────────────────────

export default function ComponentTestingPage() {
  // State DatePicker Standar
  const [singleDate, setSingleDate] = useState<Date | null | undefined>(
    new Date(),
  );

  // State DateRangePicker
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: new Date(2026, 7, 1),
    to: new Date(2026, 7, 12),
  });

  return (
    <div className="container mx-auto max-w-5xl space-y-10 p-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Component Sandbox</h1>
        <p className="text-sm text-muted-foreground">
          Pengujian integrasi DatePicker, DateRangePicker, dan ManualTable.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* Testing 1: DatePicker */}
        <section className="space-y-3 rounded-xl border border-border p-5 bg-card">
          <h2 className="text-base font-semibold">1. Single DatePicker</h2>
          <div className="max-w-xs space-y-2">
            <DatePicker
              value={singleDate}
              onChange={(date) => setSingleDate(date)}
              placeholder="Pilih tanggal..."
            />
            <p className="text-xs text-muted-foreground">
              Selected:{" "}
              <span className="font-mono text-foreground">
                {singleDate ? singleDate.toISOString().split("T")[0] : "null"}
              </span>
            </p>
          </div>
        </section>

        {/* Testing 2: DateRangePicker */}
        <section className="space-y-3 rounded-xl border border-border p-5 bg-card">
          <h2 className="text-base font-semibold">2. DateRangePicker</h2>
          <div className="space-y-2">
            <DateRangePicker
              value={dateRange}
              onUpdate={(range) => setDateRange(range)}
            />
            <p className="text-xs text-muted-foreground">
              Range:{" "}
              <span className="font-mono text-foreground">
                {dateRange?.from
                  ? dateRange.from.toISOString().split("T")[0]
                  : "null"}{" "}
                -{" "}
                {dateRange?.to
                  ? dateRange.to.toISOString().split("T")[0]
                  : "null"}
              </span>
            </p>
          </div>
        </section>
      </div>

      {/* Testing 3: ManualTable */}
      <section className="space-y-4 rounded-xl border border-border p-5 bg-card">
        <h2 className="text-base font-semibold">
          3. ManualTable dengan Infinite Scroll & Filter
        </h2>
        <ManualTable
          columns={columns}
          query={tableQueryConfig}
          rowKey="id"
          showFilter
          showCount
        />
      </section>
    </div>
  );
}
