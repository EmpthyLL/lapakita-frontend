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

interface IllustrationContent {
  icon: LucideIcon;
  eyebrow: string;
  headline: string;
  description: string;
}

/** Full side panel — used by "split" layout (login, register). */
export function AuthIllustrationPanel({
  icon: Icon,
  eyebrow,
  headline,
  description,
}: IllustrationContent) {
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

export function AuthIllustrationBackdrop() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="absolute -left-32 -top-32 h-72 w-72 rounded-full bg-primary/20 blur-3xl" />
      <div className="absolute -bottom-32 -right-32 h-72 w-72 rounded-full bg-owner/20 blur-3xl" />
      <div className="absolute left-1/2 top-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-supplier/10 blur-3xl" />
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(90deg, var(--border) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />
    </div>
  );
}

export function AuthIconBadge({ icon: Icon }: { icon: LucideIcon }) {
  return (
    <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-brand text-white shadow-lg shadow-primary/20">
      <Icon className="h-7 w-7" />
    </div>
  );
}
