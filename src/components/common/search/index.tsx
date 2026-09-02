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
import { cn } from "@/lib/utils";
import { ChevronDown, RotateCcw, SlidersHorizontal, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { ReactNode, useEffect, useState } from "react";
import {
  getAllowedPlacements,
  STALL_PERMANENCE_TABS,
} from "./constants/permanance";
import {
  DEFAULT_CAPITAL_BY_PERMANENCE,
  DEPOSIT_RANGE,
  FLOOR_COUNT_RANGE,
  GENERAL_RENT_RANGE,
  STALL_SIZE_RANGE,
} from "./constants/range";
import { StallPermanenceType } from "./constants/types";
import { FacilityPicker } from "./FacilityPicker";
import {
  createLandmarkRadiusEntry,
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
}: {
  title: string;
  children: ReactNode;
  defaultOpen?: boolean;
  activeCount?: number;
}) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border-b border-border/80 last:border-b-0">
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex w-full items-center justify-between py-3.5 text-left transition-colors hover:text-primary outline-none"
      >
        <div className="flex items-center gap-2">
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
        </div>
        <ChevronDown
          className={cn(
            "shrink-0 text-muted-foreground transition-all duration-150",
            "h-6 w-6 stroke-[2.5]",
            isOpen && "rotate-180",
            "opacity-20",
          )}
        />
      </button>

      <div
        className={cn(
          "grid transition-all duration-200 ease-in-out",
          isOpen
            ? "grid-rows-[1fr] pb-4 opacity-100"
            : "grid-rows-[0fr] opacity-0",
        )}
      >
        <div className="overflow-hidden">{children}</div>
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

  const { params, setParamValues, commitSearch } = useStallSearchQuery();

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
    // [HAPUS commitSearch dari sini agar tidak auto-search saat klik fasilitas]
  }

  function applyPresetFor(
    typeDef: BusinessType | null,
    forPermanence: StallPermanenceType,
  ) {
    if (!typeDef) return false;

    const preset = typeDef.permanence_presets?.[forPermanence];

    if (preset) {
      setParamValues({
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
          forPermanence === "permanent" && "recommendedSizeSqm" in preset
            ? [preset.recommendedFloors.min, preset.recommendedFloors.max]
            : params.floorCountRange,
        openingTime:
          forPermanence === "semi-permanent" && "defaultOpeningTime" in preset
            ? preset.defaultOpeningTime
            : params.openingTime,
        closingTime:
          forPermanence === "semi-permanent" && "defaultOpeningTime" in preset
            ? preset.defaultClosingTime
            : params.closingTime,
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
      });
    } else {
      setParamValues({
        propertyType: [],
        placement: "",
        sizeRange: [STALL_SIZE_RANGE.min, STALL_SIZE_RANGE.max],
        floorCountRange: [FLOOR_COUNT_RANGE.min, FLOOR_COUNT_RANGE.min],
        facilities: [],
        openingTime: "10:00",
        closingTime: "22:00",
        registrationDeadlineDays: null,
        eventDurationDays: null,
      });
    }

    setParamValues({
      paymentCycle: "",
      rentRange: [GENERAL_RENT_RANGE.min, GENERAL_RENT_RANGE.max],
      depositRange: [DEPOSIT_RANGE.min, DEPOSIT_RANGE.max],
    });

    if (typeDef.recommended_landmarks?.length) {
      if (isUntouchedLandmarkEntries(params.landmarkEntries)) {
        setParamValues({
          landmarkEntries: typeDef.recommended_landmarks.map((landmark) => ({
            ...createLandmarkRadiusEntry(),
            landmark,
          })),
        });
      }
    }
    return true;
  }

  function handlePermanenceChange(next: StallPermanenceType) {
    if (selectedTypeObj) {
      const nextPreset = selectedTypeObj.permanence_presets?.[next];

      if (nextPreset) {
        applyPresetFor(selectedTypeObj, next);
        setParamValues({ permanenceType: next });
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
          registrationDeadlineDays: null,
          eventDurationDays: null,
          capital: DEFAULT_CAPITAL_BY_PERMANENCE[next],
          startDate: "",
          customStartDay: "",
          minLeasePeriod: "",
          customLeaseMonths: "",
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
        registrationDeadlineDays: null,
        eventDurationDays: null,
        capital: DEFAULT_CAPITAL_BY_PERMANENCE[next],
        startDate: "",
        customStartDay: "",
        minLeasePeriod: "",
        customLeaseMonths: "",
        eventOperatingDays: "",
        attendanceRequirement: "",
        cancellationPolicy: "",
      });
      setSelectedTypeObj(null);
    }

    // [DIUBAH]: Jangan auto-commit search saat ganti tab, biarkan user klik search button
    if (!isFull) {
      commitSearch("hero"); // Khusus mode hero di home page tetap boleh langsung push ke halaman utama jika diperlukan, atau hapus jika ingin murni manual
    }
  }

  function handleBusinessTypeChange(value: string, selectedObj?: BusinessType) {
    const typeDef = selectedObj ?? null;
    setSelectedTypeObj(typeDef);

    if (!typeDef) {
      setParamValues({ businessType: value });
      return;
    }

    setParamValues({
      businessType: value,
      bepMonths: String(typeDef.default_bep_months),
      customBepMonths: null,
      capital: typeDef.default_capital,
    });

    applyPresetFor(typeDef, params.permanenceType);
    // [HAPUS commitSearch("full") di sini agar perubahan business type hanya set state lokal saja]
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

  useEffect(() => {
    if (
      params.paymentCycle &&
      !activeTabConfig.allowedPaymentCycles.includes(params.paymentCycle)
    ) {
      setParamValues({ paymentCycle: "" });
    }
  }, [params.permanenceType]);

  function handleSearch() {
    commitSearch(mode);
  }

  function resetAllFilters() {
    setParamValues({
      permanenceType: "permanent",
      location: "",
      propertyType: [],
      placement: "",
      sizeRange: [STALL_SIZE_RANGE.min, STALL_SIZE_RANGE.max],
      floorCountRange: [FLOOR_COUNT_RANGE.min, FLOOR_COUNT_RANGE.min],
      businessType: "",
      facilities: [],
      capital: DEFAULT_CAPITAL_BY_PERMANENCE["permanent"],
      rentRange: [GENERAL_RENT_RANGE.min, GENERAL_RENT_RANGE.max],
      depositRange: [DEPOSIT_RANGE.min, DEPOSIT_RANGE.max],
      startDate: "",
      customStartDay: "",
      minLeasePeriod: "",
      customLeaseMonths: "",
      eventOperatingDays: "",
      attendanceRequirement: "",
      cancellationPolicy: "",
      paymentCycle: "",
      openingTime: "10:00",
      closingTime: "22:00",
      registrationDeadlineDays: null,
      eventDurationDays: null,
      landmarkEntries: [createLandmarkRadiusEntry()],
    });
    setSelectedTypeObj(null);
    if (isFull) commitSearch("full");
  }

  const activeFilterCount =
    (params.propertyType.length > 0 ? 1 : 0) +
    (params.placement ? 1 : 0) +
    (params.floorCountRange[0] > FLOOR_COUNT_RANGE.min ||
    params.floorCountRange[1] > FLOOR_COUNT_RANGE.min
      ? 1
      : 0) +
    (params.registrationDeadlineDays !== null ? 1 : 0) +
    (params.eventDurationDays !== null ? 1 : 0) +
    (params.businessType ? 1 : 0) +
    params.facilities.length +
    (params.startDate ? 1 : 0) +
    (params.minLeasePeriod ? 1 : 0) +
    (params.eventOperatingDays ? 1 : 0) +
    (params.attendanceRequirement ? 1 : 0) +
    (params.cancellationPolicy ? 1 : 0) +
    (params.paymentCycle ? 1 : 0);

  const renderSpaceFilters = () => (
    <>
      <FilterAccordionSection title={t("sections.landmarks_radius")}>
        <LandmarkRadiusPicker
          entries={params.landmarkEntries}
          onChange={(entries) => {
            setParamValues({ landmarkEntries: entries });
          }}
        />
      </FilterAccordionSection>

      <FilterAccordionSection title={t("sections.space_details")}>
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

      <FilterAccordionSection title={t("sections.property_type")}>
        <PropertyTypePicker
          value={params.propertyType}
          onChange={(propertyType) => {
            setParamValues({ propertyType });
          }}
          permanenceType={params.permanenceType}
        />
      </FilterAccordionSection>
    </>
  );

  const renderBudgetTermsFilters = () => (
    <>
      <FilterAccordionSection title={t("sections.budget_roi")}>
        <StallSearchBudgetFilters
          permanenceType={params.permanenceType}
          businessTypeLabel={selectedTypeObj?.label ?? null}
          bepMonths={params.bepMonths}
          onBepMonthsChange={(bepMonths) => {
            setParamValues({ bepMonths });
          }}
          customBepMonths={params.customBepMonths}
          onCustomBepMonthsChange={(customBepMonths) => {
            setParamValues({ customBepMonths });
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

      <FilterAccordionSection title={t("sections.lease_event_terms")}>
        <LeaseTermsPicker
          permanenceType={params.permanenceType}
          startDate={params.startDate}
          onStartDateChange={(startDate) => {
            setParamValues({ startDate });
          }}
          customStartDay={params.customStartDay}
          onCustomStartDayChange={(customStartDay) => {
            setParamValues({ customStartDay });
          }}
          minLeasePeriod={params.minLeasePeriod}
          onMinLeasePeriodChange={(minLeasePeriod) => {
            setParamValues({ minLeasePeriod });
          }}
          customLeaseMonths={params.customLeaseMonths}
          onCustomLeaseMonthsChange={(customLeaseMonths) => {
            setParamValues({ customLeaseMonths });
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

      <FilterAccordionSection
        title={t("sections.facilities")}
        activeCount={params.facilities.length}
      >
        <FacilityPicker
          selected={params.facilities}
          onToggle={toggleFacility}
          selectedPropertyTypes={params.propertyType}
          permanenceType={params.permanenceType}
          size="sidebar"
        />
      </FilterAccordionSection>
    </>
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
                      activeFilterCount > 0 ? `(${activeFilterCount})` : "",
                  })}
            </span>
            {showMobileFilters ? (
              <span className="flex items-center gap-2">
                {activeFilterCount > 0 && (
                  <Badge
                    variant="secondary"
                    className="h-5 rounded-full bg-primary/10 px-2 text-[10px] font-bold text-primary"
                  >
                    {activeFilterCount}
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
        <div className="rounded-2xl border border-border bg-card p-4 shadow-sm lg:hidden animate-in fade-in zoom-in-95">
          <div className="mb-3 flex items-center justify-between border-b border-border pb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              {t("all_search_filters")}
            </span>
            {activeFilterCount > 0 && (
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

          <div className="space-y-1">
            {renderSpaceFilters()}
            {renderBudgetTermsFilters()}
          </div>
        </div>
      )}

      {isFull && (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[280px_minmax(0,1fr)_280px]">
          <aside className="hidden lg:block">
            <div className="space-y-1 rounded-2xl border border-border bg-card p-4 shadow-xs sticky top-4">
              <div className="mb-2 flex items-center justify-between border-b border-border pb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  {t("space_filters")}
                </span>
              </div>
              {renderSpaceFilters()}
            </div>
          </aside>

          <main className="min-w-0 space-y-4">
            {activeFilterCount > 0 && (
              <div className="hidden lg:flex items-center justify-between rounded-xl border border-border bg-card px-4 py-2.5 shadow-2xs">
                <span className="text-xs font-medium text-muted-foreground">
                  Active filters applied ({activeFilterCount})
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

          <aside className="hidden lg:block">
            <div className="space-y-1 rounded-2xl border border-border bg-card p-4 shadow-xs sticky top-4">
              <div className="mb-2 flex items-center justify-between border-b border-border pb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  {t("budget_terms")}
                </span>
              </div>
              {renderBudgetTermsFilters()}
            </div>
          </aside>
        </div>
      )}

      {!isFull && <StallSearchFooter />}
    </div>
  );
}
