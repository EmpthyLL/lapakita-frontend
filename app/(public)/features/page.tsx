import { RoleFilterProvider } from "./RoleContext";
import { FeaturesHero } from "./FeatureHero";
import { LifecycleSection } from "./LifecycleSection";
import { ComparisonSection } from "./ComparisonSection";
import { FeaturesCta } from "./FeatureCTA";
import { Suspense } from "react";
import { FeaturesContent } from "./FeatureContent";

export default function FeaturesPage() {
  return (
    <Suspense fallback={null}>
      <RoleFilterProvider>
        <FeaturesHero />
        <FeaturesContent />
        <LifecycleSection />
        <ComparisonSection />
        <FeaturesCta />
      </RoleFilterProvider>
    </Suspense>
  );
}
