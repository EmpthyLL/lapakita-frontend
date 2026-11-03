"use client";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useRoleContext } from "@/hooks/use-role-context";
import { getNotifications } from "@/lib/data/api/notification";
import { NotificationItem } from "@/lib/data/schema/notification/get_notif";
import { cn } from "@/lib/utils";
import { Role } from "@/types";
import { useQuery } from "@tanstack/react-query";
import {
  BadgePercent,
  Bell,
  BellRing,
  CheckCheck,
  CheckCircle2,
  CreditCard,
  FileText,
  KeyRound,
  Lock,
  Package,
  Sparkles,
  Truck,
  UserCheck,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

type BrowserNotificationPermission = NotificationPermission | "unsupported";

const getRoleBadgeTheme = (role: Role) => {
  switch (role) {
    case "owner":
      return "bg-owner/10 text-owner border-owner/20";
    case "supplier":
      return "bg-supplier/10 text-supplier border-supplier/20";
    case "tenant":
    default:
      return "bg-tenant/10 text-tenant border-tenant/20";
  }
};

const getNotificationIcon = (typeCode: string) => {
  if (typeCode.includes("lease") || typeCode.includes("application"))
    return <KeyRound className="size-4" />;
  if (typeCode.includes("order") || typeCode.includes("b2b"))
    return <Truck className="size-4" />;
  if (
    typeCode.includes("rent") ||
    typeCode.includes("payout") ||
    typeCode.includes("payment")
  )
    return <CreditCard className="size-4" />;
  if (typeCode.includes("deposit") || typeCode.includes("claim"))
    return <BadgePercent className="size-4" />;
  if (typeCode.includes("subscription")) return <Sparkles className="size-4" />;
  if (typeCode.includes("security") || typeCode.includes("password"))
    return <Lock className="size-4" />;
  if (typeCode.includes("profile")) return <UserCheck className="size-4" />;
  if (typeCode.includes("demand") || typeCode.includes("stock"))
    return <Package className="size-4" />;
  if (typeCode.includes("inspection")) return <FileText className="size-4" />;
  return <CheckCircle2 className="size-4" />;
};

export function NotificationPopover() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [permission, setPermission] =
    useState<BrowserNotificationPermission>("default");
  const [requestingPermission, setRequestingPermission] = useState(false);

  const { activeRole, isWalletPage, isSettingsPage } = useRoleContext();

  const categoryFilter = isWalletPage
    ? "finance"
    : isSettingsPage
      ? "system"
      : "operational";

  const contextLabel = isWalletPage
    ? "Finance & Wallet"
    : isSettingsPage
      ? "System & Security"
      : `${activeRole} Operational`;

  const linkTargetUrl = isWalletPage
    ? "/dashboard/wallet/notifications"
    : isSettingsPage
      ? "/dashboard/settings/notifications"
      : `/dashboard/${activeRole}/notifications`;

  // Menggunakan useQuery untuk mengambil 10 item pertama
  const { data, refetch } = useQuery({
    queryKey: ["notifications", activeRole, categoryFilter],
    queryFn: () =>
      getNotifications({
        role: activeRole as Role,
        category: categoryFilter,
        page: 1,
        limit: 10,
      }),
  });

  const notifications = data?.data || [];
  const unreadCount = notifications.filter((n) => !n.read).length;

  const handlePopoverChange = (nextOpen: boolean) => {
    setOpen(nextOpen);
    if (nextOpen) {
      setPermission(
        "Notification" in window
          ? window.Notification.permission
          : "unsupported",
      );
      refetch();
    }
  };

  const requestNotificationPermission = async () => {
    if (!("Notification" in window)) {
      setPermission("unsupported");
      return;
    }
    setRequestingPermission(true);
    try {
      setPermission(await window.Notification.requestPermission());
    } finally {
      setRequestingPermission(false);
    }
  };

  const handleMarkAllAsRead = () => {
    // Implementasi mark all as read lokal/mutasi
  };

  const handleItemClick = (item: NotificationItem) => {
    setOpen(false);
    if (item.actionUrl) {
      router.push(item.actionUrl);
    }
  };

  return (
    <Popover open={open} onOpenChange={handlePopoverChange}>
      <PopoverTrigger asChild>
        <button
          type="button"
          className="relative flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground outline-none cursor-pointer"
          aria-label="Notifications"
        >
          <Bell className="h-4.5 w-4.5" />
          {unreadCount > 0 && (
            <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-destructive animate-pulse" />
          )}
        </button>
      </PopoverTrigger>

      <PopoverContent
        align="end"
        className="w-[calc(100vw-2rem)] sm:w-88 p-0 z-60 shadow-xl rounded-2xl border-border/80 overflow-hidden bg-background mx-2 sm:mx-0"
      >
        <div className="flex items-center justify-between border-b border-border/60 bg-secondary/20 px-3.5 sm:px-4 py-3">
          <div className="flex min-w-0 items-center gap-2">
            <span className="font-semibold text-sm tracking-tight text-foreground">
              Notifications
            </span>
            {unreadCount > 0 && (
              <span className="flex h-4 min-w-4 shrink-0 items-center justify-center rounded-full bg-destructive px-1 text-[10px] font-bold text-destructive-foreground">
                {unreadCount}
              </span>
            )}
            <span
              className={cn(
                "truncate rounded-full border px-2 py-0.5 text-[10px] font-bold capitalize tracking-wide hidden xs:inline-flex",
                isWalletPage
                  ? "bg-warning/10 text-warning border-warning/20"
                  : isSettingsPage
                    ? "bg-muted text-muted-foreground border-border"
                    : getRoleBadgeTheme(activeRole as Role),
              )}
            >
              {contextLabel}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {unreadCount > 0 && (
              <button
                type="button"
                onClick={handleMarkAllAsRead}
                className="flex items-center gap-1 text-[11px] font-medium text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                title="Mark all as read"
              >
                <CheckCheck className="size-3.5" />
                <span className="hidden sm:inline">Read All</span>
              </button>
            )}

            {permission === "granted" ? (
              <div className="flex items-center gap-1 text-success text-xs font-medium bg-success/10 px-2 py-0.5 rounded-full">
                <CheckCircle2 className="size-3.5" />
                <span className="hidden sm:inline">Active</span>
              </div>
            ) : (
              <button
                type="button"
                onClick={requestNotificationPermission}
                disabled={permission === "unsupported" || requestingPermission}
                className="flex items-center gap-1 text-xs font-semibold text-primary hover:underline transition-all disabled:opacity-50 cursor-pointer"
              >
                <BellRing className="size-3.5" />
                <span>
                  {permission === "denied"
                    ? "Blocked"
                    : requestingPermission
                      ? "Enabling..."
                      : "Enable Push"}
                </span>
              </button>
            )}
          </div>
        </div>

        <div className="max-h-[60vh] sm:max-h-80 overflow-y-auto divide-y divide-border/40">
          {notifications.length === 0 ? (
            <div className="py-10 text-center flex flex-col items-center justify-center gap-1.5 text-muted-foreground">
              <Sparkles className="size-5 opacity-40" />
              <p className="text-xs">No notifications for this section.</p>
            </div>
          ) : (
            notifications.map((item) => (
              <div
                key={item.id}
                onClick={() => handleItemClick(item)}
                className={cn(
                  "group relative flex gap-3 p-3.5 transition-all hover:bg-secondary/40 text-left cursor-pointer",
                  !item.read && "bg-primary/3 font-medium",
                )}
              >
                {!item.read && (
                  <span className="absolute left-0 top-3 bottom-3 w-1 rounded-r-full bg-primary" />
                )}

                <div className="mt-0.5 shrink-0">
                  <div
                    className={cn(
                      "flex size-7 items-center justify-center rounded-full border",
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
                    {getNotificationIcon(item.typeCode)}
                  </div>
                </div>

                <div className="flex-1 space-y-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-xs font-semibold text-foreground tracking-tight truncate">
                      {item.title}
                    </p>
                    <span className="text-[10px] text-muted-foreground font-normal shrink-0">
                      {item.time}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground/95 line-clamp-2 leading-normal">
                    {item.description}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="border-t border-border/60 p-2.5 bg-secondary/10 rounded-b-2xl text-center">
          <Link
            href={linkTargetUrl}
            onClick={() => setOpen(false)}
            className="text-xs font-semibold text-primary hover:underline block py-1 transition-colors"
          >
            {isWalletPage
              ? "View all wallet & finance notifications \u2192"
              : isSettingsPage
                ? "View all security & system logs \u2192"
                : `View all ${activeRole} operational notifications \u2192`}
          </Link>
        </div>
      </PopoverContent>
    </Popover>
  );
}
