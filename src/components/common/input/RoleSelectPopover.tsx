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

interface RoleSelectPopoverProps {
  value: RoleAndAll;
  onChange: (role: RoleAndAll) => void;
  className?: string;
  disabled?: boolean;
  mode?: "topbar" | "form";
  showGeneral?: boolean;
}

export function RoleSelectPopover({
  value,
  onChange,
  className,
  disabled = false,
  mode = "form",
  showGeneral = false,
}: RoleSelectPopoverProps) {
  const [open, setOpen] = useState(false);

  const currentConfig = ROLES_CONFIG[value] ?? ROLES_CONFIG.tenant;
  const isGeneral = value === "all";

  const roles: RoleAndAll[] = showGeneral
    ? ["all", "tenant", "owner", "supplier"]
    : ["tenant", "owner", "supplier"];

  if (mode === "topbar") {
    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            disabled={disabled}
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
          {roles.map((roleKey) => {
            const config = ROLES_CONFIG[roleKey];
            const isSelected = value === roleKey;

            return (
              <button
                key={roleKey}
                type="button"
                onClick={() => {
                  onChange(roleKey);
                  setOpen(false);
                }}
                className={cn(
                  "flex w-full items-center justify-between rounded-md px-2.5 py-1.5 text-xs font-semibold transition-colors outline-none cursor-pointer",
                  isSelected
                    ? `${config.bgSoftClass} font-bold`
                    : "text-foreground hover:bg-secondary",
                )}
              >
                <div className="flex items-center gap-2">
                  {roleKey === "all" ? (
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

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={disabled}
          className={cn(
            "flex h-11 w-full cursor-pointer items-center justify-between gap-2 rounded-xl px-3.5 text-xs font-semibold outline-none transition-all duration-150 shadow-none border bg-background border-border hover:bg-secondary/50",
            !isGeneral && currentConfig.borderClass,
            open && "ring-2 ring-primary/20",
            className,
          )}
        >
          <div className="flex items-center gap-2.5 min-w-0">
            {isGeneral ? (
              <Settings className="h-4 w-4 shrink-0 text-muted-foreground" />
            ) : (
              <span
                className={cn(
                  "h-2.5 w-2.5 rounded-full shrink-0",
                  currentConfig.colorClass,
                )}
              />
            )}
            <span className="text-foreground font-semibold text-xs truncate">
              {currentConfig.label} {isGeneral ? "" : "Mode"}
            </span>
          </div>

          <ChevronDown
            className={cn(
              "h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-150 opacity-60",
              open && "rotate-180 opacity-90",
            )}
          />
        </Button>
      </PopoverTrigger>

      <PopoverContent
        align="center"
        className="w-(--radix-popover-trigger-width) min-w-48 p-1 shadow-md rounded-xl"
      >
        {roles.map((roleKey) => {
          const config = ROLES_CONFIG[roleKey];
          const isSelected = value === roleKey;

          return (
            <button
              key={roleKey}
              type="button"
              onClick={() => {
                onChange(roleKey);
                setOpen(false);
              }}
              className={cn(
                "flex w-full items-center justify-between rounded-lg px-3 py-2 text-xs font-semibold transition-colors outline-none cursor-pointer",
                isSelected
                  ? `${config.bgSoftClass} font-bold`
                  : "text-foreground hover:bg-secondary",
              )}
            >
              <div className="flex items-center gap-2.5">
                {roleKey === "all" ? (
                  <Settings className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <span
                    className={cn(
                      "h-2.5 w-2.5 rounded-full",
                      config.colorClass,
                    )}
                  />
                )}
                <span>
                  {config.label} {roleKey === "all" ? "" : "Mode"}
                </span>
              </div>
              {isSelected && <Check className="h-3.5 w-3.5" />}
            </button>
          );
        })}
      </PopoverContent>
    </Popover>
  );
}
