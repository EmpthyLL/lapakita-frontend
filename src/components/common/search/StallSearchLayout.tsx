import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface StallSearchLayoutProps {
  /** Filter sections, urutkan dari yang paling sering dipakai ke paling jarang */
  children: ReactNode;
  /** Panel sekunder (facilities), ditaruh di sidebar kanan */
  facilities: ReactNode;
}

export function StallSearchLayout({
  children,
  facilities,
}: StallSearchLayoutProps) {
  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
      <div className="flex flex-col lg:col-span-2">{children}</div>

      <aside className="lg:col-span-1">
        <div className="rounded-2xl border border-border bg-secondary/20 p-4 lg:sticky lg:top-4">
          <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Facilities{" "}
            <span className="normal-case text-muted-foreground/70">
              (select all that you need)
            </span>
          </p>
          {facilities}
        </div>
      </aside>
    </div>
  );
}

interface FilterSectionProps {
  title: string;
  children: ReactNode;
  className?: string;
}

export function FilterSection({
  title,
  children,
  className,
}: FilterSectionProps) {
  return (
    <section
      className={cn(
        "border-t border-border pt-6 first:border-t-0 first:pt-0 not-first:mt-6",
        className,
      )}
    >
      <h3 className="mb-3 text-sm font-semibold text-foreground">{title}</h3>
      {children}
    </section>
  );
}
