export function ContactHero() {
  return (
    <section className="relative overflow-hidden bg-background">
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(90deg, var(--border) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />
      <div className="relative mx-auto flex max-w-3xl flex-col items-center px-4 py-20 text-center sm:px-6 sm:py-24 lg:px-8">
        <span className="inline-flex items-center rounded-full bg-primary-secondary px-3 py-1 text-xs font-semibold uppercase tracking-wider text-primary">
          Get in Touch
        </span>
        <h1 className="font-heading mt-5 text-balance text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
          We&apos;re Here to Help Your Business Thrive
        </h1>
        <p className="mt-5 text-pretty text-muted-foreground sm:text-lg">
          Have questions about stall leasing, POS setups, or B2B supplies? Send
          us a message and our support team will respond quickly.
        </p>
      </div>
    </section>
  );
}
