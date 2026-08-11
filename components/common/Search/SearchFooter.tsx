import { ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";
import { SEARCH_CAPABILITIES } from "./SearchConstants";

export function StallSearchFooter() {
  return (
    <div className="mt-6 flex flex-col items-center justify-center gap-4">
      {/* Primary CTA Link for ROI/Budget Search */}
      <Link
        href="/stalls"
        className="group inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-2 text-sm font-semibold text-primary transition-all hover:border-primary/40 hover:bg-primary/10 hover:shadow-xs"
      >
        <Sparkles className="h-4 w-4 shrink-0 text-primary animate-pulse" />
        <span>
          Have a specific budget & ROI timeline? Try Budget & ROI Match
        </span>
        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
      </Link>

      {/* Feature Capability Pills (Clean, Modern, Non-Overclaiming) */}
      <div className="flex flex-wrap items-center justify-center gap-3 text-xs text-muted-foreground">
        {SEARCH_CAPABILITIES.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.highlight}
              className="flex items-center gap-2 rounded-lg border border-border/60 bg-background/80 px-3 py-1.5 shadow-2xs backdrop-blur-xs"
            >
              <Icon className="h-3.5 w-3.5 text-primary" />
              <span className="font-medium text-foreground">
                {item.highlight}:
              </span>
              <span>{item.label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
