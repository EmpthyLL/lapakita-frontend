import { CONTACT_INFO } from "./ContactData";

export function ContactInfoStrip() {
  return (
    <section className="border-y border-border bg-secondary/30">
      <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {CONTACT_INFO.map((item) => {
            const Icon = item.icon;
            const content = (
              <>
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Icon className="h-4.5 w-4.5" />
                </span>
                <span className="min-w-0">
                  <span className="block text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                    {item.label}
                  </span>
                  <span className="block truncate text-sm font-semibold text-foreground">
                    {item.value}
                  </span>
                </span>
              </>
            );

            const className =
              "flex items-center gap-3 rounded-2xl border border-border bg-card p-3.5 transition-colors";

            return item.href ? (
              <a
                key={item.label}
                href={item.href}
                target={item.href.startsWith("http") ? "_blank" : undefined}
                rel={
                  item.href.startsWith("http")
                    ? "noopener noreferrer"
                    : undefined
                }
                className={`${className} hover:border-primary/40 hover:bg-primary/3`}
              >
                {content}
              </a>
            ) : (
              <div key={item.label} className={className}>
                {content}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
