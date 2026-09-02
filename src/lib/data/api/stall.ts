import api from "@/lib/api";
import { PaginatedResponse } from "../schema/base";
import { Stall, StallSearchSchemaType } from "../schema/stall/get_stall";
import { StallDetail } from "../schema/stall/get_stall_detail";

export async function getStalls(
  params: Partial<StallSearchSchemaType>,
): Promise<PaginatedResponse<Stall>> {
  const response = await api.get<PaginatedResponse<Stall>>("/stalls", {
    params,
  });
  return response.data;
}

export async function getStallById(id: string): Promise<StallDetail> {
  const response = await api.get<{
    status: boolean;
    message: string;
    data: StallDetail;
  }>(`/stalls/${id}`);
  return response.data.data;
}
