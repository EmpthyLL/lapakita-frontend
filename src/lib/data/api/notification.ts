import { Role } from "@/types";
import { BasePaginationQuery, PaginatedResponse } from "../schema/base";
import {
  DUMMY_NOTIFICATIONS,
  NotificationItem,
  NotificationTargetRole,
} from "../schema/notification/get_notif";

export async function getNotifications(
  params: BasePaginationQuery & {
    role?: Role;
    category?: string;
    targetRole?: NotificationTargetRole;
  },
): Promise<PaginatedResponse<NotificationItem>> {
  const page = params.page ?? 1;
  const limit = params.limit ?? 10;

  // Simulasi network delay
  await new Promise((resolve) => setTimeout(resolve, 300));

  let filtered = [...DUMMY_NOTIFICATIONS];

  filtered = filtered.filter((notif) => {
    // 1. Filter berdasarkan role jika diberikan
    if (
      params.role &&
      notif.targetRole !== params.role &&
      notif.targetRole !== "all"
    ) {
      return false;
    }

    return true;
  });

  // 3. Urutkan berdasarkan createdAt terbaru (descending)
  filtered.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );

  const start = (page - 1) * limit;
  const pageItems = filtered.slice(start, start + limit);
  const totalItems = filtered.length;
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
