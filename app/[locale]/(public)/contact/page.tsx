import type { Metadata } from "next";
import { ContactFormCard } from "./ContactFormCard";
import { ContactHero } from "./ContactHero";
import { ContactInfoStrip } from "./ContactInfoStrip";

export const metadata: Metadata = {
  title: "Contact Us — Lapakita",
  description:
    "Have questions about stall leasing, POS setups, or B2B supplies? Get in touch with the Lapakita support team.",
};

export default function ContactPage() {
  return (
    <div className="bg-background">
      <ContactHero />
      <ContactInfoStrip />

      <div
        id="contact-form"
        className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8"
      >
        <ContactFormCard />
      </div>
    </div>
  );
}
