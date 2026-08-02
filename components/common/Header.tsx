"use client";

import Link from "next/link";
import {
  ChevronDown,
  User,
  Wallet,
  LogOut,
  LayoutDashboard,
  Repeat,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Logo } from "./Logo";

const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Find Stalls", href: "/stalls" },
  { label: "Features", href: "#features" },
  { label: "About Us", href: "/about" },
  { label: "FAQ", href: "/faq" },
  { label: "Contact", href: "/contact" },
];

export function SiteHeader() {
  const isLoggedIn = false;
  const userName = "John Doe";
  const userAvatarUrl = "/path/to/avatar.jpg";
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/90 backdrop-blur supports-backdrop-filter:bg-background/70">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Logo variant="full" />

        {/* Nav */}
        <nav className="hidden items-center gap-1 md:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Auth state */}
        <div className="flex items-center gap-3">
          {!isLoggedIn ? (
            <>
              <Link href="/login">
                <Button variant="ghost">Login</Button>
              </Link>
              <Link href="/register">
                <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                  Get Started
                </Button>
              </Link>
            </>
          ) : (
            <>
              <Link href="/dashboard">
                <Button variant="outline" className="hidden sm:inline-flex">
                  <LayoutDashboard className="mr-2 h-4 w-4" />
                  Go to Dashboard
                </Button>
              </Link>

              <DropdownMenu>
                <DropdownMenuTrigger>
                  <button className="flex items-center gap-1 rounded-full outline-none ring-primary/40 focus-visible:ring-2">
                    <Avatar className="h-9 w-9">
                      <AvatarImage src={userAvatarUrl} alt={userName} />
                      <AvatarFallback className="bg-primary-secondary text-primary">
                        {userName
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <ChevronDown className="h-4 w-4 text-muted-foreground" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>{userName}</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <Link href="/profile">
                      <User className="mr-2 h-4 w-4" /> Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Link href="/wallet">
                      <Wallet className="mr-2 h-4 w-4" /> Wallet
                    </Link>
                  </DropdownMenuItem>

                  <DropdownMenuSub>
                    <DropdownMenuSubTrigger>
                      <Repeat className="mr-2 h-4 w-4" /> Switch Role
                    </DropdownMenuSubTrigger>
                    <DropdownMenuSubContent>
                      <DropdownMenuItem>
                        <Link href="/dashboard/tenant">
                          <span className="mr-2 h-2 w-2 rounded-full bg-primary" />
                          Tenant
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Link href="/dashboard/owner">
                          <span className="mr-2 h-2 w-2 rounded-full bg-owner" />
                          Stall Owner
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Link href="/dashboard/supplier">
                          <span className="mr-2 h-2 w-2 rounded-full bg-supplier" />
                          Supplier
                        </Link>
                      </DropdownMenuItem>
                    </DropdownMenuSubContent>
                  </DropdownMenuSub>

                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="text-destructive focus:text-destructive">
                    <LogOut className="mr-2 h-4 w-4" /> Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          )}
        </div>
      </div>
      <div className="h-0.5 w-full bg-gradient-brand opacity-70" />
    </header>
  );
}
