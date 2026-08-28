import { ResponseData } from "../base";

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

export interface FAQSubTopic {
  title: string;
  items: FAQItem[];
}

export interface FAQData {
  id: string;
  subTopics: FAQSubTopic[];
  last_updated_at?: string | null;
}

export type FAQResponse = ResponseData<FAQData[]>;
