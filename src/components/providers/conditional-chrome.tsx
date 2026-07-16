"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { SmoothScrollProvider } from "@/components/providers/smooth-scroll-provider";
import { Navbar } from "@/components/site/navbar";
import { SiteFooter } from "@/components/site/site-footer";
import { FloatingRoot } from "@/components/floating/floating-root";
import { ScrollProgress } from "@/components/site/scroll-progress";
import { Toaster as SiteToaster } from "@/components/ui/site-toaster";

/**
 * ConditionalChrome
 *
 * The root layout wraps every route (public + /admin/*) in the same shell.
 * The admin panel has its own AdminShell (sidebar + topbar) and must NOT
 * also render the public site's Navbar, SiteFooter, FloatingRoot,
 * ScrollProgress, or Lenis smooth-scroll — otherwise a "ribbon" of site
 * chrome sits on top of the admin content and hides it.
 *
 * This client component reads the pathname and renders the full site chrome
 * only for public routes. For /admin/* it renders the children bare.
 */
export function ConditionalChrome({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin") ?? false;

  if (isAdmin) {
    // Admin panel manages its own layout, scroll, and chrome.
    return <>{children}</>;
  }

  return (
    <SmoothScrollProvider>
      <div className="relative flex min-h-screen flex-col bg-charcoal">
        <ScrollProgress />
        <Navbar />
        <main className="flex-1 flex flex-col">{children}</main>
        <SiteFooter />
      </div>
      <FloatingRoot />
      <SiteToaster />
    </SmoothScrollProvider>
  );
}
