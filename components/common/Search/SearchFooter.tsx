import { Target } from "lucide-react";
import Link from "next/link";
import { TRUST_STATS } from "./SearchConstants";

export function StallSearchFooter() {
  return (
    <div className="mt-5 flex flex-wrap items-center justify-center gap-x-8 gap-y-3.5">
      <Link
        href="/stalls"
        className="inline-flex shrink-0 items-center gap-2 whitespace-nowrap text-base font-medium text-primary hover:underline"
      >
        <Target className="h-4 w-4" />
        Have a budget & break-even target? Try Budget & ROI Match
      </Link>

      <ul className="flex flex-wrap items-center divide-x divide-border text-sm text-muted-foreground">
        {TRUST_STATS.map((stat) => (
          <li
            key={stat.label}
            className="flex items-center gap-2 whitespace-nowrap px-3.5 first:pl-0"
          >
            <stat.icon className="h-4 w-4 text-primary/60" />
            <span className="font-semibold text-foreground">{stat.value}</span>
            {stat.label}
          </li>
        ))}
      </ul>
    </div>
  );
}
