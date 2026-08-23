import api from "@/lib/api";
import { PaginatedResponse } from "@/lib/data/schema/base";
import {
  BusinessType,
  GetBusinessTypesQuery,
  RawBusinessTypeResponse,
  mapRawBusinessType,
} from "@/lib/data/schema/master/business_type";

export async function getBusinessTypes(
  params: GetBusinessTypesQuery,
): Promise<PaginatedResponse<BusinessType>> {
  const res = await api.get<PaginatedResponse<RawBusinessTypeResponse>>(
    "/business-types",
    {
      params,
    },
  );

  return {
    ...res.data,
    data: (res.data.data || []).map(mapRawBusinessType),
  };
}
