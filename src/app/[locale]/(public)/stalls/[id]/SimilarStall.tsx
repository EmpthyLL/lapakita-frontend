/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { Spinner } from "@/components/common/Spinner";
import { StallCard } from "@/components/common/StallCard";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";
import { getSimilarStalls } from "@/lib/data/api/stall";
import {
  Stall,
  StallSearchSchemaType,
} from "@/lib/data/schema/stall/get_stall";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";

interface SimilarStallsProps {
  currentStallId: string;
}

export function SimilarStalls({ currentStallId }: SimilarStallsProps) {
  const [api, setApi] = useState<CarouselApi>();

  const { data, isLoading, isFetchingNextPage, hasNextPage, fetchNextPage } =
    useInfiniteQuery({
      queryKey: ["similar-stalls", currentStallId],
      queryFn: async ({ pageParam = 1 }) => {
        const response = await getSimilarStalls(currentStallId, {
          page: pageParam,
          limit: 10,
        } as Partial<StallSearchSchemaType>);
        return response;
      },
      initialPageParam: 1,
      getNextPageParam: (lastPage) => {
        if (
          lastPage.meta &&
          lastPage.meta.currentPage < lastPage.meta.totalPages
        ) {
          return lastPage.meta.currentPage + 1;
        }
        return undefined;
      },
      enabled: Boolean(currentStallId),
    });

  const stalls: Stall[] = data?.pages.flatMap((page) => page.data) ?? [];

  useEffect(() => {
    if (!api) return;

    const onSelect = () => {
      // Jika user scroll mendekati akhir slide (misal tersisa 2 slide lagi), trigger fetchNextPage
      const selectedIndex = api.selectedScrollSnap();
      const totalSlides = api.scrollSnapList().length;

      if (
        selectedIndex >= totalSlides - 2 &&
        hasNextPage &&
        !isFetchingNextPage
      ) {
        fetchNextPage();
      }
    };

    api.on("select", onSelect);
    api.on("reInit", onSelect);

    return () => {
      api.off("select", onSelect);
      api.off("reInit", onSelect);
    };
  }, [api, hasNextPage, isFetchingNextPage]);

  if (!isLoading && stalls.length === 0) return null;

  return (
    <section className="border-t border-border bg-secondary/30 py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="font-heading text-2xl font-bold tracking-tight text-foreground">
              Similar Stalls You Might Like
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              More listings around the same area and price range.
            </p>
          </div>
        </div>

        {isLoading ? (
          <div className="flex h-40 items-center justify-center">
            <Spinner />
          </div>
        ) : (
          <Carousel
            setApi={setApi}
            opts={{
              align: "start",
              loop: false,
            }}
            className="w-full"
          >
            <CarouselContent className="-ml-4">
              {stalls.map((stall) => (
                <CarouselItem
                  key={stall.id}
                  className="pl-4 basis-full sm:basis-1/2 lg:basis-1/4"
                >
                  <StallCard stall={stall} variant="grid" />
                </CarouselItem>
              ))}
              {isFetchingNextPage && (
                <CarouselItem className="pl-4 basis-30 flex items-center justify-center">
                  <Spinner />
                </CarouselItem>
              )}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        )}
      </div>
    </section>
  );
}
