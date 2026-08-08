"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowRight, Mail } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import {
  InstagramIcon,
  LinkedinIcon,
  XIcon,
  YoutubeIcon,
} from "../icon/SocialIcon";
import { Logo } from "./Logo";

export const ROLE_LINKS = {
  tenant: {
    label: "For Tenants",
    color: "primary" as const,
    links: [
      { label: "Discover Your Ideal Stall", href: "/stalls" },
      { label: "Learn Tenant Capabilities", href: "/features?role=tenant" },
      { label: "Establish Business POS", href: "/dashboard/tenant" },
      { label: "View Tenant Pricing Plans", href: "/pricing?role=tenant" },
      { label: "Tenant Rental & POS FAQ", href: "/faq?tab=tenant" },
    ],
  },
  owner: {
    label: "For Stall Owners",
    color: "owner" as const,
    links: [
      { label: "Learn Owner Capabilities", href: "/features?role=owner" },
      { label: "Manage Property Portfolio", href: "/dashboard/owner" },
      { label: "View Property Plans", href: "/pricing?role=owner" },
      { label: "Stall Management FAQ", href: "/faq?tab=owner" },
    ],
  },
  supplier: {
    label: "For B2B Suppliers",
    color: "supplier" as const,
    links: [
      { label: "Learn Supplier Capabilities", href: "/features?role=supplier" },
      { label: "Access Wholesale Hub", href: "/dashboard/supplier" },
      { label: "View Supplier Plans", href: "/pricing?role=supplier" },
      { label: "Supplier Procurement FAQ", href: "/faq?tab=supplier" },
    ],
  },
};

const COMPANY_LINKS = [
  { label: "About Us", href: "/about" },
  { label: "Pricing & Plans", href: "/pricing" },
  { label: "FAQ Center", href: "/faq" },
  { label: "Contact Support", href: "/contact" },
  { label: "Jobs Application", href: "/career" },
];

const LEGAL_LINKS = [
  { label: "Terms of Service", href: "/terms" },
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Cookie Policy", href: "/cookies" },
];

const SOCIALS = [
  {
    icon: InstagramIcon,
    href: "https://instagram.com/lapakita",
    label: "Instagram",
  },
  { icon: XIcon, href: "https://x.com/lapakita", label: "X" },
  {
    icon: LinkedinIcon,
    href: "https://linkedin.com/company/lapakita",
    label: "LinkedIn",
  },
  {
    icon: YoutubeIcon,
    href: "https://youtube.com/@lapakita",
    label: "YouTube",
  },
];

export function SiteFooter() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubmitted(true);
    setEmail("");
  };

  return (
    <footer className="w-full border-t border-border bg-secondary/30">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        {/* Main Grid: Memisahkan bagian Brand & Newsletter dengan kumpulan kolom link */}
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-8 items-start">
          {/* Sisi Kiri: Brand & Newsletter (Mengambil porsi 5 kolom di layar besar) */}
          <div className="lg:col-span-5 pr-0 xl:pr-6">
            <Logo />

            <p className="mt-4 max-w-sm text-sm text-muted-foreground">
              The data-driven platform connecting tenants, stall owners, and
              suppliers — with business analytics and built-in POS.
            </p>

            <form onSubmit={handleSubscribe} className="mt-6 max-w-sm">
              <label
                htmlFor="footer-email"
                className="text-sm font-medium text-foreground"
              >
                Interested in partnering with Lapakita?
              </label>

              <div className="mt-2 flex gap-2">
                <div className="relative min-w-0 flex-1">
                  <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="footer-email"
                    type="email"
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="h-10 bg-background pl-9"
                    required
                  />
                </div>

                <Button
                  type="submit"
                  size="icon"
                  className="h-10 w-10 shrink-0 bg-primary text-primary-foreground hover:bg-primary/90"
                  aria-label="Contact us"
                >
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>

              <p className="mt-2 text-xs text-muted-foreground">
                Leave your email and our team will get in touch to discuss
                partnership opportunities.
              </p>

              {submitted && (
                <p className="mt-2 text-xs text-primary">
                  Thanks! We&rsquo;ve received your inquiry and will contact you
                  soon.
                </p>
              )}
            </form>
          </div>

          {/* Sisi Kanan: Sub-grid untuk seluruh Kolom Link (Mengambil porsi 7 kolom sisa) */}
          <div className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-4 gap-8">
            {/* Role link columns */}
            {Object.values(ROLE_LINKS).map((group) => (
              <div key={group.label}>
                <h4
                  className="mb-4 text-sm font-semibold uppercase tracking-wide"
                  style={{ color: `var(--${group.color})` }}
                >
                  {group.label}
                </h4>
                <ul className="space-y-3">
                  {group.links.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}

            {/* Company */}
            <div>
              <h4 className="mb-4 text-sm font-semibold uppercase tracking-wide text-foreground">
                Company
              </h4>
              <ul className="space-y-3">
                {COMPANY_LINKS.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 flex flex-col items-center gap-6 border-t border-border pt-8 text-center sm:mt-14">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Lapakita. All rights reserved.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2">
            {LEGAL_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-xs text-muted-foreground transition-colors hover:text-foreground"
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="flex items-center justify-center gap-3">
            {SOCIALS.map(({ icon: Icon, href, label }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="flex h-8 w-8 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors hover:border-primary hover:text-primary"
              >
                <Icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
