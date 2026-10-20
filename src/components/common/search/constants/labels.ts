import { MASTER_FACILITIES } from "./facilities";
import { LANDMARK_CATEGORIES } from "./landmark";
import {
  STALL_PERMANENCE_TABS,
  STALL_PLACEMENT_OPTIONS,
  STALL_PROPERTY_TYPES,
} from "./permanance";
import {
  ATTENDANCE_REQUIREMENT_OPTIONS,
  CANCELLATION_POLICY_OPTIONS,
  EVENT_OPERATING_DAYS_OPTIONS,
  PAYMENT_CYCLE_OPTIONS,
} from "./range";
import type {
  AttendanceRequirementValue,
  CancellationPolicyValue,
  EventOperatingDaysValue,
  FacilityValue,
  LandmarkCategoryValue,
  PaymentCycle,
  StallPermanenceType,
  StallPlacement,
  StallPropertyTypeValue,
} from "./types";

export type StallConstantMode =
  | "propertyType"
  | "placement"
  | "permanenceType"
  | "paymentCycle"
  | "facility"
  | "landmarkCategory"
  | "eventOperatingDays"
  | "attendanceRequirement"
  | "cancellationPolicy";

type StallConstantValue =
  | StallPropertyTypeValue
  | StallPlacement
  | StallPermanenceType
  | PaymentCycle
  | FacilityValue
  | LandmarkCategoryValue
  | EventOperatingDaysValue
  | AttendanceRequirementValue
  | CancellationPolicyValue;

export function getStallConstantLabel(
  mode: StallConstantMode,
  value: StallConstantValue | string,
): string {
  switch (mode) {
    case "propertyType":
      return (
        STALL_PROPERTY_TYPES.find((option) => option.value === value)?.label ??
        humanize(value)
      );
    case "placement":
      return (
        STALL_PLACEMENT_OPTIONS.find((option) => option.value === value)
          ?.label ?? humanize(value)
      );
    case "permanenceType":
      return (
        STALL_PERMANENCE_TABS.find((option) => option.value === value)
          ?.shortLabel ?? humanize(value)
      );
    case "paymentCycle":
      return (
        PAYMENT_CYCLE_OPTIONS.find((option) => option.value === value)?.label ??
        humanize(value)
      );
    case "facility":
      return (
        MASTER_FACILITIES[value as FacilityValue]?.label ?? humanize(value)
      );
    case "landmarkCategory":
      return (
        LANDMARK_CATEGORIES.find((option) => option.value === value)?.label ??
        humanize(value)
      );
    case "eventOperatingDays":
      return (
        EVENT_OPERATING_DAYS_OPTIONS.find((option) => option.value === value)
          ?.label ?? humanize(value)
      );
    case "attendanceRequirement":
      return (
        ATTENDANCE_REQUIREMENT_OPTIONS.find((option) => option.value === value)
          ?.label ?? humanize(value)
      );
    case "cancellationPolicy":
      return (
        CANCELLATION_POLICY_OPTIONS.find((option) => option.value === value)
          ?.label ?? humanize(value)
      );
  }
}

function humanize(value: string): string {
  return value
    .replace(/[-_]+/g, " ")
    .replace(/\b\w/g, (character) => character.toUpperCase());
}
