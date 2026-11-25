import api from "@/lib/api";
import {
  AddBusinessFrontValues,
  BusinessFrontResponse,
  GetBusinessFrontsQueryParams,
  GetBusinessFrontsResponse,
  UpdateBusinessFrontValues,
} from "../schema/business/business_front";
import { CreateBusinessValues } from "../schema/business/create_business";
import {
  GetBusinessListResponse,
  ListBusinessQueryParams,
} from "../schema/business/list_business";
import { UpdateBusinessValues } from "../schema/business/update_business";

// --- Business ---

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

// --- Business Fronts ---

export async function getBusinessFronts(
  businessId: string,
  params?: GetBusinessFrontsQueryParams,
): Promise<GetBusinessFrontsResponse> {
  const response = await api.get<GetBusinessFrontsResponse>(
    `/businesses/front/${businessId}`,
    { params },
  );
  return response.data;
}

export async function addBusinessFront(
  businessId: string,
  payload: AddBusinessFrontValues,
): Promise<BusinessFrontResponse> {
  const normalizedPayload: AddBusinessFrontValues = {
    ...payload,
    store_url: payload.store_url?.trim() ? payload.store_url.trim() : null,
  };
  const response = await api.post<BusinessFrontResponse>(
    `/businesses/front/${businessId}`,
    normalizedPayload,
  );
  return response.data;
}

export async function updateBusinessFront(
  frontId: string,
  payload: UpdateBusinessFrontValues,
): Promise<BusinessFrontResponse> {
  const normalizedPayload: UpdateBusinessFrontValues = {
    ...payload,
    ...(payload.store_url !== undefined
      ? {
          store_url: payload.store_url?.trim()
            ? payload.store_url.trim()
            : null,
        }
      : {}),
  };
  const response = await api.patch<BusinessFrontResponse>(
    `/businesses/front/${frontId}`,
    normalizedPayload,
  );
  return response.data;
}

export async function deleteBusinessFront(frontId: string): Promise<void> {
  await api.delete(`/businesses/front/${frontId}`);
}
