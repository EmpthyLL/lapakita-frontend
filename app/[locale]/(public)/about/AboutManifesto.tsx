import { MapPin, Network, ShieldCheck } from "lucide-react";

const ISSUES = [
  {
    icon: MapPin,
    title: "Data-Backed Physical Location",
    description:
      "Removing the guesswork from renting a space with landmark-based search, radius filtering, and a capital-to-break-even ratio filter.",
  },
  {
    icon: ShieldCheck,
    title: "Escrow & Contract Certainty",
    description:
      "Removing lease disputes with price-locked digital contracts and deposits held in a neutral escrow payment gateway.",
  },
  {
    icon: Network,
    title: "Direct Supply Chain Connectivity",
    description:
      "Connecting a tenant's daily POS straight to supplier procurement — no middleman advertising costs involved.",
  },
];

export function AboutManifesto() {
  return (
    <section className="bg-secondary/40 py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-heading text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Local Commerce Built on Trust & Transparency
          </h2>
          <p className="mt-5 text-pretty text-muted-foreground">
            For decades, local brick-and-mortar SMEs have operated in fragmented
            silos. Tenants struggle to evaluate rental locations realistically,
            stall owners face empty-space risk and payment friction, and
            suppliers waste budget trying to reach active buyers. Lapakita was
            founded to build a shared digital operating infrastructure where all
            three stakeholders thrive together.
          </p>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-3">
          {ISSUES.map((issue) => (
            <div
              key={issue.title}
              className="rounded-2xl border border-border bg-card p-6 shadow-sm"
            >
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-primary-secondary text-primary">
                <issue.icon className="h-5 w-5" />
              </div>
              <h3 className="font-semibold text-foreground">{issue.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                {issue.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
