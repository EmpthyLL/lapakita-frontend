import { Button } from "@/components/ui/button";
import { Building2, MessageCircle, ShieldCheck } from "lucide-react";
import Image from "next/image";

export function ContactHero() {
  return (
    <section className="relative overflow-hidden bg-background">
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(90deg, var(--border) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      <div className="relative mx-auto grid max-w-6xl grid-cols-1 items-center gap-10 px-4 py-16 sm:px-6 sm:py-20 lg:grid-cols-2 lg:gap-12 lg:px-8 lg:py-24">
        {/* Left: copy */}
        <div className="text-center lg:text-left">
          <span className="inline-flex items-center rounded-full bg-primary-secondary px-3 py-1 text-xs font-semibold uppercase tracking-wider text-primary">
            Get in Touch
          </span>
          <h1 className="font-heading mt-5 text-balance text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
            We&apos;re Here to Help Your Business Thrive
          </h1>
          <p className="mx-auto mt-5 max-w-md text-pretty text-muted-foreground sm:text-lg lg:mx-0">
            Have questions about stall leasing, POS setups, or B2B supplies?
            Send us a message and our support team will assist you.
          </p>

          <div className="mt-7 flex flex-col items-center gap-3 sm:flex-row sm:justify-center lg:justify-start">
            <Button asChild size="lg" variant="success">
              <a
                href="https://wa.me/6281234567890"
                target="_blank"
                rel="noopener noreferrer"
              >
                <MessageCircle className="h-4 w-4" />
                Chat on WhatsApp
              </a>
            </Button>
            <Button asChild size="lg" variant="outline">
              <a href="#contact-form">Send a message instead</a>
            </Button>
          </div>
        </div>

        {/* Right: photo collage with practical feature cards */}
        <div className="relative mx-auto w-full max-w-md lg:max-w-none">
          <div className="relative h-72 overflow-hidden rounded-[2rem] border border-border shadow-lg sm:h-80 lg:h-96">
            <Image
              src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1000&h=1000&fit=crop"
              alt="Rows of kiosks and stalls in an Indonesian market corridor"
              fill
              className="object-cover"
              priority
            />
            <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-black/30 via-transparent to-transparent" />
          </div>

          {/* Real Feature Card 1: Verified Ecosystem */}
          <div className="absolute -left-4 bottom-6 flex items-center gap-2.5 rounded-2xl border border-border bg-card px-3.5 py-2.5 shadow-md sm:-left-6">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary-secondary text-primary">
              <Building2 className="h-4.5 w-4.5" />
            </span>
            <div className="leading-tight">
              <p className="text-sm font-bold text-foreground">
                Stalls & Kiosks
              </p>
              <p className="text-[11px] text-muted-foreground">
                Verified Listings
              </p>
            </div>
          </div>

          {/* Real Feature Card 2: Official Support */}
          <div className="absolute -right-4 top-6 flex items-center gap-2.5 rounded-2xl border border-border bg-card px-3.5 py-2.5 shadow-md sm:-right-6">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-success/10 text-success">
              <ShieldCheck className="h-4.5 w-4.5" />
            </span>
            <div className="leading-tight">
              <p className="text-sm font-bold text-foreground">
                Direct Support
              </p>
              <p className="text-[11px] text-muted-foreground">
                Official Helpdesk
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
