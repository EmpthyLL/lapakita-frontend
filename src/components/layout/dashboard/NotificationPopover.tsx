"use client";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { DUMMY_NOTIFICATIONS } from "@/lib/data/api/notification";
import { cn } from "@/lib/utils";
import { Role, VALID_ROLES } from "@/types";
import {
  BadgePercent,
  Bell,
  BellRing,
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
import { useSession } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
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
  const [open, setOpen] = useState(false);
  const [permission, setPermission] =
    useState<BrowserNotificationPermission>("default");
  const [requestingPermission, setRequestingPermission] = useState(false);
  const pathname = usePathname();
  const { data: session } = useSession();

  const handlePopoverChange = (nextOpen: boolean) => {
    setOpen(nextOpen);
    if (nextOpen) {
      setPermission(
        "Notification" in window
          ? window.Notification.permission
          : "unsupported",
      );
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

  // Deteksi Konteks Halaman
  const isWalletPage = pathname.startsWith("/dashboard/wallet");
  const isSettingsPage = pathname.startsWith("/dashboard/settings");

  // Tentukan role aktif
  const segments = pathname.split("/").filter(Boolean);
  const dashboardIndex = segments.lastIndexOf("dashboard");
  const currentPathRole = segments[dashboardIndex + 1] as Role;

  const currentRole: Role = VALID_ROLES.includes(currentPathRole)
    ? currentPathRole
    : (session?.user?.activeRole as Role) || "tenant";

  const rawNotifications =
    DUMMY_NOTIFICATIONS[currentRole] || DUMMY_NOTIFICATIONS.tenant;

  // Pemisahan tegas berdasarkan halaman saat ini (tidak dicampur)
  let notifications = rawNotifications;
  let contextLabel = `Op (${currentRole})`;
  let linkTargetUrl = `/dashboard/${currentRole}/notifications`;

  if (isWalletPage) {
    // Di halaman Wallet: HANYA menampilkan notifikasi kategori finance
    notifications = rawNotifications.filter((n) => n.category === "finance");
    contextLabel = "Finance Wallet";
    linkTargetUrl = "/dashboard/wallet/notifications";
  } else if (isSettingsPage) {
    // Di halaman Settings: HANYA menampilkan notifikasi kategori system
    notifications = rawNotifications.filter((n) => n.category === "system");
    contextLabel = "System Security";
    linkTargetUrl = "/dashboard/settings/notifications";
  } else {
    // Di Dashboard Role: HANYA menampilkan notifikasi kategori operational sesuai role
    notifications = rawNotifications.filter(
      (n) => n.category === "operational",
    );
    contextLabel = `${currentRole} Operational`;
    linkTargetUrl = `/dashboard/${currentRole}/notifications`;
  }

  const unreadCount = notifications.filter((n) => !n.read).length;

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
        className="w-88 p-0 z-60 shadow-xl rounded-2xl border-border/80 overflow-hidden bg-background"
      >
        {/* Header Popover */}
        <div className="flex items-center justify-between border-b border-border/60 bg-secondary/20 px-4 py-3">
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
                "truncate rounded-full border px-2 py-0.5 text-[10px] font-bold capitalize tracking-wide",
                isWalletPage
                  ? "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20"
                  : isSettingsPage
                    ? "bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/20"
                    : getRoleBadgeTheme(currentRole),
              )}
            >
              {contextLabel}
            </span>
          </div>

          {/* Browser Notification Permission Button */}
          {permission === "granted" ? (
            <div className="flex items-center gap-1 text-emerald-500 text-xs font-medium bg-emerald-500/10 px-2 py-0.5 rounded-full">
              <CheckCircle2 className="size-3.5" />
              <span>Active</span>
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

        {/* List Notifikasi Sesuai Konteks Terisolasi */}
        <div className="max-h-80 overflow-y-auto divide-y divide-border/40">
          {notifications.length === 0 ? (
            <div className="py-10 text-center flex flex-col items-center justify-center gap-1.5 text-muted-foreground">
              <Sparkles className="size-5 opacity-40" />
              <p className="text-xs">No notifications for this section.</p>
            </div>
          ) : (
            notifications.map((item) => (
              <div
                key={item.id}
                className={cn(
                  "group relative flex gap-3 p-3.5 transition-all hover:bg-secondary/40 text-left cursor-pointer",
                  !item.read && "bg-primary/3 font-medium",
                )}
              >
                {/* Unread Indicator Line */}
                {!item.read && (
                  <span className="absolute left-0 top-3 bottom-3 w-1 rounded-r-full bg-primary" />
                )}

                <div className="mt-0.5 shrink-0">
                  <div
                    className={cn(
                      "flex size-7 items-center justify-center rounded-full border",
                      item.variant === "success" &&
                        "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
                      item.variant === "warning" &&
                        "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
                      item.variant === "destructive" &&
                        "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20",
                      item.variant === "info" &&
                        "bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-500/20",
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
                  <p className="text-xs text-muted-foreground/90 line-clamp-2 leading-normal">
                    {item.description}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer Link Dinamis Sesuai Konteks Halaman */}
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
                : `View all ${currentRole} operational notifications \u2192`}
          </Link>
        </div>
      </PopoverContent>
    </Popover>
  );
}
