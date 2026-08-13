import { ArrowRight, HelpCircle } from "lucide-react";
import Link from "next/link";
import { CONTACT_INFO } from "./ContactData";

export function ContactInfoCard() {
  return (
    <div className="rounded-3xl border border-border bg-card p-6 shadow-sm sm:p-8">
      <div className="space-y-6">
        {CONTACT_INFO.map((item) => {
          const content = (
            <div className="flex items-start gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary-secondary text-primary">
                <item.icon className="h-5 w-5" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  {item.label}
                </p>
                <p className="mt-0.5 truncate text-sm font-medium text-foreground">
                  {item.value}
                </p>
              </div>
            </div>
          );

          return item.href ? (
            <a
              key={item.label}
              href={item.href}
              target={item.href.startsWith("http") ? "_blank" : undefined}
              rel={
                item.href.startsWith("http") ? "noopener noreferrer" : undefined
              }
              className="block transition-opacity hover:opacity-80"
            >
              {content}
            </a>
          ) : (
            <div key={item.label}>{content}</div>
          );
        })}
      </div>

      <div className="mt-8 rounded-2xl border border-border bg-secondary/40 p-5">
        <div className="flex items-start gap-3">
          <HelpCircle className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
          <div>
            <p className="text-sm font-semibold text-foreground">
              Looking for quick answers?
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              Most questions about leasing, POS, and deposits are already
              answered in our FAQ.
            </p>
            <Link
              href="/faq"
              className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline"
            >
              Read FAQ
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
