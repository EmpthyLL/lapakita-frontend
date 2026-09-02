"use client";

import { SegmentedToggle } from "../../input/SegmentedToggle";
import {
  getAllowedPlacements,
  STALL_PLACEMENT_OPTIONS,
} from "../constants/permanance";
import {
  StallPermanenceType,
  StallPlacement,
  StallPropertyTypeValue,
} from "../constants/types";
import { PermanentSpaceFields } from "./PermanentSpaceFields";
import { SemiPermanentSpaceFields } from "./SemiPermanentSpaceFields";
import { TemporarySpaceFields } from "./TemporarySpaceFields";

const SHORT_LABEL: Record<StallPlacement, string> = {
  indoor: "Indoor",
  "semi-outdoor": "Semi-Outdoor",
  outdoor: "Outdoor",
};

interface StallSpaceFilterProps {
  permanenceType: StallPermanenceType;
  selectedPropertyTypes: StallPropertyTypeValue[];

  // General placement (Indoor / Semi-Outdoor / Outdoor)
  placement: StallPlacement | "";
  onPlacementChange: (value: StallPlacement | "") => void;

  // Permanent-only
  floorCount: [number, number];
  onFloorCountChange: (value: [number, number]) => void;
  stallSize: [number, number];
  onStallSizeChange: (value: [number, number]) => void;

  // Semi-permanent-only
  openingTime: string;
  onOpeningTimeChange: (value: string) => void;
  closingTime: string;
  onClosingTimeChange: (value: string) => void;

  // Temporary-only
  registrationDeadlineDays: number | null;
  onRegistrationDeadlineDaysChange: (value: number) => void;
  eventDurationDays: number | null;
  onEventDurationDaysChange: (value: number) => void;
}

export function StallSpaceFilter(props: StallSpaceFilterProps) {
  const allowedPlacements = getAllowedPlacements(
    props.selectedPropertyTypes,
    props.permanenceType,
  );

  const placementOptions = STALL_PLACEMENT_OPTIONS.filter((opt) =>
    allowedPlacements.includes(opt.value),
  ).map((opt) => ({
    value: opt.value,
    label: opt.label,
    shortLabel: SHORT_LABEL[opt.value],
  }));

  return (
    <div className="flex flex-col gap-5">
      {/* Placement dipindah keluar dari file-file spesifik permanence, menjadi komponen global di atas */}
      {placementOptions.length > 0 && (
        <div>
          <p className="mb-2 text-xs font-semibold text-muted-foreground">
            Stall Placement
          </p>
          <SegmentedToggle
            value={props.placement}
            onChange={props.onPlacementChange}
            options={placementOptions}
          />
        </div>
      )}

      {/* Render komponen spesifik permanence di bawahnya */}
      {props.permanenceType === "semi-permanent" ? (
        <SemiPermanentSpaceFields
          openingTime={props.openingTime}
          onOpeningTimeChange={props.onOpeningTimeChange}
          closingTime={props.closingTime}
          onClosingTimeChange={props.onClosingTimeChange}
        />
      ) : props.permanenceType === "temporary" ? (
        <TemporarySpaceFields
          registrationDeadlineDays={props.registrationDeadlineDays}
          onRegistrationDeadlineDaysChange={
            props.onRegistrationDeadlineDaysChange
          }
          eventDurationDays={props.eventDurationDays}
          onEventDurationDaysChange={props.onEventDurationDaysChange}
        />
      ) : (
        <PermanentSpaceFields
          floorCount={props.floorCount}
          onFloorCountChange={props.onFloorCountChange}
          stallSize={props.stallSize}
          onStallSizeChange={props.onStallSizeChange}
        />
      )}
    </div>
  );
}
