import { FaqSection } from "@/app/[locale]/(public)/(page)/FaqSection";
import { AboutSummary } from "./AboutSummary";
import { ComparisonSection } from "./ComparisonSection";
import { Hero } from "./Hero";
import { HowItWorks } from "./HowItWorks";
import { EcosystemPillars } from "./Pillars";
import { PricingTeaser } from "./PricingTeaser";
import { TestimonialsCarousel } from "./Testimony";

export default function LandingPage() {
  return (
    <>
      <Hero />
      <EcosystemPillars />
      <HowItWorks />
      <AboutSummary />
      <ComparisonSection />
      <PricingTeaser />
      <TestimonialsCarousel />
      <FaqSection />
    </>
  );
}
