import { Calculator, Eye, Rocket, Scale } from "lucide-react";

const PRINCIPLES = [
  {
    icon: Eye,
    title: "Radical Transparency",
    description:
      "No hidden fees, no mid-lease price surges, and no black-box algorithms. All contract terms and analytics are clear and predictable.",
  },
  {
    icon: Calculator,
    title: "Deterministic Data, No Speculation",
    description:
      "Business forecasting built on mathematical financial models, historical POS trends, and realistic operational inputs.",
  },
  {
    icon: Scale,
    title: "Ecosystem Fairness",
    description:
      "Security deposits held in neutral escrow. No exploitative daily penalties, no forced evictions, and peer-to-peer review accountability.",
  },
  {
    icon: Rocket,
    title: "Gradual Onboarding",
    description:
      "Zero-friction entry. Minimal initial setup, optional KYC only when legally needed, and unbundled pricing for every SME budget.",
  },
];

export function AboutPrinciples() {
  return (
    <section className="bg-secondary/40 py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-sm font-semibold uppercase tracking-wider text-owner">
            Our Operating Principles
          </span>
          <h2 className="font-heading mt-3 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            The Philosophy Behind Every Feature
          </h2>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {PRINCIPLES.map((principle) => (
            <div
              key={principle.title}
              className="rounded-2xl border border-border bg-card p-6 shadow-sm"
            >
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-brand text-white">
                <principle.icon className="h-5 w-5" />
              </div>
              <h3 className="font-semibold text-foreground">
                {principle.title}
              </h3>
              <p className="mt-2 text-sm text-muted-foreground">
                {principle.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
