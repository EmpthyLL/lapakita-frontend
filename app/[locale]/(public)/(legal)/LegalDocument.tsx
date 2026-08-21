import { TocList } from "@/components/common/TOCList";
import { LegalDocument } from "@/lib/data/schema/public/get_legal";
import { LegalNav } from "./LegalNav";

export function LegalDocumentView({ document }: { document: LegalDocument }) {
  return (
    <section className="bg-background">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        {/* Header */}
        <div className="max-w-2xl">
          <span className="text-sm font-semibold uppercase tracking-wider text-primary">
            Legal
          </span>
          <h1 className="font-heading mt-3 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            {document.title}
          </h1>
          <p className="mt-4 text-muted-foreground">{document.intro}</p>
          <p className="mt-2 text-xs text-muted-foreground">
            Last updated: August 5, 2026
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-10 lg:grid-cols-[220px_1fr_240px]">
          {/* Doc switcher */}
          <aside className="lg:sticky lg:top-24 lg:h-fit">
            <LegalNav />
          </aside>

          {/* Content */}
          <article className="min-w-0 space-y-12">
            {document.sections.map((section) => (
              <div key={section.id} id={section.id} className="scroll-mt-24">
                <h2 className="font-heading flex items-baseline gap-2.5 text-xl font-bold text-foreground">
                  <span className="text-primary">{section.number}.</span>
                  {section.title}
                </h2>

                <div className="mt-4 space-y-4">
                  {section.subsections.map((sub, i) => (
                    <div key={i}>
                      {sub.title && (
                        <p className="mb-1 text-sm font-semibold text-foreground">
                          {sub.title}
                        </p>
                      )}
                      <p className="text-sm leading-relaxed text-muted-foreground">
                        {sub.body}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </article>

          {/* Table of contents */}
          <aside className="hidden lg:sticky lg:top-24 lg:block lg:h-fit">
            <TocList items={document.sections} />
          </aside>
        </div>
      </div>
    </section>
  );
}
