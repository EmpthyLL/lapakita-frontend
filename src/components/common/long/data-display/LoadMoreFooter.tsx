"use client";

import { Button } from "@/components/ui/button";
import { ChevronDown, Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";

export function LoadMoreFooter({
  onClick,
  isLoading,
}: {
  onClick: () => void;
  isLoading: boolean;
}) {
  const t = useTranslations("common.display_table");

  return (
    <div className="relative">
      {/* Decorative teaser — a blurred hint of more content, fading into the page */}
      <div
        aria-hidden
        className="pointer-events-none relative h-28 overflow-hidden rounded-2xl"
      >
        <div className="absolute inset-0 grid grid-cols-1 gap-3 opacity-50 blur-[3px] sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="h-24 rounded-2xl border border-border bg-secondary/40"
            />
          ))}
        </div>
        <div className="absolute inset-0 bg-linear-to-b from-transparent via-background/80 to-background" />
      </div>

      <div className="relative -mt-10 flex justify-center pb-2">
        <Button
          type="button"
          variant="outline"
          size="lg"
          onClick={onClick}
          disabled={isLoading}
          className="gap-2 rounded-full border-primary/30 bg-card px-6 shadow-md hover:border-primary hover:bg-primary/5"
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin text-primary" />
          ) : (
            <ChevronDown className="h-4 w-4 text-primary" />
          )}
          {t("load_more")}
        </Button>
      </div>
    </div>
  );
}
