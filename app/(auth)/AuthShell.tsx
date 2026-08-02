import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import Link from "next/link";
import { AuthIllustration } from "./AuthIlustration";
import { Logo } from "@/components/common/Logo";

interface AuthShellProps {
  imageSide: "left" | "right";
  illustration: {
    icon: LucideIcon;
    eyebrow: string;
    headline: string;
    description: string;
  };
  children: ReactNode;
}

export function AuthShell({
  imageSide,
  illustration,
  children,
}: AuthShellProps) {
  const imagePanel = <AuthIllustration {...illustration} />;

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
