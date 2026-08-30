import { SiteFooter } from "@/components/layout/Footer";
import { SiteHeader } from "@/components/layout/Header";
import { Logo } from "@/components/layout/Logo";
import { Button } from "@/components/ui/button";
import "@/style/globals.css";
import { Home, LayoutGrid, SearchX, Store } from "lucide-react";
import Link from "next/link";

export default function NotFound() {
  return (
    <>
      <SiteHeader />
      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-background px-4 py-10">
        <div className="mx-auto w-full max-w-xl rounded-[2rem] border border-border/70 bg-card/80 p-10 shadow-2xl shadow-black/10 backdrop-blur-xl">
          <div className="flex flex-col items-center text-center">
            <div className="mb-6">
              <Logo variant="mark" className="mx-auto h-24 w-24" />
            </div>
            <div className="relative mb-6">
              <div className="flex h-20 w-20 items-center justify-center rounded-[1.75rem] bg-primary-secondary">
                <Store className="h-10 w-10 text-primary" />
              </div>
              <div className="absolute -bottom-2 -right-2 flex h-9 w-9 items-center justify-center rounded-full border-4 border-background bg-destructive text-white">
                <SearchX className="h-4 w-4" />
              </div>
            </div>
            <span className="text-sm font-semibold uppercase tracking-[0.32em] text-primary">
              Error 404
            </span>
            <h1 className="mt-4 text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
              This Stall Doesn&apos;t Exist
            </h1>
            <p className="mt-4 max-w-lg text-base leading-7 text-muted-foreground">
              The page you&apos;re looking for may have moved, been rented out,
              or never existed in the first place.
            </p>

            <div className="mt-10 flex w-full flex-col gap-3 sm:flex-row sm:justify-center">
              <div className="w-full sm:w-auto">
                <Link href="/">
                  <Button className="justify-center flex items-center gap-2">
                    <Home className="h-4 w-4" />
                    Back to Home
                  </Button>
                </Link>
              </div>
              <div className="w-full sm:w-auto">
                <Link href="/stalls">
                  <Button
                    variant="outline"
                    className="justify-center flex items-center gap-2"
                  >
                    <LayoutGrid className="mr-2 h-4 w-4" />
                    Browse Stalls
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
      <SiteFooter />
    </>
  );
}
