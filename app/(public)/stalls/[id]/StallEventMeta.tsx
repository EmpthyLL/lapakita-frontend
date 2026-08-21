import type { TemporaryStallDetail } from "@/lib/data/schema/stall/get_stall_detail";
import { differenceInCalendarDays, format } from "date-fns";
import { CalendarDays, Clock3, Users } from "lucide-react";

export function StallEventMeta({
  eventMeta,
}: {
  eventMeta: TemporaryStallDetail["eventMeta"];
}) {
  const start = new Date(eventMeta.eventStartDate);
  const end = new Date(eventMeta.eventEndDate);
  const daysUntilDeadline = Math.max(
    differenceInCalendarDays(start, new Date()) -
      eventMeta.registrationDeadlineDaysBefore,
    0,
  );
  const slotsLeft = eventMeta.availableSlots;
  const isFillingUp = slotsLeft <= eventMeta.totalSlots * 0.3;

  return (
    <div className="rounded-2xl border-2 border-primary/20 bg-linear-to-br from-primary/5 to-transparent p-4">
      {eventMeta.eventName && (
        <p className="text-sm font-bold text-foreground">
          {eventMeta.eventName}
        </p>
      )}

      <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-3">
        <div className="flex items-start gap-2">
          <CalendarDays className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
          <div>
            <p className="text-xs font-semibold text-foreground">
              Event Window
            </p>
            <p className="text-xs text-muted-foreground">
              {format(start, "d MMM")} – {format(end, "d MMM yyyy")}
            </p>
          </div>
        </div>

        <div className="flex items-start gap-2">
          <Clock3 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
          <div>
            <p className="text-xs font-semibold text-foreground">
              Registration Deadline
            </p>
            <p className="text-xs text-muted-foreground">
              H-{eventMeta.registrationDeadlineDaysBefore} before start
              {daysUntilDeadline > 0 && ` (${daysUntilDeadline} days left)`}
            </p>
          </div>
        </div>

        <div className="flex items-start gap-2">
          <Users className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
          <div>
            <p className="text-xs font-semibold text-foreground">Booth Slots</p>
            <p
              className={
                isFillingUp
                  ? "text-xs font-semibold text-destructive"
                  : "text-xs text-muted-foreground"
              }
            >
              {slotsLeft} of {eventMeta.totalSlots} available
              {isFillingUp && " — filling up"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
