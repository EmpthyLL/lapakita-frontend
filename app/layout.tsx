import type { Metadata } from "next";
import "./globals.css";
import { SiteHeader } from "@/components/common/Header";
import { SiteFooter } from "@/components/common/Footer";

export const metadata: Metadata = {
  title: "Lapakita — Find Stalls, Run Your POS, Scale Your Business",
  description:
    "Lapakita connects tenants, stall owners, and suppliers on one platform with footfall analytics and built-in POS.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="flex min-h-screen flex-col antialiased">
        <SiteHeader />
        <main className="flex-1">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
