import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Stall, StallCard } from "@/components/common/StallCard";

const FEATURED_STALLS: Stall[] = [
  {
    id: "1",
    name: "Kios Nasi Goreng Bu Sari",
    imageUrl:
      "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600&h=400&fit=crop",
    location: "Pasar Minggu, South Jakarta",
    turnoverForecast: "+18% projected",
    pricePerMonth: "Rp 3,500,000",
  },
  {
    id: "2",
    name: "Lapak Fashion Kemeja",
    imageUrl:
      "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=600&h=400&fit=crop",
    location: "Tanah Abang, Central Jakarta",
    turnoverForecast: "+24% projected",
    pricePerMonth: "Rp 5,200,000",
  },
  {
    id: "3",
    name: "Toko Sembako Berkah",
    imageUrl:
      "https://images.unsplash.com/photo-1578916171728-46686eac8d58?w=600&h=400&fit=crop",
    location: "Bekasi Timur, West Java",
    turnoverForecast: "+12% projected",
    pricePerMonth: "Rp 2,800,000",
  },
];

export function FeaturedStalls() {
  return (
    <section className="py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <span className="text-sm font-semibold uppercase tracking-wider text-primary">
              Featured Stalls
            </span>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Ready-to-Rent, Backed by Data
            </h2>
          </div>
          <Link
            href="/stalls"
            className="group inline-flex items-center gap-1 text-sm font-semibold text-primary"
          >
            View All Stalls
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURED_STALLS.map((stall) => (
            <StallCard key={stall.id} stall={stall} />
          ))}
        </div>
      </div>
    </section>
  );
}
