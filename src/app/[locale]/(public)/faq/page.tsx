import type { Metadata } from "next";
import { Suspense } from "react";
import { FaqPageContent } from "./FaqPageContent";

export const metadata: Metadata = {
  title: "FAQ — Lapakita",
  description:
    "Answers for tenants, stall owners, and suppliers using Lapakita.",
};

export default function FaqPage() {
  return (
    <Suspense fallback={null}>
      <FaqPageContent />
    </Suspense>
  );
}
