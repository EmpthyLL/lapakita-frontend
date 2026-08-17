import { Button } from "@/components/ui/button";
import type { OwnerProfileSummary } from "@/lib/data/schema/stall/get_stall_detail";
import { toWhatsAppLink } from "@/lib/utils";
import { CheckCircle2, MessageCircle, ShieldCheck, Star } from "lucide-react";
import Image from "next/image";

export function StallOwnerCard({ owner }: { owner: OwnerProfileSummary }) {
  const waLink = toWhatsAppLink(
    owner.contact,
    `Hi ${owner.name}, I'm interested in your stall listing on Lapakita.`,
  );

  return (
    <div className="overflow-hidden rounded-2xl border border-owner/20 bg-card shadow-xs transition-colors hover:border-owner/30">
      {/* Owner Patterned Banner dengan Tint Warna Owner */}
      <div className="relative h-20 bg-linear-to-b from-owner/15 via-owner/5 to-transparent">
        <div
          className="absolute inset-0 text-owner/20"
          style={{
            backgroundImage:
              "radial-gradient(currentColor 1.5px, transparent 1.5px)",
            backgroundSize: "14px 14px",
          }}
        />

        {/* Badge Verified Owner di Pojok Kanan Banner */}
        <div className="absolute right-3 top-3 flex items-center gap-1.5 rounded-full border border-owner/30 bg-background/80 px-2.5 py-1 text-[10px] font-semibold text-owner backdrop-blur-xs">
          <ShieldCheck className="h-3 w-3" />
          <span>Verified Owner</span>
        </div>
      </div>

      <div className="-mt-10 px-5 pb-5">
        {/* Avatar Profil dengan Border Ring Warna Owner */}
        <div className="relative flex items-end justify-between">
          <div className="relative h-18 w-18 overflow-hidden rounded-full border-4 border-card bg-muted shadow-sm ring-2 ring-owner/40">
            <Image
              src={owner.avatarUrl}
              alt={owner.name}
              fill
              className="object-cover"
            />
          </div>
        </div>

        {/* Informasi Owner */}
        <div className="mt-3">
          <div className="flex items-center gap-1.5">
            <p className="truncate font-bold text-foreground text-base">
              {owner.name}
            </p>
            <CheckCircle2 className="h-4 w-4 shrink-0 text-owner fill-owner/20" />
          </div>

          {/* Metrics & Ratings */}
          <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
            <div className="flex items-center gap-1 font-medium text-foreground">
              <Star className="h-3.5 w-3.5 fill-amber-500 text-amber-500" />
              <span>{owner.rating.toFixed(1)}</span>
            </div>
            <span>•</span>
            <span>{owner.reviewCount} reviews</span>
            <span>•</span>
            <span className="text-muted-foreground/80">
              Joined {owner.joinedYear}
            </span>
          </div>
        </div>

        {/* Tombol Kontak Utama (Menggunakan variant="owner" dari button component) */}
        <Button asChild className="mt-4 w-full" variant="owner">
          <a href={waLink} target="_blank" rel="noopener noreferrer">
            <MessageCircle className="mr-1.5 h-4 w-4" />
            Chat with Owner
          </a>
        </Button>
      </div>
    </div>
  );
}
