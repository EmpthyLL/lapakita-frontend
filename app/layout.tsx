import type { Metadata } from "next";
import "@/style/globals.css";

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
      <body className="flex min-h-screen flex-col antialiased">{children}</body>
    </html>
  );
}
