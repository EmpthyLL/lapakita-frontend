import { Role } from "@/types";
import { BasePaginationQuery, PaginatedResponse } from "../schema/base";
import {
  DUMMY_NOTIFICATIONS,
  NotificationItem,
} from "../schema/notification/get_notif";

export async function getNotifications(
  params: BasePaginationQuery & { role?: Role; category?: string },
): Promise<PaginatedResponse<NotificationItem>> {
  const page = params.page ?? 1;
  const limit = params.limit ?? 10;
  const role = params.role ?? "tenant";

  // Simulasi network delay
  await new Promise((resolve) => setTimeout(resolve, 400));

  const allRoleNotifs = DUMMY_NOTIFICATIONS[role] || DUMMY_NOTIFICATIONS.tenant;

  // Filter berdasarkan kategori jika ada
  let filtered = allRoleNotifs;
  if (params.category && params.category !== "all") {
    filtered = allRoleNotifs.filter((n) => n.category === params.category);
  }

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
