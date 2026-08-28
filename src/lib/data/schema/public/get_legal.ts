import { ResponseData } from "../base";

export type DocType = "terms" | "privacy" | "cookies";

export interface LegalSubsection {
  title?: string;
  body: string;
}

export interface LegalSection {
  id: string;
  number: string;
  title: string;
  subsections: LegalSubsection[];
}

export interface LegalDocumentData {
  last_updated_at?: string | null;
  data: LegalSection[];
}

export type LegalResponse = ResponseData<LegalDocumentData>;
