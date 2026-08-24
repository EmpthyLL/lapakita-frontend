import api from "@/lib/api";
import {
  AreaDetailResponse,
  AreaGeneralResponse,
  GetAreaQuery,
} from "@/lib/data/schema/master/location";

export async function searchGeneralLocations(
  params: GetAreaQuery,
): Promise<AreaGeneralResponse> {
  const res = await api.get<AreaGeneralResponse>("/areas", {
    params,
  });
  console.log(res.data);
  return res.data;
}

export async function searchDetailLocation(
  params: GetAreaQuery,
): Promise<AreaDetailResponse> {
  const res = await api.get<AreaDetailResponse>("/areas/detail", {
    params,
  });
  return res.data;
}
