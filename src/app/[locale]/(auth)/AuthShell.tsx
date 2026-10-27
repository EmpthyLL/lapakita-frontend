import { Logo } from "@/components/layout/Logo";
import { ArrowLeft, type LucideIcon } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";
import {
  AuthIconBadge,
  AuthIllustrationBackdrop,
  AuthIllustrationPanel,
} from "./AuthIlustration";

interface IllustrationContent {
  icon: LucideIcon;
  eyebrow: string;
  headline: string;
  description: string;
}

interface AuthShellProps {
  /** "split": image panel + form side-by-side (login, register).
   *  "centered": single centered card with decorative backdrop (everything else). */
  layout?: "split" | "centered";
  /** Only used when layout === "split" */
  imageSide?: "left" | "right";
  backHref?: string;
  backLabel?: string;
  illustration: IllustrationContent;
  children: ReactNode;
}

export function AuthShell({
  layout = "split",
  imageSide = "left",
  backHref = "/",
  backLabel = "Back to home",
  illustration,
  children,
}: AuthShellProps) {
  const backLink = (
    <Link
      href={backHref}
      className="group inline-flex h-9 w-fit items-center gap-2 rounded-full border border-border bg-background/80 px-3.5 text-sm font-medium text-muted-foreground shadow-xs transition-colors hover:border-primary/30 hover:bg-primary/5 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30"
    >
      <ArrowLeft className="size-4 transition-transform duration-150 group-hover:-translate-x-0.5" />
      {backLabel}
    </Link>
  );

  if (layout === "centered") {
    return (
      <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background px-4 py-12">
        <AuthIllustrationBackdrop />

        <div className="relative w-full max-w-md">
          <div className="mb-8 flex items-center justify-between gap-4">
            <Logo variant="full" />
            {backLink}
          </div>

          <div className="rounded-3xl border border-border bg-card p-8 shadow-lg shadow-primary/5 sm:p-10">
            <AuthIconBadge icon={illustration.icon} />
            {children}
          </div>
        </div>
      </div>
    );
  }

  const imagePanel = <AuthIllustrationPanel {...illustration} />;

  const formPanel = (
    <div className="flex h-full flex-col justify-center px-6 py-12 sm:px-12 lg:px-20">
      <div className="mx-auto w-full max-w-sm">
        <div className="mb-5">{backLink}</div>
        <div className="mb-10 md:hidden">
          <Logo variant="full" />
        </div>
        {children}
      </div>
    </div>
  );

  return (
    <div className="grid min-h-screen grid-cols-1 md:grid-cols-2">
      {imageSide === "left" ? (
        <>
          {imagePanel}
          {formPanel}
        </>
      ) : (
        <>
          {formPanel}
          {imagePanel}
        </>
      )}
    </div>
  );
}
