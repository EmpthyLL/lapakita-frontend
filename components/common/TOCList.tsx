"use client";

import { cn, generateSlug } from "@/lib/utils";

export interface TocItem {
  title: string;
}

interface TocListProps {
  items: TocItem[];
}

export function TocList({ items }: TocListProps) {
  return (
    <div className="rounded-2xl border border-border bg-secondary/30 p-5">
      <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        On this page
      </p>
      <ul className="space-y-1">
        {items.map((item, id) => (
          <li key={id}>
            <a
              href={`#${generateSlug(item.title)}`}
              className={cn(
                "block rounded-lg px-2.5 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-background hover:text-foreground",
              )}
            >
              <span className="mr-1.5 text-primary">{id + 1}.</span>
              {item.title}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
