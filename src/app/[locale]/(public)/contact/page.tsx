// app/contact/page.tsx
import type { Metadata } from "next";
import { ContactFormCard } from "./ContactFormCard";
import { ContactHero } from "./ContactHero";
import { ContactInfoStrip } from "./ContactInfoStrip";
import { ContactTabSwitch } from "./ContactTabSwitch";

export const metadata: Metadata = {
  title: "Contact Us — Lapakita",
  description:
    "Have questions about stall leasing, POS setups, B2B supplies, or corporate partnerships? Get in touch with the Lapakita team.",
};

interface ContactPageProps {
  searchParams: Promise<{
    intent?: string;
    email?: string;
  }>;
}

export default async function ContactPage({ searchParams }: ContactPageProps) {
  const resolvedParams = await searchParams;
  const activeTab =
    resolvedParams.intent === "partnership" ? "partnership" : "support";
  const initialEmail = resolvedParams.email || "";

  return (
    <div className="bg-background">
      <ContactHero />
      <ContactInfoStrip />

      <div
        id="contact-form"
        className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8 space-y-8"
      >
        <ContactTabSwitch activeTab={activeTab} />
        <ContactFormCard
          defaultIntent={activeTab}
          defaultEmail={initialEmail}
        />
      </div>
    </div>
  );
}
