"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Quote } from "lucide-react";

interface Testimonial {
  id: string;
  name: string;
  role: string;
  roleType: "primary" | "owner" | "supplier";
  avatarUrl: string;
  quote: string;
}

const TESTIMONIALS: Testimonial[] = [
  {
    id: "1",
    name: "Rina Kartika",
    role: "Tenant — Kios Nasi Goreng Bu Sari",
    roleType: "primary",
    avatarUrl:
      "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=256&auto=format&fit=crop",
    quote:
      "Lapakita bantu aku nemuin lokasi kios dengan proyeksi turnover yang jelas. Sebulan pertama langsung balik modal sewa.",
  },
  {
    id: "2",
    name: "Bapak Hasan",
    role: "Stall Owner — Pasar Minggu",
    roleType: "owner",
    avatarUrl:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=256&auto=format&fit=crop",
    quote:
      "Dulu susah screening penyewa dan nagih sewa. Sekarang semua otomatis lewat dashboard, occupancy naik 30% dalam 3 bulan.",
  },
  {
    id: "3",
    name: "CV Sumber Rejeki",
    role: "Supplier — Distributor Sembako",
    roleType: "supplier",
    avatarUrl:
      "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=256&auto=format&fit=crop",
    quote:
      "Fitur demand forecasting-nya akurat. Kami bisa atur stok lebih efisien karena tahu kios mana yang lagi butuh restock.",
  },
  {
    id: "4",
    name: "Siti Nurhaliza",
    role: "Tenant — Lapak Fashion Kemeja",
    roleType: "primary",
    avatarUrl:
      "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=256&auto=format&fit=crop",
    quote:
      "POS bawaan-nya gampang dipakai, laporan penjualan harian langsung kelihatan tanpa perlu aplikasi tambahan lagi.",
  },
  {
    id: "5",
    name: "Bu Dewi",
    role: "Stall Owner — Tanah Abang",
    roleType: "owner",
    avatarUrl:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=256&auto=format&fit=crop",
    quote:
      "Laporan performa okupansi bulanan sangat membantu saat evaluasi harga sewa untuk periode berikutnya.",
  },
];

function RoleDot({ roleType }: { roleType: Testimonial["roleType"] }) {
  return (
    <span
      className="h-2 w-2 rounded-full shrink-0"
      style={{ backgroundColor: `var(--${roleType})` }}
    />
  );
}

export function TestimonialsCarousel() {
  return (
    <section className="bg-secondary/40 py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-sm font-semibold uppercase tracking-wider text-primary">
            Testimonials
          </span>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Trusted Across the Ecosystem
          </h2>
          <p className="mt-4 text-muted-foreground">
            Hear from tenants, stall owners, and suppliers already growing with
            Lapakita.
          </p>
        </div>

        <Carousel
          opts={{ align: "start", loop: true }}
          className="mx-auto mt-14 w-full max-w-6xl"
        >
          <CarouselContent className="-ml-4">
            {TESTIMONIALS.map((t) => (
              <CarouselItem
                key={t.id}
                className="basis-full pl-4 sm:basis-1/2 lg:basis-1/3"
              >
                <div className="flex h-full flex-col rounded-2xl border border-border bg-card p-6 shadow-sm">
                  <Quote className="h-6 w-6 text-primary/30" />

                  <p className="mt-4 flex-1 text-sm leading-relaxed text-foreground/90">
                    &ldquo;{t.quote}&rdquo;
                  </p>

                  <div className="mt-4 flex items-center gap-3 border-t border-border pt-4">
                    <Avatar className="h-10 w-10 shrink-0">
                      <AvatarImage
                        src={t.avatarUrl}
                        alt={t.name}
                        className="object-cover"
                      />
                      <AvatarFallback className="bg-primary-secondary text-primary font-medium">
                        {t.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .slice(0, 2)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-foreground">
                        {t.name}
                      </p>
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <RoleDot roleType={t.roleType} />
                        <span className="truncate">{t.role}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>

          <div className="mt-8 flex items-center justify-center gap-3">
            <CarouselPrevious className="static translate-y-0" />
            <CarouselNext className="static translate-y-0" />
          </div>
        </Carousel>
      </div>
    </section>
  );
}
