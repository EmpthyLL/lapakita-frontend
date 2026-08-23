import api from "@/lib/api";
import { RoleAndAll } from "@/types";
import { FAQResponse } from "../schema/public/get_faq";
import { DocType, LegalResponse } from "../schema/public/get_legal";

export async function getFAQs(role_type: RoleAndAll) {
  const res = await api.get<FAQResponse>(`/faqs/${role_type}`);
  return res.data.data;
}
export async function getLegals(doc_type: DocType) {
  const res = await api.get<LegalResponse>(`/legals/${doc_type}`);
  return res.data.data;
}
