import type { StartDateValue } from "@/components/common/search/util/SearchConstants";
import type { StallDetail } from "@/lib/data/schema/stall/get_stall_detail";
import { CalendarClock, FileText, Repeat } from "lucide-react";

function ordinal(n: number) {
  const suffixes = ["th", "st", "nd", "rd"];
  const v = n % 100;
  return `${n}${suffixes[(v - 20) % 10] ?? suffixes[v] ?? suffixes[0]}`;
}

function formatStartDate(opt: StartDateValue | string) {
  if (opt === "eom") return "End of month";
  const day = Number(opt);
  return Number.isFinite(day) ? ordinal(day) : String(opt);
}

// Numeric days first (ascending), "end of month" last — reads like a calendar, not raw data order
function sortStartDates(options: (StartDateValue | string)[]) {
  return [...options].sort((a, b) => {
    if (a === "eom") return 1;
    if (b === "eom") return -1;
    return Number(a) - Number(b);
  });
}

export function StallLeaseRules({ stall }: { stall: StallDetail }) {
  const { leaseRules } = stall;
  const sortedStartDates = sortStartDates(leaseRules.startDateOptions);

  return (
    <div>
      <h2 className="text-lg font-semibold text-foreground">Lease Terms</h2>

      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="rounded-xl border border-border bg-card p-4">
          <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
            <Repeat className="h-4 w-4 text-primary" />
            Minimum Lease Period
          </div>
          <p className="mt-1.5 text-sm text-muted-foreground">
            {leaseRules.minimumLeaseMonths} months
          </p>
        </div>

        <div className="rounded-xl border border-border bg-card p-4">
          <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
            <CalendarClock className="h-4 w-4 text-primary" />
            Available Start Dates
          </div>
          <p className="mt-1.5 text-xs text-muted-foreground">
            The owner allows move-in on these specific days:
          </p>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {sortedStartDates.map((opt) => (
              <span
                key={String(opt)}
                className="rounded-full border border-primary/20 bg-primary/5 px-2.5 py-1 text-xs font-medium text-primary"
              >
                {formatStartDate(opt)}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-4 rounded-xl border border-border bg-card p-4">
        <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
          <FileText className="h-4 w-4 text-primary" />
          Utility Terms
        </div>
        <p className="mt-1.5 text-sm text-muted-foreground">
          {leaseRules.utilityTerms}
        </p>
      </div>

      {stall.houseRules.length > 0 && (
        <div className="mt-4 rounded-xl border border-border bg-card p-4">
          <p className="text-sm font-semibold text-foreground">House Rules</p>
          <ul className="mt-2 space-y-1.5">
            {stall.houseRules.map((rule) => (
              <li
                key={rule}
                className="flex items-start gap-2 text-sm text-muted-foreground"
              >
                <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-muted-foreground" />
                {rule}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
