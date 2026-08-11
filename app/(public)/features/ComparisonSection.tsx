import { Check, X } from "lucide-react";

interface ComparisonRow {
  criteria: string;
  traditional: string;
  lapakita: string;
}

const ROWS: ComparisonRow[] = [
  {
    criteria: "Location Discovery",
    traditional: "Pure speculation, street hunting & informal advice",
    lapakita: "Landmark, radius & budget/target ROI matching",
  },
  {
    criteria: "Lease Contract Terms",
    traditional: "Loose paper agreements & unannounced price surges",
    lapakita: "Price-locked digital contracts with custom start dates",
  },
  {
    criteria: "Security Deposit Handling",
    traditional: "Held directly by owner (high risk of dispute)",
    lapakita: "Safely stored in a neutral payment gateway escrow account",
  },
  {
    criteria: "Key Exchange & Lock Access",
    traditional: "Unregulated handoffs & unclear lost key rules",
    lapakita: "Direct handoff with deposit-backed key loss protection",
  },
  {
    criteria: "Overdue Management",
    traditional: "Arbitrary daily fines & sudden lockouts without notice",
    lapakita: "Red overdue badges & manual owner discretion",
  },
  {
    criteria: "Business Operations",
    traditional: "Manual ledgers or separate third-party POS apps",
    lapakita: "Integrated POS, multi-timeline forecast & cashier access",
  },
  {
    criteria: "Raw Material Sourcing",
    traditional: "Unconnected, manual supplier hunting",
    lapakita: "In-dashboard B2B supplier matchmaking & 1-click reorders",
  },
  {
    criteria: "Move-Out & Relisting",
    traditional:
      "Automatic or premature relisting regardless of space condition",
    lapakita:
      "Photo-backed escrow claims, review ratings & manual owner relisting",
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
