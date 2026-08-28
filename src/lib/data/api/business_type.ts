import api from "@/lib/api";
import { PaginatedResponse } from "@/lib/data/schema/base";
import {
  BusinessType,
  BusinessTypeResponce,
  GetBusinessTypesQuery,
} from "@/lib/data/schema/master/business_type";

export async function getBusinessTypes(
  params: GetBusinessTypesQuery,
): Promise<PaginatedResponse<BusinessType>> {
  const res = await api.get<BusinessTypeResponce>("/business-types", {
    params,
  });
  return res.data;
}
