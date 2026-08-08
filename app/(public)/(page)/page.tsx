import { FaqSection } from "@/app/(public)/(page)/FaqSection";
import { FeaturedStalls } from "./FeatureStall";
import { Hero } from "./Hero";
import { EcosystemPillars } from "./Pillars";
import { TestimonialsCarousel } from "./Testimony";

export default function LandingPage() {
  return (
    <>
      <Hero />
      <EcosystemPillars />
      <FeaturedStalls />
      <TestimonialsCarousel />
      <FaqSection />
    </>
  );
}
