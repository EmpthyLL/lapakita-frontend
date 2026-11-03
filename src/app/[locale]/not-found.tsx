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
      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-background px-4 py-8 sm:py-12 md:py-16">
        <div className="mx-auto w-full max-w-xl rounded-2xl sm:rounded-[2rem] border border-border/70 bg-card/80 p-6 sm:p-8 md:p-10 shadow-2xl shadow-black/10 backdrop-blur-xl">
          <div className="flex flex-col items-center text-center">
            {/* Logo Utama */}
            <div className="mb-4 sm:mb-6">
              <Logo
                variant="mark"
                className="mx-auto h-16 w-16 sm:h-20 sm:w-20 md:h-24 md:w-24"
              />
            </div>

            {/* Ikon 404 Visual */}
            <div className="relative mb-4 sm:mb-6">
              <div className="flex h-16 w-16 sm:h-20 sm:w-20 items-center justify-center rounded-[1.25rem] sm:rounded-[1.75rem] bg-primary-secondary">
                <Store className="h-8 w-8 sm:h-10 sm:w-10 text-primary" />
              </div>
              <div className="absolute -bottom-1 -right-1 sm:-bottom-2 sm:-right-2 flex h-7 w-7 sm:h-9 sm:w-9 items-center justify-center rounded-full border-2 sm:border-4 border-background bg-destructive text-white">
                <SearchX className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              </div>
            </div>

            {/* Teks Label & Judul */}
            <span className="text-xs sm:text-sm font-semibold uppercase tracking-[0.25em] sm:tracking-[0.32em] text-primary">
              Error 404
            </span>
            <h1 className="mt-2 sm:mt-4 text-2xl sm:text-4xl md:text-5xl font-semibold tracking-tight text-foreground">
              This Stall Doesn&apos;t Exist
            </h1>
            <p className="mt-3 sm:mt-4 max-w-md sm:max-w-lg text-sm sm:text-base leading-relaxed sm:leading-7 text-muted-foreground">
              The page you&apos;re looking for may have moved, been rented out,
              or never existed in the first place.
            </p>

            {/* Tombol Aksi Responsif */}
            <div className="mt-8 sm:mt-10 flex w-full flex-col sm:flex-row items-center justify-center gap-3">
              <Link href="/" className="w-full sm:w-auto">
                <Button className="w-full sm:w-auto justify-center flex items-center gap-2">
                  <Home className="h-4 w-4" />
                  Back to Home
                </Button>
              </Link>
              <Link href="/stalls" className="w-full sm:w-auto">
                <Button
                  variant="outline"
                  className="w-full sm:w-auto justify-center flex items-center gap-2"
                >
                  <LayoutGrid className="h-4 w-4" />
                  Browse Stalls
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
      <SiteFooter />
    </>
  );
}
