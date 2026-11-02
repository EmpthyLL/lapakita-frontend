"use client";

import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { ROLES_CONFIG, type RoleAndAll } from "@/types";
import {
  Check,
  ChevronDown,
  ChevronRight,
  Repeat,
  Settings,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";

interface RoleSelectPopoverProps {
  value: RoleAndAll;
  onChange: (role: RoleAndAll) => void;
  className?: string;
  disabled?: boolean;
  mode?: "topbar" | "form" | "toggle" | "menu";
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
  const hoverCloseTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const t = useTranslations("common.nav");

  const openOnHover = () => {
    if (hoverCloseTimeout.current) {
      clearTimeout(hoverCloseTimeout.current);
      hoverCloseTimeout.current = null;
    }
    setOpen(true);
  };

  const closeAfterHover = () => {
    if (hoverCloseTimeout.current) clearTimeout(hoverCloseTimeout.current);
    hoverCloseTimeout.current = setTimeout(() => setOpen(false), 120);
  };

  useEffect(
    () => () => {
      if (hoverCloseTimeout.current) clearTimeout(hoverCloseTimeout.current);
    },
    [],
  );

  const currentConfig = ROLES_CONFIG[value] ?? ROLES_CONFIG.tenant;
  const isGeneral = value === "all";

  const roles: RoleAndAll[] = showGeneral
    ? ["all", "tenant", "owner", "supplier"]
    : ["tenant", "owner", "supplier"];

  if (mode === "toggle") {
    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            size="icon-sm"
            disabled={disabled}
            aria-label="Switch role"
            aria-expanded={open}
            className={cn(
              "size-9 shrink-0 rounded-lg border-border text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground",
              !isGeneral && currentConfig.borderClass,
              open && "ring-2 ring-primary/20",
              className,
            )}
          >
            <Repeat
              className={cn(
                "size-4 transition-transform duration-200",
                open && "rotate-180",
              )}
            />
          </Button>
        </PopoverTrigger>

        <PopoverContent
          align="end"
          className="z-60 w-48 rounded-md p-1 shadow-md"
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
                  "flex w-full items-center justify-between rounded-md px-2.5 py-1.5 text-xs font-semibold transition-colors outline-none cursor-pointer",
                  isSelected
                    ? `${config.bgSoftClass} font-bold`
                    : "text-foreground hover:bg-secondary",
                )}
              >
                <span className="flex items-center gap-2">
                  {roleKey === "all" ? (
                    <Settings className="h-3.5 w-3.5 text-muted-foreground" />
                  ) : (
                    <span
                      className={cn("h-2 w-2 rounded-full", config.colorClass)}
                    />
                  )}
                  {config.label}
                </span>
                {isSelected && <Check className="h-3.5 w-3.5" />}
              </button>
            );
          })}
        </PopoverContent>
      </Popover>
    );
  }

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

  if (mode === "menu") {
    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            disabled={disabled}
            aria-expanded={open}
            onMouseEnter={openOnHover}
            onMouseLeave={closeAfterHover}
            onFocus={openOnHover}
            className={cn(
              "h-auto w-full justify-start rounded-sm px-2 py-1.5 text-xs font-medium",
              open && "bg-accent text-accent-foreground",
              className,
            )}
          >
            <Repeat className="mr-2 h-4 w-4" />
            {t("switch_role")}
            <ChevronRight className="ml-auto h-4 w-4" />
          </Button>
        </PopoverTrigger>

        <PopoverContent
          side="right"
          align="start"
          sideOffset={0}
          onMouseEnter={openOnHover}
          onMouseLeave={closeAfterHover}
          className="z-60 w-48 rounded-md border p-1 shadow-lg"
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
                  "flex w-full items-center justify-between rounded-md px-2 py-1.5 text-xs font-medium transition-colors outline-none cursor-pointer",
                  isSelected
                    ? `${config.bgSoftClass} font-bold`
                    : "hover:bg-secondary",
                )}
              >
                <span className="flex items-center">
                  <span
                    className={cn(
                      "mr-2 h-2 w-2 rounded-full",
                      config.colorClass,
                    )}
                  />
                  {t(`roles.${roleKey}`)}
                </span>
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
            "flex h-11 w-full cursor-pointer items-center justify-between gap-2 px-3.5 text-xs font-semibold outline-none transition-all duration-150 shadow-none border bg-background border-border hover:bg-secondary/50",
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
