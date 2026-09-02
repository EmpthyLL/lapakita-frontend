/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { StallSearchSchemaType } from "@/lib/data/schema/stall/get_stall";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useState } from "react";
import {
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

// Mapping eksplisit agar key di URL konsisten dan sesuai dengan schema backend
const URL_TO_SCHEMA_MAP: Record<string, keyof StallSearchSchemaType> = {
  location: "location",
  permanenceType: "permanenceType",
  landmarks: "landmarkEntries",
  propertyTypes: "propertyType",
  placement: "placement",
  businessType: "businessType",
  facilities: "facilities",
  bepMonths: "bepMonths",
  capital: "capital",
  minRent: "rentRange",
  maxRent: "rentRange",
  minDeposit: "depositRange",
  maxDeposit: "depositRange",
  startDate: "startDate",
  minLease: "minLeasePeriod",
  paymentCycle: "paymentCycle",
  eventDays: "eventOperatingDays",
  attendance: "attendanceRequirement",
  cancellation: "cancellationPolicy",
  minSize: "sizeRange",
  maxSize: "sizeRange",
  minFloor: "floorCountRange",
  maxFloor: "floorCountRange",
  openingTime: "openingTime",
  closingTime: "closingTime",
  regDeadline: "registrationDeadlineDays",
  eventDuration: "eventDurationDays",
  sortBy: "sortBy",
};

export function getCleanBackendQuery(
  searchParams: URLSearchParams,
): Record<string, any> {
  const queryObj: Record<string, any> = {};

  searchParams.forEach((val, key) => {
    const schemaKey = URL_TO_SCHEMA_MAP[key] || key;

    // Handle array / JSON parsing untuk schema tertentu
    if (schemaKey === "landmarkEntries") {
      try {
        queryObj[schemaKey] = JSON.parse(val);
      } catch {
        queryObj[schemaKey] = [];
      }
    } else if (schemaKey === "propertyType" || schemaKey === "facilities") {
      queryObj[schemaKey] = val ? val.split(",") : [];
    } else if (
      schemaKey === "rentRange" ||
      schemaKey === "depositRange" ||
      schemaKey === "sizeRange" ||
      schemaKey === "floorCountRange"
    ) {
      // Range biasanya dikirim sebagai min & max terpisah di URL, di-mapping jika perlu atau biarkan sesuai struktur backend
      if (!queryObj[schemaKey]) queryObj[schemaKey] = [0, 0];
      if (key.startsWith("min")) queryObj[schemaKey][0] = Number(val);
      if (key.startsWith("max")) queryObj[schemaKey][1] = Number(val);
    } else {
      queryObj[schemaKey] = val;
    }
  });

  return queryObj;
}

export function useStallSearchQuery() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [params, setParams] = useState<
    Omit<StallSearchSchemaType, "page" | "limit">
  >(() => {
    const permType =
      (searchParams.get("permanenceType") as StallPermanenceType) ||
      "permanent";

    return {
      location: searchParams.get("location") || "",
      permanenceType: permType,
      landmarkEntries: searchParams.get("landmarks")
        ? JSON.parse(searchParams.get("landmarks")!)
        : [],
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

      bepMonths: searchParams.get("bepMonths") || "",
      capital: searchParams.get("capital")
        ? Number(searchParams.get("capital"))
        : 0,

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

      startDate:
        permType !== "temporary" ? searchParams.get("startDate") || "" : "",
      minLeasePeriod:
        permType !== "temporary" ? searchParams.get("minLease") || "" : "",
      paymentCycle:
        permType !== "temporary"
          ? (searchParams.get("paymentCycle") as PaymentCycle) || ""
          : "",

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

  const setParamValues = useCallback(
    (newValues: Partial<Omit<StallSearchSchemaType, "page" | "limit">>) => {
      setParams((prev) => ({ ...prev, ...newValues }));
    },
    [],
  );

  const getExistingParams = useCallback(() => {
    const query = new URLSearchParams(window.location.search);
    query.delete("permanence"); // Hapus key sampah lama jika ada
    return query;
  }, []);

  const commitPrimarySearch = useCallback(
    (mode: "hero" | "full") => {
      const query = getExistingParams();

      if (params.location) query.set("location", params.location);
      else query.delete("location");

      if (params.permanenceType)
        query.set("permanenceType", params.permanenceType);
      else query.delete("permanenceType");

      if (params.businessType) query.set("businessType", params.businessType);
      else query.delete("businessType");

      if (params.sortBy && params.sortBy !== "recommended") {
        query.set("sortBy", params.sortBy);
      } else {
        query.delete("sortBy");
      }

      const queryString = query.toString();
      if (mode === "hero") {
        router.push(`/stalls?${queryString}`);
      } else {
        router.push(`?${queryString}`, { scroll: false });
      }
    },
    [
      params.location,
      params.permanenceType,
      params.businessType,
      params.sortBy,
      router,
      getExistingParams,
    ],
  );

  const commitLandmarksSearch = useCallback(
    (mode: "hero" | "full") => {
      const query = getExistingParams();

      if (params.landmarkEntries?.length) {
        const validEntries = params.landmarkEntries
          .filter((e) => e.landmark)
          .map(({ landmark, radius }) => ({ landmark, radius }));

        if (validEntries.length > 0) {
          query.set("landmarks", JSON.stringify(validEntries));
        } else {
          query.delete("landmarks");
        }
      } else {
        query.delete("landmarks");
      }

      const queryString = query.toString();
      if (mode === "hero") {
        router.push(`/stalls?${queryString}`);
      } else {
        router.push(`?${queryString}`, { scroll: false });
      }
    },
    [params.landmarkEntries, router, getExistingParams],
  );

  const commitSpaceDetailsSearch = useCallback(
    (mode: "hero" | "full") => {
      const query = getExistingParams();

      if (params.placement) query.set("placement", params.placement);
      else query.delete("placement");

      if (params.permanenceType === "permanent") {
        if (
          params.sizeRange &&
          (params.sizeRange[0] > STALL_SIZE_RANGE.min ||
            params.sizeRange[1] < STALL_SIZE_RANGE.max)
        ) {
          query.set("minSize", String(params.sizeRange[0]));
          query.set("maxSize", String(params.sizeRange[1]));
        } else {
          query.delete("minSize");
          query.delete("maxSize");
        }

        if (
          params.floorCountRange &&
          (params.floorCountRange[0] > FLOOR_COUNT_RANGE.min ||
            params.floorCountRange[1] < FLOOR_COUNT_RANGE.min)
        ) {
          query.set("minFloor", String(params.floorCountRange[0]));
          query.set("maxFloor", String(params.floorCountRange[1]));
        } else {
          query.delete("minFloor");
          query.delete("maxFloor");
        }
      }

      if (params.permanenceType === "semi-permanent") {
        if (params.openingTime && params.openingTime !== "10:00") {
          query.set("openingTime", params.openingTime);
        } else {
          query.delete("openingTime");
        }
        if (params.closingTime && params.closingTime !== "22:00") {
          query.set("closingTime", params.closingTime);
        } else {
          query.delete("closingTime");
        }
      }

      if (params.permanenceType === "temporary") {
        if (params.registrationDeadlineDays !== null) {
          query.set("regDeadline", String(params.registrationDeadlineDays));
        } else {
          query.delete("regDeadline");
        }
        if (params.eventDurationDays !== null) {
          query.set("eventDuration", String(params.eventDurationDays));
        } else {
          query.delete("eventDuration");
        }
      }

      const queryString = query.toString();
      if (mode === "hero") {
        router.push(`/stalls?${queryString}`);
      } else {
        router.push(`?${queryString}`, { scroll: false });
      }
    },
    [params, router, getExistingParams],
  );

  const commitPropertyTypeSearch = useCallback(
    (mode: "hero" | "full") => {
      const query = getExistingParams();

      if (params.propertyType.length) {
        query.set("propertyTypes", params.propertyType.join(","));
      } else {
        query.delete("propertyTypes");
      }

      const queryString = query.toString();
      if (mode === "hero") {
        router.push(`/stalls?${queryString}`);
      } else {
        router.push(`?${queryString}`, { scroll: false });
      }
    },
    [params.propertyType, router, getExistingParams],
  );

  const commitBudgetSearch = useCallback(
    (mode: "hero" | "full") => {
      const query = getExistingParams();

      if (params.bepMonths && params.bepMonths !== String(DEFAULT_BEP_MONTHS)) {
        query.set("bepMonths", params.bepMonths);
      } else {
        query.delete("bepMonths");
      }

      if (params.capital && params.capital > 0) {
        query.set("capital", String(params.capital));
      } else {
        query.delete("capital");
      }

      if (
        params.rentRange &&
        (params.rentRange[0] > GENERAL_RENT_RANGE.min ||
          params.rentRange[1] < GENERAL_RENT_RANGE.max)
      ) {
        query.set("minRent", String(params.rentRange[0]));
        query.set("maxRent", String(params.rentRange[1]));
      } else {
        query.delete("minRent");
        query.delete("maxRent");
      }

      if (
        params.depositRange &&
        (params.depositRange[0] > DEPOSIT_RANGE.min ||
          params.depositRange[1] < DEPOSIT_RANGE.max)
      ) {
        query.set("minDeposit", String(params.depositRange[0]));
        query.set("maxDeposit", String(params.depositRange[1]));
      } else {
        query.delete("minDeposit");
        query.delete("maxDeposit");
      }

      const queryString = query.toString();
      if (mode === "hero") {
        router.push(`/stalls?${queryString}`);
      } else {
        router.push(`?${queryString}`, { scroll: false });
      }
    },
    [
      params.bepMonths,
      params.capital,
      params.rentRange,
      params.depositRange,
      router,
      getExistingParams,
    ],
  );

  const commitLeaseTermsSearch = useCallback(
    (mode: "hero" | "full") => {
      const query = getExistingParams();

      if (params.permanenceType !== "temporary") {
        if (params.paymentCycle) query.set("paymentCycle", params.paymentCycle);
        else query.delete("paymentCycle");

        if (params.startDate) query.set("startDate", params.startDate);
        else query.delete("startDate");

        if (params.minLeasePeriod) query.set("minLease", params.minLeasePeriod);
        else query.delete("minLease");
      }

      if (params.permanenceType === "temporary") {
        if (params.eventOperatingDays)
          query.set("eventDays", params.eventOperatingDays);
        else query.delete("eventDays");

        if (params.attendanceRequirement)
          query.set("attendance", params.attendanceRequirement);
        else query.delete("attendance");

        if (params.cancellationPolicy)
          query.set("cancellation", params.cancellationPolicy);
        else query.delete("cancellation");
      }

      const queryString = query.toString();
      if (mode === "hero") {
        router.push(`/stalls?${queryString}`);
      } else {
        router.push(`?${queryString}`, { scroll: false });
      }
    },
    [params, router, getExistingParams],
  );

  const commitFacilitiesSearch = useCallback(
    (mode: "hero" | "full") => {
      const query = getExistingParams();

      if (params.facilities.length) {
        query.set("facilities", params.facilities.join(","));
      } else {
        query.delete("facilities");
      }

      const queryString = query.toString();
      if (mode === "hero") {
        router.push(`/stalls?${queryString}`);
      } else {
        router.push(`?${queryString}`, { scroll: false });
      }
    },
    [params.facilities, router, getExistingParams],
  );

  return {
    params,
    setParamValues,
    commitPrimarySearch,
    commitLandmarksSearch,
    commitSpaceDetailsSearch,
    commitPropertyTypeSearch,
    commitBudgetSearch,
    commitLeaseTermsSearch,
    commitFacilitiesSearch,
  };
}
