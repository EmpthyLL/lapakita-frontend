"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { VariantColor } from "@/types";

export interface FaqItem {
  question: string;
  answer: string;
  roleType?: VariantColor;
}

interface FaqAccordionSectionProps {
  items: FaqItem[];
}

export function FAQAccordion({ items }: FaqAccordionSectionProps) {
  return (
    <Accordion type="single" collapsible className="w-full">
      {items.map((item, id) => (
        <AccordionItem
          key={id}
          value={`faq-item-${id}`}
          className="border-border"
        >
          <AccordionTrigger className="text-left text-sm font-semibold text-foreground hover:no-underline sm:text-base">
            <span className="flex items-start gap-2.5">
              {item.roleType && (
                <span
                  className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full"
                  style={{ backgroundColor: `var(--${item.roleType})` }}
                />
              )}
              {item.question}
            </span>
          </AccordionTrigger>
          <AccordionContent className="text-sm text-muted-foreground">
            {item.answer}
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
