"use client";

import {
  CalendarClock,
  CalendarDays,
  ShieldAlert,
  UserCheck,
} from "lucide-react";

import { Autocomplete } from "../input/Autocomplete";
import {
  ATTENDANCE_REQUIREMENT_OPTIONS,
  CANCELLATION_POLICY_OPTIONS,
  DAY_OF_MONTH_OPTIONS,
  EVENT_OPERATING_DAYS_OPTIONS,
  LEASE_MONTHS_OPTIONS,
  MIN_LEASE_PERIOD_PRESETS,
  START_DATE_PRESETS,
} from "./constants/range";
import { StallPermanenceType } from "./constants/types";

interface LeaseTermsPickerProps {
  permanenceType: StallPermanenceType;

  // Common / Permanent / Semi-Permanent Props
  startDate: string;
  onStartDateChange: (value: string) => void;
  customStartDay: string;
  onCustomStartDayChange: (value: string) => void;

  minLeasePeriod: string;
  onMinLeasePeriodChange: (value: string) => void;
  customLeaseMonths: string;
  onCustomLeaseMonthsChange: (value: string) => void;

  // Temporary / Pop-Up Specific Filters
  eventOperatingDays: string;
  onEventOperatingDaysChange: (value: string) => void;

  attendanceRequirement: string;
  onAttendanceRequirementChange: (value: string) => void;

  cancellationPolicy: string;
  onCancellationPolicyChange: (value: string) => void;
}

export function LeaseTermsPicker({
  permanenceType,
  startDate,
  onStartDateChange,
  customStartDay,
  onCustomStartDayChange,
  minLeasePeriod,
  onMinLeasePeriodChange,
  customLeaseMonths,
  onCustomLeaseMonthsChange,
  eventOperatingDays,
  onEventOperatingDaysChange,
  attendanceRequirement,
  onAttendanceRequirementChange,
  cancellationPolicy,
  onCancellationPolicyChange,
}: LeaseTermsPickerProps) {
  const isTemporary = permanenceType === "temporary";

  // Objek pencari deskripsi berdasarkan value terpilih
  const selectedAttendance = ATTENDANCE_REQUIREMENT_OPTIONS.find(
    (opt) => opt.value === attendanceRequirement,
  );
  const selectedCancellation = CANCELLATION_POLICY_OPTIONS.find(
    (opt) => opt.value === cancellationPolicy,
  );

  if (isTemporary) {
    return (
      <div className="space-y-5">
        {/* 1. Operating Days Schedule */}
        <div>
          <p className="mb-2 flex items-center gap-1.5 text-xs font-semibold text-muted-foreground">
            <CalendarDays className="h-3.5 w-3.5" />
            Event Days Schedule
          </p>
          <Autocomplete
            value={eventOperatingDays}
            onSelect={(v) => onEventOperatingDaysChange(String(v))}
            options={EVENT_OPERATING_DAYS_OPTIONS}
            placeholder="Any operating schedule"
            mode="solid"
          />
        </div>

        {/* 2. Attendance Requirement */}
        <div>
          <p className="mb-2 flex items-center gap-1.5 text-xs font-semibold text-muted-foreground">
            <UserCheck className="h-3.5 w-3.5" />
            Attendance Requirement
          </p>
          <Autocomplete
            value={attendanceRequirement}
            onSelect={(v) => onAttendanceRequirementChange(String(v))}
            options={ATTENDANCE_REQUIREMENT_OPTIONS}
            placeholder="Any attendance policy"
            mode="solid"
          />
          {selectedAttendance?.description && (
            <p className="mt-1.5 text-[11px] font-medium text-muted-foreground">
              {selectedAttendance.description}
            </p>
          )}
        </div>

        {/* 3. Cancellation / Early Exit Policy */}
        <div>
          <p className="mb-2 flex items-center gap-1.5 text-xs font-semibold text-muted-foreground">
            <ShieldAlert className="h-3.5 w-3.5" />
            Cancellation & Early Exit
          </p>
          <Autocomplete
            value={cancellationPolicy}
            onSelect={(v) => onCancellationPolicyChange(String(v))}
            options={CANCELLATION_POLICY_OPTIONS}
            placeholder="Any cancellation terms"
            mode="solid"
          />
          {selectedCancellation?.description && (
            <p className="mt-1.5 text-[11px] font-medium text-muted-foreground">
              {selectedCancellation.description}
            </p>
          )}
        </div>
      </div>
    );
  }

  // Tab Permanent / Semi-Permanent
  return (
    <div className="space-y-5">
      <div>
        <p className="mb-2 flex items-center gap-1.5 text-xs font-semibold text-muted-foreground">
          <CalendarClock className="h-3.5 w-3.5" />
          Desired Start Date
        </p>
        <Autocomplete
          value={startDate}
          onSelect={(v) => onStartDateChange(String(v))}
          options={[
            ...START_DATE_PRESETS,
            { value: "custom", label: "Custom day" },
          ]}
          placeholder="Any start date"
          mode="solid"
        />
        {startDate === "custom" && (
          <Autocomplete
            value={customStartDay}
            onSelect={(v) => onCustomStartDayChange(String(v))}
            options={DAY_OF_MONTH_OPTIONS}
            placeholder="Pick a day (1–28)"
            mode="solid"
            className="mt-2"
          />
        )}
      </div>

      <div>
        <p className="mb-2 flex items-center gap-1.5 text-xs font-semibold text-muted-foreground">
          <CalendarClock className="h-3.5 w-3.5" />
          Minimum Lease Period
        </p>
        <Autocomplete
          value={minLeasePeriod}
          onSelect={(v) => onMinLeasePeriodChange(String(v))}
          options={MIN_LEASE_PERIOD_PRESETS}
          placeholder="Any lease period"
          mode="solid"
        />
        {minLeasePeriod === "custom" && (
          <Autocomplete
            value={customLeaseMonths}
            onSelect={(v) => onCustomLeaseMonthsChange(String(v))}
            options={LEASE_MONTHS_OPTIONS}
            placeholder="Pick months (1–12)"
            mode="solid"
            className="mt-2"
          />
        )}
      </div>
    </div>
  );
}
