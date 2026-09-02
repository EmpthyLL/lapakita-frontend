"use client";

import { StallSearchSchemaType } from "@/lib/data/schema/stall/get_stall";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useState } from "react";
import {
  DEFAULT_ASSUMED_CAPITAL,
  DEFAULT_BEP_MONTHS,
  DEPOSIT_RANGE,
  FLOOR_COUNT_RANGE,
  GENERAL_RENT_RANGE,
  STALL_SIZE_RANGE,
} from "../constants/range";
import {
  PaymentCycle,
  StallPermanenceType,
  StallPlacement,
  StallPropertyTypeValue,
} from "../constants/types";
import { createLandmarkRadiusEntry } from "../LandmarkRadiusPicker";

export function useStallSearchQuery() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [params, setParams] = useState<
    Omit<StallSearchSchemaType, "page" | "limit">
  >(() => {
    const permType =
      (searchParams.get("permanence") as StallPermanenceType) || "permanent";

    return {
      location: searchParams.get("location") || "",
      permanenceType: permType,
      landmarkEntries: searchParams.get("landmarks")
        ? JSON.parse(searchParams.get("landmarks")!)
        : [createLandmarkRadiusEntry()],
      propertyType: searchParams.get("propertyTypes")
        ? (searchParams
            .get("propertyTypes")!
            .split(",") as StallPropertyTypeValue[])
        : [],
      placement: (searchParams.get("placement") as StallPlacement) || "",

      businessType: searchParams.get("businessType") || "",
      facilities: searchParams.get("facilities")
        ? searchParams.get("facilities")!.split(",")
        : [],
      bepMonths: searchParams.get("bepMonths") || String(DEFAULT_BEP_MONTHS),
      customBepMonths: searchParams.get("customBep")
        ? Number(searchParams.get("customBep"))
        : null,
      capital: searchParams.get("capital")
        ? Number(searchParams.get("capital"))
        : DEFAULT_ASSUMED_CAPITAL,
      rentRange:
        searchParams.get("minRent") && searchParams.get("maxRent")
          ? [
              Number(searchParams.get("minRent")),
              Number(searchParams.get("maxRent")),
            ]
          : [GENERAL_RENT_RANGE.min, GENERAL_RENT_RANGE.max],
      depositRange:
        searchParams.get("minDeposit") && searchParams.get("maxDeposit")
          ? [
              Number(searchParams.get("minDeposit")),
              Number(searchParams.get("maxDeposit")),
            ]
          : [DEPOSIT_RANGE.min, DEPOSIT_RANGE.max],

      // Lease terms hanya dibaca jika permanen/semi-permanen (bukan temporary)
      startDate:
        permType !== "temporary" ? searchParams.get("startDate") || "" : "",
      customStartDay:
        permType !== "temporary"
          ? searchParams.get("customStartDay") || ""
          : "",
      minLeasePeriod:
        permType !== "temporary" ? searchParams.get("minLease") || "" : "",
      customLeaseMonths:
        permType !== "temporary"
          ? searchParams.get("customLeaseMonths") || ""
          : "",
      paymentCycle:
        permType !== "temporary"
          ? (searchParams.get("paymentCycle") as PaymentCycle) || ""
          : "",

      // Event terms khusus temporary
      eventOperatingDays:
        permType === "temporary" ? searchParams.get("eventDays") || "" : "",
      attendanceRequirement:
        permType === "temporary" ? searchParams.get("attendance") || "" : "",
      cancellationPolicy:
        permType === "temporary" ? searchParams.get("cancellation") || "" : "",

      sizeRange:
        permType === "permanent" &&
        searchParams.get("minSize") &&
        searchParams.get("maxSize")
          ? [
              Number(searchParams.get("minSize")),
              Number(searchParams.get("maxSize")),
            ]
          : [STALL_SIZE_RANGE.min, STALL_SIZE_RANGE.max],
      floorCountRange:
        permType === "permanent" &&
        searchParams.get("minFloor") &&
        searchParams.get("maxFloor")
          ? [
              Number(searchParams.get("minFloor")),
              Number(searchParams.get("maxFloor")),
            ]
          : [FLOOR_COUNT_RANGE.min, FLOOR_COUNT_RANGE.min],

      openingTime:
        permType === "semi-permanent"
          ? searchParams.get("openingTime") || "10:00"
          : "10:00",
      closingTime:
        permType === "semi-permanent"
          ? searchParams.get("closingTime") || "22:00"
          : "22:00",

      registrationDeadlineDays:
        permType === "temporary" && searchParams.get("regDeadline")
          ? Number(searchParams.get("regDeadline"))
          : null,
      eventDurationDays:
        permType === "temporary" && searchParams.get("eventDuration")
          ? Number(searchParams.get("eventDuration"))
          : null,
      sortBy: searchParams.get("sortBy") || "recommended",
    };
  });

  const buildQueryString = useCallback(
    (currentParams: Omit<StallSearchSchemaType, "page" | "limit">) => {
      const query = new URLSearchParams();

      if (currentParams.location) query.set("location", currentParams.location);
      if (currentParams.permanenceType)
        query.set("permanence", currentParams.permanenceType);
      if (currentParams.businessType)
        query.set("businessType", currentParams.businessType);
      if (currentParams.sortBy && currentParams.sortBy !== "recommended")
        query.set("sortBy", currentParams.sortBy);

      if (currentParams.propertyType.length)
        query.set("propertyTypes", currentParams.propertyType.join(","));
      if (currentParams.placement)
        query.set("placement", currentParams.placement);
      if (currentParams.facilities.length)
        query.set("facilities", currentParams.facilities.join(","));

      // Budget & Financial Parameters
      if (
        currentParams.bepMonths &&
        currentParams.bepMonths !== String(DEFAULT_BEP_MONTHS)
      )
        query.set("bepMonths", currentParams.bepMonths);
      if (currentParams.customBepMonths !== null)
        query.set("customBep", String(currentParams.customBepMonths));
      if (currentParams.capital !== DEFAULT_ASSUMED_CAPITAL)
        query.set("capital", String(currentParams.capital));

      if (
        currentParams.rentRange &&
        (currentParams.rentRange[0] > GENERAL_RENT_RANGE.min ||
          currentParams.rentRange[1] < GENERAL_RENT_RANGE.max)
      ) {
        query.set("minRent", String(currentParams.rentRange[0]));
        query.set("maxRent", String(currentParams.rentRange[1]));
      }

      if (
        currentParams.depositRange &&
        (currentParams.depositRange[0] > DEPOSIT_RANGE.min ||
          currentParams.depositRange[1] < DEPOSIT_RANGE.max)
      ) {
        query.set("minDeposit", String(currentParams.depositRange[0]));
        query.set("maxDeposit", String(currentParams.depositRange[1]));
      }

      // Parameter Lease & Event Terms dipisah secara ketat berdasarkan permanen vs temporary
      if (currentParams.permanenceType !== "temporary") {
        if (currentParams.paymentCycle)
          query.set("paymentCycle", currentParams.paymentCycle);
        if (currentParams.startDate)
          query.set("startDate", currentParams.startDate);
        if (currentParams.customStartDay)
          query.set("customStartDay", currentParams.customStartDay);
        if (currentParams.minLeasePeriod)
          query.set("minLease", currentParams.minLeasePeriod);
        if (currentParams.customLeaseMonths)
          query.set("customLeaseMonths", currentParams.customLeaseMonths);
      }

      if (currentParams.permanenceType === "temporary") {
        if (currentParams.eventOperatingDays)
          query.set("eventDays", currentParams.eventOperatingDays);
        if (currentParams.attendanceRequirement)
          query.set("attendance", currentParams.attendanceRequirement);
        if (currentParams.cancellationPolicy)
          query.set("cancellation", currentParams.cancellationPolicy);
      }

      // Parameter Spesifik Permanence Lainnya
      if (currentParams.permanenceType === "permanent") {
        if (
          currentParams.sizeRange &&
          (currentParams.sizeRange[0] > STALL_SIZE_RANGE.min ||
            currentParams.sizeRange[1] < STALL_SIZE_RANGE.max)
        ) {
          query.set("minSize", String(currentParams.sizeRange[0]));
          query.set("maxSize", String(currentParams.sizeRange[1]));
        }
        if (
          currentParams.floorCountRange &&
          (currentParams.floorCountRange[0] > FLOOR_COUNT_RANGE.min ||
            currentParams.floorCountRange[1] > FLOOR_COUNT_RANGE.min)
        ) {
          query.set("minFloor", String(currentParams.floorCountRange[0]));
          query.set("maxFloor", String(currentParams.floorCountRange[1]));
        }
      }

      if (currentParams.permanenceType === "semi-permanent") {
        if (
          currentParams.openingTime &&
          currentParams.openingTime !== "10:00"
        ) {
          query.set("openingTime", currentParams.openingTime);
        }
        if (
          currentParams.closingTime &&
          currentParams.closingTime !== "22:00"
        ) {
          query.set("closingTime", currentParams.closingTime);
        }
      }

      if (currentParams.permanenceType === "temporary") {
        if (currentParams.registrationDeadlineDays !== null) {
          query.set(
            "regDeadline",
            String(currentParams.registrationDeadlineDays),
          );
        }
        if (currentParams.eventDurationDays !== null) {
          query.set("eventDuration", String(currentParams.eventDurationDays));
        }
      }

      if (currentParams.landmarkEntries?.length) {
        const validEntries = currentParams.landmarkEntries.filter(
          (e) => e.landmark,
        );
        if (validEntries.length > 0) {
          query.set("landmarks", JSON.stringify(validEntries));
        }
      }

      return query.toString();
    },
    [],
  );

  const setParamValues = useCallback(
    (newValues: Partial<Omit<StallSearchSchemaType, "page" | "limit">>) => {
      setParams((prev) => ({ ...prev, ...newValues }));
    },
    [],
  );

  const commitSearch = useCallback(
    (mode: "hero" | "full") => {
      const queryString = buildQueryString(params);
      if (mode === "hero") {
        router.push(`/stalls?${queryString}`);
      } else {
        router.push(`?${queryString}`, { scroll: false });
      }
    },
    [params, router, buildQueryString],
  );

  return { params, setParamValues, commitSearch };
}
