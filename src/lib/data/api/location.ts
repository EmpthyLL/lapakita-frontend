import api from "@/lib/api";
import {
  ClearAreaHistoryResponse,
  DeleteHistoryItemResponse,
  GetAreaHistoryResponse,
  SaveAreaHistoryPayload,
  SaveAreaHistoryResponse,
} from "@/lib/data/schema/master/area_history";
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

// ── Location History APIs ───────────────────────────────────────────────────

export async function getAreaHistory(): Promise<GetAreaHistoryResponse> {
  const res = await api.get<GetAreaHistoryResponse>("/areas/history");
  console.log(res);
  return res.data;
}

export async function saveAreaHistory(
  payload: SaveAreaHistoryPayload,
): Promise<SaveAreaHistoryResponse> {
  const res = await api.post<SaveAreaHistoryResponse>(
    "/areas/history",
    payload,
  );
  return res.data;
}

export async function clearAreaHistory(): Promise<ClearAreaHistoryResponse> {
  const res = await api.delete<ClearAreaHistoryResponse>("/areas/history");
  return res.data;
}

export async function deleteAreaHistoryItem(
  fullLabel: string,
): Promise<DeleteHistoryItemResponse> {
  const res = await api.delete<DeleteHistoryItemResponse>(
    "/areas/history/item",
    {
      data: { full_label: fullLabel },
    },
  );
  return res.data;
}
