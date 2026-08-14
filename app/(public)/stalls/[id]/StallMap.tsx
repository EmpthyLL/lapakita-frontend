import type { StallDetail } from "@/lib/data/schema/stall/get_stall_detail";
import { ExternalLink } from "lucide-react";

export function StallMap({ address }: { address: StallDetail["address"] }) {
  return (
    <div>
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-foreground">Location</h2>
        <a
          href={address.mapUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 text-sm font-medium text-primary hover:underline"
        >
          Open in Maps
          <ExternalLink className="h-3.5 w-3.5" />
        </a>
      </div>
      <p className="mt-1 text-sm text-muted-foreground">{address.street}</p>

      <div className="mt-4 overflow-hidden rounded-2xl border border-border">
        <iframe
          src={address.embeddedMapUrl}
          className="h-72 w-full"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="Stall location map"
        />
      </div>
    </div>
  );
}
