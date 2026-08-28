"use client";

import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Role } from "@/types";
import { Check, ChevronDown, Repeat } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export const ROLES_CONFIG: Record<
  Role,
  {
    label: string;
    colorClass: string;
    bgSoftClass: string;
    borderClass: string;
  }
> = {
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
  activeRole: Role;
  isGeneralPage?: boolean;
  className?: string;
}

export function RoleSwitcher({
  activeRole,
  isGeneralPage = false,
  className,
}: RoleSwitcherProps) {
  const [open, setOpen] = useState(false);

  const currentRoleConfig = ROLES_CONFIG[activeRole] ?? ROLES_CONFIG.tenant;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className={cn(
            "flex h-8 cursor-pointer items-center justify-between gap-1.5 rounded-md px-2.5 text-xs font-semibold outline-none transition-all duration-150 shadow-none border",
            isGeneralPage
              ? "border-border text-muted-foreground"
              : currentRoleConfig.borderClass,
            open && "ring-2 ring-primary/20",
            className,
          )}
        >
          <div className="flex items-center gap-2 min-w-0">
            <Repeat className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
            <span
              className={cn(
                "h-2 w-2 rounded-full shrink-0",
                isGeneralPage
                  ? "bg-muted-foreground"
                  : currentRoleConfig.colorClass,
              )}
            />
            <span className="text-foreground font-semibold text-xs capitalize truncate">
              {isGeneralPage ? "General Mode" : currentRoleConfig.label}
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
        <div className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
          Workspace Mode
        </div>
        <div className="my-1 h-px bg-border" />

        {(Object.keys(ROLES_CONFIG) as Role[]).map((roleKey) => {
          const config = ROLES_CONFIG[roleKey];
          const isSelected = !isGeneralPage && activeRole === roleKey;

          return (
            <Link
              key={roleKey}
              href={`/dashboard/${roleKey}`}
              onClick={() => setOpen(false)}
              className={cn(
                "flex w-full items-center justify-between rounded-md px-2.5 py-1.5 text-xs font-semibold transition-colors outline-none",
                isSelected
                  ? `${config.bgSoftClass} font-bold`
                  : "text-foreground hover:bg-secondary",
              )}
            >
              <div className="flex items-center gap-2">
                <span
                  className={cn("h-2 w-2 rounded-full", config.colorClass)}
                />
                <span>{config.label}</span>
              </div>
              {isSelected && <Check className="h-3.5 w-3.5" />}
            </Link>
          );
        })}
      </PopoverContent>
    </Popover>
  );
}
