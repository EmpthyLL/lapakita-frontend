"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FileText, ShieldCheck, Cookie } from "lucide-react";
import { cn } from "@/lib/utils";
import { LEGAL_DOCUMENTS } from "@/lib/data/schema/public/get_legal";

const ICONS = {
  terms: FileText,
  privacy: ShieldCheck,
  cookies: Cookie,
} as const;

export function LegalNav() {
  const pathname = usePathname();

  return (
    <nav className="flex gap-2 overflow-x-auto lg:flex-col lg:overflow-visible">
      {LEGAL_DOCUMENTS.map((doc) => {
        const href = `/${doc.slug}`;
        const active = pathname === href;
        const Icon = ICONS[doc.slug];
        return (
          <Link
            key={doc.slug}
            href={href}
            className={cn(
              "flex shrink-0 items-center gap-2 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-colors lg:shrink",
              active
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-secondary hover:text-foreground",
            )}
          >
            <Icon className="h-4 w-4" />
            {doc.label}
          </Link>
        );
      })}
    </nav>
  );
}
