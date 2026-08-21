import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { LegalDocumentView } from "../LegalDocument";
import { getLegalDocument } from "@/lib/data/api/public";
import { SlugKey } from "@/lib/data/schema/public/get_legal";

type Props = {
  params: Promise<{
    slug: SlugKey;
  }>;
};

const metadataMap = {
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
} as const;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;

  const metadata = metadataMap[slug as keyof typeof metadataMap];

  if (!metadata) {
    return {
      title: "Not Found",
    };
  }

  return metadata;
}

export default async function LegalPage({ params }: Props) {
  const { slug } = await params;

  const document = getLegalDocument(slug);

  if (!document) {
    notFound();
  }

  return <LegalDocumentView document={document} />;
}
