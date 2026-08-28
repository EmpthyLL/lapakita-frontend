import { Lock, Megaphone, RefreshCw, Vault } from "lucide-react";

const POINTS = [
  {
    icon: RefreshCw,
    title: "Cancel Anytime",
    description:
      "No forced auto-debit. Your pass simply expires — renew, switch, or stay Free.",
  },
  {
    icon: Vault,
    title: "Escrow Safety",
    description:
      "Deposits and payments are held in a licensed, neutral escrow gateway.",
  },
  {
    icon: Lock,
    title: "No Auto-Lock",
    description:
      "Expired passes never lock your data — your POS history and listings stay intact.",
  },
  {
    icon: Megaphone,
    title: "No Ads, Ever",
    description:
      "We don't sell your data or show third-party ads inside your dashboard.",
  },
];

export function PricingTrust() {
  return (
    <section className="py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-sm font-semibold uppercase tracking-wider text-owner">
            Our Guarantee
          </span>
          <h2 className="font-heading mt-3 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Transparent. No Hidden Fees.
          </h2>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {POINTS.map((point) => (
            <div
              key={point.title}
              className="rounded-2xl border border-border bg-card p-6 text-center shadow-sm"
            >
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-brand text-white">
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
