/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BusinessType } from "@/lib/data/schema/master/business_type";
import { cn } from "@/lib/utils";
import { ChevronDown, RotateCcw, SlidersHorizontal, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { ReactNode, useEffect, useState } from "react";
import {
  getAllowedPlacements,
  getContextualFacilities,
  getPropertyTypesForPermanence,
  STALL_PERMANENCE_TABS,
} from "./constants/permanance";
import {
  DEFAULT_ASSUMED_CAPITAL,
  DEFAULT_BEP_MONTHS,
  DEFAULT_CAPITAL_BY_PERMANENCE,
  DEPOSIT_RANGE,
  FLOOR_COUNT_RANGE,
  GENERAL_RENT_RANGE,
  RADIUS_PRESETS,
  STALL_SIZE_RANGE,
} from "./constants/range";
import {
  PaymentCycle,
  StallPermanenceType,
  StallPlacement,
  StallPropertyTypeValue,
} from "./constants/types";
import { FacilityPicker } from "./FacilityPicker";
import {
  createLandmarkRadiusEntry,
  LandmarkRadiusEntry,
  LandmarkRadiusPicker,
} from "./LandmarkRadiusPicker";
import { LeaseTermsPicker } from "./LeaseTermsPicker";
import { StallSpaceFilter } from "./permanence";
import { PropertyTypePicker } from "./PropertyTypePicker";
import { StallSearchFooter } from "./SearchFooter";
import { StallPermanenceTabs } from "./StallPermanenceTabs";
import { StallSearchBudgetFilters } from "./StallSearchBudgetFilters";
import { StallSearchPrimaryRow } from "./StallSearchPrimaryRow";

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

  const [location, setLocation] = useState("");
  const radius = RADIUS_PRESETS[1];
  const [singleLandmark, setSingleLandmark] = useState("any");

  const [permanenceType, setPermanenceType] =
    useState<StallPermanenceType>("permanent");

  const [landmarkEntries, setLandmarkEntries] = useState<LandmarkRadiusEntry[]>(
    [createLandmarkRadiusEntry()],
  );

  const [propertyType, setPropertyType] = useState<StallPropertyTypeValue[]>(
    [],
  );
  const [placement, setPlacement] = useState<StallPlacement | "">("");
  const [sizeRange, setSizeRange] = useState<[number, number]>([
    STALL_SIZE_RANGE.min,
    STALL_SIZE_RANGE.max,
  ]);
  const [floorCountRange, setFloorCountRange] = useState<[number, number]>([
    FLOOR_COUNT_RANGE.min,
    FLOOR_COUNT_RANGE.min,
  ]);

  const [businessType, setBusinessType] = useState("");
  const [selectedTypeObj, setSelectedTypeObj] = useState<BusinessType | null>(
    null,
  );

  const [facilities, setFacilities] = useState<string[]>([]);
  const [bepMonths, setBepMonths] = useState<string>(
    String(DEFAULT_BEP_MONTHS),
  );
  const [customBepMonths, setCustomBepMonths] = useState<number | null>(null);
  const [capital, setCapital] = useState<number>(DEFAULT_ASSUMED_CAPITAL);
  const [rentRange, setRentRange] = useState<[number, number]>([
    GENERAL_RENT_RANGE.min,
    GENERAL_RENT_RANGE.max,
  ]);
  const [depositRange, setDepositRange] = useState<[number, number]>([
    DEPOSIT_RANGE.min,
    DEPOSIT_RANGE.max,
  ]);

  const [startDate, setStartDate] = useState("");
  const [customStartDay, setCustomStartDay] = useState("");
  const [minLeasePeriod, setMinLeasePeriod] = useState("");
  const [customLeaseMonths, setCustomLeaseMonths] = useState("");
  const [paymentCycle, setPaymentCycle] = useState<PaymentCycle | "">("");

  const [eventOperatingDays, setEventOperatingDays] = useState("");
  const [attendanceRequirement, setAttendanceRequirement] = useState("");
  const [cancellationPolicy, setCancellationPolicy] = useState("");

  const [openingTime, setOpeningTime] = useState("10:00");
  const [closingTime, setClosingTime] = useState("22:00");
  const [registrationDeadlineDays, setRegistrationDeadlineDays] = useState<
    number | null
  >(null);
  const [eventDurationDays, setEventDurationDays] = useState<number | null>(
    null,
  );

  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const activeTabConfig = STALL_PERMANENCE_TABS.find(
    (t) => t.value === permanenceType,
  )!;

  function toggleFacility(value: string) {
    setFacilities((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value],
    );
  }

  function applyPresetFor(
    typeDef: BusinessType | null,
    forPermanence: StallPermanenceType,
  ) {
    if (!typeDef) return false;

    const preset = typeDef.permanencePresets?.[forPermanence];

    if (preset) {
      setPropertyType(
        preset.allowedPropertyTypes?.length ? preset.allowedPropertyTypes : [],
      );
      setPlacement(preset.defaultPlacement);
      setFacilities(preset.facilities || []);

      if (forPermanence === "permanent" && "recommendedSizeSqm" in preset) {
        setSizeRange([
          preset.recommendedSizeSqm.min,
          preset.recommendedSizeSqm.max,
        ]);
        setFloorCountRange([
          preset.recommendedFloors.min,
          preset.recommendedFloors.max,
        ]);
      }

      if (
        forPermanence === "semi-permanent" &&
        "defaultOpeningTime" in preset
      ) {
        setOpeningTime(preset.defaultOpeningTime);
        setClosingTime(preset.defaultClosingTime);
      }

      if (
        forPermanence === "temporary" &&
        "registrationWindowDaysBefore" in preset
      ) {
        setRegistrationDeadlineDays(preset.registrationWindowDaysBefore);
        setEventDurationDays(preset.typicalDurationDays);
      }
    } else {
      const defaultPropertyTypes = getPropertyTypesForPermanence(
        forPermanence,
      ).map((p) => p.value);
      const defaultPlacements = getAllowedPlacements([], forPermanence);
      const defaultFacilities = getContextualFacilities([], forPermanence).map(
        (f) => f.value,
      );

      setPropertyType(defaultPropertyTypes);
      setPlacement(defaultPlacements[0] ?? "");
      setSizeRange([STALL_SIZE_RANGE.min, STALL_SIZE_RANGE.max]);
      setFloorCountRange([FLOOR_COUNT_RANGE.min, FLOOR_COUNT_RANGE.min]);
      setFacilities(defaultFacilities);
      setOpeningTime("10:00");
      setClosingTime("22:00");
      setRegistrationDeadlineDays(null);
      setEventDurationDays(null);
    }

    setPaymentCycle("");
    setRentRange([GENERAL_RENT_RANGE.min, GENERAL_RENT_RANGE.max]);
    setDepositRange([DEPOSIT_RANGE.min, DEPOSIT_RANGE.max]);

    if (typeDef.landmarks?.length) {
      setLandmarkEntries((prev) =>
        isUntouchedLandmarkEntries(prev)
          ? typeDef.landmarks.map((landmark) => ({
              ...createLandmarkRadiusEntry(),
              landmark,
            }))
          : prev,
      );
    }
    return true;
  }

  function handlePermanenceChange(next: StallPermanenceType) {
    setPermanenceType(next);

    const applied = selectedTypeObj
      ? applyPresetFor(selectedTypeObj, next)
      : false;

    if (!applied) {
      setBusinessType("");
      setSelectedTypeObj(null);
      setPropertyType([]);
      setPlacement("");
      setSizeRange([STALL_SIZE_RANGE.min, STALL_SIZE_RANGE.max]);
      setFloorCountRange([FLOOR_COUNT_RANGE.min, FLOOR_COUNT_RANGE.min]);
      setFacilities([]);
      setPaymentCycle("");
      setRentRange([GENERAL_RENT_RANGE.min, GENERAL_RENT_RANGE.max]);
      setDepositRange([DEPOSIT_RANGE.min, DEPOSIT_RANGE.max]);
      setOpeningTime("10:00");
      setClosingTime("22:00");
      setRegistrationDeadlineDays(null);
      setEventDurationDays(null);
      setCapital(DEFAULT_CAPITAL_BY_PERMANENCE[next]);

      setStartDate("");
      setCustomStartDay("");
      setMinLeasePeriod("");
      setCustomLeaseMonths("");
      setEventOperatingDays("");
      setAttendanceRequirement("");
      setCancellationPolicy("");
    }
  }

  function handleBusinessTypeChange(value: string, selectedObj?: BusinessType) {
    setBusinessType(value);
    const typeDef = selectedObj ?? null;
    setSelectedTypeObj(typeDef);

    if (!typeDef) return;

    setBepMonths(String(typeDef.defaultBEPMonths));
    setCustomBepMonths(null);
    setCapital(typeDef.defaultCapital);

    applyPresetFor(typeDef, permanenceType);
  }

  useEffect(() => {
    const allowed = getAllowedPlacements(propertyType, permanenceType);
    if (placement && !allowed.includes(placement)) {
      setPlacement("");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [propertyType, permanenceType]);

  useEffect(() => {
    if (
      paymentCycle &&
      !activeTabConfig.allowedPaymentCycles.includes(paymentCycle)
    ) {
      setPaymentCycle("");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [permanenceType]);

  function handleSearch() {
    if (isFull) {
      console.log({
        location,
        permanenceType,
        landmarkEntries,
        propertyType,
        placement,
        sizeRange,
        floorCountRange,
        businessType,
        facilities,
        bepMonths: bepMonths === "custom" ? customBepMonths : Number(bepMonths),
        capital,
        rentRange,
        depositRange,
        startDate,
        customStartDay,
        minLeasePeriod,
        customLeaseMonths,
        eventOperatingDays,
        attendanceRequirement,
        cancellationPolicy,
        paymentCycle,
      });
    } else {
      console.log({ location, landmark: singleLandmark, radius });
    }
  }

  function resetAllFilters() {
    setPropertyType([]);
    setPlacement("");
    setSizeRange([STALL_SIZE_RANGE.min, STALL_SIZE_RANGE.max]);
    setFloorCountRange([FLOOR_COUNT_RANGE.min, FLOOR_COUNT_RANGE.min]);
    setBusinessType("");
    setSelectedTypeObj(null);
    setFacilities([]);
    setCapital(DEFAULT_CAPITAL_BY_PERMANENCE[permanenceType]);
    setRentRange([GENERAL_RENT_RANGE.min, GENERAL_RENT_RANGE.max]);
    setDepositRange([DEPOSIT_RANGE.min, DEPOSIT_RANGE.max]);
    setStartDate("");
    setCustomStartDay("");
    setMinLeasePeriod("");
    setCustomLeaseMonths("");
    setEventOperatingDays("");
    setAttendanceRequirement("");
    setCancellationPolicy("");
    setPaymentCycle("");
    setOpeningTime("10:00");
    setClosingTime("22:00");
    setRegistrationDeadlineDays(null);
    setEventDurationDays(null);
  }

  const activeFilterCount =
    (propertyType.length > 0 ? 1 : 0) +
    (placement ? 1 : 0) +
    (floorCountRange[0] > FLOOR_COUNT_RANGE.min ||
    floorCountRange[1] > FLOOR_COUNT_RANGE.min
      ? 1
      : 0) +
    (registrationDeadlineDays !== null ? 1 : 0) +
    (eventDurationDays !== null ? 1 : 0) +
    (businessType ? 1 : 0) +
    facilities.length +
    (startDate ? 1 : 0) +
    (minLeasePeriod ? 1 : 0) +
    (eventOperatingDays ? 1 : 0) +
    (attendanceRequirement ? 1 : 0) +
    (cancellationPolicy ? 1 : 0) +
    (paymentCycle ? 1 : 0);

  const renderSpaceFilters = () => (
    <>
      <FilterAccordionSection title={t("sections.landmarks_radius")}>
        <LandmarkRadiusPicker
          entries={landmarkEntries}
          onChange={setLandmarkEntries}
        />
      </FilterAccordionSection>

      <FilterAccordionSection title={t("sections.space_details")}>
        <StallSpaceFilter
          permanenceType={permanenceType}
          selectedPropertyTypes={propertyType}
          placement={placement}
          onPlacementChange={setPlacement}
          floorCount={floorCountRange}
          onFloorCountChange={setFloorCountRange}
          stallSize={sizeRange}
          onStallSizeChange={setSizeRange}
          openingTime={openingTime}
          onOpeningTimeChange={setOpeningTime}
          closingTime={closingTime}
          onClosingTimeChange={setClosingTime}
          registrationDeadlineDays={registrationDeadlineDays}
          onRegistrationDeadlineDaysChange={setRegistrationDeadlineDays}
          eventDurationDays={eventDurationDays}
          onEventDurationDaysChange={setEventDurationDays}
        />
      </FilterAccordionSection>

      <FilterAccordionSection title={t("sections.property_type")}>
        <PropertyTypePicker
          value={propertyType}
          onChange={setPropertyType}
          permanenceType={permanenceType}
        />
      </FilterAccordionSection>
    </>
  );

  const renderBudgetTermsFilters = () => (
    <>
      <FilterAccordionSection title={t("sections.budget_roi")}>
        <StallSearchBudgetFilters
          permanenceType={permanenceType}
          businessTypeLabel={selectedTypeObj?.label ?? null}
          bepMonths={bepMonths}
          onBepMonthsChange={setBepMonths}
          customBepMonths={customBepMonths}
          onCustomBepMonthsChange={setCustomBepMonths}
          capital={capital}
          onCapitalChange={setCapital}
          paymentCycle={paymentCycle}
          onPaymentCycleChange={setPaymentCycle}
          allowedPaymentCycles={activeTabConfig.allowedPaymentCycles}
          rentRange={rentRange}
          onRentRangeChange={setRentRange}
          depositRange={depositRange}
          onDepositRangeChange={setDepositRange}
        />
      </FilterAccordionSection>

      <FilterAccordionSection title={t("sections.lease_event_terms")}>
        <LeaseTermsPicker
          permanenceType={permanenceType}
          startDate={startDate}
          onStartDateChange={setStartDate}
          customStartDay={customStartDay}
          onCustomStartDayChange={setCustomStartDay}
          minLeasePeriod={minLeasePeriod}
          onMinLeasePeriodChange={setMinLeasePeriod}
          customLeaseMonths={customLeaseMonths}
          onCustomLeaseMonthsChange={setCustomLeaseMonths}
          eventOperatingDays={eventOperatingDays}
          onEventOperatingDaysChange={setEventOperatingDays}
          attendanceRequirement={attendanceRequirement}
          onAttendanceRequirementChange={setAttendanceRequirement}
          cancellationPolicy={cancellationPolicy}
          onCancellationPolicyChange={setCancellationPolicy}
        />
      </FilterAccordionSection>

      <FilterAccordionSection
        title={t("sections.facilities")}
        activeCount={facilities.length}
      >
        <FacilityPicker
          selected={facilities}
          onToggle={toggleFacility}
          selectedPropertyTypes={propertyType}
          permanenceType={permanenceType}
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
          location={location}
          onLocationChange={setLocation}
          businessType={businessType}
          onBusinessTypeChange={handleBusinessTypeChange}
          permanenceType={permanenceType}
          singleLandmark={singleLandmark}
          onSingleLandmarkChange={setSingleLandmark}
          onSearch={handleSearch}
        />

        {!isFull && (
          <div className="mt-3 flex flex-wrap items-center gap-2 border-t border-border pt-3">
            <span className="text-xs font-medium text-muted-foreground">
              {t("radius")}
            </span>
            <div className="flex flex-wrap gap-1.5">
              {RADIUS_PRESETS.map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => {}}
                  className={cn(
                    "rounded-full px-3 py-1 text-xs font-medium transition-colors outline-none",
                    radius === r
                      ? "bg-primary text-primary-foreground"
                      : "border border-border bg-secondary/50 text-muted-foreground hover:border-primary/40 hover:text-foreground",
                  )}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {isFull && (
        <StallPermanenceTabs
          value={permanenceType}
          onChange={handlePermanenceChange}
        />
      )}

      {isFull && (
        <div className="flex items-center justify-between gap-3 lg:hidden">
          <Button
            variant="outline"
            onClick={() => setShowMobileFilters((p) => !p)}
            className="flex-1 justify-between rounded-xl border-primary/20 bg-primary/5 font-semibold text-primary"
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
              <X className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </Button>

          {activeFilterCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={resetAllFilters}
              className="gap-1.5 rounded-xl text-xs font-semibold text-muted-foreground hover:text-destructive"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              {t("reset")}
            </Button>
          )}
        </div>
      )}

      {isFull && showMobileFilters && (
        <div className="rounded-2xl border border-border bg-card p-4 shadow-sm lg:hidden animate-in fade-in zoom-in-95">
          <div className="mb-3 flex items-center justify-between border-b border-border pb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              {t("all_search_filters")}
            </span>
            <button
              type="button"
              onClick={resetAllFilters}
              className="flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
            >
              <RotateCcw className="h-3 w-3" />
              {t("reset_all")}
            </button>
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
                <button
                  type="button"
                  onClick={resetAllFilters}
                  className="text-[11px] font-medium text-primary hover:underline"
                >
                  {t("reset")}
                </button>
              </div>
              {renderSpaceFilters()}
            </div>
          </aside>

          <main className="min-w-0">
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
                <button
                  type="button"
                  onClick={resetAllFilters}
                  className="text-[11px] font-medium text-primary hover:underline"
                >
                  {t("reset")}
                </button>
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
