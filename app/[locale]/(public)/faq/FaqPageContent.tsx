"use client";

import { RoleTab } from "@/components/common/RoleTab";
import { TocList } from "@/components/common/TOCList";
import {
  RoleFilterProvider,
  useRoleFilter,
} from "@/components/providers/role_provider";
import { Button } from "@/components/ui/button";
import { COMPREHENSIVE_FAQS } from "@/lib/data/schema/public/get_faq";
import { HelpCircle, MessageCircleQuestion } from "lucide-react";
import Link from "next/link";
import { FaqCategoryContent } from "./FaqCategoryContent";

function FaqBody() {
  const { activeRole } = useRoleFilter();
  const category =
    COMPREHENSIVE_FAQS.find((c) => c.id === activeRole) ??
    COMPREHENSIVE_FAQS[0];

  return (
    <section className="bg-background">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-secondary">
            <HelpCircle className="h-6 w-6 text-primary" />
          </div>
          <span className="text-sm font-semibold uppercase tracking-wider text-primary">
            FAQ
          </span>
          <h1 className="font-heading mt-3 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Frequently Asked Questions
          </h1>
          <p className="mt-4 text-muted-foreground">{category.description}</p>
        </div>

        <div className="mt-10 flex justify-center">
          <RoleTab />
        </div>

        <div className="mt-12 grid grid-cols-1 gap-10 lg:grid-cols-[1fr_240px]">
          <div key={category.id} className="min-w-0">
            <FaqCategoryContent category={category} />
          </div>
          <aside className="hidden lg:sticky lg:top-24 lg:block lg:h-fit">
            <TocList items={category.subTopics} />
          </aside>
        </div>

        <div className="mt-16 flex flex-col items-center gap-4 rounded-2xl border border-border bg-secondary/40 p-6 text-center sm:flex-row sm:justify-between sm:text-left">
          <div className="flex items-center gap-3">
            <MessageCircleQuestion className="h-8 w-8 shrink-0 text-primary" />
            <div>
              <p className="text-sm font-semibold text-foreground">
                Still have questions?
              </p>
              <p className="text-sm text-muted-foreground">
                Our team is happy to help you get started.
              </p>
            </div>
          </div>
          <Button
            asChild
            className="bg-primary text-primary-foreground hover:bg-primary/90"
          >
            <Link href="/contact">Contact Us</Link>
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
