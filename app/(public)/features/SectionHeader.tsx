import { VariantColor } from "@/types";

interface SectionHeadingProps {
  badge: string;
  title: string;
  description: string;
  color?: VariantColor;
}

export function SectionHeading({
  badge,
  title,
  description,
  color = "primary",
}: SectionHeadingProps) {
  return (
    <div className="mx-auto max-w-2xl text-center">
      <span
        className="inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wider"
        style={{
          backgroundColor: `var(--${color}-secondary)`,
          color: `var(--${color})`,
        }}
      >
        {badge}
      </span>
      <h2 className="font-heading mt-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
        {title}
      </h2>
      <p className="mt-4 text-muted-foreground">{description}</p>
    </div>
  );
}
