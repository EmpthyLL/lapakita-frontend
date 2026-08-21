import { Logo } from "@/components/layout/Logo";
import type { LucideIcon } from "lucide-react";
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
  illustration: IllustrationContent;
  children: ReactNode;
}

export function AuthShell({
  layout = "split",
  imageSide = "left",
  illustration,
  children,
}: AuthShellProps) {
  if (layout === "centered") {
    return (
      <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background px-4 py-12">
        <AuthIllustrationBackdrop />

        <div className="relative w-full max-w-md">
          <Link href="/" className="mb-8 flex justify-center">
            <Logo variant="full" />
          </Link>

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
        <Link href="/" className="mb-10 flex md:hidden">
          <Logo variant="full" />
        </Link>
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
