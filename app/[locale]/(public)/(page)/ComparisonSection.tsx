import { Check, Sparkles, X } from "lucide-react";

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
    <section id="comparison" className="relative py-20 sm:py-28">
      {/* Background Accent Mesh - Menyatu di Samping Kanan-Bawah Section */}
      <div className="pointer-events-none absolute right-0 top-1/2 -z-10 h-125 w-96 -translate-y-1/2 opacity-20 blur-3xl bg-gradient-brand" />

      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-sm font-semibold uppercase tracking-wider text-primary">
            Why Lapakita
          </span>
          <h2 className="font-heading mt-3 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Traditional Stall Leasing vs.{" "}
            <span className="text-gradient-brand">Lapakita Ecosystem</span>
          </h2>
        </div>

        {/* Outer Card dengan Border Gradient di Sisi Kiri & Kanan */}
        <div className="relative mt-12 overflow-hidden rounded-3xl border border-border bg-card shadow-xl">
          {/* Top Decorative Gradient Accent Bar */}
          <div className="h-1.5 w-full bg-gradient-brand" />

          <div className="overflow-x-auto">
            <table className="w-full min-w-160 border-collapse text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/40">
                  <th className="w-1/4 p-4.5 text-left font-bold text-foreground">
                    Feature / Capability
                  </th>
                  <th className="w-3/8 p-4.5 text-left font-semibold text-muted-foreground">
                    Traditional Stall Leasing
                  </th>
                  {/* Header Lapakita berpendar warna primary-secondary */}
                  <th className="w-3/8 bg-linear-to-r from-primary-secondary/60 to-primary-secondary/20 p-4.5 text-left font-bold text-primary">
                    <div className="flex items-center gap-2">
                      <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-xs">
                        <Sparkles className="h-3.5 w-3.5" />
                      </span>
                      <span>Lapakita Ecosystem</span>
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {ROWS.map((row) => (
                  <tr
                    key={row.criteria}
                    className="group transition-colors hover:bg-muted/20"
                  >
                    {/* Criteria Column */}
                    <td className="p-4 font-semibold text-foreground group-hover:text-primary transition-colors">
                      {row.criteria}
                    </td>

                    {/* Traditional Column */}
                    <td className="p-4 text-muted-foreground">
                      <span className="flex items-start gap-2.5">
                        <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-destructive/10 text-destructive">
                          <X className="h-3 w-3 stroke-[2.5]" />
                        </span>
                        <span className="leading-snug">{row.traditional}</span>
                      </span>
                    </td>

                    {/* Lapakita Column (Subtle Primary Tint pada Sisi Kanan Tabel) */}
                    <td className="bg-primary-secondary/25 p-4 font-medium text-foreground transition-colors group-hover:bg-primary-secondary/40">
                      <span className="flex items-start gap-2.5">
                        <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-xs">
                          <Check className="h-3 w-3 stroke-[2.5]" />
                        </span>
                        <span className="leading-snug">{row.lapakita}</span>
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
}
