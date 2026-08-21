import { Separator } from "@/components/ui/separator";
import { getMockStallDetail } from "@/lib/data/api/stall";
import type { Metadata } from "next";
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

export const metadata: Metadata = {
  title: "Stall Detail — Lapakita",
};

export default function StallDetailPage() {
  const stall = getMockStallDetail();

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
