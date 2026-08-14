import { Button } from "@/components/ui/button";
import { ArrowRight, Eye, Layers, Lock, Scale } from "lucide-react";
import Link from "next/link";

const STATS = [
  { value: "3", label: "Roles, one account" },
  { value: "0", label: "Hidden fees" },
  { value: "100%", label: "Escrow-protected deposits" },
];

const PRINCIPLES = [
  {
    icon: Eye,
    title: "Radical Transparency",
    description:
      "No hidden fees, no mid-lease price surges, no black-box algorithms.",
  },
  {
    icon: Scale,
    title: "Ecosystem Fairness",
    description:
      "Deposits held in neutral escrow — no exploitative daily penalties.",
  },
  {
    icon: Lock,
    title: "Privacy-First Data",
    description:
      "Your revenue and margins stay strictly private to your account.",
  },
];

export function AboutSummary() {
  return (
    <section className="bg-secondary/40 py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-start gap-12 lg:grid-cols-2">
          {/* Left: narrative + stats */}
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-primary-secondary px-3 py-1 text-xs font-semibold uppercase tracking-wider text-primary">
              <Layers className="h-3.5 w-3.5" />
              About Lapakita
            </span>
            <h2 className="font-heading mt-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Re-architecting Local Commerce, Not Just Digitizing It
            </h2>
            <p className="mt-5 text-pretty text-muted-foreground">
              Lapakita is built to replace speculation with data, informal
              friction with price-locked digital contracts, and fragmented tools
              with a single operating system for business operators, stall
              owners, and B2B suppliers.
            </p>

            <Button
              asChild
              className="mt-7 bg-primary text-primary-foreground hover:bg-primary/90"
            >
              <Link href="/about">
                Learn More About Us
                <ArrowRight className="ml-1.5 h-4 w-4" />
              </Link>
            </Button>

            <div className="mt-10 grid grid-cols-3 gap-4 border-t border-border pt-8">
              {STATS.map((stat) => (
                <div key={stat.label}>
                  <span className="font-heading block text-2xl font-bold text-primary sm:text-3xl">
                    {stat.value}
                  </span>
                  <span className="mt-1 block text-xs text-muted-foreground sm:text-sm">
                    {stat.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Right: operating principles, as a compact trust-building block */}
          <div className="rounded-3xl border border-border bg-card p-6 shadow-sm sm:p-8">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              Our Operating Principles
            </h3>

            <div className="mt-5 space-y-5">
              {PRINCIPLES.map((principle) => (
                <div key={principle.title} className="flex items-start gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-brand text-white">
                    <principle.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">
                      {principle.title}
                    </p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {principle.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <Link
              href="/about#principles"
              className="mt-6 inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline"
            >
              See all our principles
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
