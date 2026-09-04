/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useInfiniteSearch } from "@/hooks/use-infinite-search";
import { getBusinessTypes } from "@/lib/data/api/business_type";
import {
  BusinessType,
  GetBusinessTypesQuery,
} from "@/lib/data/schema/master/business_type";
import type { StallSearchSchemaType } from "@/lib/data/schema/stall/get_stall";
import { cn } from "@/lib/utils";
import { ChevronDown, RotateCcw, SlidersHorizontal, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { ReactNode, useEffect, useState } from "react";
import {
  getAllowedPlacements,
  STALL_PERMANENCE_TABS,
} from "./constants/permanance";
import {
  DEFAULT_ASSUMED_CAPITAL,
  DEFAULT_BEP_MONTHS,
  DEFAULT_CAPITAL_BY_PERMANENCE,
  DEPOSIT_RANGE,
  FLOOR_COUNT_RANGE,
  GENERAL_RENT_RANGE,
  STALL_SIZE_RANGE,
} from "./constants/range";
import { StallPermanenceType } from "./constants/types";
import { FacilityPicker } from "./FacilityPicker";
import {
  LandmarkRadiusEntry,
  LandmarkRadiusPicker,
} from "./LandmarkRadiusPicker";
import { LeaseTermsPicker } from "./LeaseTermsPicker";
import { PropertyTypePicker } from "./PropertyTypePicker";
import { StallSearchFooter } from "./SearchFooter";
import { StallSpaceFilter } from "./space";
import { StallPermanenceTabs } from "./StallPermanenceTabs";
import { StallSearchBudgetFilters } from "./StallSearchBudgetFilters";
import { StallSearchPrimaryRow } from "./StallSearchPrimaryRow";
import { useStallSearchQuery } from "./util/UseStallSearchQuery";

export interface StallSearchProps {
  mode?: "hero" | "full";
  children?: ReactNode;
}

function FilterAccordionSection({
  title,
  children,
  defaultOpen = true,
  activeCount = 0,
  onApply,
}: {
  title: string;
  children: ReactNode;
  defaultOpen?: boolean;
  activeCount?: number;
  onApply?: () => void;
}) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border-b border-border/80 last:border-b-0">
      <div className="flex w-full items-center justify-between py-3.5 text-left">
        <button
          type="button"
          onClick={() => setIsOpen((prev) => !prev)}
          className="flex flex-1 items-center gap-2 outline-none transition-colors hover:text-primary"
        >
          <span className="text-xs font-bold uppercase tracking-wider text-foreground">
            {title}
          </span>
          {activeCount > 0 && (
            <Badge
              variant="secondary"
              className="h-4 rounded-full bg-primary/10 px-1.5 text-[10px] font-bold text-primary"
            >
              {activeCount}
            </Badge>
          )}
        </button>

        <div className="flex items-center gap-2">
          {onApply && (
            <button
              type="button"
              onClick={onApply}
              className="text-xs font-semibold text-primary hover:underline"
            >
              Apply
            </button>
          )}
          <button
            type="button"
            onClick={() => setIsOpen((prev) => !prev)}
            className="outline-none"
          >
            <ChevronDown
              className={cn(
                "shrink-0 text-muted-foreground transition-all duration-150",
                "h-6 w-6 stroke-[2.5]",
                isOpen && "rotate-180",
                "opacity-20",
              )}
            />
          </button>
        </div>
      </div>

      <div
        className={cn(
          "grid min-h-0 transition-all duration-200 ease-in-out",
          isOpen
            ? "grid-rows-[1fr] pb-3 opacity-100"
            : "grid-rows-[0fr] opacity-0",
        )}
      >
        <div className="min-h-0 overflow-hidden space-y-3">{children}</div>
      </div>
    </div>
  );
}

function isUntouchedLandmarkEntries(entries: LandmarkRadiusEntry[]) {
  return entries.length === 1 && !entries[0].landmark;
}

export default function StallSearch({
  mode = "full",
  children,
}: StallSearchProps) {
  const t = useTranslations("common.search.stall_search");
  const isFull = mode === "full";

  const {
    params,
    setParamValues,
    commitPrimarySearch,
    commitPermanenceChange,
    commitPresetSearch,
    budgetApplied,
    clearBudgetApplied,
    commitLandmarksSearch,
    commitSpaceDetailsSearch,
    commitPropertyTypeSearch,
    commitBudgetSearch,
    commitLeaseTermsSearch,
    commitFacilitiesSearch,
  } = useStallSearchQuery();

  const [selectedTypeObj, setSelectedTypeObj] = useState<BusinessType | null>(
    null,
  );
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const { data: businessTypes } = useInfiniteSearch<
    BusinessType,
    GetBusinessTypesQuery
  >({
    queryKey: ["business-types", params.permanenceType],
    queryFn: getBusinessTypes,
    search: "",
    searchKey: "search",
    enabled: true,
  });

  useEffect(() => {
    if (params.businessType && !selectedTypeObj && businessTypes.length > 0) {
      const found = businessTypes.find((bt) => bt.id === params.businessType);
      if (found) {
        setSelectedTypeObj(found);
      }
    }
  }, [params.businessType, businessTypes]);

  const activeTabConfig = STALL_PERMANENCE_TABS.find(
    (t) => t.value === params.permanenceType,
  )!;

  function toggleFacility(value: string) {
    const nextFacilities = params.facilities.includes(value)
      ? params.facilities.filter((v) => v !== value)
      : [...params.facilities, value];

    setParamValues({ facilities: nextFacilities });
  }

  function applyPresetFor(
    typeDef: BusinessType | null,
    forPermanence: StallPermanenceType,
  ) {
    if (!typeDef) return false;

    const preset = typeDef.permanence_presets?.[forPermanence];

    const presetValues: Partial<Omit<StallSearchSchemaType, "page" | "limit">> =
      preset
        ? {
            propertyType: preset.allowedPropertyTypes?.length
              ? preset.allowedPropertyTypes
              : [],
            placement: preset.defaultPlacement,
            facilities: preset.facilities || [],
            sizeRange:
              forPermanence === "permanent" && "recommendedSizeSqm" in preset
                ? [preset.recommendedSizeSqm.min, preset.recommendedSizeSqm.max]
                : params.sizeRange,
            floorCountRange:
              forPermanence === "permanent" && "recommendedFloors" in preset
                ? [preset.recommendedFloors.min, preset.recommendedFloors.max]
                : params.floorCountRange,
            openingTime:
              forPermanence === "semi-permanent" &&
              "defaultOpeningTime" in preset
                ? preset.defaultOpeningTime
                : params.openingTime,
            closingTime:
              forPermanence === "semi-permanent" &&
              "defaultOpeningTime" in preset
                ? preset.defaultClosingTime
                : params.closingTime,
            is24hour: params.is24hour,
            registrationDeadlineDays:
              forPermanence === "temporary" &&
              "registrationWindowDaysBefore" in preset
                ? preset.registrationWindowDaysBefore
                : params.registrationDeadlineDays,
            eventDurationDays:
              forPermanence === "temporary" &&
              "registrationWindowDaysBefore" in preset
                ? preset.typicalDurationDays
                : params.eventDurationDays,
          }
        : {
            propertyType: [],
            placement: "",
            sizeRange: [STALL_SIZE_RANGE.min, STALL_SIZE_RANGE.max],
            floorCountRange: [FLOOR_COUNT_RANGE.min, FLOOR_COUNT_RANGE.min],
            facilities: [],
            openingTime: "10:00",
            closingTime: "22:00",
            is24hour: false,
            registrationDeadlineDays: null,
            eventDurationDays: null,
          };
    setParamValues(presetValues);

    if (typeDef.recommended_landmarks?.length) {
      if (isUntouchedLandmarkEntries(params.landmarkEntries)) {
        const landmarkEntries = typeDef.recommended_landmarks.map(
          (landmark) => ({
            landmark,
            radius: "3 km",
          }),
        );
        setParamValues({ landmarkEntries });
        return { ...presetValues, landmarkEntries };
      }
    }
    return presetValues;
  }

  function handlePermanenceChange(next: StallPermanenceType) {
    clearBudgetApplied();
    commitPermanenceChange(mode, next);

    if (selectedTypeObj) {
      const nextPreset = selectedTypeObj.permanence_presets?.[next];

      if (nextPreset) {
        applyPresetFor(selectedTypeObj, next);
        setParamValues({
          permanenceType: next,
          bepMonths: String(DEFAULT_BEP_MONTHS),
          capital: DEFAULT_CAPITAL_BY_PERMANENCE[next],
          paymentCycle: "",
          rentRange: [GENERAL_RENT_RANGE.min, GENERAL_RENT_RANGE.max],
          depositRange: [DEPOSIT_RANGE.min, DEPOSIT_RANGE.max],
        });
      } else {
        setParamValues({
          permanenceType: next,
          businessType: "",
          propertyType: [],
          placement: "",
          sizeRange: [STALL_SIZE_RANGE.min, STALL_SIZE_RANGE.max],
          floorCountRange: [FLOOR_COUNT_RANGE.min, FLOOR_COUNT_RANGE.min],
          facilities: [],
          paymentCycle: "",
          rentRange: [GENERAL_RENT_RANGE.min, GENERAL_RENT_RANGE.max],
          depositRange: [DEPOSIT_RANGE.min, DEPOSIT_RANGE.max],
          openingTime: "10:00",
          closingTime: "22:00",
          is24hour: false,
          registrationDeadlineDays: null,
          eventDurationDays: null,
          capital: DEFAULT_CAPITAL_BY_PERMANENCE[next],
          startDate: "",
          minLeasePeriod: "",
          eventOperatingDays: "",
          attendanceRequirement: "",
          cancellationPolicy: "",
        });
        setSelectedTypeObj(null);
      }
    } else {
      setParamValues({
        permanenceType: next,
        businessType: "",
        propertyType: [],
        placement: "",
        sizeRange: [STALL_SIZE_RANGE.min, STALL_SIZE_RANGE.max],
        floorCountRange: [FLOOR_COUNT_RANGE.min, FLOOR_COUNT_RANGE.min],
        facilities: [],
        paymentCycle: "",
        rentRange: [GENERAL_RENT_RANGE.min, GENERAL_RENT_RANGE.max],
        depositRange: [DEPOSIT_RANGE.min, DEPOSIT_RANGE.max],
        openingTime: "10:00",
        closingTime: "22:00",
        is24hour: false,
        registrationDeadlineDays: null,
        eventDurationDays: null,
        capital: DEFAULT_CAPITAL_BY_PERMANENCE[next],
        startDate: "",
        minLeasePeriod: "",
        eventOperatingDays: "",
        attendanceRequirement: "",
        cancellationPolicy: "",
      });
      setSelectedTypeObj(null);
    }
  }

  function handleBusinessTypeChange(value: string, selectedObj?: BusinessType) {
    const typeDef = selectedObj ?? null;
    setSelectedTypeObj(typeDef);

    if (!typeDef) {
      setParamValues({ businessType: value });
      return;
    }

    const presetValues = applyPresetFor(typeDef, params.permanenceType);
    setParamValues({
      businessType: value,
      bepMonths: String(typeDef.default_bep_months),
      capital: typeDef.default_capital,
      ...presetValues,
    });
  }

  function handleApplyBusinessPreset() {
    if (!selectedTypeObj || !params.businessType) return;

    const presetValues = applyPresetFor(selectedTypeObj, params.permanenceType);
    const nextValues = {
      businessType: params.businessType,
      bepMonths: String(selectedTypeObj.default_bep_months),
      capital: selectedTypeObj.default_capital,
      ...presetValues,
    };
    setParamValues(nextValues);
    commitPresetSearch(mode, nextValues);
  }

  useEffect(() => {
    const allowed = getAllowedPlacements(
      params.propertyType,
      params.permanenceType,
    );
    if (params.placement && !allowed.includes(params.placement)) {
      setParamValues({ placement: "" });
    }
  }, [params.propertyType, params.permanenceType]);

  function handleSearch() {
    commitPrimarySearch(mode);
  }

  // Reset All mencakup pembersihan state dan membersihkan URL sekaligus melalui commitPrimarySearch
  function resetAllFilters() {
    setSelectedTypeObj(null);
    clearBudgetApplied();
    setParamValues({
      permanenceType: "permanent",
      location: "",
      propertyType: [],
      placement: "",
      businessType: "",
      facilities: [],
      landmarkEntries: [],
      bepMonths: String(DEFAULT_BEP_MONTHS),
      capital: DEFAULT_ASSUMED_CAPITAL,
      rentRange: [GENERAL_RENT_RANGE.min, GENERAL_RENT_RANGE.max],
      depositRange: [DEPOSIT_RANGE.min, DEPOSIT_RANGE.max],
      sizeRange: [STALL_SIZE_RANGE.min, STALL_SIZE_RANGE.max],
      floorCountRange: [FLOOR_COUNT_RANGE.min, FLOOR_COUNT_RANGE.min],
      startDate: "",
      minLeasePeriod: "",
      paymentCycle: "",
      eventOperatingDays: "",
      attendanceRequirement: "",
      cancellationPolicy: "",
      openingTime: "10:00",
      closingTime: "22:00",
      is24hour: false,
      registrationDeadlineDays: null,
      eventDurationDays: null,
    });

    // Redirect bersih langsung ke query default / kosong tanpa filter lanjutan
    window.history.pushState({}, "", window.location.pathname);
  }

  // Active counts per individual section
  const landmarksActiveCount = params.landmarkEntries.filter(
    (e) => e.landmark,
  ).length;

  const spaceActiveCount =
    (params.placement ? 1 : 0) +
    (params.floorCountRange[0] > FLOOR_COUNT_RANGE.min ||
    params.floorCountRange[1] > FLOOR_COUNT_RANGE.min
      ? 1
      : 0) +
    (params.sizeRange[0] > STALL_SIZE_RANGE.min ||
    params.sizeRange[1] < STALL_SIZE_RANGE.max
      ? 1
      : 0) +
    (params.openingTime !== "10:00" ? 1 : 0) +
    (params.closingTime !== "22:00" ? 1 : 0) +
    (params.is24hour ? 1 : 0) +
    (params.registrationDeadlineDays !== null ? 1 : 0) +
    (params.eventDurationDays !== null ? 1 : 0) +
    (params.propertyType.length > 0 ? params.propertyType.length : 0);

  const budgetActiveCount = budgetApplied
    ? (params.bepMonths && params.bepMonths !== String(DEFAULT_BEP_MONTHS)
        ? 1
        : 0) +
      (params.capital > 0 &&
      params.capital !== DEFAULT_CAPITAL_BY_PERMANENCE[params.permanenceType]
        ? 1
        : 0) +
      (params.paymentCycle ? 1 : 0) +
      (params.rentRange[0] > GENERAL_RENT_RANGE.min ||
      params.rentRange[1] < GENERAL_RENT_RANGE.max
        ? 1
        : 0) +
      (params.depositRange[0] > DEPOSIT_RANGE.min ||
      params.depositRange[1] < DEPOSIT_RANGE.max
        ? 1
        : 0)
    : 0;

  const leaseTermsActiveCount =
    (params.startDate ? 1 : 0) +
    (params.minLeasePeriod ? 1 : 0) +
    (params.eventOperatingDays ? 1 : 0) +
    (params.attendanceRequirement ? 1 : 0) +
    (params.cancellationPolicy ? 1 : 0);

  const facilitiesActiveCount = params.facilities.length;
  const budgetFacilitiesActiveCount = budgetActiveCount + facilitiesActiveCount;

  const totalActiveFilterCount =
    landmarksActiveCount +
    spaceActiveCount +
    budgetActiveCount +
    leaseTermsActiveCount +
    facilitiesActiveCount;

  // Bagian 1: Landmark
  const renderLandmarkCard = () => (
    <div className="space-y-1 rounded-2xl border border-border bg-card p-4 shadow-xs">
      <div className="mb-2 flex items-center justify-between border-b border-border pb-2">
        <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
          {t("landmark_panel.title")}
        </span>
        {landmarksActiveCount > 0 && (
          <button
            type="button"
            onClick={() => {
              setParamValues({ landmarkEntries: [] });
              commitLandmarksSearch(mode);
            }}
            className="flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
          >
            <RotateCcw className="h-3 w-3" />
            Reset
          </button>
        )}
      </div>
      <FilterAccordionSection
        title={t("sections.landmarks_radius")}
        activeCount={landmarksActiveCount}
        onApply={() => commitLandmarksSearch(mode)}
      >
        <LandmarkRadiusPicker
          entries={params.landmarkEntries}
          onChange={(entries) => {
            setParamValues({ landmarkEntries: entries });
          }}
        />
      </FilterAccordionSection>
    </div>
  );

  // Bagian 2: Space (Space Details + Property Type)
  const renderSpaceCard = () => (
    <div className="space-y-4 rounded-2xl border border-border bg-card p-4 shadow-xs">
      <div className="flex items-center justify-between border-b border-border pb-2">
        <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
          Space
        </span>
        {spaceActiveCount > 0 && (
          <button
            type="button"
            onClick={() => {
              setParamValues({
                placement: "",
                propertyType: [],
                sizeRange: [STALL_SIZE_RANGE.min, STALL_SIZE_RANGE.max],
                floorCountRange: [FLOOR_COUNT_RANGE.min, FLOOR_COUNT_RANGE.min],
                openingTime: "10:00",
                closingTime: "22:00",
                is24hour: false,
                registrationDeadlineDays: null,
                eventDurationDays: null,
              });
              // Commit kedua sub-bagian space agar bersih total dari URL
              commitSpaceDetailsSearch(mode);
              commitPropertyTypeSearch(mode);
            }}
            className="flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
          >
            <RotateCcw className="h-3 w-3" />
            Reset
          </button>
        )}
      </div>

      <div className="space-y-1">
        <FilterAccordionSection
          title={t("sections.space_details")}
          onApply={() => commitSpaceDetailsSearch(mode)}
        >
          <StallSpaceFilter
            permanenceType={params.permanenceType}
            selectedPropertyTypes={params.propertyType}
            placement={params.placement}
            onPlacementChange={(placement) => {
              setParamValues({ placement });
            }}
            floorCount={params.floorCountRange}
            onFloorCountChange={(floorCountRange) => {
              setParamValues({ floorCountRange });
            }}
            stallSize={params.sizeRange}
            onStallSizeChange={(sizeRange) => {
              setParamValues({ sizeRange });
            }}
            openingTime={params.openingTime}
            onOpeningTimeChange={(openingTime) => {
              setParamValues({ openingTime });
            }}
            closingTime={params.closingTime}
            onClosingTimeChange={(closingTime) => {
              setParamValues({ closingTime });
            }}
            is24hour={params.is24hour}
            onIs24hourChange={(is24hour) => {
              setParamValues({ is24hour });
            }}
            registrationDeadlineDays={params.registrationDeadlineDays}
            onRegistrationDeadlineDaysChange={(registrationDeadlineDays) => {
              setParamValues({ registrationDeadlineDays });
            }}
            eventDurationDays={params.eventDurationDays}
            onEventDurationDaysChange={(eventDurationDays) => {
              setParamValues({ eventDurationDays });
            }}
          />
        </FilterAccordionSection>

        <FilterAccordionSection
          title={t("sections.property_type")}
          onApply={() => commitPropertyTypeSearch(mode)}
        >
          <PropertyTypePicker
            value={params.propertyType}
            onChange={(propertyType) => {
              setParamValues({ propertyType });
            }}
            permanenceType={params.permanenceType}
          />
        </FilterAccordionSection>
      </div>
    </div>
  );

  // Bagian 3: Budget
  const renderBudgetCard = () => (
    <div className="space-y-1 rounded-2xl border border-border bg-card p-4 shadow-xs">
      <div className="mb-2 flex items-center justify-between border-b border-border pb-2">
        <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
          {t("sections.budget_facilities")}
        </span>
        {budgetFacilitiesActiveCount > 0 && (
          <button
            type="button"
            onClick={() => {
              setParamValues({
                bepMonths: String(DEFAULT_BEP_MONTHS),
                capital: DEFAULT_ASSUMED_CAPITAL,
                paymentCycle: "",
                rentRange: [GENERAL_RENT_RANGE.min, GENERAL_RENT_RANGE.max],
                depositRange: [DEPOSIT_RANGE.min, DEPOSIT_RANGE.max],
                facilities: [],
              });
              commitBudgetSearch(mode);
              commitFacilitiesSearch(mode);
            }}
            className="flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
          >
            <RotateCcw className="h-3 w-3" />
            Reset
          </button>
        )}
      </div>
      <FilterAccordionSection
        title={t("sections.budget_roi")}
        activeCount={budgetActiveCount}
        onApply={() => commitBudgetSearch(mode)}
      >
        <StallSearchBudgetFilters
          permanenceType={params.permanenceType}
          businessTypeObj={selectedTypeObj}
          businessTypeLabel={selectedTypeObj?.label ?? null}
          bepMonths={params.bepMonths}
          onBepMonthsChange={(bepMonths) => {
            setParamValues({ bepMonths });
          }}
          capital={params.capital}
          onCapitalChange={(capital) => {
            setParamValues({ capital });
          }}
          paymentCycle={params.paymentCycle}
          onPaymentCycleChange={(paymentCycle) => {
            setParamValues({ paymentCycle });
          }}
          allowedPaymentCycles={activeTabConfig.allowedPaymentCycles}
          rentRange={params.rentRange}
          onRentRangeChange={(rentRange) => {
            setParamValues({ rentRange });
          }}
          depositRange={params.depositRange}
          onDepositRangeChange={(depositRange) => {
            setParamValues({ depositRange });
          }}
        />
      </FilterAccordionSection>

      <FilterAccordionSection
        title={t("facility_panel.options")}
        activeCount={facilitiesActiveCount}
        onApply={() => commitFacilitiesSearch(mode)}
      >
        <FacilityPicker
          selected={params.facilities}
          onToggle={toggleFacility}
          selectedPropertyTypes={params.propertyType}
          permanenceType={params.permanenceType}
          size="sidebar"
        />
      </FilterAccordionSection>
    </div>
  );

  // Bagian 4: Lease Term
  const renderLeaseTermCard = () => (
    <div className="space-y-4 rounded-2xl border border-border bg-card p-4 shadow-xs">
      <div className="flex items-center justify-between border-b border-border pb-2">
        <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
          Lease Term
        </span>
        {leaseTermsActiveCount > 0 && (
          <button
            type="button"
            onClick={() => {
              setParamValues({
                startDate: "",
                minLeasePeriod: "",
                eventOperatingDays: "",
                attendanceRequirement: "",
                cancellationPolicy: "",
              });
              commitLeaseTermsSearch(mode);
            }}
            className="flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
          >
            <RotateCcw className="h-3 w-3" />
            Reset
          </button>
        )}
      </div>

      <div className="space-y-1">
        <FilterAccordionSection
          title={t("sections.lease_event_terms")}
          onApply={() => commitLeaseTermsSearch(mode)}
        >
          <LeaseTermsPicker
            permanenceType={params.permanenceType}
            startDate={params.startDate}
            onStartDateChange={(startDate) => {
              setParamValues({ startDate });
            }}
            minLeasePeriod={params.minLeasePeriod}
            onMinLeasePeriodChange={(minLeasePeriod) => {
              setParamValues({ minLeasePeriod });
            }}
            eventOperatingDays={params.eventOperatingDays}
            onEventOperatingDaysChange={(eventOperatingDays) => {
              setParamValues({ eventOperatingDays });
            }}
            attendanceRequirement={params.attendanceRequirement}
            onAttendanceRequirementChange={(attendanceRequirement) => {
              setParamValues({ attendanceRequirement });
            }}
            cancellationPolicy={params.cancellationPolicy}
            onCancellationPolicyChange={(cancellationPolicy) => {
              setParamValues({ cancellationPolicy });
            }}
          />
        </FilterAccordionSection>
      </div>
    </div>
  );

  return (
    <div className="w-full space-y-6">
      <div
        className={cn(
          "rounded-2xl border border-border bg-card shadow-xs",
          isFull ? "p-4 sm:p-5" : "p-3 shadow-lg shadow-primary/5 sm:p-4",
        )}
      >
        <StallSearchPrimaryRow
          isFull={isFull}
          location={params.location}
          onLocationChange={(location) => {
            setParamValues({ location });
          }}
          businessType={params.businessType}
          onBusinessTypeChange={handleBusinessTypeChange}
          hasBusinessTypePreset={Boolean(selectedTypeObj)}
          onApplyBusinessPreset={handleApplyBusinessPreset}
          permanenceType={params.permanenceType}
          onPermanenceChange={handlePermanenceChange}
          onSearch={handleSearch}
        />
      </div>

      {isFull && (
        <StallPermanenceTabs
          value={params.permanenceType}
          onChange={handlePermanenceChange}
          mode="full"
        />
      )}

      {isFull && (
        <div className="flex items-center lg:hidden">
          <Button
            variant="outline"
            onClick={() => setShowMobileFilters((p) => !p)}
            className="w-full justify-between rounded-xl border-primary/20 bg-primary/5 font-semibold text-primary"
          >
            <span className="flex items-center gap-2">
              <SlidersHorizontal className="h-4 w-4" />
              {showMobileFilters
                ? t("hide_filters")
                : t("show_filters", {
                    count:
                      totalActiveFilterCount > 0
                        ? `(${totalActiveFilterCount})`
                        : "",
                  })}
            </span>
            {showMobileFilters ? (
              <span className="flex items-center gap-2">
                {totalActiveFilterCount > 0 && (
                  <Badge
                    variant="secondary"
                    className="h-5 rounded-full bg-primary/10 px-2 text-[10px] font-bold text-primary"
                  >
                    {totalActiveFilterCount}
                  </Badge>
                )}
                <X className="h-4 w-4" />
              </span>
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </Button>
        </div>
      )}

      {isFull && showMobileFilters && (
        <div className="rounded-2xl border border-border bg-card p-4 shadow-sm lg:hidden animate-in fade-in zoom-in-95 space-y-4">
          <div className="flex items-center justify-between border-b border-border pb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              {t("all_search_filters")}
            </span>
            {totalActiveFilterCount > 0 && (
              <button
                type="button"
                onClick={resetAllFilters}
                className="flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
              >
                <RotateCcw className="h-3 w-3" />
                {t("reset_all")}
              </button>
            )}
          </div>

          <div className="space-y-4">
            {renderSpaceCard()}
            {renderLandmarkCard()}
            {renderBudgetCard()}
            {renderLeaseTermCard()}
          </div>
        </div>
      )}

      {isFull && (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[280px_minmax(0,1fr)_280px] items-start">
          <aside className="hidden lg:block space-y-6 sticky top-4">
            {renderSpaceCard()}
            {renderLandmarkCard()}
          </aside>

          <main className="min-w-0 space-y-4">
            {totalActiveFilterCount > 0 && (
              <div className="hidden lg:flex items-center justify-between rounded-xl border border-border bg-card px-4 py-2.5 shadow-2xs">
                <span className="text-xs font-medium text-muted-foreground">
                  Active filters applied ({totalActiveFilterCount})
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={resetAllFilters}
                  className="h-7 gap-1.5 text-xs font-semibold text-primary hover:text-primary hover:bg-primary/10 hover:underline"
                >
                  <RotateCcw className="h-3 w-3" />
                  Reset all filters
                </Button>
              </div>
            )}

            {children ?? (
              <div className="flex h-full min-h-60 items-center justify-center rounded-2xl border border-dashed border-border text-sm text-muted-foreground">
                {t("listing_placeholder")}
              </div>
            )}
          </main>

          <aside className="hidden lg:block space-y-6 sticky top-4">
            {renderBudgetCard()}
            {renderLeaseTermCard()}
          </aside>
        </div>
      )}

      {!isFull && <StallSearchFooter />}
    </div>
  );
}
