import { FAQAccordion } from "@/components/common/FAQAccordion";
import { HelpCircle } from "lucide-react";
import { PRICING_FAQS } from "./PricingData";

export function PricingFaq() {
  return (
    <section className="bg-secondary/40 py-20 sm:py-28">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-secondary">
            <HelpCircle className="h-6 w-6 text-primary" />
          </div>
          <span className="text-sm font-semibold uppercase tracking-wider text-primary">
            Pricing FAQ
          </span>
          <h2 className="font-heading mt-3 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Questions About Billing
          </h2>
        </div>

        <div className="mt-12">
          <FAQAccordion
            items={PRICING_FAQS.map((f, i) => ({
              id: `pricing-${i}`,
              question: f.question,
              answer: f.answer,
            }))}
          />
        </div>
      </div>
    </section>
  );
}
