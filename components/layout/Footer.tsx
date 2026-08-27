"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { ArrowRight, Mail } from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useState } from "react";
import { LanguageSwitcher } from "../common/LanguageSwitcher";
import {
  InstagramIcon,
  LinkedinIcon,
  XIcon,
  YoutubeIcon,
} from "../icon/SocialIcon";
import { Logo } from "./Logo";

type RoleVariant = "tenant" | "owner" | "supplier";

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
  const t = useTranslations("common.footer");
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  // roleLinks menggunakan key roleVariant resmi ("tenant", "owner", "supplier")
  const roleLinks: Record<
    RoleVariant,
    {
      label: string;
      role: RoleVariant;
      links: Array<{ label: string; href: string }>;
    }
  > = {
    tenant: {
      label: t("groups.tenant"),
      role: "tenant",
      links: [
        { label: t("links.discover_stalls"), href: "/stalls" },
        {
          label: t("links.tenant_capabilities"),
          href: "/features?role=tenant",
        },
        { label: t("links.business_pos"), href: "/dashboard/tenant" },
        { label: t("links.tenant_pricing"), href: "/pricing?role=tenant" },
        { label: t("links.rental_faq"), href: "/faq?tab=tenant" },
      ],
    },
    owner: {
      label: t("groups.owner"),
      role: "owner",
      links: [
        { label: t("links.owner_capabilities"), href: "/features?role=owner" },
        { label: t("links.manage_catalog"), href: "/dashboard/owner" },
        { label: t("links.property_plans"), href: "/pricing?role=owner" },
        { label: t("links.stall_faq"), href: "/faq?tab=owner" },
      ],
    },
    supplier: {
      label: t("groups.supplier"),
      role: "supplier",
      links: [
        {
          label: t("links.supplier_capabilities"),
          href: "/features?role=supplier",
        },
        { label: t("links.wholesale_hub"), href: "/dashboard/supplier" },
        { label: t("links.supplier_plans"), href: "/pricing?role=supplier" },
        { label: t("links.supply_faq"), href: "/faq?tab=supplier" },
      ],
    },
  };

  const companyLinks = [
    { label: t("links.about_us"), href: "/about" },
    { label: t("links.pricing_plans"), href: "/pricing" },
    { label: t("links.faq_center"), href: "/faq" },
    { label: t("links.contact_support"), href: "/contact" },
    { label: t("links.jobs"), href: "/career" },
  ];

  const legalLinks = [
    { label: t("links.terms"), href: "/terms" },
    { label: t("links.privacy"), href: "/privacy" },
    { label: t("links.cookies"), href: "/cookies" },
  ];

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubmitted(true);
    setEmail("");
  };

  return (
    <footer className="w-full border-t border-border bg-secondary/30">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        {/* Main Grid */}
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-8 items-start">
          {/* Brand & Newsletter */}
          <div className="lg:col-span-5 pr-0 xl:pr-6">
            <Logo />

            <p className="mt-4 max-w-sm text-sm text-muted-foreground">
              {t("tagline")}
            </p>

            <form onSubmit={handleSubscribe} className="mt-6 max-w-sm">
              <label
                htmlFor="footer-email"
                className="text-sm font-medium text-foreground"
              >
                {t("newsletter_title")}
              </label>

              <div className="mt-2 flex gap-2">
                <div className="relative min-w-0 flex-1">
                  <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="footer-email"
                    type="email"
                    placeholder={t("placeholder_email")}
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
                {t("newsletter_desc")}
              </p>

              {submitted && (
                <p className="mt-2 text-xs text-primary font-medium">
                  {t("newsletter_success")}
                </p>
              )}
            </form>
          </div>

          {/* Links Grid */}
          <div className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-4 gap-8">
            {Object.values(roleLinks).map((group) => (
              <div key={group.role}>
                {/* Judul Role menggunakan kelas warna token dari globals.css */}
                <h4
                  className={cn(
                    "mb-4 text-sm font-semibold uppercase tracking-wide",
                    {
                      "text-tenant": group.role === "tenant",
                      "text-owner": group.role === "owner",
                      "text-supplier": group.role === "supplier",
                    },
                  )}
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

            <div>
              <h4 className="mb-4 text-sm font-semibold uppercase tracking-wide text-foreground">
                {t("groups.company")}
              </h4>
              <ul className="space-y-3">
                {companyLinks.map((link) => (
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
        <div className="mt-12 flex flex-col sm:flex-row items-center justify-between gap-6 border-t border-border pt-8 text-center sm:text-left sm:mt-14">
          <p className="text-sm text-muted-foreground">
            {t("copyright", { year: new Date().getFullYear() })}
          </p>

          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2">
            {legalLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-xs text-muted-foreground transition-colors hover:text-foreground"
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-4">
            <LanguageSwitcher variant="outline" />

            <div className="flex items-center justify-center gap-2">
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
      </div>
    </footer>
  );
}
