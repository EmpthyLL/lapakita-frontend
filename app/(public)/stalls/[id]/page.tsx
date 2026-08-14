import { Separator } from "@/components/ui/separator";
import { MOCK_STALL_DETAIL } from "@/lib/data/schema/stall/get_stall_detail";
import type { Metadata } from "next";
import { SimilarStalls } from "./SimilarStall";
import { StallDetailTopBar } from "./StallDetailTopBar";
import { StallFacilities } from "./StallFacility";
import { StallGallery } from "./StallGallery";
import { StallHeader } from "./StallHeader";
import { StallLandmarks } from "./StallLandmark";
import { StallLeaseRules } from "./StallLeaseRules";
import { StallMap } from "./StallMap";
import { StallOwnerCard } from "./StallOwnerCard";
import { StallPricingCard } from "./StallPricingCard";

export const metadata: Metadata = {
  title: `${MOCK_STALL_DETAIL.title} — Lapakita`,
  description: MOCK_STALL_DETAIL.description.slice(0, 155),
};

export default function StallDetailPage() {
  const stall = MOCK_STALL_DETAIL;

  return (
    <div className="bg-background">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <StallDetailTopBar title={stall.title} />

        <StallGallery media={stall.media} title={stall.title} />

        <div className="mt-8 grid grid-cols-1 gap-10 lg:grid-cols-[1fr_360px]">
          <div className="min-w-0 space-y-8">
            <StallHeader stall={stall} />

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
