"use client";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Role } from "@/types";
import { Bell, BellRing, CheckCircle2, Info, Sparkles } from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const VALID_ROLES: Role[] = ["tenant", "owner", "supplier"];

interface NotificationItem {
  id: string;
  title: string;
  description: string;
  time: string;
  read: boolean;
  type: "info" | "success" | "warning";
}

type BrowserNotificationPermission = NotificationPermission | "unsupported";

const DUMMY_NOTIFICATIONS: Record<Role, NotificationItem[]> = {
  tenant: [
    {
      id: "t-1",
      title: "Kiosk Rental Approved",
      description:
        "Your rental application for Kiosk A-12 was approved by the owner.",
      time: "10 min ago",
      read: false,
      type: "success",
    },
    {
      id: "t-2",
      title: "Monthly Rent Due",
      description: "Your rental payment is due in 3 days.",
      time: "2 hr ago",
      read: true,
      type: "info",
    },
  ],
  owner: [
    {
      id: "o-1",
      title: "New Tenant Application",
      description: "A new rental application was submitted for Kiosk B-05.",
      time: "5 min ago",
      read: false,
      type: "success",
    },
    {
      id: "o-2",
      title: "Escrow Funds Received",
      description: "The monthly rental deposit has been secured in escrow.",
      time: "1 hr ago",
      read: true,
      type: "info",
    },
  ],
  supplier: [
    {
      id: "s-1",
      title: "New Supply Order",
      description: "The tenant at Kiosk A-12 placed a new supply order.",
      time: "15 min ago",
      read: false,
      type: "success",
    },
    {
      id: "s-2",
      title: "High Demand Alert",
      description: "Demand for rice and cooking oil is rising in your area.",
      time: "3 hr ago",
      read: true,
      type: "info",
    },
  ],
};

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

  // Tentukan role aktif berdasarkan URL dashboard atau session
  const segments = pathname.split("/").filter(Boolean);
  const dashboardIndex = segments.lastIndexOf("dashboard");
  const currentPathRole = segments[dashboardIndex + 1] as Role;

  const currentRole: Role = VALID_ROLES.includes(currentPathRole)
    ? currentPathRole
    : (session?.user?.activeRole as Role) || "tenant";

  const notifications =
    DUMMY_NOTIFICATIONS[currentRole] || DUMMY_NOTIFICATIONS.tenant;
  const unreadCount = notifications.filter((n) => !n.read).length;

  const notificationPageUrl = `/dashboard/${currentRole}/notifications`;

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
        className="w-84 p-0 z-60 shadow-xl rounded-2xl border-border/80 overflow-hidden bg-background"
      >
        {/* Header Popover yang Lebih Rapi & Minimalis */}
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
                getRoleBadgeTheme(currentRole),
              )}
            >
              {currentRole}
            </span>
          </div>

          {/* Status / Request Permission Button Berbentuk Minimalis / Text Link */}
          {permission === "granted" ? (
            <div className="flex items-center gap-1 text-success text-xs font-medium bg-success/10 px-2 py-0.5 rounded-full">
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

        {/* Improved Notification List (Lebih Bersih & Modern) */}
        <div className="max-h-80 overflow-y-auto divide-y divide-border/40">
          {notifications.length === 0 ? (
            <div className="py-10 text-center flex flex-col items-center justify-center gap-1.5 text-muted-foreground">
              <Sparkles className="size-5 opacity-40" />
              <p className="text-xs">You&apos;re all caught up!</p>
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
                  {item.type === "success" ? (
                    <div className="flex size-7 items-center justify-center rounded-full bg-suc-500/10 text-suc-500">
                      <CheckCircle2 className="size-4" />
                    </div>
                  ) : (
                    <div className="flex size-7 items-center justify-center rounded-full bg-blue-500/10 text-blue-500">
                      <Info className="size-4" />
                    </div>
                  )}
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

        {/* Footer Link */}
        <div className="border-t border-border/60 p-2.5 bg-secondary/10 rounded-b-2xl text-center">
          <Link
            href={notificationPageUrl}
            onClick={() => setOpen(false)}
            className="text-xs font-semibold text-primary hover:underline block py-1 transition-colors"
          >
            View all {currentRole} notifications &rarr;
          </Link>
        </div>
      </PopoverContent>
    </Popover>
  );
}
