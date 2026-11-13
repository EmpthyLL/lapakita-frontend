import { Role, RoleAndAll } from "@/types";
import { BasePaginationQuery, PaginatedResponse } from "../schema/base";
import {
  DUMMY_NOTIFICATIONS,
  NotificationItem,
} from "../schema/notification/get_notif";

export async function getNotifications(
  params: BasePaginationQuery & {
    pageType?: "dashboard" | "settings" | "wallet";
    role?: Role;
    targetRole?: RoleAndAll | null;
    category?: "operational" | "finance" | "system" | "all";
  },
): Promise<PaginatedResponse<NotificationItem>> {
  const page = params.page ?? 1;
  const limit = params.limit ?? 10;

  // Simulasi network delay
  await new Promise((resolve) => setTimeout(resolve, 300));

  let filtered = [...DUMMY_NOTIFICATIONS];

  filtered = filtered.filter((notif) => {
    // 1. Filter berdasarkan halaman (pageType) atau kategori eksplisit
    if (params.pageType === "settings" || params.category === "system") {
      if (notif.category !== "system") return false;
    } else if (params.pageType === "wallet" || params.category === "finance") {
      if (notif.category !== "finance") return false;
    } else if (
      params.pageType === "dashboard" ||
      params.category === "operational"
    ) {
      // Di dashboard, secara default tampilkan operational milik role aktif ATAU target "all"
      if (params.role) {
        if (notif.targetRole !== params.role && notif.targetRole !== "all") {
          return false;
        }
      }
    }

    // 2. Filter berdasarkan targetRole eksplisit (jika parameter targetRole dikirimkan)
    if (params.targetRole !== undefined && params.targetRole !== null) {
      if (notif.targetRole !== params.targetRole) {
        return false;
      }
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
