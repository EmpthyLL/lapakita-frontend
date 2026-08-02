import Image from "next/image";
import { MapPin, TrendingUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export interface Stall {
  id: string;
  name: string;
  imageUrl: string;
  location: string;
  turnoverForecast: string; // e.g. "+18% projected"
  pricePerMonth: string; // e.g. "Rp 3,500,000"
}

export function StallCard({ stall }: { stall: Stall }) {
  return (
    <a
      href={`/stalls/${stall.id}`}
      className="group block overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-shadow hover:shadow-md"
    >
      <div className="relative h-44 w-full overflow-hidden bg-muted">
        <Image
          src={stall.imageUrl}
          alt={stall.name}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <Badge className="absolute left-3 top-3 gap-1 border-none bg-owner text-owner-foreground">
          <TrendingUp className="h-3 w-3" />
          {stall.turnoverForecast}
        </Badge>
      </div>

      <div className="p-4">
        <h3 className="font-semibold text-foreground">{stall.name}</h3>
        <div className="mt-1 flex items-center gap-1 text-sm text-muted-foreground">
          <MapPin className="h-3.5 w-3.5" />
          {stall.location}
        </div>

        <div className="mt-4 flex items-baseline justify-between border-t border-border pt-3">
          <span className="text-lg font-bold text-primary">
            {stall.pricePerMonth}
          </span>
          <span className="text-xs text-muted-foreground">/ month</span>
        </div>
      </div>
    </a>
  );
}
