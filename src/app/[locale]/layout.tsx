import { Providers } from "@/components/providers/provider";
import { Locale } from "@/i18n/request";
import { routing } from "@/i18n/routing";
import "@/style/globals.css";
import type { Metadata } from "next";
import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";

export const metadata: Metadata = {
  title: "Lapakita — Find Stalls, Run Your POS, Scale Your Business",
  description:
    "Lapakita connects tenants, stall owners, and suppliers on one platform with footfall analytics and built-in POS.",
};

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as Locale)) {
    notFound();
  }

  const messages = await getMessages();

  return (
    <html lang={locale} suppressHydrationWarning>
      <body>
        <Providers locale={locale} messages={messages}>
          {children}
        </Providers>
      </body>
    </html>
  );
}
