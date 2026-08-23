import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";

import { DocType } from "@/lib/data/schema/public/get_legal";
import { LegalDocument } from "../LegalDocument";

type Props = {
  params: Promise<{
    doc_type: string;
  }>;
};

const VALID_DOC_TYPES: DocType[] = ["terms", "privacy", "cookies"];

const metadataMap: Record<DocType, { title: string; description: string }> = {
  terms: {
    title: "Terms and Conditions — Lapakita",
    description:
      "Terms governing your use of Lapakita as a Tenant, Stall Owner, or Supplier.",
  },
  privacy: {
    title: "Privacy Policy — Lapakita",
    description:
      "What data Lapakita collects, how it's used, and the protections in place across all accounts.",
  },
  cookies: {
    title: "Cookies Policy — Lapakita",
    description:
      "How Lapakita uses browser storage — strictly for essential functionality, never for tracking.",
  },
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { doc_type } = await params;

  const metadata = metadataMap[doc_type as DocType];

  if (!metadata) {
    return { title: "Not Found — Lapakita" };
  }

  return metadata;
}

export default async function LegalPage({ params }: Props) {
  const { doc_type } = await params;

  if (!VALID_DOC_TYPES.includes(doc_type as DocType)) {
    notFound();
  }

  return (
    <Suspense fallback={null}>
      <LegalDocument docType={doc_type as DocType} />
    </Suspense>
  );
}
