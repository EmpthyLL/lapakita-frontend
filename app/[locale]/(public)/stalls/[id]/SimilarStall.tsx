import { StallCard } from "@/components/common/StallCard";
import { MOCK_STALL_LIST } from "@/lib/data/schema/stall/get_stall";

export function SimilarStalls({ currentStallId }: { currentStallId: string }) {
  const similar = MOCK_STALL_LIST.filter((s) => s.id !== currentStallId).slice(
    0,
    4,
  );

  if (similar.length === 0) return null;

  return (
    <section className="border-t border-border bg-secondary/30 py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 className="font-heading text-2xl font-bold tracking-tight text-foreground">
          Similar Stalls You Might Like
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          More listings around the same area and price range.
        </p>

        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {similar.map((stall) => (
            <StallCard key={stall.id} stall={stall} variant="grid" />
          ))}
        </div>
      </div>
    </section>
  );
}
