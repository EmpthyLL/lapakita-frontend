"use client";

import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { usePathname, useRouter } from "@/i18n/routing";
import { cn } from "@/lib/utils";
import { VALID_ROLES, type Role } from "@/types";
import { useQueryClient } from "@tanstack/react-query";
import { Check, ChevronDown, Globe } from "lucide-react";
import { useSession } from "next-auth/react";
import { Locale, useLocale } from "next-intl";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export const LANGUAGES: Record<string, string> = {
  en: "English",
  id: "Indonesia",
};

const ROLE_ACTIVE_STYLES: Record<
  Role,
  { border: string; ring: string; text: string; background: string }
> = {
  tenant: {
    border: "border-tenant",
    ring: "ring-tenant/20",
    text: "text-tenant",
    background: "bg-tenant/10",
  },
  owner: {
    border: "border-owner",
    ring: "ring-owner/20",
    text: "text-owner",
    background: "bg-owner/10",
  },
  supplier: {
    border: "border-supplier",
    ring: "ring-supplier/20",
    text: "text-supplier",
    background: "bg-supplier/10",
  },
};

interface LanguageSwitcherProps {
  variant?: "outline" | "ghost" | "default";
  className?: string;
  showLabel?: boolean;
}

export function LanguageSwitcher({
  variant = "outline",
  className,
  showLabel = true,
}: LanguageSwitcherProps) {
  const queryClient = useQueryClient();
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { data: session } = useSession();

  const [open, setOpen] = useState(false);
  const pathSegments = pathname.split("/").filter(Boolean);
  const dashboardIndex = pathSegments.lastIndexOf("dashboard");
  const routeRole = pathSegments[dashboardIndex + 1] as Role;
  const sessionRole = session?.user?.activeRole ?? "tenant";
  const activeRole =
    dashboardIndex >= 0 && VALID_ROLES.includes(routeRole)
      ? routeRole
      : sessionRole;
  const activeRoleStyle = ROLE_ACTIVE_STYLES[activeRole];

  const handleLocaleChange = (nextLocale: string) => {
    setOpen(false);
    if (nextLocale === locale) return;

    const params = new URLSearchParams(searchParams.toString());
    const pathnameWithParams = params.toString()
      ? `${pathname}?${params.toString()}`
      : pathname;

    router.replace(pathnameWithParams, {
      locale: nextLocale as Locale,
      scroll: false,
    });
  };

  useEffect(() => {
    queryClient.invalidateQueries();
  }, [locale, queryClient]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant={variant}
          size="sm"
          className={cn(
            "flex h-8 cursor-pointer items-center justify-between gap-1 rounded-md border px-2 text-xs font-semibold outline-none transition-all duration-150 shadow-none",
            activeRoleStyle.border,
            open && cn("ring-2", activeRoleStyle.ring),
            className,
          )}
        >
          <div className="flex items-center gap-1.5 min-w-0">
            <Globe
              className={cn("h-3.5 w-3.5 shrink-0", activeRoleStyle.text)}
            />
            <span className="uppercase text-foreground font-semibold text-[11px]">
              {locale}
            </span>
            {showLabel && (
              <span className="hidden text-muted-foreground/80 text-[11px] sm:inline">
                ({LANGUAGES[locale] ?? locale})
              </span>
            )}
          </div>

          <ChevronDown
            className={cn(
              "h-4 w-4 shrink-0 stroke-[2.25] transition-transform duration-150 opacity-60",
              activeRoleStyle.text,
              open && cn("rotate-180 opacity-90", activeRoleStyle.text),
            )}
          />
        </Button>
      </PopoverTrigger>

      <PopoverContent
        align="end"
        className="z-70 w-36 rounded-md p-1 shadow-md"
      >
        {Object.entries(LANGUAGES).map(([key, name]) => {
          const isSelected = locale === key;
          return (
            <button
              key={key}
              type="button"
              onClick={() => handleLocaleChange(key)}
              className={cn(
                "flex w-full items-center justify-between rounded-md px-2.5 py-1.5 text-xs font-semibold transition-colors outline-none",
                isSelected
                  ? cn(
                      activeRoleStyle.background,
                      activeRoleStyle.text,
                      "font-bold",
                    )
                  : "text-foreground hover:bg-secondary",
              )}
            >
              {name}
              {isSelected && (
                <Check className={cn("h-3.5 w-3.5", activeRoleStyle.text)} />
              )}
            </button>
          );
        })}
      </PopoverContent>
    </Popover>
  );
}
