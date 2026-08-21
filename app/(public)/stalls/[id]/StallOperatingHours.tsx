import type { SemiPermanentStallDetail } from "@/lib/data/schema/stall/get_stall_detail";
import { Clock } from "lucide-react";

export function StallOperatingHours({
  operatingHours,
  parentComplexName,
}: {
  operatingHours: SemiPermanentStallDetail["operatingHours"];
  parentComplexName: string;
}) {
  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
        <Clock className="h-4 w-4 text-primary" />
        Operating Hours
      </div>
      <p className="mt-1.5 text-sm text-muted-foreground">
        {operatingHours.is24Hours
          ? "Open 24 hours, following the complex's general access."
          : `${operatingHours.openingTime} – ${operatingHours.closingTime}`}
      </p>
      <p className="mt-1 text-xs text-muted-foreground">
        Bound by {parentComplexName}&apos;s shared management schedule.
      </p>
    </div>
  );
}
