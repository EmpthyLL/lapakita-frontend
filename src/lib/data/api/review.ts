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

  const start = (page - 1) * limit;
  const pageItems = MOCK_STALL_REVIEWS.slice(start, start + limit);
  const totalItems = MOCK_STALL_REVIEWS.length;
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
