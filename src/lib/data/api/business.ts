import api from "@/lib/api";
import { CreateBusinessValues } from "../schema/business/create_business";
import {
  GetBusinessListResponse,
  ListBusinessQueryParams,
} from "../schema/business/list_business";
import { UpdateBusinessValues } from "../schema/business/update_business";

export async function getBusinesses(
  params?: ListBusinessQueryParams,
): Promise<GetBusinessListResponse> {
  const response = await api.get<GetBusinessListResponse>("/businesses", {
    params,
  });
  return response.data;
}

export async function createBusiness(payload: CreateBusinessValues) {
  const response = await api.post("/businesses", payload);
  return response.data;
}

export async function updateBusiness(
  id: string,
  payload: UpdateBusinessValues,
) {
  const response = await api.put(`/businesses/${id}`, payload);
  return response.data;
}

export async function deleteBusiness(id: string): Promise<void> {
  await api.delete(`/businesses/${id}`);
}
