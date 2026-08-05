"use client";

import Link from "next/link";
import { useState } from "react";
import { Mail, ArrowRight } from "lucide-react";
import {
  InstagramIcon,
  XIcon,
  LinkedinIcon,
  YoutubeIcon,
} from "../icon/SocialIcon";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Logo } from "./Logo";

const ROLE_LINKS = {
  tenant: {
    label: "Tenant",
    color: "primary" as const,
    links: [
      { label: "Find Stalls", href: "/stalls" },
      { label: "How Renting Works", href: "/how-it-works/tenant" },
      { label: "Built-in POS", href: "/features/pos" },
      { label: "Pricing", href: "/pricing" },
    ],
  },
  owner: {
    label: "Stall Owner",
    color: "owner" as const,
    links: [
      { label: "List Your Stall", href: "/owner/list" },
      { label: "Owner Dashboard", href: "/dashboard/owner" },
      { label: "Rent Collection", href: "/features/rent-collection" },
      { label: "Occupancy Reports", href: "/features/reports" },
    ],
  },
  supplier: {
    label: "Supplier",
    color: "supplier" as const,
    links: [
      { label: "Become a Supplier", href: "/supplier/join" },
      { label: "Order Management", href: "/features/orders" },
      { label: "Demand Forecasting", href: "/features/forecasting" },
      { label: "Supplier Dashboard", href: "/dashboard/supplier" },
    ],
  },
};

const COMPANY_LINKS = [
  { label: "About Us", href: "/about" },
  { label: "FAQ", href: "/faq" },
  { label: "Contact", href: "/contact" },
  { label: "Careers", href: "/careers" },
  { label: "Blog", href: "/blog" },
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
    // TODO: wire up to newsletter API
    setSubmitted(true);
    setEmail("");
  };

  return (
    <footer className="border-t border-border bg-secondary/30">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1.4fr_0.8fr_0.8fr_0.8fr_1fr]">
          {/* Brand + newsletter */}
          <div className="lg:pr-6">
            <Logo />

            <p className="mt-4 max-w-xs text-sm text-muted-foreground">
              The data-driven platform connecting tenants, stall owners, and
              suppliers — with business analytics and built-in POS.
            </p>

            <form onSubmit={handleSubscribe} className="mt-6 max-w-xs">
              <label
                htmlFor="footer-email"
                className="text-sm font-medium text-foreground"
              >
                Interested in partnering with Lapakita?
              </label>

              <div className="mt-2 flex gap-2">
                <div className="relative flex-1">
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

        {/* Bottom bar */}
        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-border pt-8 sm:flex-row">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Lapakita. All rights reserved.
          </p>

          <div className="flex items-center gap-4">
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

          <div className="flex items-center gap-3">
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
