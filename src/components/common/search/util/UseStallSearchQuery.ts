/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { StallSearchSchemaType } from "@/lib/data/schema/stall/get_stall";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useState } from "react";
import {
  DEFAULT_BEP_MONTHS,
  DEFAULT_CAPITAL_BY_PERMANENCE,
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

const PERMANENCE_QUERY_KEYS = {
  permanent: ["sizeRange", "floorCountRange"],
  "semi-permanent": ["openingTime", "closingTime", "is24Hours"],
  temporary: [
    "eventOperatingDays",
    "attendanceRequirement",
    "cancellationPolicy",
    "registrationDeadline",
    "eventDurationDays",
  ],
} as const;

const LEASE_QUERY_KEYS = {
  permanent: ["paymentCycle", "startDate", "minLeasePeriod"],
  "semi-permanent": ["paymentCycle", "startDate", "minLeasePeriod"],
  temporary: [
    "eventOperatingDays",
    "attendanceRequirement",
    "cancellationPolicy",
  ],
} as const;

function removeIrrelevantPermanenceQuery(
  query: URLSearchParams,
  permanenceType: StallPermanenceType,
) {
  const relevantKeys = new Set<string>([
    ...PERMANENCE_QUERY_KEYS[permanenceType],
    ...LEASE_QUERY_KEYS[permanenceType],
  ]);

  Object.values(PERMANENCE_QUERY_KEYS)
    .flat()
    .forEach((key) => {
      if (!relevantKeys.has(key)) query.delete(key);
    });

  Object.values(LEASE_QUERY_KEYS)
    .flat()
    .forEach((key) => {
      if (!relevantKeys.has(key)) query.delete(key);
    });
}

export function getCleanBackendQuery(
  searchParams: URLSearchParams,
): Record<string, any> {
  const queryObj: Record<string, any> = {};

  searchParams.forEach((val, key) => {
    if (key === "landmarkEntries") {
      try {
        queryObj[key] = JSON.parse(val);
      } catch {
        queryObj[key] = [];
      }
    } else if (key === "propertyType" || key === "facilities") {
      queryObj[key] = val ? val.split(",") : [];
    } else if (key === "is24Hours") {
      queryObj[key] = val === "true";
    } else if (
      key === "rentRange" ||
      key === "depositRange" ||
      key === "sizeRange" ||
      key === "floorCountRange"
    ) {
      if (!queryObj[key]) queryObj[key] = [0, 0];
      // Jika dikirim sebagai string array/range terpisah
      const parts = val.split(",");
      if (parts.length === 2) {
        queryObj[key] = [Number(parts[0]), Number(parts[1])];
      }
    } else {
      queryObj[key] = val;
    }
  });

  return queryObj;
}

export function useStallSearchQuery() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [budgetApplied, setBudgetApplied] = useState(() =>
    Boolean(
      searchParams.get("bepMonths") ||
      searchParams.get("capital") ||
      searchParams.get("paymentCycle") ||
      searchParams.get("rentRange") ||
      searchParams.get("depositRange"),
    ),
  );

  const [params, setParams] = useState<
    Omit<StallSearchSchemaType, "page" | "limit">
  >(() => {
    const permType =
      (searchParams.get("permanenceType") as StallPermanenceType) ||
      "permanent";

    const parseRange = (
      val: string | null,
      defaultVal: [number, number],
    ): [number, number] => {
      if (!val) return defaultVal;
      try {
        const parsed = JSON.parse(val);
        if (Array.isArray(parsed) && parsed.length === 2)
          return [Number(parsed[0]), Number(parsed[1])];
      } catch {}
      return defaultVal;
    };

    const parseFloorRange = (
      val: string | null,
      defaultVal: [number, number],
    ): [number, number] => {
      if (!val) return defaultVal;
      try {
        const parsed = JSON.parse(val);
        if (Array.isArray(parsed) && parsed.length === 2)
          return [Number(parsed[0]), Number(parsed[1])];
      } catch {}
      return defaultVal;
    };

    return {
      location: searchParams.get("location") || "",
      permanenceType: permType,
      landmarkEntries: searchParams.get("landmarkEntries")
        ? JSON.parse(searchParams.get("landmarkEntries")!)
        : [],
      propertyType: searchParams.get("propertyType")
        ? (searchParams
            .get("propertyType")!
            .split(",") as StallPropertyTypeValue[])
        : [],
      placement: (searchParams.get("placement") as StallPlacement) || "",
      businessType: searchParams.get("businessType") || "",
      facilities: searchParams.get("facilities")
        ? searchParams.get("facilities")!.split(",")
        : [],
      bepMonths: searchParams.get("bepMonths") || String(DEFAULT_BEP_MONTHS),
      capital: searchParams.get("capital")
        ? Number(searchParams.get("capital"))
        : DEFAULT_CAPITAL_BY_PERMANENCE[permType],
      rentRange: parseRange(searchParams.get("rentRange"), [
        GENERAL_RENT_RANGE.min,
        GENERAL_RENT_RANGE.max,
      ]),
      depositRange: parseRange(searchParams.get("depositRange"), [
        DEPOSIT_RANGE.min,
        DEPOSIT_RANGE.max,
      ]),
      startDate:
        permType !== "temporary" ? searchParams.get("startDate") || "" : "",
      minLeasePeriod:
        permType !== "temporary"
          ? searchParams.get("minLeasePeriod") || ""
          : "",
      customLeaseMonths: searchParams.get("customLeaseMonths") || "",
      customStartDay: searchParams.get("customStartDay") || "",
      customBepMonths: searchParams.get("customBepMonths")
        ? Number(searchParams.get("customBepMonths"))
        : null,
      paymentCycle:
        permType !== "temporary"
          ? (searchParams.get("paymentCycle") as PaymentCycle) || ""
          : "",
      eventOperatingDays:
        permType === "temporary"
          ? searchParams.get("eventOperatingDays") || ""
          : "",
      attendanceRequirement:
        permType === "temporary"
          ? searchParams.get("attendanceRequirement") || ""
          : "",
      cancellationPolicy:
        permType === "temporary"
          ? searchParams.get("cancellationPolicy") || ""
          : "",
      sizeRange: parseRange(searchParams.get("sizeRange"), [
        STALL_SIZE_RANGE.min,
        STALL_SIZE_RANGE.max,
      ]),
      floorCountRange: parseFloorRange(searchParams.get("floorCountRange"), [
        FLOOR_COUNT_RANGE.min,
        FLOOR_COUNT_RANGE.min,
      ]),
      openingTime:
        permType === "semi-permanent"
          ? searchParams.get("openingTime") || "10:00"
          : "10:00",
      closingTime:
        permType === "semi-permanent"
          ? searchParams.get("closingTime") || "22:00"
          : "22:00",
      is24Hours:
        permType === "semi-permanent" &&
        searchParams.get("is24Hours") === "true",
      registrationDeadline: searchParams.get("registrationDeadline")
        ? Number(searchParams.get("registrationDeadline"))
        : null,
      eventDurationDays: searchParams.get("eventDurationDays")
        ? Number(searchParams.get("eventDurationDays"))
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
    return new URLSearchParams(window.location.search);
  }, []);

  const commitPermanenceChange = useCallback(
    (mode: "hero" | "full", permanenceType: StallPermanenceType) => {
      const query = getExistingParams();
      query.set("permanenceType", permanenceType);
      [
        "bepMonths",
        "capital",
        "paymentCycle",
        "rentRange",
        "depositRange",
        "propertyType",
        "placement",
      ].forEach((key) => query.delete(key));
      removeIrrelevantPermanenceQuery(query, permanenceType);

      const queryString = query.toString();
      if (mode === "hero") router.push(`/stalls?${queryString}`);
      else router.push(`?${queryString}`, { scroll: false });
    },
    [router, getExistingParams],
  );

  const commitPrimarySearch = useCallback(
    (
      mode: "hero" | "full",
      overrides: Partial<Omit<StallSearchSchemaType, "page" | "limit">> = {},
    ) => {
      const query = getExistingParams();
      const next = { ...params, ...overrides };

      if (next.location) query.set("location", next.location);
      else query.delete("location");

      if (next.permanenceType) query.set("permanenceType", next.permanenceType);
      else query.delete("permanenceType");

      if (next.businessType) query.set("businessType", next.businessType);
      else query.delete("businessType");

      if (next.sortBy && next.sortBy !== "recommended") {
        query.set("sortBy", next.sortBy);
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
    [params, router, getExistingParams],
  );

  const commitPresetSearch = useCallback(
    (
      mode: "hero" | "full",
      overrides: Partial<Omit<StallSearchSchemaType, "page" | "limit">>,
    ) => {
      setBudgetApplied(true);
      const next = { ...params, ...overrides };
      const query = getExistingParams();

      if (next.businessType) query.set("businessType", next.businessType);
      else query.delete("businessType");
      if (next.propertyType.length)
        query.set("propertyType", next.propertyType.join(","));
      else query.delete("propertyType");
      if (next.placement) query.set("placement", next.placement);
      else query.delete("placement");
      if (next.facilities.length)
        query.set("facilities", next.facilities.join(","));
      else query.delete("facilities");

      const validLandmarks = next.landmarkEntries.filter(
        (entry) => entry.landmark,
      );
      if (validLandmarks.length)
        query.set("landmarkEntries", JSON.stringify(validLandmarks));
      else query.delete("landmarkEntries");

      if (next.permanenceType === "permanent") {
        if (
          next.sizeRange[0] > STALL_SIZE_RANGE.min ||
          next.sizeRange[1] < STALL_SIZE_RANGE.max
        ) {
          query.set("sizeRange", JSON.stringify(next.sizeRange));
        } else {
          query.delete("sizeRange");
        }
        if (
          next.floorCountRange[0] > FLOOR_COUNT_RANGE.min ||
          next.floorCountRange[1] < FLOOR_COUNT_RANGE.max
        ) {
          query.set("floorCountRange", JSON.stringify(next.floorCountRange));
        } else {
          query.delete("floorCountRange");
        }
      }
      if (next.permanenceType === "semi-permanent") {
        if (next.is24Hours) query.set("is24Hours", "true");
        else query.delete("is24Hours");
        query.set("openingTime", next.openingTime);
        query.set("closingTime", next.closingTime);
      }
      if (next.permanenceType === "temporary") {
        if (next.registrationDeadline !== null)
          query.set("registrationDeadline", String(next.registrationDeadline));
        else query.delete("registrationDeadline");
        if (next.eventDurationDays !== null)
          query.set("eventDurationDays", String(next.eventDurationDays));
        else query.delete("eventDurationDays");
      }

      if (next.bepMonths && next.bepMonths !== String(DEFAULT_BEP_MONTHS)) {
        query.set("bepMonths", next.bepMonths);
      } else query.delete("bepMonths");
      if (next.capital > 0) query.set("capital", String(next.capital));
      else query.delete("capital");

      if (
        next.rentRange[0] > GENERAL_RENT_RANGE.min ||
        next.rentRange[1] < GENERAL_RENT_RANGE.max
      ) {
        query.set("rentRange", JSON.stringify(next.rentRange));
      } else {
        query.delete("rentRange");
      }
      if (
        next.depositRange[0] > DEPOSIT_RANGE.min ||
        next.depositRange[1] < DEPOSIT_RANGE.max
      ) {
        query.set("depositRange", JSON.stringify(next.depositRange));
      } else {
        query.delete("depositRange");
      }

      const queryString = query.toString();
      if (mode === "hero") router.push(`/stalls?${queryString}`);
      else router.push(`?${queryString}`, { scroll: false });
    },
    [params, router, getExistingParams],
  );

  const commitLandmarksSearch = useCallback(
    (mode: "hero" | "full") => {
      const query = getExistingParams();

      if (params.landmarkEntries?.length) {
        const validEntries = params.landmarkEntries
          .filter((e) => e.landmark)
          .map(({ landmark, radius }) => ({ landmark, radius }));

        if (validEntries.length > 0) {
          query.set("landmarkEntries", JSON.stringify(validEntries));
        } else {
          query.delete("landmarkEntries");
        }
      } else {
        query.delete("landmarkEntries");
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
          query.set("sizeRange", JSON.stringify(params.sizeRange));
        } else {
          query.delete("sizeRange");
        }

        if (
          params.floorCountRange &&
          (params.floorCountRange[0] > FLOOR_COUNT_RANGE.min ||
            params.floorCountRange[1] < FLOOR_COUNT_RANGE.max)
        ) {
          query.set("floorCountRange", JSON.stringify(params.floorCountRange));
        } else {
          query.delete("floorCountRange");
        }
      }

      if (params.permanenceType === "semi-permanent") {
        if (params.is24Hours) query.set("is24Hours", "true");
        else query.delete("is24Hours");
        query.set("openingTime", params.openingTime);
        query.set("closingTime", params.closingTime);
      }

      if (params.permanenceType === "temporary") {
        if (params.registrationDeadline !== null) {
          query.set(
            "registrationDeadline",
            String(params.registrationDeadline),
          );
        } else {
          query.delete("registrationDeadline");
        }
        if (params.eventDurationDays !== null) {
          query.set("eventDurationDays", String(params.eventDurationDays));
        } else {
          query.delete("eventDurationDays");
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
        query.set("propertyType", params.propertyType.join(","));
      } else {
        query.delete("propertyType");
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
      setBudgetApplied(true);
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
        query.set("rentRange", JSON.stringify(params.rentRange));
      } else {
        query.delete("rentRange");
      }

      if (
        params.depositRange &&
        (params.depositRange[0] > DEPOSIT_RANGE.min ||
          params.depositRange[1] < DEPOSIT_RANGE.max)
      ) {
        query.set("depositRange", JSON.stringify(params.depositRange));
      } else {
        query.delete("depositRange");
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

  const clearBudgetApplied = useCallback(() => {
    setBudgetApplied(false);
  }, []);

  const clearBudgetSearch = useCallback(
    (mode: "hero" | "full") => {
      setBudgetApplied(false);
      const query = getExistingParams();
      [
        "bepMonths",
        "capital",
        "paymentCycle",
        "rentRange",
        "depositRange",
      ].forEach((key) => query.delete(key));

      const queryString = query.toString();
      if (mode === "hero") router.push(`/stalls?${queryString}`);
      else router.push(`?${queryString}`, { scroll: false });
    },
    [router, getExistingParams],
  );

  const commitLeaseTermsSearch = useCallback(
    (mode: "hero" | "full") => {
      const query = getExistingParams();
      removeIrrelevantPermanenceQuery(query, params.permanenceType);

      if (params.permanenceType !== "temporary") {
        if (params.paymentCycle) query.set("paymentCycle", params.paymentCycle);
        else query.delete("paymentCycle");

        if (params.startDate) query.set("startDate", params.startDate);
        else query.delete("startDate");

        if (params.minLeasePeriod && params.minLeasePeriod !== "custom")
          query.set("minLeasePeriod", params.minLeasePeriod);
        else query.delete("minLeasePeriod");
      }

      if (params.permanenceType === "temporary") {
        if (params.eventOperatingDays)
          query.set("eventOperatingDays", params.eventOperatingDays);
        else query.delete("eventOperatingDays");

        if (params.attendanceRequirement)
          query.set("attendanceRequirement", params.attendanceRequirement);
        else query.delete("attendanceRequirement");

        if (params.cancellationPolicy)
          query.set("cancellationPolicy", params.cancellationPolicy);
        else query.delete("cancellationPolicy");
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
    commitPermanenceChange,
    commitPresetSearch,
    budgetApplied,
    clearBudgetApplied,
    clearBudgetSearch,
    commitLandmarksSearch,
    commitSpaceDetailsSearch,
    commitPropertyTypeSearch,
    commitBudgetSearch,
    commitLeaseTermsSearch,
    commitFacilitiesSearch,
  };
}
