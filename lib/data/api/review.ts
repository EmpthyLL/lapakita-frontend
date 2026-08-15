import { BasePaginationQuery, PaginatedResponse } from "../schema/base";
import {
  MOCK_STALL_REVIEWS,
  StallReview,
} from "../schema/review/get_stall_review";

export async function getStallReviews(
  params: BasePaginationQuery & { stallId?: string },
): Promise<PaginatedResponse<StallReview>> {
  const page = params.page ?? 1;
  const limit = params.limit ?? 5;

  await new Promise((resolve) => setTimeout(resolve, 450));

  const source = params.stallId
    ? MOCK_STALL_REVIEWS.filter((r) => r.stallId === params.stallId)
    : MOCK_STALL_REVIEWS;

  const start = (page - 1) * limit;
  const pageItems = source.slice(start, start + limit);
  const totalItems = source.length;
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
