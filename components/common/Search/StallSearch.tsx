"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BUSINESS_PRESETS } from "@/lib/data/schema/analysis/business_preset";
import { BUSINESS_CATEGORIES } from "@/lib/data/schema/master/business_type";
import { cn } from "@/lib/utils";
import { ChevronDown, RotateCcw, SlidersHorizontal, X } from "lucide-react";
import { ReactNode, useState } from "react";
import { FacilityPicker } from "./FacilityPicker";
import {
  createLandmarkRadiusEntry,
  LandmarkRadiusPicker,
  type LandmarkRadiusEntry,
} from "./LandmarkRadiusPicker";
import { LeaseTermsPicker } from "./LeaseTermsPicker";
import { PlacementPicker } from "./PlacementPicker";
import { PropertyTypePicker } from "./PropertyTypePicker";
import {
  DEFAULT_ASSUMED_CAPITAL,
  DEFAULT_BEP_MONTHS,
  DEPOSIT_RANGE,
  PaymentCycle,
  RADIUS_PRESETS,
  RENT_RANGE,
  STALL_SIZE_RANGE,
  StallPlacement,
} from "./SearchConstants";
import { StallSearchFooter } from "./SearchFooter";
import { StallSearchBudgetFilters } from "./StallSearchBudgetFilters";
import { StallSearchPrimaryRow } from "./StallSearchPrimaryRow";
import { StallSizeFilter } from "./StallSpaceFilters.";

const BUSINESS_TYPE_LABELS: Record<string, string> = Object.fromEntries(
  BUSINESS_CATEGORIES.flatMap((g) => g.types.map((t) => [t.value, t.label])),
);

export interface StallSearchProps {
  mode?: "hero" | "full";
  children?: ReactNode;
}

// ─── Animated Collapsible Section ───────────────────────────────────────────

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
  const isFull = mode === "full";

  // Filter States
  const [location, setLocation] = useState("");
  const [radius, setRadius] = useState(RADIUS_PRESETS[1]);
  const [singleLandmark, setSingleLandmark] = useState("any");

  const [landmarkEntries, setLandmarkEntries] = useState<LandmarkRadiusEntry[]>(
    [createLandmarkRadiusEntry()],
  );

  const [propertyType, setPropertyType] = useState("");
  const [placement, setPlacement] = useState<StallPlacement | "">("");
  const [sizeRange, setSizeRange] = useState<[number, number]>([
    STALL_SIZE_RANGE.min,
    STALL_SIZE_RANGE.max,
  ]);

  const [businessType, setBusinessType] = useState("");
  const [facilities, setFacilities] = useState<string[]>([]);
  const [bepMonths, setBepMonths] = useState<string>(
    String(DEFAULT_BEP_MONTHS),
  );
  const [customBepMonths, setCustomBepMonths] = useState<number | null>(null);
  const [capital, setCapital] = useState<number>(DEFAULT_ASSUMED_CAPITAL);
  const [rentRange, setRentRange] = useState<[number, number]>([
    RENT_RANGE.min,
    RENT_RANGE.max,
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

  // Mobile Filter Panel Toggle
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  function toggleFacility(value: string) {
    setFacilities((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value],
    );
  }

  function handleBusinessTypeChange(value: string) {
    setBusinessType(value);
    const preset = BUSINESS_PRESETS[value];
    if (!preset) return;

    setBepMonths(String(preset.bepMonths));
    setCustomBepMonths(null);
    setCapital(preset.capital);
    setRentRange(preset.rentRange);
    setDepositRange(preset.depositRange);

    setFacilities((prev) =>
      Array.from(new Set([...prev, ...preset.facilities])),
    );

    setLandmarkEntries((prev) =>
      isUntouchedLandmarkEntries(prev)
        ? preset.landmarks.map((landmark) => ({
            ...createLandmarkRadiusEntry(),
            landmark,
          }))
        : prev,
    );
  }

  function handleSearch() {
    if (isFull) {
      console.log({
        location,
        landmarkEntries,
        propertyType,
        placement,
        sizeRange,
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
        paymentCycle,
      });
    } else {
      console.log({ location, landmark: singleLandmark, radius });
    }
  }

  function resetAllFilters() {
    setPropertyType("");
    setPlacement("");
    setSizeRange([STALL_SIZE_RANGE.min, STALL_SIZE_RANGE.max]);
    setBusinessType("");
    setFacilities([]);
    setRentRange([RENT_RANGE.min, RENT_RANGE.max]);
    setDepositRange([DEPOSIT_RANGE.min, DEPOSIT_RANGE.max]);
    setStartDate("");
    setMinLeasePeriod("");
    setPaymentCycle("");
  }

  // Hitung berapa filter opsional yang aktif
  const activeFilterCount =
    (propertyType ? 1 : 0) +
    (placement ? 1 : 0) +
    (businessType ? 1 : 0) +
    facilities.length +
    (startDate ? 1 : 0) +
    (minLeasePeriod ? 1 : 0) +
    (paymentCycle ? 1 : 0);

  // Komponen Konten Filter Kiri (Space Properties)
  const renderSpaceFilters = () => (
    <>
      <FilterAccordionSection title="Landmarks & Radius">
        <LandmarkRadiusPicker
          entries={landmarkEntries}
          onChange={setLandmarkEntries}
        />
      </FilterAccordionSection>

      <FilterAccordionSection title="Property Type">
        <PropertyTypePicker value={propertyType} onChange={setPropertyType} />
      </FilterAccordionSection>

      <FilterAccordionSection title="Placement & Size">
        <div className="space-y-4">
          <PlacementPicker value={placement} onChange={setPlacement} />
          <StallSizeFilter value={sizeRange} onChange={setSizeRange} />
        </div>
      </FilterAccordionSection>
    </>
  );

  // Komponen Konten Filter Kanan (Budget & Terms)
  const renderBudgetTermsFilters = () => (
    <>
      <FilterAccordionSection title="Budget & ROI">
        <StallSearchBudgetFilters
          businessTypeLabel={BUSINESS_TYPE_LABELS[businessType] ?? null}
          bepMonths={bepMonths}
          onBepMonthsChange={setBepMonths}
          customBepMonths={customBepMonths}
          onCustomBepMonthsChange={setCustomBepMonths}
          capital={capital}
          onCapitalChange={setCapital}
          rentRange={rentRange}
          onRentRangeChange={setRentRange}
          depositRange={depositRange}
          onDepositRangeChange={setDepositRange}
        />
      </FilterAccordionSection>

      <FilterAccordionSection title="Lease & Payment Terms">
        <LeaseTermsPicker
          startDate={startDate}
          onStartDateChange={setStartDate}
          customStartDay={customStartDay}
          onCustomStartDayChange={setCustomStartDay}
          minLeasePeriod={minLeasePeriod}
          onMinLeasePeriodChange={setMinLeasePeriod}
          customLeaseMonths={customLeaseMonths}
          onCustomLeaseMonthsChange={setCustomLeaseMonths}
          paymentCycle={paymentCycle}
          onPaymentCycleChange={setPaymentCycle}
        />
      </FilterAccordionSection>

      <FilterAccordionSection
        title="Facilities"
        activeCount={facilities.length}
      >
        <FacilityPicker
          selected={facilities}
          onToggle={toggleFacility}
          size="sidebar"
        />
      </FilterAccordionSection>
    </>
  );

  return (
    <div className="w-full space-y-6">
      {/* ─── Main Bar Search Input ─── */}
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
          singleLandmark={singleLandmark}
          onSingleLandmarkChange={setSingleLandmark}
          onSearch={handleSearch}
        />

        {!isFull && (
          <div className="mt-3 flex flex-wrap items-center gap-2 border-t border-border pt-3">
            <span className="text-xs font-medium text-muted-foreground">
              Radius:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {RADIUS_PRESETS.map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setRadius(r)}
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

      {/* ─── Mobile Filter Toggle Button (Hanya Muncul di Mobile) ─── */}
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
                ? "Hide Filters"
                : `Filter Search Options ${
                    activeFilterCount > 0 ? `(${activeFilterCount})` : ""
                  }`}
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
              Reset
            </Button>
          )}
        </div>
      )}

      {/* ─── Mobile Accordion Panel Filter (Diletakkan SEBELUM Listing) ─── */}
      {isFull && showMobileFilters && (
        <div className="rounded-2xl border border-border bg-card p-4 shadow-sm lg:hidden animate-in fade-in zoom-in-95">
          <div className="mb-3 flex items-center justify-between border-b border-border pb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              All Search Filters
            </span>
            <button
              type="button"
              onClick={resetAllFilters}
              className="flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
            >
              <RotateCcw className="h-3 w-3" />
              Reset All
            </button>
          </div>

          <div className="space-y-1">
            {renderSpaceFilters()}
            {renderBudgetTermsFilters()}
          </div>
        </div>
      )}

      {/* ─── Layout Full Mode untuk Desktop (3-Columns Grid) ─── */}
      {isFull && (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[280px_minmax(0,1fr)_280px]">
          {/* Left Sidebar Desktop: Space Properties */}
          <aside className="hidden lg:block">
            <div className="space-y-1 rounded-2xl border border-border bg-card p-4 shadow-xs sticky top-4">
              <div className="mb-2 flex items-center justify-between border-b border-border pb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Space Filters
                </span>
                <button
                  type="button"
                  onClick={resetAllFilters}
                  className="text-[11px] font-medium text-primary hover:underline"
                >
                  Reset
                </button>
              </div>

              {renderSpaceFilters()}
            </div>
          </aside>

          {/* Center Column: Listing (Selalu Berada di Tengah) */}
          <main className="min-w-0">
            {children ?? (
              <div className="flex h-full min-h-60 items-center justify-center rounded-2xl border border-dashed border-border text-sm text-muted-foreground">
                Stall listing goes here
              </div>
            )}
          </main>

          {/* Right Sidebar Desktop: Budget & Terms */}
          <aside className="hidden lg:block">
            <div className="space-y-1 rounded-2xl border border-border bg-card p-4 shadow-xs sticky top-4">
              <div className="mb-2 flex items-center justify-between border-b border-border pb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Budget & Terms
                </span>
                <button
                  type="button"
                  onClick={resetAllFilters}
                  className="text-[11px] font-medium text-primary hover:underline"
                >
                  Reset
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
