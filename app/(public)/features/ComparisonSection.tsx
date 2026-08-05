import { Check, X } from "lucide-react";

interface ComparisonRow {
  criteria: string;
  traditional: string;
  lapakita: string;
}

const ROWS: ComparisonRow[] = [
  {
    criteria: "Location Decision",
    traditional: "Pure speculation / informal advice",
    lapakita: "Data-backed comparison & simulation",
  },
  {
    criteria: "Lease Agreement",
    traditional: "Loose paper / verbal agreement",
    lapakita: "Price-locked digital contracts",
  },
  {
    criteria: "Deposit Handling",
    traditional: "Held directly by owner (risk of dispute)",
    lapakita: "Safe escrow payment gateway hold",
  },
  {
    criteria: "Key Exchange",
    traditional: "Unverified manual handoff",
    lapakita: "Photo-verified Request Key Protocol",
  },
  {
    criteria: "Overdue Management",
    traditional: "Sudden lockouts / exploitative daily fees",
    lapakita: "Clear visual alerts & manual owner control",
  },
  {
    criteria: "Business Operations",
    traditional: "Separate manual ledgers / third-party apps",
    lapakita: "Integrated POS, inventory & staff management",
  },
  {
    criteria: "Raw Material Sourcing",
    traditional: "Unconnected, manual supplier search",
    lapakita: "In-dashboard B2B supplier matchmaking",
  },
  {
    criteria: "Overdue / Exit Cleanup",
    traditional: "Unregulated responsibility",
    lapakita: "Community rating penalties & deposit-backed damage claims",
  },
];

export function ComparisonSection() {
  return (
    <section id="comparison" className="py-20 sm:py-28">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-sm font-semibold uppercase tracking-wider text-primary">
            Why Lapakita
          </span>
          <h2 className="font-heading mt-3 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Traditional Stall Leasing vs. Lapakita Ecosystem
          </h2>
        </div>

        <div className="mt-12 overflow-x-auto rounded-2xl border border-border shadow-sm">
          <table className="w-full min-w-160 border-collapse text-sm">
            <thead>
              <tr className="bg-secondary/60">
                <th className="p-4 text-left font-semibold text-foreground">
                  Feature / Capability
                </th>
                <th className="p-4 text-left font-semibold text-muted-foreground">
                  Traditional Stall Leasing
                </th>
                <th className="p-4 text-left font-semibold text-primary">
                  Lapakita Ecosystem
                </th>
              </tr>
            </thead>
            <tbody>
              {ROWS.map((row, i) => (
                <tr
                  key={row.criteria}
                  className={i % 2 === 1 ? "bg-secondary/20" : undefined}
                >
                  <td className="border-t border-border p-4 font-medium text-foreground">
                    {row.criteria}
                  </td>
                  <td className="border-t border-border p-4 text-muted-foreground">
                    <span className="flex items-start gap-2">
                      <X className="mt-0.5 h-4 w-4 shrink-0 text-destructive/70" />
                      {row.traditional}
                    </span>
                  </td>
                  <td className="border-t border-border p-4 text-foreground">
                    <span className="flex items-start gap-2">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                      {row.lapakita}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
