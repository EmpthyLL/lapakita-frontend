"use client";

import { RoleTab } from "@/components/common/RoleTab";
import { Spinner } from "@/components/common/Spinner";
import { TocList } from "@/components/common/TOCList";
import {
  RoleFilterProvider,
  useRoleFilter,
} from "@/components/providers/role_provider";
import { Button } from "@/components/ui/button";
import { getFAQs } from "@/lib/data/api/public";
import { useQuery } from "@tanstack/react-query";
import {
  AlertCircle,
  Clock,
  HelpCircle,
  MessageCircleQuestion,
  RefreshCw,
} from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import Link from "next/link";
import { FaqCategoryContent } from "./FaqCategoryContent";

function FaqBody() {
  const { activeRole } = useRoleFilter();
  const t = useTranslations("public.faq");
  const locale = useLocale();

  const {
    data: categoriesData,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["faqs", activeRole],
    queryFn: () => getFAQs(activeRole),
    staleTime: 5 * 60 * 1000,
  });

  const categories = categoriesData ?? [];
  const category =
    categories.find((c) => c?.id === activeRole) ?? categories[0];

  // Deskripsi khusus role bersumber dari JSON i18n lokal
  const activeRoleDescription = t.has(`descriptions.${activeRole}`)
    ? t(`descriptions.${activeRole}`)
    : t("descriptions.all");

  // Format tanggal Last Updated At
  const formattedLastUpdated = category?.last_updated_at
    ? new Intl.DateTimeFormat(locale, {
        day: "numeric",
        month: "long",
        year: "numeric",
      }).format(new Date(category.last_updated_at))
    : null;

  return (
    <section className="bg-background">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-secondary">
            <HelpCircle className="h-6 w-6 text-primary" />
          </div>
          <span className="text-sm font-semibold uppercase tracking-wider text-primary">
            {t("badge")}
          </span>
          <h1 className="font-heading mt-3 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            {t("title")}
          </h1>
          <p className="mt-4 text-muted-foreground">{activeRoleDescription}</p>

          {/* Badge Last Updated At */}
          {formattedLastUpdated && (
            <div className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-secondary px-3 py-1 text-[11px] font-medium text-muted-foreground">
              <Clock className="size-3.5 text-primary" />
              <span>
                {t("last_updated")}: {formattedLastUpdated}
              </span>
            </div>
          )}
        </div>

        <div className="mt-10 flex justify-center">
          <RoleTab />
        </div>

        {/* --- STATE LOADING --- */}
        {isLoading ? (
          <div className="mt-16 flex justify-center py-12">
            <Spinner />
          </div>
        ) : isError || !category ? (
          /* --- STATE ERROR / EMPTY --- */
          <div className="mt-12 mx-auto max-w-md rounded-2xl border border-border bg-card p-8 text-center shadow-xs">
            <div className="mx-auto mb-3 flex size-12 items-center justify-center rounded-xl bg-destructive/10 text-destructive">
              <AlertCircle className="size-6" />
            </div>
            <h3 className="font-heading text-lg font-semibold text-foreground">
              {t("error.title")}
            </h3>
            <p className="mt-1.5 text-xs text-muted-foreground leading-relaxed">
              {t("error.description")}
            </p>
            <Button
              onClick={() => refetch()}
              variant="outline"
              size="sm"
              className="mt-5 gap-2 font-semibold"
            >
              <RefreshCw className="size-3.5" />
              <span>{t("error.retry")}</span>
            </Button>
          </div>
        ) : (
          /* --- STATE DATA SUKSES (MURNI DARI API) --- */
          <div className="mt-12 grid grid-cols-1 gap-10 lg:grid-cols-[1fr_240px]">
            <div key={category.id} className="min-w-0">
              <FaqCategoryContent category={category} />
            </div>
            <aside className="hidden lg:sticky lg:top-24 lg:block lg:h-fit">
              <TocList items={category.subTopics ?? []} isLoading={isLoading} />
            </aside>
          </div>
        )}

        {/* --- FOOTER CTA CONTACT --- */}
        <div className="mt-16 flex flex-col items-center gap-4 rounded-2xl border border-border bg-secondary/40 p-6 text-center sm:flex-row sm:justify-between sm:text-left">
          <div className="flex items-center gap-3">
            <MessageCircleQuestion className="h-8 w-8 shrink-0 text-primary" />
            <div>
              <p className="text-sm font-semibold text-foreground">
                {t("contact.title")}
              </p>
              <p className="text-sm text-muted-foreground">
                {t("contact.description")}
              </p>
            </div>
          </div>
          <Button
            asChild
            className="bg-primary text-primary-foreground hover:bg-primary/90"
          >
            <Link href="/contact">{t("contact.button")}</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}

export function FaqPageContent() {
  return (
    <RoleFilterProvider paramKey="tab">
      <FaqBody />
    </RoleFilterProvider>
  );
}
