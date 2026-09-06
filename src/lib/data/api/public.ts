import api from "@/lib/api";
import { RoleAndAll } from "@/types";
import { FAQResponse } from "../schema/public/get_faq";
import { DocType, LegalResponse } from "../schema/public/get_legal";
import {
  ContactValues,
  SubmitContactResponse,
} from "../schema/public/post_contact";

export async function getFAQs(role_type: RoleAndAll) {
  const res = await api.get<FAQResponse>(`/public/faqs/${role_type}`);
  return res.data.data;
}
export async function getLegals(doc_type: DocType) {
  const res = await api.get<LegalResponse>(`/public/legals/${doc_type}`);
  return res.data.data;
}

export async function submitContactInquiry(payload: ContactValues) {
  const res = await api.post<SubmitContactResponse>("/public/contact", payload);
  return res.data.data;
}
