import { FaqSection } from "@/app/(public)/(page)/FaqSection";
import { Hero } from "./Hero";
import { EcosystemPillars } from "./Pillars";
import { TestimonialsCarousel } from "./Testimony";

export default function LandingPage() {
  return (
    <>
      <Hero />
      <EcosystemPillars />
      <TestimonialsCarousel />
      <FaqSection />
    </>
  );
}
