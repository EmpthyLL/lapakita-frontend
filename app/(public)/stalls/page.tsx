import StallSearch from "@/components/common/search/StallSearch";

export default async function StallsPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="mb-6 text-2xl font-bold text-foreground">
        Find Your Stall
      </h1>

      <StallSearch mode="full">
        {/* ini masuk ke kolom kiri, di bawah search bar, sebelah filter */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2"></div>
      </StallSearch>
    </div>
  );
}
