import { FAQAccordion } from "@/components/common/FAQAccordion";
import { FAQData } from "@/lib/data/schema/public/get_faq";
import { generateSlug } from "@/lib/utils";

export function FaqCategoryContent({ category }: { category: FAQData }) {
  return (
    <div className="space-y-12">
      {category.subTopics.map((subTopic, id) => (
        <div
          key={id}
          id={generateSlug(subTopic.title)}
          className="scroll-mt-24"
        >
          <h3 className="font-heading text-lg font-bold text-foreground">
            {subTopic.title}
          </h3>
          <div className="mt-4">
            <FAQAccordion items={subTopic.items} />
          </div>
        </div>
      ))}
    </div>
  );
}
