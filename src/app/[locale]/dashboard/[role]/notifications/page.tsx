"use client";

import { Spinner } from "@/components/common/Spinner";
import { Button } from "@/components/ui/button";
import { useRoleContext } from "@/hooks/use-role-context";
import { getNotifications } from "@/lib/data/api/notification";
import {
  NotificationCategory,
  NotificationItem,
  NotificationVariant,
} from "@/lib/data/schema/notification/get_notif";
import { cn, formatRelativeTime } from "@/lib/utils";
import { Role, RoleAndAll } from "@/types";
import { useInfiniteQuery } from "@tanstack/react-query";
import {
  AlertTriangle,
  Bell,
  CheckCheck,
  CheckCircle2,
  CreditCard,
  ExternalLink,
  FileText,
  Filter,
  Lock,
  Package,
  ShieldAlert,
  Sparkles,
} from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useCallback, useRef, useState } from "react";

function getNotificationIcon(
  category: NotificationCategory,
  variant: NotificationVariant,
) {
  if (category === "finance") return CreditCard;
  if (category === "system") {
    if (variant === "warning" || variant === "destructive") return ShieldAlert;
    return Lock;
  }
  if (variant === "success") return CheckCircle2;
  if (variant === "warning") return AlertTriangle;
  if (variant === "destructive") return FileText;
  return Package;
}

// Helper untuk menentukan warna strip dan background tint berdasarkan targetRole (Konsisten di semua tempat)
export const getRoleThemeStyles = (targetRole: string, isUnread: boolean) => {
  switch (targetRole) {
    case "tenant":
      return {
        strip: "bg-[var(--tenant)]",
        unreadBg: isUnread
          ? "bg-[color-mix(in_oklch,var(--tenant),transparent_90%)] font-medium"
          : "",
      };
    case "owner":
      return {
        strip: "bg-[var(--owner)]",
        unreadBg: isUnread
          ? "bg-[color-mix(in_oklch,var(--owner),transparent_90%)] font-medium"
          : "",
      };
    case "supplier":
      return {
        strip: "bg-[var(--supplier)]",
        unreadBg: isUnread
          ? "bg-[color-mix(in_oklch,var(--supplier),transparent_90%)] font-medium"
          : "",
      };
    case "all":
    default:
      // Disamakan dengan warna general sidebar (secondary / muted)
      return {
        strip: "bg-muted-foreground/60",
        unreadBg: isUnread ? "bg-secondary font-medium" : "",
      };
  }
};

// Helper untuk memberikan warna background/border tombol sesuai role target
export function getRoleFilterStyle(target: string, isActive: boolean) {
  if (!isActive) {
    return "bg-secondary/60 text-muted-foreground hover:bg-secondary hover:text-foreground";
  }

  switch (target) {
    case "tenant":
      return "bg-[var(--tenant)] text-[var(--tenant-foreground)] shadow-md ring-2 ring-[var(--tenant)]/40 font-bold";
    case "owner":
      return "bg-[var(--owner)] text-[var(--owner-foreground)] shadow-md ring-2 ring-[var(--owner)]/40 font-bold";
    case "supplier":
      return "bg-[var(--supplier)] text-[var(--supplier-foreground)] shadow-md ring-2 ring-[var(--supplier)]/40 font-bold";
    case "general":
      return "bg-info text-info-foreground shadow-md ring-2 ring-info/40 font-bold";
    default:
      return "bg-primary text-primary-foreground shadow-md ring-2 ring-primary/40 font-bold";
  }
}

export default function RoleNotificationsPage() {
  const router = useRouter();
  const pathname = usePathname();
  const { activeRole } = useRoleContext();

  const isWalletPage = pathname.includes("/wallet");
  const isSettingsPage = pathname.includes("/settings");

  const pageType = isWalletPage
    ? "wallet"
    : isSettingsPage
      ? "settings"
      : "dashboard";

  const [selectedTargetRole, setSelectedTargetRole] = useState<
    RoleAndAll | undefined
  >(undefined);

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteQuery({
      queryKey: [
        "notifications-infinite",
        activeRole,
        pageType,
        selectedTargetRole,
      ],
      queryFn: ({ pageParam = 1 }) =>
        getNotifications({
          role: activeRole as Role,
          page: pageParam,
          limit: 5,
          pageType: pageType,
          targetRole: selectedTargetRole,
        }),
      getNextPageParam: (lastPage) =>
        lastPage.meta.hasNextPage ? lastPage.meta.currentPage + 1 : undefined,
      initialPageParam: 1,
    });

  const notifications: NotificationItem[] =
    data?.pages.flatMap((page) => page.data) || [];

  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (isFetchingNextPage) return;
      if (observerRef.current) observerRef.current.disconnect();

      observerRef.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasNextPage) {
          fetchNextPage();
        }
      });

      if (node) observerRef.current.observe(node);
    },
    [isFetchingNextPage, hasNextPage, fetchNextPage],
  );

  const handleMarkAllAsRead = () => {
    // Aksi tandai semua dibaca
  };

  const handleNotificationClick = (item: NotificationItem) => {
    if (item.actionUrl) {
      router.push(item.actionUrl);
    }
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  const pageTitle = isWalletPage
    ? "Wallet & Finance Notifications"
    : isSettingsPage
      ? "System & Security Alerts"
      : `${activeRole} Notifications`;

  return (
    <div className="mx-auto max-w-4xl space-y-8 pb-16 px-4 sm:px-6">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl border border-border bg-card p-6 shadow-sm sm:p-8">
        <div className="absolute top-0 right-0 h-32 w-32 -translate-y-8 translate-x-8 rounded-full bg-primary/20 opacity-20 blur-2xl pointer-events-none" />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <Bell className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-heading text-xl font-bold text-foreground capitalize">
                  {pageTitle}
                </h1>
                {unreadCount > 0 && (
                  <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-destructive px-1.5 text-xs font-bold text-destructive-foreground">
                    {unreadCount}
                  </span>
                )}
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">
                {isWalletPage
                  ? "Track escrow settlements, remittances, payouts, and subscription invoices."
                  : isSettingsPage
                    ? "Monitor account security, login credentials, and verification updates."
                    : `Review activity logs tailored for ${activeRole} and general announcements.`}
              </p>
            </div>
          </div>

          {unreadCount > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleMarkAllAsRead}
              className="gap-2 rounded-xl text-xs font-semibold self-start sm:self-auto"
            >
              <CheckCheck className="size-4" /> Mark All as Read
            </Button>
          )}
        </div>

        {/* Filter Bar Target Role */}
        {isWalletPage && (
          <div className="mt-6 flex flex-wrap items-center gap-2 pt-4 border-t border-border/60">
            <span className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground mr-2">
              <Filter className="size-3.5" /> Filter Target:
            </span>
            {(
              [
                { label: "All (No Filter)", value: undefined },
                { label: "General (All Target)", value: "all" },
                { label: "Tenant", value: "tenant" },
                { label: "Owner", value: "owner" },
                { label: "Supplier", value: "supplier" },
              ] as const
            ).map((target) => {
              const isActive = selectedTargetRole === target.value;
              return (
                <button
                  key={String(target.value)}
                  onClick={() => setSelectedTargetRole(target.value)}
                  className={cn(
                    "rounded-xl px-3.5 py-1.5 text-xs font-semibold capitalize transition-all cursor-pointer",
                    getRoleFilterStyle(String(target.value ?? "all"), isActive),
                  )}
                >
                  {target.label}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* List Notifikasi */}
      <div className="rounded-3xl border border-border bg-card shadow-sm overflow-hidden">
        {notifications.length === 0 ? (
          <div className="py-16 text-center flex flex-col items-center justify-center gap-2 text-muted-foreground">
            <Sparkles className="size-8 opacity-40" />
            <p className="text-sm font-medium">No notifications available.</p>
          </div>
        ) : (
          <div className="divide-y divide-border/60">
            {notifications.map((item) => {
              const IconComponent = getNotificationIcon(
                item.category,
                item.variant,
              );
              const theme = getRoleThemeStyles(item.targetRole, !item.read);

              return (
                <div
                  key={item.id}
                  onClick={() => handleNotificationClick(item)}
                  className={cn(
                    "group relative flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 transition-all hover:bg-secondary/40 text-left cursor-pointer",
                    theme.unreadBg,
                  )}
                >
                  {/* Garis strip selalu ada untuk menandai role target */}
                  <span
                    className={cn(
                      "absolute left-0 top-3 bottom-3 w-1.5 rounded-r-full",
                      theme.strip,
                      !item.read ? "opacity-100" : "opacity-40",
                    )}
                  />

                  <div className="flex items-start gap-3.5 min-w-0 flex-1 pl-2">
                    <div
                      className={cn(
                        "flex size-9 shrink-0 items-center justify-center rounded-full border mt-0.5",
                        item.variant === "success" &&
                          "bg-success/10 text-success border-success/20",
                        item.variant === "warning" &&
                          "bg-warning/10 text-warning border-warning/20",
                        item.variant === "destructive" &&
                          "bg-destructive/10 text-destructive border-destructive/20",
                        item.variant === "info" &&
                          "bg-info/10 text-info border-info/20",
                      )}
                    >
                      <IconComponent className="size-4" />
                    </div>

                    <div className="space-y-1 min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="text-sm font-semibold text-foreground tracking-tight">
                          {item.title}
                        </p>
                        <span className="rounded-full border border-border/80 bg-secondary/50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                          {item.category}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground/90 leading-relaxed">
                        {item.description}
                      </p>
                      <p className="text-[11px] text-muted-foreground/70 font-medium pt-0.5">
                        {formatRelativeTime(item.createdAt, {
                          maxRelativeDays: 7,
                        })}
                      </p>
                    </div>
                  </div>

                  {item.actionUrl && (
                    <div className="self-end sm:self-center shrink-0">
                      <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary group-hover:underline">
                        View Action <ExternalLink className="size-3.5" />
                      </span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {hasNextPage && (
          <div ref={loadMoreRef} className="py-8">
            <Spinner className="h-12" />
          </div>
        )}
      </div>
    </div>
  );
}
