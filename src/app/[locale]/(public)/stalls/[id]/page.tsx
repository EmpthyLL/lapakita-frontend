"use client";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { getStallById } from "@/lib/data/api/stall";
import { StallDetail } from "@/lib/data/schema/stall/get_stall_detail";
import { useQuery } from "@tanstack/react-query";
import { AlertCircle, ArrowLeft, RefreshCw } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { SimilarStalls } from "./SimilarStall";
import { StallDetailTopBar } from "./StallDetailTopBar";
import { StallEventMeta } from "./StallEventMeta";
import { StallFacilities } from "./StallFacility";
import { StallGallery } from "./StallGallery";
import { StallHeader } from "./StallHeader";
import { StallLandmarks } from "./StallLandmark";
import { StallLeaseRules } from "./StallLeaseRules";
import { StallMap } from "./StallMap";
import { StallOperatingHours } from "./StallOperatingHours";
import { StallOwnerCard } from "./StallOwnerCard";
import { StallPricingCard } from "./StallPricingCard";
import { StallReviewsSection } from "./review/StallReviewsSection";

function StallDetailSkeleton() {
  return (
    <div className="bg-background">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="mb-5 flex items-center justify-between">
          <Skeleton className="h-9 w-24 rounded-lg" />
          <Skeleton className="h-9 w-9 rounded-full" />
        </div>

        <Skeleton className="aspect-video w-full rounded-2xl sm:aspect-[2.2/1]" />

        <div className="mt-8 grid grid-cols-1 gap-10 lg:grid-cols-[1fr_360px]">
          <div className="space-y-8">
            <div className="space-y-4">
              <Skeleton className="h-7 w-3/4 max-w-lg" />
              <Skeleton className="h-4 w-1/2 max-w-sm" />
              <div className="flex gap-2">
                <Skeleton className="h-6 w-20 rounded-full" />
                <Skeleton className="h-6 w-24 rounded-full" />
              </div>
            </div>
            <Separator />
            <div className="space-y-3">
              <Skeleton className="h-6 w-40" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-11/12" />
              <Skeleton className="h-4 w-2/3" />
            </div>
            <Separator />
            <div className="grid gap-3 sm:grid-cols-2">
              <Skeleton className="h-20 rounded-xl" />
              <Skeleton className="h-20 rounded-xl" />
            </div>
          </div>
          <Skeleton className="h-80 rounded-2xl" />
        </div>
      </div>
    </div>
  );
}

export default function StallDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const {
    data: stall,
    isLoading,
    error,
    refetch,
  } = useQuery<StallDetail>({
    queryKey: ["stall-detail", id],
    queryFn: () => getStallById(id),
    enabled: Boolean(id),
  });

  if (isLoading) {
    return <StallDetailSkeleton />;
  }

  if (error || !stall) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center px-4 py-12">
        <div className="flex w-full max-w-md flex-col items-center rounded-2xl border border-border bg-card px-6 py-10 text-center shadow-sm sm:px-10">
          <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-destructive/10 text-destructive">
            <AlertCircle className="h-7 w-7" />
          </div>
          <h2 className="text-xl font-bold text-foreground">
            Unable to load stall details
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            This stall may no longer be available, or there was a problem
            connecting to the server.
          </p>
          <div className="mt-6 flex w-full flex-col gap-2 sm:flex-row sm:justify-center">
            <Button type="button" onClick={() => refetch()} className="gap-2">
              <RefreshCw className="h-4 w-4" />
              Try again
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
              className="gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to stalls
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-background">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <StallDetailTopBar title={stall.title} />

        <StallGallery media={stall.media} title={stall.title} />

        <div className="mt-8 grid grid-cols-1 gap-10 lg:grid-cols-[1fr_360px]">
          <div className="min-w-0 space-y-8">
            <StallHeader stall={stall} />

            {stall.permanenceType === "temporary" && (
              <StallEventMeta eventMeta={stall.eventMeta} />
            )}

            {stall.permanenceType === "semi-permanent" && (
              <StallOperatingHours
                operatingHours={stall.operatingHours}
                parentComplexName={stall.parentComplexName}
              />
            )}

            <Separator />

            <div>
              <h2 className="text-lg font-semibold text-foreground">
                About This Stall
              </h2>
              <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-muted-foreground">
                {stall.description}
              </p>
            </div>

            <Separator />

            <StallFacilities facilityValues={stall.facilityValues} />

            <Separator />

            <StallLeaseRules stall={stall} />

            <Separator />

            <StallLandmarks landmarks={stall.nearbyLandmarks} />

            <Separator />

            <StallMap address={stall.address} />

            <Separator />

            <div>
              <h2 className="mb-4 text-lg font-semibold text-foreground">
                Listed By
              </h2>
              <StallOwnerCard owner={stall.owner} />
            </div>

            <Separator />

            <StallReviewsSection stallId={stall.id} />
          </div>

          <div>
            <StallPricingCard pricing={stall.pricing} />
          </div>
        </div>
      </div>

      <SimilarStalls currentStallId={stall.id} />
    </div>
  );
}
