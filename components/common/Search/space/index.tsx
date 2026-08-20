"use client";

import { getAllowedPlacements } from "../constants/permanance";
import {
  StallPermanenceType,
  StallPlacement,
  StallPropertyTypeValue,
} from "../constants/types";
import { PermanentSpaceFields } from "./PermanentSpaceFields";
import { SemiPermanentSpaceFields } from "./SemiPermanentSpaceFields";
import { TemporarySpaceFields } from "./TemporarySpaceFields";

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

  if (props.permanenceType === "semi-permanent") {
    return (
      <SemiPermanentSpaceFields
        allowedPlacements={allowedPlacements}
        placement={props.placement}
        onPlacementChange={props.onPlacementChange}
        openingTime={props.openingTime}
        onOpeningTimeChange={props.onOpeningTimeChange}
        closingTime={props.closingTime}
        onClosingTimeChange={props.onClosingTimeChange}
      />
    );
  }

  if (props.permanenceType === "temporary") {
    return (
      <TemporarySpaceFields
        allowedPlacements={allowedPlacements}
        placement={props.placement}
        onPlacementChange={props.onPlacementChange}
        registrationDeadlineDays={props.registrationDeadlineDays}
        onRegistrationDeadlineDaysChange={
          props.onRegistrationDeadlineDaysChange
        }
        eventDurationDays={props.eventDurationDays}
        onEventDurationDaysChange={props.onEventDurationDaysChange}
      />
    );
  }

  return (
    <PermanentSpaceFields
      allowedPlacements={allowedPlacements}
      placement={props.placement}
      onPlacementChange={props.onPlacementChange}
      floorCount={props.floorCount}
      onFloorCountChange={props.onFloorCountChange}
      stallSize={props.stallSize}
      onStallSizeChange={props.onStallSizeChange}
    />
  );
}
