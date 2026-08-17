"use client";

import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Check, ChevronDown, Globe } from "lucide-react";
import { useState } from "react";

export const LANGUAGES: Record<string, string> = {
  id: "Indonesia",
  en: "English",
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
  const [open, setOpen] = useState(false);
  const [currentLocale, setCurrentLocale] = useState<string>("id");

  const handleLocaleChange = (nextLocale: string) => {
    setOpen(false);
    if (nextLocale === currentLocale) return;
    setCurrentLocale(nextLocale);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant={variant}
          size="sm"
          className={cn(
            "flex h-8 cursor-pointer items-center justify-between gap-1 rounded-md px-2 text-xs font-semibold outline-none transition-all duration-150 shadow-none",
            open && "border-primary ring-2 ring-primary/20",
            className,
          )}
        >
          <div className="flex items-center gap-1.5 min-w-0">
            <Globe className="h-3.5 w-3.5 shrink-0 text-primary" />
            <span className="uppercase text-foreground font-semibold text-[11px]">
              {currentLocale}
            </span>
            {showLabel && (
              <span className="hidden text-muted-foreground/80 text-[11px] sm:inline">
                ({LANGUAGES[currentLocale]})
              </span>
            )}
          </div>

          <ChevronDown
            className={cn(
              "h-4 w-4 shrink-0 text-muted-foreground stroke-[2.25] transition-transform duration-150 opacity-60",
              open && "rotate-180 opacity-90 text-primary",
            )}
          />
        </Button>
      </PopoverTrigger>

      <PopoverContent align="end" className="w-36 rounded-md p-1 shadow-md">
        {Object.entries(LANGUAGES).map(([key, name]) => {
          const isSelected = currentLocale === key;
          return (
            <button
              key={key}
              type="button"
              onClick={() => handleLocaleChange(key)}
              className={cn(
                "flex w-full items-center justify-between rounded-md px-2.5 py-1.5 text-xs font-semibold transition-colors outline-none",
                isSelected
                  ? "bg-primary/10 text-primary font-bold"
                  : "text-foreground hover:bg-secondary",
              )}
            >
              {name}
              {isSelected && <Check className="h-3.5 w-3.5 text-primary" />}
            </button>
          );
        })}
      </PopoverContent>
    </Popover>
  );
}
