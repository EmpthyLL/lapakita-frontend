"use client";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Role } from "@/types";
import { Bell, CheckCircle2, Info } from "lucide-react";
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

// Dummy data simulasi notifikasi per role
const DUMMY_NOTIFICATIONS: Record<Role, NotificationItem[]> = {
  tenant: [
    {
      id: "t-1",
      title: "Sewa Kios Disetujui",
      description: "Pengajuan sewa Kios A-12 Anda telah disetujui oleh Owner.",
      time: "10 menit lalu",
      read: false,
      type: "success",
    },
    {
      id: "t-2",
      title: "Tagihan Bulanan",
      description: "Jatuh tempo pembayaran sewa tinggal 3 hari lagi.",
      time: "2 jam lalu",
      read: true,
      type: "info",
    },
  ],
  owner: [
    {
      id: "o-1",
      title: "Pendaftaran Tenant Baru",
      description: "Ada pengajuan sewa baru masuk untuk Kios B-05.",
      time: "5 menit lalu",
      read: false,
      type: "success",
    },
    {
      id: "o-2",
      title: "Dana Escrow Masuk",
      description: "Deposit sewa bulanan telah diamankan ke sistem.",
      time: "1 jam lalu",
      read: true,
      type: "info",
    },
  ],
  supplier: [
    {
      id: "s-1",
      title: "Pesanan Stok Baru",
      description: "Tenant Kios A-12 memesan suplai bahan baku baru.",
      time: "15 menit lalu",
      read: false,
      type: "success",
    },
    {
      id: "s-2",
      title: "Signal Permintaan Tinggi",
      description: "Produk beras & minyak melonjak di area Anda.",
      time: "3 jam lalu",
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
  const pathname = usePathname();
  const { data: session } = useSession();

  // Tentukan role aktif berdasarkan URL dashboard saat ini, atau fallback ke session activeRole
  const segments = pathname.split("/").filter(Boolean);
  const dashboardIndex = segments.lastIndexOf("dashboard");
  const currentPathRole = segments[dashboardIndex + 1] as Role;

  const currentRole: Role = VALID_ROLES.includes(currentPathRole)
    ? currentPathRole
    : (session?.user?.activeRole as Role) || "tenant";

  // Ambil daftar notifikasi berdasarkan role aktif
  const notifications =
    DUMMY_NOTIFICATIONS[currentRole] || DUMMY_NOTIFICATIONS.tenant;
  const unreadCount = notifications.filter((n) => !n.read).length;

  const notificationPageUrl = `/dashboard/${currentRole}/notifications`;

  return (
    <Popover open={open} onOpenChange={setOpen}>
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
        className="w-80 p-0 z-60 shadow-xl rounded-2xl"
      >
        {/* Header Popover */}
        <div className="flex items-center justify-between border-b border-border px-4 py-3 bg-secondary/30 rounded-t-2xl">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-sm">Notifikasi</span>
            <span
              className={cn(
                "text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full border",
                getRoleBadgeTheme(currentRole),
              )}
            >
              Mode {currentRole}
            </span>
          </div>
          {unreadCount > 0 && (
            <span className="text-xs text-muted-foreground font-medium">
              {unreadCount} baru
            </span>
          )}
        </div>

        {/* List Notifikasi */}
        <div className="max-h-72 overflow-y-auto divide-y divide-border/60">
          {notifications.length === 0 ? (
            <div className="py-8 text-center text-xs text-muted-foreground">
              Tidak ada notifikasi saat ini.
            </div>
          ) : (
            notifications.map((item) => (
              <div
                key={item.id}
                className={cn(
                  "flex gap-3 p-3 transition-colors hover:bg-secondary/50 text-left",
                  !item.read && "bg-primary/5",
                )}
              >
                <div className="mt-0.5 shrink-0">
                  {item.type === "success" ? (
                    <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                  ) : (
                    <Info className="h-4 w-4 text-blue-500" />
                  )}
                </div>
                <div className="flex-1 space-y-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-xs font-semibold text-foreground truncate">
                      {item.title}
                    </p>
                    <span className="text-[10px] text-muted-foreground shrink-0">
                      {item.time}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer Link ke Halaman Notifikasi Spesifik Role */}
        <div className="border-t border-border p-2 bg-secondary/10 rounded-b-2xl text-center">
          <Link
            href={notificationPageUrl}
            onClick={() => setOpen(false)}
            className="text-xs font-semibold text-primary hover:underline block py-1.5 transition-colors"
          >
            Lihat semua notifikasi {currentRole} &rarr;
          </Link>
        </div>
      </PopoverContent>
    </Popover>
  );
}
