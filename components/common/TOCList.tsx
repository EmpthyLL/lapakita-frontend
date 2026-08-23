"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { cn, generateSlug } from "@/lib/utils";
import { useTranslations } from "next-intl";

export interface TocItem {
  id?: string;
  title: string;
}

interface TocListProps {
  items: TocItem[];
  isLoading?: boolean;
}

export function TocList({ items, isLoading = false }: TocListProps) {
  const t = useTranslations("common.toc");

  if (isLoading) {
    return (
      <div className="rounded-2xl border border-border bg-secondary/30 p-5">
        <Skeleton className="mb-3 h-4 w-24 rounded-md" />
        <div className="space-y-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center gap-2 px-2.5 py-1.5">
              <Skeleton className="h-4 w-4 shrink-0 rounded-md" />
              <Skeleton
                className="h-4 rounded-md"
                style={{ width: `${60 + (i % 3) * 15}%` }}
              />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!items || items.length === 0) return null;

  return (
    <div className="rounded-2xl border border-border bg-secondary/30 p-5">
      <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        {t("on_this_page")}
      </p>
      <ul className="space-y-1">
        {items.map((item, id) => {
          const targetId = item.id || generateSlug(item.title);
          return (
            <li key={item.id || id}>
              <a
                href={`#${targetId}`}
                className={cn(
                  "block rounded-lg px-2.5 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-background hover:text-foreground",
                )}
              >
                <span className="mr-1.5 text-primary">{id + 1}.</span>
                {item.title}
              </a>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
