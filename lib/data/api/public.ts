import { LEGAL_DOCUMENTS, LegalDocument } from "../schema/public/get_legal";

export function getLegalDocument(slug: LegalDocument["slug"]) {
  return LEGAL_DOCUMENTS.find((doc) => doc.slug === slug)!;
}
