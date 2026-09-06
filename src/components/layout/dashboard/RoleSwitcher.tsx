"use client";

import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import type { RoleAndAll } from "@/types";
import { Check, ChevronDown, Settings } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export const ROLES_CONFIG: Record<
  RoleAndAll,
  {
    label: string;
    colorClass: string;
    bgSoftClass: string;
    borderClass: string;
  }
> = {
  all: {
    label: "General Mode",
    colorClass: "bg-muted-foreground text-background",
    bgSoftClass: "bg-secondary text-foreground",
    borderClass: "border-border hover:border-foreground/40",
  },
  tenant: {
    label: "Tenant",
    colorClass: "bg-tenant text-tenant-foreground",
    bgSoftClass: "bg-tenant/10 text-tenant",
    borderClass: "border-tenant/30 hover:border-tenant",
  },
  owner: {
    label: "Stall Owner",
    colorClass: "bg-owner text-owner-foreground",
    bgSoftClass: "bg-owner/10 text-owner",
    borderClass: "border-owner/30 hover:border-owner",
  },
  supplier: {
    label: "Supplier",
    colorClass: "bg-supplier text-supplier-foreground",
    bgSoftClass: "bg-supplier/10 text-supplier",
    borderClass: "border-supplier/30 hover:border-supplier",
  },
};

interface RoleSwitcherProps {
  activeRole: RoleAndAll;
  className?: string;
}

export function RoleSwitcher({ activeRole, className }: RoleSwitcherProps) {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const currentConfig = ROLES_CONFIG[activeRole] ?? ROLES_CONFIG.tenant;
  const isGeneral = activeRole === "all";

  const options: Array<{ key: RoleAndAll; href: string }> = [
    { key: "all", href: "/dashboard/settings" },
    { key: "tenant", href: "/dashboard/tenant" },
    { key: "owner", href: "/dashboard/owner" },
    { key: "supplier", href: "/dashboard/supplier" },
  ];

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className={cn(
            "flex h-8 cursor-pointer items-center justify-between gap-1.5 rounded-md px-2.5 text-xs font-semibold outline-none transition-all duration-150 shadow-none border",
            isGeneral
              ? "border-border text-foreground"
              : currentConfig.borderClass,
            open && "ring-2 ring-primary/20",
            className,
          )}
        >
          <div className="flex items-center gap-2 min-w-0">
            {isGeneral ? (
              <Settings className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
            ) : (
              <span
                className={cn(
                  "h-2 w-2 rounded-full shrink-0",
                  currentConfig.colorClass,
                )}
              />
            )}
            <span className="text-foreground font-semibold text-xs truncate">
              {currentConfig.label}
            </span>
          </div>

          <ChevronDown
            className={cn(
              "h-3.5 w-3.5 shrink-0 text-muted-foreground transition-transform duration-150 opacity-60",
              open && "rotate-180 opacity-90",
            )}
          />
        </Button>
      </PopoverTrigger>

      <PopoverContent align="end" className="w-48 rounded-md p-1 shadow-md">
        {options.map((opt) => {
          const config = ROLES_CONFIG[opt.key];
          const isSelected = activeRole === opt.key;

          return (
            <button
              key={opt.key}
              type="button"
              onClick={() => {
                setOpen(false);
                router.push(opt.href);
              }}
              className={cn(
                "flex w-full items-center justify-between rounded-md px-2.5 py-1.5 text-xs font-semibold transition-colors outline-none cursor-pointer",
                isSelected
                  ? `${config.bgSoftClass} font-bold`
                  : "text-foreground hover:bg-secondary",
              )}
            >
              <div className="flex items-center gap-2">
                {opt.key === "all" ? (
                  <Settings className="h-3.5 w-3.5 text-muted-foreground" />
                ) : (
                  <span
                    className={cn("h-2 w-2 rounded-full", config.colorClass)}
                  />
                )}
                <span>{config.label}</span>
              </div>
              {isSelected && <Check className="h-3.5 w-3.5" />}
            </button>
          );
        })}
      </PopoverContent>
    </Popover>
  );
}
