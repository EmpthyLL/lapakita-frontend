"use client";

import { LegalSection } from "@/lib/data/schema/public/get_legal";
import { cn } from "@/lib/utils";

export function LegalToc({ sections }: { sections: LegalSection[] }) {
  return (
    <div className="rounded-2xl border border-border bg-secondary/30 p-5">
      <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        On this page
      </p>
      <ul className="space-y-1">
        {sections.map((section) => (
          <li key={section.id}>
            <a
              href={`#${section.id}`}
              className={cn(
                "block rounded-lg px-2.5 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-background hover:text-foreground",
              )}
            >
              <span className="mr-1.5 text-primary">{section.number}.</span>
              {section.title}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
