import { RoleFilterProvider } from "@/components/providers/role_provider";
import { Suspense } from "react";
import { FeaturesContent } from "./FeatureContent";
import { FeaturesCta } from "./FeatureCTA";
import { FeaturesHero } from "./FeatureHero";
import { LifecycleSection } from "./LifecycleSection";

export default function FeaturesPage() {
  return (
    <Suspense fallback={null}>
      <RoleFilterProvider paramKey="role">
        <FeaturesHero />
        <FeaturesContent />
        <LifecycleSection />
        <FeaturesCta />
      </RoleFilterProvider>
    </Suspense>
  );
}
