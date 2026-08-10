"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAdmin } from "@/lib/admin/auth-context";
import { useRouter, usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  FileText,
  Settings,
  Package,
  Palette,
  Search,
  FileEdit,
  Image as ImageIcon,
  Home,
  HelpCircle,
  LogOut,
  ExternalLink,
  Menu,
  X,
  Briefcase,
  Handshake,
  Database,
  Globe,
  Shield,
  TrendingUp,
} from "lucide-react";

const navItems = [
  // ── OVERVIEW ──
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  // ── CRM ──
  { label: "Leads CRM", href: "/admin/crm", icon: Database },
  { label: "Leads (Legacy)", href: "/admin/leads", icon: Users },
  // ── CATALOGUE ──
  { label: "Products", href: "/admin/products", icon: Package },
  { label: "Image Manager", href: "/admin/images", icon: ImageIcon },
  { label: "Track Pages", href: "/admin/track-pages", icon: FileEdit },
  { label: "Media Library", href: "/admin/media", icon: FileEdit },
  { label: "Blog Posts", href: "/admin/blog", icon: FileText },
  { label: "Client Logos", href: "/admin/client-logos", icon: Users },
  // ── CONTENT ──
  { label: "Homepage Builder", href: "/admin/homepage", icon: Home },
  { label: "Website CMS", href: "/admin/cms", icon: Settings },
  { label: "Page Content", href: "/admin/pages", icon: FileEdit },
  { label: "FAQ Manager", href: "/admin/faq", icon: HelpCircle },
  // ── PEOPLE ──
  { label: "Careers", href: "/admin/careers", icon: Briefcase },
  { label: "Dealers", href: "/admin/dealers", icon: Handshake },
  // ── CONFIGURATION ──
  { label: "Appearance", href: "/admin/appearance", icon: Palette },
  { label: "SEO & Company", href: "/admin/seo", icon: Search },
  { label: "Content Hub", href: "/admin/content", icon: FileEdit },
];

export function AdminShell({ children }: { children: React.ReactNode }) {
  const { user, logout, loading } = useAdmin();
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [dbWarning, setDbWarning] = useState<{
    error: string;
    fixInstructions: string;
    errorType: string;
  } | null>(null);

  useEffect(() => {
    if (!loading && !user && pathname !== "/admin/login") {
      router.push("/admin/login");
    }
  }, [user, loading, pathname, router]);

  // Check DB health on admin pages load
  useEffect(() => {
    if (user && pathname !== "/admin/login") {
      fetch("/api/admin/health", { cache: "no-store" })
        .then((r) => r.json())
        .then((data) => {
          if (!data.ok) {
            setDbWarning({
              error: data.error || "Database connection failed.",
              fixInstructions: data.fixInstructions || "Check your DATABASE_URL on Vercel.",
              errorType: data.errorType || "UNKNOWN",
            });
          } else {
            setDbWarning(null);
          }
        })
        .catch(() => {
          // Health check failed — don't block the admin
        });
    }
  }, [user, pathname]);

  if (loading) {
    return (
      <div className="min-h-screen bg-charcoal flex items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-brass/30 border-t-brass" />
      </div>
    );
  }

  if (!user && pathname !== "/admin/login") {
    return null;
  }

  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-charcoal flex">
      {/* Sidebar */}
      <aside
        className={`${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 fixed lg:sticky top-0 left-0 z-50 h-screen w-64 bg-charcoal border-r border-white/10 transition-transform flex flex-col`}
      >
        <div className="shrink-0 p-6 border-b border-white/10">
          <img src="/images/laxree-logo.png" alt="LaxRee" className="h-8" />
          <p className="mt-2 font-mono text-[9px] uppercase tracking-[0.3em] text-sand">Admin Panel</p>
        </div>

        <nav className="flex-1 overflow-y-auto p-4 flex flex-col gap-1 scrollbar-thin">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 rounded-xl px-4 py-2.5 text-[13px] font-medium transition-colors ${
                  isActive
                    ? "bg-brass/10 text-brass border border-brass/20"
                    : "text-sand hover:bg-white/5 hover:text-ivory"
                }`}
              >
                <Icon className="h-4 w-4 shrink-0" strokeWidth={1.75} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="shrink-0 p-4 border-t border-white/10">
          <a
            href="https://l-axreedemo.vercel.app"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 rounded-xl px-4 py-2.5 text-[13px] text-sand hover:bg-white/5 hover:text-ivory transition-colors mb-1"
          >
            <ExternalLink className="h-4 w-4" strokeWidth={1.75} />
            View Website
          </a>
          <button
            onClick={() => {
              logout();
              router.push("/admin/login");
            }}
            className="flex w-full items-center gap-3 rounded-xl px-4 py-2.5 text-[13px] text-sand hover:bg-red-500/10 hover:text-red-400 transition-colors"
          >
            <LogOut className="h-4 w-4" strokeWidth={1.75} />
            Logout
          </button>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar (mobile) */}
        <header className="lg:hidden flex items-center justify-between p-4 border-b border-white/10">
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-ivory">
            {sidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
          <img src="/images/laxree-logo.png" alt="LaxRee" className="h-6" />
          <div className="w-6" />
        </header>

        {/* Page content */}
        <main className="flex-1 p-6 md:p-8 overflow-y-auto">
          {dbWarning && (
            <div className="mb-6 rounded-xl border border-red-500/40 bg-red-500/10 p-5">
              <div className="flex items-start gap-3">
                <Database className="h-5 w-5 text-red-400 shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-[14px] font-semibold text-red-400">
                    Database Not Connected — Admin Changes Will NOT Persist
                  </p>
                  <p className="mt-1.5 text-[12px] text-sand leading-relaxed">
                    {dbWarning.error}
                  </p>
                  <div className="mt-3 rounded-lg bg-charcoal/60 border border-red-500/20 p-3">
                    <p className="text-[11px] font-mono uppercase tracking-wider text-brass mb-1.5">
                      How to Fix
                    </p>
                    <p className="text-[12px] text-ivory leading-relaxed whitespace-pre-line">
                      {dbWarning.fixInstructions}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
          {children}
        </main>
      </div>
    </div>
  );
}
