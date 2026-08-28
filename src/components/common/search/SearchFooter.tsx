"use client";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import { ArrowRight, Sparkles } from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { SEARCH_CAPABILITIES } from "./constants/types";

export function StallSearchFooter() {
  const t = useTranslations("common.search.footer");

  return (
    <div className="mt-8 flex w-full flex-col items-center justify-center gap-6">
      {/* Primary CTA Link */}
      <Link
        href="/stalls"
        className="group relative inline-flex items-center gap-2.5 rounded-full border border-primary/20 bg-linear-to-r from-primary/5 via-primary/10 to-primary/5 px-5 py-2.5 text-sm font-semibold text-primary transition-all duration-200 hover:border-primary/40 hover:bg-primary/15 hover:shadow-md hover:shadow-primary/5 active:scale-98"
      >
        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-primary">
          <Sparkles className="h-3.5 w-3.5 animate-pulse text-primary" />
        </div>
        <span>
          {t("cta_text")}{" "}
          <span className="font-bold underline decoration-primary/30 underline-offset-4 group-hover:decoration-primary">
            {t("cta_highlight")}
          </span>
        </span>
        <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
      </Link>

      {/* Container Slider dengan min-w-0 & overflow-hidden agar Embla terukur sempurna */}
      <div className="w-full max-w-5xl min-w-0 overflow-hidden px-2">
        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          plugins={[
            Autoplay({
              delay: 3000,
              stopOnInteraction: false,
              stopOnMouseEnter: true,
            }),
          ]}
          className="w-full"
        >
          <CarouselContent className="-ml-3">
            {SEARCH_CAPABILITIES.map((item) => {
              const Icon = item.icon;
              return (
                <CarouselItem
                  key={item.id}
                  className="pl-3 basis-full sm:basis-1/2 lg:basis-1/3"
                >
                  <div className="group flex h-full items-start gap-3 rounded-2xl border border-border/70 bg-card/80 p-4 shadow-2xs backdrop-blur-xs transition-all duration-200 hover:border-primary/30 hover:bg-card hover:shadow-xs">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors duration-200 group-hover:bg-primary group-hover:text-primary-foreground">
                      <Icon className="h-4.5 w-4.5" />
                    </div>
                    <div className="min-w-0 flex-1 space-y-1 text-left">
                      <h4 className="text-xs font-bold tracking-tight text-foreground">
                        {t(`capabilities.${item.id}.title`)}
                      </h4>
                      <p className="text-[11px] leading-relaxed text-muted-foreground">
                        {t(`capabilities.${item.id}.desc`)}
                      </p>
                    </div>
                  </div>
                </CarouselItem>
              );
            })}
          </CarouselContent>
        </Carousel>
      </div>
    </div>
  );
}
