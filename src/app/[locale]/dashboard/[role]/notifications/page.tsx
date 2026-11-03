"use client";

import { Spinner } from "@/components/common/Spinner";
import { Button } from "@/components/ui/button";
import { useRoleContext } from "@/hooks/use-role-context";
import { getNotifications } from "@/lib/data/api/notification";
import { NotificationItem } from "@/lib/data/schema/notification/get_notif";
import { cn } from "@/lib/utils";
import { Role } from "@/types";
import { useInfiniteQuery } from "@tanstack/react-query";
import {
  Bell,
  CheckCheck,
  CheckCircle2,
  ExternalLink,
  Sparkles,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useRef } from "react";

export default function RoleNotificationsPage() {
  const router = useRouter();
  const { activeRole } = useRoleContext();

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteQuery({
      queryKey: ["notifications-infinite", activeRole],
      queryFn: ({ pageParam = 1 }) =>
        getNotifications({
          role: activeRole as Role,
          page: pageParam,
          limit: 5,
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
    // Aksi mark all as read
  };

  const handleNotificationClick = (item: NotificationItem) => {
    if (item.actionUrl) {
      router.push(item.actionUrl);
    }
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="mx-auto max-w-4xl space-y-8 pb-16 px-4 sm:px-6">
      <div className="relative overflow-hidden rounded-3xl border border-border bg-card p-6 shadow-sm sm:p-8">
        <div className="absolute top-0 right-0 h-32 w-32 -translate-y-8 translate-x-8 rounded-full bg-gradient-brand opacity-10 blur-2xl pointer-events-none" />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <Bell className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-heading text-xl font-bold text-foreground capitalize">
                  {activeRole} Notifications
                </h1>
                {unreadCount > 0 && (
                  <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-destructive px-1.5 text-xs font-bold text-destructive-foreground">
                    {unreadCount}
                  </span>
                )}
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">
                Review all operational alerts, system messages, and activity
                logs.
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
      </div>

      <div className="rounded-3xl border border-border bg-card shadow-sm overflow-hidden">
        {notifications.length === 0 ? (
          <div className="py-16 text-center flex flex-col items-center justify-center gap-2 text-muted-foreground">
            <Sparkles className="size-8 opacity-40" />
            <p className="text-sm font-medium">No notifications available.</p>
          </div>
        ) : (
          <div className="divide-y divide-border/60">
            {notifications.map((item) => (
              <div
                key={item.id}
                onClick={() => handleNotificationClick(item)}
                className={cn(
                  "group relative flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 transition-all hover:bg-secondary/40 text-left cursor-pointer",
                  !item.read && "bg-primary/3 font-medium",
                )}
              >
                {!item.read && (
                  <span className="absolute left-0 top-3 bottom-3 w-1.5 rounded-r-full bg-primary" />
                )}

                <div className="flex items-start gap-3.5 min-w-0 flex-1">
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
                    <CheckCircle2 className="size-4" />
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
                      {item.time}
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
            ))}
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
