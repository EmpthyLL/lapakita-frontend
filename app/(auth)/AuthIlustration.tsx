import { Logo } from "@/components/common/Logo";
import type { LucideIcon } from "lucide-react";
import { Sparkles } from "lucide-react";

interface AuthIllustrationProps {
  icon: LucideIcon;
  eyebrow: string;
  headline: string;
  description: string;
}

export function AuthIllustration({
  icon: Icon,
  eyebrow,
  headline,
  description,
}: AuthIllustrationProps) {
  return (
    <div className="relative hidden h-full flex-col justify-between overflow-hidden bg-gradient-brand p-10 text-white md:flex lg:p-14">
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.12]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 20% 20%, white 1px, transparent 1px), radial-gradient(circle at 80% 65%, white 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />

      <Logo variant="mark" className="relative brightness-0 invert" />

      <div className="relative max-w-sm">
        <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/15 backdrop-blur">
          <Icon className="h-7 w-7" />
        </div>
        <span className="text-sm font-semibold uppercase tracking-wider text-white/80">
          {eyebrow}
        </span>
        <h2 className="font-heading mt-3 text-3xl font-bold tracking-tight">
          {headline}
        </h2>
        <p className="mt-4 text-white/85">{description}</p>
      </div>

      <div className="relative flex items-center gap-2 text-sm text-white/70">
        <Sparkles className="h-4 w-4" />
        Trusted by tenants, owners, and suppliers across Indonesia
      </div>
    </div>
  );
}
