"use client";

import { DatePicker } from "@/components/common/input/DatePicker";
import {
  DocumentFileItem,
  DocumentInput,
} from "@/components/common/input/DocumentInput";
import { DataDisplay } from "@/components/common/long/data-display";
import { DateRangePicker } from "@/components/common/long/date-range-picker";
import { Button } from "@/components/ui/button";
import { showToast } from "@/lib/toast";
import { Plus } from "lucide-react";
import { useState } from "react";
import { DateRange } from "react-day-picker";
import { stallQueryConfig, useStallColumns } from "./data";

function Demo({
  title,
  desc,
  children,
}: {
  title: string;
  desc: string;
  children: React.ReactNode;
}) {
  return (
    <section className="space-y-4 rounded-2xl border border-border bg-card p-6 shadow-xs">
      <div>
        <h2 className="text-lg font-semibold text-foreground">{title}</h2>
        <p className="text-xs text-muted-foreground">{desc}</p>
      </div>
      {children}
    </section>
  );
}

export default function ComponentSandboxPage() {
  const stallColumns = useStallColumns();

  const [singleDate, setSingleDate] = useState<Date | null | undefined>(
    new Date(),
  );

  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: new Date(2026, 7, 1),
    to: new Date(2026, 7, 15),
  });

  const [singleDoc, setSingleDoc] = useState<DocumentFileItem | null>(null);
  const [multipleDocs, setMultipleDocs] = useState<DocumentFileItem[] | null>(
    null,
  );
  const [isMultipleMode, setIsMultipleMode] = useState(false);

  return (
    <div className="container mx-auto max-w-6xl space-y-10 p-6">
      <div className="border-b border-border pb-5">
        <h1 className="text-2xl font-bold tracking-tight">Component Sandbox</h1>
        <p className="text-sm text-muted-foreground">
          Pengujian integrasi DatePicker, DateRangePicker, DocumentInput, dan
          DataDisplay.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <section className="space-y-3 rounded-2xl border border-border bg-card p-5 shadow-xs">
          <h2 className="text-base font-semibold text-foreground">
            1. DatePicker (Single Date)
          </h2>
          <div className="max-w-xs space-y-2">
            <DatePicker
              value={singleDate}
              onChange={(date) => setSingleDate(date)}
              placeholder="Pick a date..."
            />
            <p className="text-xs text-muted-foreground">
              Selected Value:{" "}
              <span className="font-mono text-foreground font-medium">
                {singleDate ? singleDate.toISOString().split("T")[0] : "null"}
              </span>
            </p>
          </div>
        </section>

        <section className="space-y-3 rounded-2xl border border-border bg-card p-5 shadow-xs">
          <h2 className="text-base font-semibold text-foreground">
            2. DateRangePicker (Range)
          </h2>
          <div className="space-y-2">
            <DateRangePicker
              value={dateRange}
              onUpdate={(range) => setDateRange(range)}
            />
            <p className="text-xs text-muted-foreground">
              Selected Range:{" "}
              <span className="font-mono text-foreground font-medium">
                {dateRange?.from
                  ? dateRange.from.toISOString().split("T")[0]
                  : "null"}{" "}
                —{" "}
                {dateRange?.to
                  ? dateRange.to.toISOString().split("T")[0]
                  : "null"}
              </span>
            </p>
          </div>
        </section>
      </div>

      <Demo
        title="3. DocumentInput (Base64 Support - Single & Multiple)"
        desc="Komponen input file universal untuk Foto, PDF, Word, Excel dengan pemrosesan Base64 otomatis."
      >
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">
              Mode saat ini:{" "}
              <strong className="text-foreground">
                {isMultipleMode ? "Multiple Files" : "Single File"}
              </strong>
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsMultipleMode((prev) => !prev)}
              className="h-8 text-xs rounded-lg"
            >
              Toggle ke {isMultipleMode ? "Single" : "Multiple"}
            </Button>
          </div>

          {!isMultipleMode ? (
            <div className="space-y-2">
              <DocumentInput
                title="Upload Dokumen Tunggal (KTP / Surat)"
                multiple={false}
                value={singleDoc}
                onChange={(val) => setSingleDoc(val as DocumentFileItem | null)}
              />
              <p className="text-xs text-muted-foreground">
                File terpilih:{" "}
                <span className="font-medium text-foreground">
                  {singleDoc ? singleDoc.name : "Belum ada file"}
                </span>
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              <DocumentInput
                title="Upload Dokumen Banyak (Multiple PDF, Excel, Foto)"
                multiple={true}
                value={multipleDocs}
                onChange={(val) =>
                  setMultipleDocs(val as DocumentFileItem[] | null)
                }
              />
              <p className="text-xs text-muted-foreground">
                Total file terpilih:{" "}
                <span className="font-medium text-foreground">
                  {multipleDocs?.length ?? 0} file
                </span>
              </p>
            </div>
          )}
        </div>
      </Demo>

      <Demo
        title="4. DataDisplay (Variant: list + infinite-scroll + Toolbar Action)"
        desc="Playful row cards, auto-loads on scroll, dilengkapi primary search & custom toolbar action."
      >
        <DataDisplay
          columns={stallColumns}
          query={stallQueryConfig}
          rowKey="id"
          variant="list"
          loadMode="infinite-scroll"
          showFilter
          showCount
          toolbarExtraAction={
            <Button
              size="sm"
              className="h-10 gap-1.5 rounded-xl px-3.5 text-xs"
              onClick={() => showToast.success("Modal Tambah Lapak dibuka")}
            >
              <Plus className="h-4 w-4" />
              Tambah Lapak
            </Button>
          }
        />
      </Demo>

      <Demo
        title="5. DataDisplay (Variant: card + pagination)"
        desc="Grid preset dengan navigasi halaman bernomor dan search bar terintegrasi."
      >
        <DataDisplay
          columns={stallColumns}
          query={stallQueryConfig}
          rowKey="id"
          variant="card"
          loadMode="pagination"
          showFilter
          showCount
        />
      </Demo>

      <Demo
        title="6. DataDisplay (Variant: table + load-more)"
        desc="Classic data grid dengan tombol manual load-more di bagian bawah."
      >
        <DataDisplay
          columns={stallColumns}
          query={stallQueryConfig}
          rowKey="id"
          variant="table"
          loadMode="load-more"
          showFilter
          showCount
        />
      </Demo>
    </div>
  );
}
