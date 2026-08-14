import { Badge } from "@/components/ui/badge";
import type { StallDetail } from "@/lib/data/schema/stall/get_stall_detail";
import { MapPin, Maximize2, Star, Zap } from "lucide-react";

export function StallHeader({ stall }: { stall: StallDetail }) {
  return (
    <div>
      <div className="flex flex-wrap items-center gap-2">
        <Badge className="border-none bg-primary-secondary font-medium text-primary">
          {stall.propertyType}
        </Badge>
        <Badge variant="outline" className="capitalize">
          {stall.placement}
        </Badge>
      </div>

      <h1 className="font-heading mt-3 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
        {stall.title}
      </h1>

      <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-muted-foreground">
        <span className="flex items-center gap-1.5">
          <MapPin className="h-4 w-4 text-primary" />
          {stall.address.neighborhood}, {stall.address.city},{" "}
          {stall.address.province}
        </span>
        <span className="flex items-center gap-1.5">
          <Maximize2 className="h-4 w-4" />
          {stall.sizeSqm} m² ({stall.dimensions.lengthMeters}×
          {stall.dimensions.widthMeters}m)
        </span>
        <span className="flex items-center gap-1.5">
          <Zap className="h-4 w-4" />
          {stall.electricityCapacityVA.toLocaleString("id-ID")} VA
        </span>
        <span className="flex items-center gap-1.5 font-semibold text-amber-600">
          <Star className="h-4 w-4 fill-amber-500 text-amber-500" />
          {stall.rating.toFixed(1)}
          <span className="font-normal text-muted-foreground">
            ({stall.reviewCount} reviews)
          </span>
        </span>
      </div>
    </div>
  );
}
