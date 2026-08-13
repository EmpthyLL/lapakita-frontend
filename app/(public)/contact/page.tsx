import type { Metadata } from "next";
import { PersonaValue } from "./ContactData";
import { ContactFormCard } from "./ContactFormCard";
import { ContactHero } from "./ContactHero";
import { ContactInfoCard } from "./ContactInfoCard";

export const metadata: Metadata = {
  title: "Contact Us — Lapakita",
  description:
    "Have questions about stall leasing, POS setups, or B2B supplies? Get in touch with the Lapakita support team.",
};

const VALID_PERSONAS: PersonaValue[] = [
  "tenant",
  "owner",
  "supplier",
  "general",
];

export default async function ContactPage({
  searchParams,
}: {
  searchParams: Promise<{ persona?: string }>;
}) {
  const params = await searchParams;
  const defaultPersona = VALID_PERSONAS.includes(params.persona as PersonaValue)
    ? (params.persona as PersonaValue)
    : undefined;

  return (
    <>
      <ContactHero />

      <section className="pb-20 sm:pb-28">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-5">
            <div className="lg:col-span-2">
              <ContactInfoCard />
            </div>
            <div className="lg:col-span-3">
              <ContactFormCard defaultPersona={defaultPersona} />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
