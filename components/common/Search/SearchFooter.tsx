import Link from "next/link";
import { Target } from "lucide-react";
import { TRUST_STATS } from "./SearchConstants";

export function StallSearchFooter() {
  return (
    <div className="mt-4 flex flex-wrap items-center justify-center gap-x-6 gap-y-3">
      <Link
        href="/stalls"
        className="inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap text-sm font-medium text-primary hover:underline"
      >
        <Target className="h-3.5 w-3.5" />
        Have a budget & break-even target? Try Budget & ROI Match
      </Link>

      <ul className="flex flex-wrap items-center divide-x divide-border text-xs text-muted-foreground">
        {TRUST_STATS.map((stat) => (
          <li
            key={stat.label}
            className="flex items-center gap-1.5 whitespace-nowrap px-3 first:pl-0"
          >
            <stat.icon className="h-3.5 w-3.5 text-primary/60" />
            <span className="font-semibold text-foreground">{stat.value}</span>
            {stat.label}
          </li>
        ))}
      </ul>
    </div>
  );
}
