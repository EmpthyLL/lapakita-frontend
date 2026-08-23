"use client";

import { DocType } from "@/lib/data/schema/public/get_legal";
import { cn } from "@/lib/utils";
import { Cookie, FileText, ShieldCheck } from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_ITEMS: { slug: DocType; icon: typeof FileText }[] = [
  { slug: "terms", icon: FileText },
  { slug: "privacy", icon: ShieldCheck },
  { slug: "cookies", icon: Cookie },
];

export function LegalNav() {
  const pathname = usePathname();
  const t = useTranslations("public.legal.docs");

  return (
    <nav className="flex gap-2 overflow-x-auto lg:flex-col lg:overflow-visible">
      {NAV_ITEMS.map((item) => {
        const href = `/${item.slug}`;
        const active = pathname.endsWith(href);
        const Icon = item.icon;

        return (
          <Link
            key={item.slug}
            href={href}
            className={cn(
              "flex shrink-0 items-center gap-2 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-colors lg:shrink",
              active
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-secondary hover:text-foreground",
            )}
          >
            <Icon className="h-4 w-4" />
            {t(`${item.slug}.label`)}
          </Link>
        );
      })}
    </nav>
  );
}
