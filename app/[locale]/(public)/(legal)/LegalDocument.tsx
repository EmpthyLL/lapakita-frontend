"use client";

import { Spinner } from "@/components/common/Spinner";
import { TocList } from "@/components/common/TOCList";
import { Button } from "@/components/ui/button";
import { getLegals } from "@/lib/data/api/public";
import { DocType } from "@/lib/data/schema/public/get_legal";
import { useQuery } from "@tanstack/react-query";
import { AlertCircle, Clock, RefreshCw } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { LegalNav } from "./LegalNav";

export function LegalDocument({ docType }: { docType: DocType }) {
  const t = useTranslations("public.legal");
  const locale = useLocale();

  const {
    data: documentData,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["legal-document", docType],
    queryFn: () => getLegals(docType),
    staleTime: 10 * 60 * 1000,
  });

  const sections = documentData?.data ?? [];

  const formattedLastUpdated = documentData?.last_updated_at
    ? new Intl.DateTimeFormat(locale, {
        day: "numeric",
        month: "long",
        year: "numeric",
      }).format(new Date(documentData.last_updated_at))
    : null;

  return (
    <section className="bg-background">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        {/* Header (Title & Intro dari Local i18n) */}
        <div className="max-w-2xl">
          <span className="text-sm font-semibold uppercase tracking-wider text-primary">
            {t("badge")}
          </span>
          <h1 className="font-heading mt-3 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            {t(`docs.${docType}.title`)}
          </h1>
          <p className="mt-4 text-muted-foreground">
            {t(`docs.${docType}.intro`)}
          </p>

          {formattedLastUpdated && (
            <div className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-secondary px-3 py-1 text-[11px] font-medium text-muted-foreground">
              <Clock className="size-3.5 text-primary" />
              <span>
                {t("last_updated")}: {formattedLastUpdated}
              </span>
            </div>
          )}
        </div>

        <div className="mt-12 grid grid-cols-1 gap-10 lg:grid-cols-[220px_1fr_240px]">
          {/* Doc Switcher */}
          <aside className="lg:sticky lg:top-24 lg:h-fit">
            <LegalNav />
          </aside>

          {/* Content (Sections dari API Backend) */}
          {isLoading ? (
            <div className="flex justify-center py-20">
              <Spinner />
            </div>
          ) : isError ? (
            <div className="mx-auto max-w-md rounded-2xl border border-border bg-card p-8 text-center shadow-xs">
              <div className="mx-auto mb-3 flex size-12 items-center justify-center rounded-xl bg-destructive/10 text-destructive">
                <AlertCircle className="size-6" />
              </div>
              <h3 className="font-heading text-lg font-semibold text-foreground">
                {t("error_title")}
              </h3>
              <p className="mt-1.5 text-xs text-muted-foreground leading-relaxed">
                {t("error_desc")}
              </p>
              <Button
                onClick={() => refetch()}
                variant="outline"
                size="sm"
                className="mt-5 gap-2 font-semibold"
              >
                <RefreshCw className="size-3.5" />
                <span>{t("retry")}</span>
              </Button>
            </div>
          ) : (
            <article className="min-w-0 space-y-12">
              {sections.map((section) => (
                <div key={section.id} id={section.id} className="scroll-mt-24">
                  <h2 className="font-heading flex items-baseline gap-2.5 text-xl font-bold text-foreground">
                    <span className="text-primary">{section.number}.</span>
                    {section.title}
                  </h2>

                  <div className="mt-4 space-y-4">
                    {section.subsections?.map((sub, i) => (
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
          )}

          {/* Table of Contents */}
          <aside className="hidden lg:sticky lg:top-24 lg:block lg:h-fit">
            <TocList items={sections} isLoading={isLoading} />
          </aside>
        </div>
      </div>
    </section>
  );
}
