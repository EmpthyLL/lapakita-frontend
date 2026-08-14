import { Button } from "@/components/ui/button";
import type { OwnerProfileSummary } from "@/lib/data/schema/stall/get_stall_detail";
import { toWhatsAppLink } from "@/lib/utils";
import { MessageCircle, Star } from "lucide-react";
import Image from "next/image";

export function StallOwnerCard({ owner }: { owner: OwnerProfileSummary }) {
  const waLink = toWhatsAppLink(
    owner.contact,
    `Hi ${owner.name}, I'm interested in your stall listing on Lapakita.`,
  );

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-card">
      {/* Patterned banner — soft primary dot grid, purely decorative, fades into the card */}
      <div className="relative h-16 bg-primary/[0.07]">
        <div
          className="absolute inset-0 text-primary/25"
          style={{
            backgroundImage:
              "radial-gradient(currentColor 1.5px, transparent 1.5px)",
            backgroundSize: "16px 16px",
          }}
        />
        <div className="absolute inset-0 bg-linear-to-b from-transparent to-card" />
      </div>

      <div className="-mt-8 px-5 pb-5">
        <div className="relative h-16 w-16 overflow-hidden rounded-full border-4 border-card shadow-sm">
          <Image
            src={owner.avatarUrl}
            alt={owner.name}
            fill
            className="object-cover"
          />
        </div>

        <div className="mt-3">
          <p className="truncate font-semibold text-foreground">{owner.name}</p>
          <div className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground">
            <Star className="h-3 w-3 fill-amber-500 text-amber-500" />
            {owner.rating.toFixed(1)} ({owner.reviewCount} reviews) · Joined{" "}
            {owner.joinedYear}
          </div>
        </div>

        <Button
          asChild
          className="mt-4 w-full bg-[#25D366] text-white hover:bg-[#25D366]/90"
        >
          <a href={waLink} target="_blank" rel="noopener noreferrer">
            <MessageCircle className="mr-1.5 h-4 w-4" />
            Chat on WhatsApp
          </a>
        </Button>
      </div>
    </div>
  );
}
