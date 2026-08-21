import { EyeOff, Lock, Smartphone } from "lucide-react";

const POINTS = [
  {
    icon: Lock,
    title: "Escrow Payment Security",
    description:
      "Neutral deposit storage integrated with licensed national payment gateways.",
  },
  {
    icon: EyeOff,
    title: "Privacy-First Data Isolation",
    description:
      "Tenant sales revenues and margins remain strictly private to the business owner.",
  },
  {
    icon: Smartphone,
    title: "Single Account Architecture",
    description:
      "Seamless role switching between Tenant, Owner, and Supplier with zero account clutter.",
  },
];

export function AboutTechFoundation() {
  return (
    <section className="py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <span className="inline-flex items-center rounded-full bg-supplier-secondary px-3 py-1 text-xs font-semibold uppercase tracking-wider text-supplier">
            Enterprise-Grade Security
          </span>
          <h2 className="font-heading mt-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Powered by Secure Escrow & Modern Cloud Tech
          </h2>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-3">
          {POINTS.map((point) => (
            <div
              key={point.title}
              className="flex flex-col items-center rounded-2xl border border-border bg-card p-6 text-center shadow-sm"
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-supplier-secondary text-supplier">
                <point.icon className="h-5.5 w-5.5" />
              </div>
              <h3 className="font-semibold text-foreground">{point.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                {point.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
