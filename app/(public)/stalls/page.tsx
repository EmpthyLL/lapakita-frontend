import StallSearch from "@/components/common/search/StallSearch";
import { BasePaginationQuery, PaginatedResponse } from "@/lib/data/schema/base";
import { MOCK_STALL_LIST, Stall } from "@/lib/data/schema/stall/get_stall";
import { LayoutGrid } from "lucide-react";
import { StallInfiniteList } from "./StallInfiniteList";
import { StallResultsToolbar } from "./StallResultsToolbar";

// Mock Query Function (Ganti ini dengan API call backend kamu nantinya)
async function fetchStallsApi(
  params: BasePaginationQuery,
): Promise<PaginatedResponse<Stall>> {
  // Simulasi latency jaringan
  await new Promise((resolve) => setTimeout(resolve, 800));

  const page = params.page ?? 1;
  const limit = params.limit ?? 10;
  const start = (page - 1) * limit;
  const paginated = MOCK_STALL_LIST.slice(start, start + limit);
  const totalPages = Math.ceil(MOCK_STALL_LIST.length / limit);

  return {
    status: true,
    message: "Success",
    data: paginated,
    meta: {
      currentPage: page,
      perPage: limit,
      totalItems: MOCK_STALL_LIST.length,
      totalPages,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
    },
  };
}

export default async function StallsPage() {
  const initialStalls = MOCK_STALL_LIST.slice(0, 10);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:py-10">
      {/* Header */}
      <div className="mb-6">
        <p className="mb-1 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-primary">
          <LayoutGrid className="h-3.5 w-3.5" />
          Stall Directory
        </p>
        <h1 className="text-2xl font-bold text-foreground sm:text-3xl">
          Find Your Stall
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Browse verified stalls, kiosks, and retail spots — filter by location,
          budget, and lease terms to find the one that fits.
        </p>
      </div>

      <StallSearch mode="full">
        <div className="space-y-4">
          <StallResultsToolbar count={MOCK_STALL_LIST.length} />

          {/* Infinite Scroll List */}
          <StallInfiniteList
            queryFn={fetchStallsApi}
            initialData={initialStalls}
          />
        </div>
      </StallSearch>
    </div>
  );
}
