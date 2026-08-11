import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export function AboutCta() {
  return (
    <section className="py-20 sm:py-28">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-brand px-8 py-16 text-center text-white sm:px-16">
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.12]"
            style={{
              backgroundImage:
                "radial-gradient(circle at 15% 25%, white 1px, transparent 1px), radial-gradient(circle at 85% 70%, white 1px, transparent 1px)",
              backgroundSize: "48px 48px",
            }}
          />
          <h2 className="font-heading relative text-3xl font-bold tracking-tight sm:text-4xl">
            Ready to Experience the Future of SME Operations?
          </h2>
          <p className="relative mx-auto mt-4 max-w-xl text-white/85">
            Join thousands of business operators, space owners, and suppliers
            transforming local commerce today.
          </p>
          <div className="relative mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button
              asChild
              size="lg"
              variant="secondary"
              className="bg-white text-primary hover:bg-white/90"
            >
              <Link href="/stalls">
                Explore Available Stalls
                <ArrowRight className="ml-1.5 h-4 w-4" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-white/40 bg-transparent text-white hover:bg-white/10"
            >
              <Link href="/register">Create Free Account</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
