"use client";

import { BUSINESS_PRESETS } from "@/lib/data/schema/analysis/business_preset";
import { BUSINESS_CATEGORIES } from "@/lib/data/schema/master/business_type";
import { cn } from "@/lib/utils";
import { ReactNode, useState } from "react";
import { FacilityPicker } from "./FacilityPicker";
import {
  createLandmarkRadiusEntry,
  LandmarkRadiusPicker,
  type LandmarkRadiusEntry,
} from "./LandmarkRadiusPicker";
import { LeaseTermsPicker } from "./LeaseTermsPicker";
import {
  DEFAULT_ASSUMED_CAPITAL,
  DEFAULT_BEP_MONTHS,
  DEPOSIT_RANGE,
  PaymentCycle,
  RADIUS_PRESETS,
  RENT_RANGE,
  STALL_SIZE_RANGE,
  StallType,
} from "./SearchConstants";
import { StallSearchFooter } from "./SearchFooter";
import { StallSearchBudgetFilters } from "./StallSearchBudgetFilters";
import { StallSearchPrimaryRow } from "./StallSearchPrimaryRow";
import { StallSpaceFilters } from "./StallSpaceFilters.";

const BUSINESS_TYPE_LABELS: Record<string, string> = Object.fromEntries(
  BUSINESS_CATEGORIES.flatMap((g) => g.types.map((t) => [t.value, t.label])),
);

export interface StallSearchProps {
  mode?: "hero" | "full";
  children?: ReactNode;
}

function FilterBlock({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="border-t border-border pt-5 first:border-t-0 first:pt-0">
      <h3 className="mb-3 text-xs font-bold uppercase tracking-wide text-foreground">
        {title}
      </h3>
      {children}
    </section>
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

  const [location, setLocation] = useState("");
  const [radius, setRadius] = useState(RADIUS_PRESETS[1]);
  const [singleLandmark, setSingleLandmark] = useState("any");

  const [landmarkEntries, setLandmarkEntries] = useState<LandmarkRadiusEntry[]>(
    [createLandmarkRadiusEntry()],
  );
  const [stallType, setStallType] = useState<StallType | "">("");
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

  function toggleFacility(value: string) {
    setFacilities((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value],
    );
  }

  // Business type is the entry point for the ROI recommendation: picking one
  // fills in BEP, capital, rent/deposit range, facilities & landmarks based
  // on what typically works for that kind of business. Everything stays editable.
  function handleBusinessTypeChange(value: string) {
    setBusinessType(value);

    const preset = BUSINESS_PRESETS[value];
    if (!preset) return; // cleared / unknown value — leave current numbers as-is

    setBepMonths(String(preset.bepMonths));
    setCustomBepMonths(null);
    setCapital(preset.capital);
    setRentRange(preset.rentRange);
    setDepositRange(preset.depositRange);

    // Merge, don't replace — keep whatever the user already checked
    setFacilities((prev) =>
      Array.from(new Set([...prev, ...preset.facilities])),
    );

    // Only auto-fill landmarks if the user hasn't started customizing that section yet
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

  return (
    <div className="w-full">
      <div
        className={cn(
          "rounded-2xl border border-border bg-card shadow-sm",
          isFull ? "p-5 sm:p-6" : "p-3 shadow-lg shadow-primary/5 sm:p-4",
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
                    "rounded-full px-3 py-1 text-xs font-medium transition-colors",
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
        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            {children ?? (
              <div className="flex h-full min-h-40 items-center justify-center rounded-2xl border border-dashed border-border text-sm text-muted-foreground">
                Stall listing goes here
              </div>
            )}
          </div>

          <aside className="lg:col-span-1">
            <div className="space-y-5 rounded-2xl border border-border bg-secondary/20 p-4 lg:sticky lg:top-4">
              <FilterBlock title="Location & Landmarks">
                <LandmarkRadiusPicker
                  entries={landmarkEntries}
                  onChange={setLandmarkEntries}
                />
              </FilterBlock>

              <FilterBlock title="Space & Type">
                <StallSpaceFilters
                  stallType={stallType}
                  onStallTypeChange={setStallType}
                  sizeRange={sizeRange}
                  onSizeRangeChange={setSizeRange}
                />
              </FilterBlock>

              <FilterBlock title="Budget & ROI">
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
              </FilterBlock>

              <FilterBlock title="Move-in & Payment Terms">
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
              </FilterBlock>

              <FilterBlock title="Facilities">
                <FacilityPicker
                  selected={facilities}
                  onToggle={toggleFacility}
                  size="sidebar"
                />
              </FilterBlock>
            </div>
          </aside>
        </div>
      )}

      {!isFull && <StallSearchFooter />}
    </div>
  );
}
