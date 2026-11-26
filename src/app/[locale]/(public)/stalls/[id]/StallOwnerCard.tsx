import { Button } from "@/components/ui/button";
import type { OwnerProfileSummary } from "@/lib/data/schema/stall/get_stall_detail";
import { toWhatsAppLink } from "@/lib/utils";
import { CalendarDays, MessageCircle, Star, Store } from "lucide-react";
import Image from "next/image";

export function StallOwnerCard({ owner }: { owner: OwnerProfileSummary }) {
  const waLink = toWhatsAppLink(
    owner.contact,
    `Hi ${owner.name}, I'm interested in your stall listing on Lapakita.`,
  );

  return (
    <div className="group relative overflow-hidden rounded-3xl border border-owner/25 bg-card shadow-sm shadow-owner/5 transition-all hover:border-owner/40 hover:shadow-lg hover:shadow-owner/10">
      <div className="relative h-28 overflow-hidden bg-linear-to-br from-owner/30 via-owner/15 to-owner/5">
        <div
          className="absolute inset-0 text-owner/25"
          style={{
            backgroundImage:
              "radial-gradient(currentColor 1px, transparent 1px)",
            backgroundSize: "16px 16px",
          }}
        />
        <div className="absolute -right-10 -top-20 size-56 rounded-full border border-owner/15 bg-owner/5" />
        <div className="absolute -right-2 -top-12 size-40 rounded-full border border-owner/20" />
        <div className="absolute inset-x-0 bottom-0 h-12 bg-linear-to-t from-card/35 to-transparent" />

        <div className="absolute left-5 top-4 inline-flex items-center gap-2 rounded-full border border-owner/25 bg-background/75 px-3 py-1.5 text-xs font-semibold tracking-wide text-owner shadow-xs backdrop-blur-sm">
          <Store className="size-3.5" />
          <span>STALL OWNER</span>
        </div>
      </div>

      <div className="relative px-5 pb-5">
        <div className="-mt-11 flex items-end justify-between">
          <div className="relative size-22 overflow-hidden rounded-full border-4 border-card bg-muted shadow-md ring-2 ring-owner/50 transition-transform group-hover:scale-[1.03]">
            <Image
              src={owner.avatarUrl}
              alt={owner.name}
              fill
              className="object-cover"
            />
          </div>
          <div className="mb-1 inline-flex items-center gap-1.5 rounded-full bg-owner-secondary px-2.5 py-1 text-xs font-medium text-owner">
            <CalendarDays className="size-3.5" />
            <span>Since {owner.joinedYear}</span>
          </div>
        </div>

        <div className="mt-4 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div className="min-w-0">
            <p className="text-xs font-medium uppercase tracking-[0.16em] text-owner">
              Your host
            </p>
            <h3 className="mt-1 truncate text-xl font-bold tracking-tight text-foreground">
              {owner.name}
            </h3>
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <div className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/10 px-2.5 py-1 text-sm font-semibold text-amber-700 dark:text-amber-400">
                <Star className="size-4 fill-current" />
                <span>{owner.rating.toFixed(1)}</span>
              </div>
              <span className="text-sm text-muted-foreground">
                {owner.reviewCount} reviews
              </span>
            </div>
          </div>

          <Button
            asChild
            variant="owner"
            className="w-full shrink-0 rounded-xl shadow-sm shadow-owner/15 transition-transform hover:-translate-y-0.5 sm:w-auto"
          >
            <a href={waLink} target="_blank" rel="noopener noreferrer">
              <MessageCircle className="mr-1.5 size-4" />
              Chat with Owner
            </a>
          </Button>
        </div>
      </div>
    </div>
  );
}
