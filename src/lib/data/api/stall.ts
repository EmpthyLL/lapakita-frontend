import { StallPermanenceType } from "@/components/common/search/constants/types";
import { BasePaginationQuery, PaginatedResponse } from "../schema/base";
import { MOCK_STALL_LIST, Stall } from "../schema/stall/get_stall";
import {
  MOCK_STALL_DETAILS,
  StallDetail,
} from "../schema/stall/get_stall_detail";

export async function getStalls(
  params: BasePaginationQuery,
): Promise<PaginatedResponse<Stall>> {
  const page = params.page ?? 1;
  const limit = params.limit ?? 6;

  await new Promise((resolve) => setTimeout(resolve, 500));

  const start = (page - 1) * limit;
  const pageItems = MOCK_STALL_LIST.slice(start, start + limit);
  const totalItems = MOCK_STALL_LIST.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / limit));

  return {
    status: true,
    message: "OK",
    data: pageItems,
    meta: {
      currentPage: page,
      perPage: limit,
      totalItems,
      totalPages,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
    },
  };
}

const PERMANENCE_TYPES: StallPermanenceType[] = [
  "permanent",
  "semi-permanent",
  "temporary",
];

export function getMockStallDetail(type?: StallPermanenceType): StallDetail {
  const resolvedType =
    type ??
    PERMANENCE_TYPES[Math.floor(Math.random() * PERMANENCE_TYPES.length)];
  return MOCK_STALL_DETAILS[resolvedType];
}
