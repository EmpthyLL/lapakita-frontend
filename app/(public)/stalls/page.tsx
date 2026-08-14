import StallSearch from "@/components/common/search/StallSearch";
import { StallCard } from "@/components/common/StallCard";
import { MOCK_STALL_LIST } from "@/lib/data/schema/stall/get_stall";
import { LayoutGrid } from "lucide-react";
import { StallResultsToolbar } from "./StallResultsToolbar";

export default async function StallsPage() {
  const stalls = MOCK_STALL_LIST;

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
          <StallResultsToolbar count={stalls.length} />

          {/* List Card Memanjang (1 Kolom Vertikal) */}
          <div className="flex flex-col gap-4">
            {stalls.map((stall) => (
              <StallCard key={stall.id} stall={stall} />
            ))}
          </div>
        </div>
      </StallSearch>
    </div>
  );
}
