import type { Metadata } from "next";
import { AboutCta } from "./AboutCTA";
import { AboutEcosystem } from "./AboutEcosystem";
import { AboutHero } from "./AboutHero";
import { AboutManifesto } from "./AboutManifesto";
import { AboutPrinciples } from "./AboutPrinciples";
import { AboutTechFoundation } from "./AboutTechFoundation";

export const metadata: Metadata = {
  title: "About Us — Lapakita",
  description:
    "Lapakita is the digital operating system connecting business operators, stall owners, and B2B suppliers in one transparent, data-driven ecosystem.",
};

export default function AboutPage() {
  return (
    <>
      <AboutHero />
      <AboutManifesto />
      <AboutEcosystem />
      <AboutPrinciples />
      <AboutTechFoundation />
      <AboutCta />
    </>
  );
}
