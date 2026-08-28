import {
  ATTENDANCE_REQUIREMENT_OPTIONS,
  CANCELLATION_POLICY_OPTIONS,
  EVENT_OPERATING_DAYS_OPTIONS,
} from "@/components/common/search/constants/range";
import type {
  StartDateValue,
  TempStartDateValue,
} from "@/components/common/search/constants/types";
import type { StallDetail } from "@/lib/data/schema/stall/get_stall_detail";
import {
  CalendarClock,
  CalendarDays,
  FileText,
  Repeat,
  ShieldAlert,
  UserCheck,
} from "lucide-react";

function ordinal(n: number) {
  const suffixes = ["th", "st", "nd", "rd"];
  const v = n % 100;
  return `${n}${suffixes[(v - 20) % 10] ?? suffixes[v] ?? suffixes[0]}`;
}

function formatStartDate(opt: StartDateValue | number) {
  if (opt === "eom") return "End of month";
  const day = Number(opt);
  return Number.isFinite(day) ? ordinal(day) : String(opt);
}

function sortStartDates(options: (StartDateValue | number)[]) {
  return [...options].sort((a, b) => {
    if (a === "eom") return 1;
    if (b === "eom") return -1;
    return Number(a) - Number(b);
  });
}

const TEMP_START_DATE_LABEL: Record<string, string> = {
  event_day_1: "Event Day 1",
  event_day_2: "Event Day 2",
  event_week_1: "First Week of Event",
};

function formatTempStartDate(opt: TempStartDateValue | string) {
  return TEMP_START_DATE_LABEL[opt] ?? String(opt);
}

export function StallLeaseRules({ stall }: { stall: StallDetail }) {
  if (stall.permanenceType === "temporary") {
    const operatingDaysLabel = EVENT_OPERATING_DAYS_OPTIONS.find(
      (o) => o.value === stall.leaseRules.operatingDays,
    )?.label;
    const attendance = ATTENDANCE_REQUIREMENT_OPTIONS.find(
      (o) => o.value === stall.leaseRules.attendanceRequirement,
    );
    const cancellation = CANCELLATION_POLICY_OPTIONS.find(
      (o) => o.value === stall.leaseRules.cancellationPolicy,
    );

    return (
      <div>
        <h2 className="text-lg font-semibold text-foreground">Booking Terms</h2>

        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="rounded-xl border border-border bg-card p-4">
            <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
              <Repeat className="h-4 w-4 text-primary" />
              Minimum Booking Length
            </div>
            <p className="mt-1.5 text-sm text-muted-foreground">
              {stall.leaseRules.minimumLeaseDays} day
              {stall.leaseRules.minimumLeaseDays > 1 ? "s" : ""}
            </p>
          </div>

          <div className="rounded-xl border border-border bg-card p-4">
            <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
              <CalendarDays className="h-4 w-4 text-primary" />
              Event Days Schedule
            </div>
            <p className="mt-1.5 text-sm text-muted-foreground">
              {operatingDaysLabel ?? "—"}
            </p>
          </div>

          <div className="rounded-xl border border-border bg-card p-4">
            <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
              <UserCheck className="h-4 w-4 text-primary" />
              Attendance Requirement
            </div>
            <p className="mt-1.5 text-sm text-muted-foreground">
              {attendance?.label ?? "—"}
            </p>
            {attendance?.description && (
              <p className="mt-1 text-xs text-muted-foreground">
                {attendance.description}
              </p>
            )}
          </div>

          <div className="rounded-xl border border-border bg-card p-4">
            <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
              <ShieldAlert className="h-4 w-4 text-primary" />
              Cancellation & Early Exit
            </div>
            <p className="mt-1.5 text-sm text-muted-foreground">
              {cancellation?.label ?? "—"}
            </p>
            {cancellation?.description && (
              <p className="mt-1 text-xs text-muted-foreground">
                {cancellation.description}
              </p>
            )}
          </div>
        </div>

        <div className="mt-4 rounded-xl border border-border bg-card p-4">
          <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
            <CalendarClock className="h-4 w-4 text-primary" />
            Available Start Days
          </div>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {stall.leaseRules.startDateOptions.map((opt) => (
              <span
                key={String(opt)}
                className="rounded-full border border-primary/20 bg-primary/5 px-2.5 py-1 text-xs font-medium text-primary"
              >
                {formatTempStartDate(opt)}
              </span>
            ))}
          </div>
        </div>

        <div className="mt-4 rounded-xl border border-border bg-card p-4">
          <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
            <FileText className="h-4 w-4 text-primary" />
            Utility Terms
          </div>
          <p className="mt-1.5 text-sm text-muted-foreground">
            {stall.leaseRules.utilityTerms}
          </p>
        </div>

        {stall.houseRules.length > 0 && (
          <div className="mt-4 rounded-xl border border-border bg-card p-4">
            <p className="text-sm font-semibold text-foreground">Booth Rules</p>
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

  // permanent / semi-permanent share the same lease-rules shape
  const { leaseRules } = stall;
  const sortedStartDates = sortStartDates(
    leaseRules.startDateOptions as (StartDateValue | number)[],
  );

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
            The owner allows move-in on these days:
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
