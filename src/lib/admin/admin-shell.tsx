"use client";

import { useEffect, useState, useRef } from "react";
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
  Home,
  HelpCircle,
  LogOut,
  ExternalLink,
  Menu,
  X,
  Image as ImageIcon,
  Briefcase,
  Handshake,
  Database,
  TrendingUp,
  CornerDownLeft,
} from "lucide-react";

const navItems = [
  // ── OVERVIEW ──
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Analytics & SEO", href: "/admin/analytics", icon: TrendingUp },
  // ── CRM ──
  { label: "Leads CRM", href: "/admin/crm", icon: Database },
  { label: "Leads (Legacy)", href: "/admin/leads", icon: Users },
  // ── CATALOGUE ──
  { label: "Products", href: "/admin/products", icon: Package },
  { label: "Media Library", href: "/admin/media", icon: ImageIcon },
  { label: "Blog Posts", href: "/admin/blog", icon: FileText },
  // ── CONTENT ──
  { label: "Homepage Builder", href: "/admin/homepage", icon: Home },
  { label: "Website CMS", href: "/admin/cms", icon: Settings },
  { label: "Page Content", href: "/admin/pages", icon: FileEdit },
  { label: "FAQ Manager", href: "/admin/faq", icon: HelpCircle },
  // ── PEOPLE ──
  { label: "Careers", href: "/admin/careers", icon: Briefcase },
  { label: "Dealers", href: "/admin/dealers", icon: Handshake },
  // ── CONFIGURATION ──
  { label: "Site Settings", href: "/admin/settings", icon: Settings },
  { label: "Appearance", href: "/admin/appearance", icon: Palette },
  { label: "SEO & Company", href: "/admin/seo", icon: Search },
  { label: "Content Hub", href: "/admin/content", icon: FileEdit },
];

export function AdminShell({ children }: { children: React.ReactNode }) {
  const { user, logout, loading } = useAdmin();
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [quickJumpOpen, setQuickJumpOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!loading && !user && pathname !== "/admin/login") {
      router.push("/admin/login");
    }
  }, [user, loading, pathname, router]);

  // ⌘K / Ctrl+K shortcut for Quick Jump
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setQuickJumpOpen((prev) => !prev);
      }
      if (e.key === "Escape" && quickJumpOpen) {
        setQuickJumpOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [quickJumpOpen]);

  // Focus search input when quick jump opens
  useEffect(() => {
    if (quickJumpOpen && searchInputRef.current) {
      searchInputRef.current.focus();
      setSearchQuery("");
      setSelectedIndex(0);
    }
  }, [quickJumpOpen]);

  // Filter nav items based on search
  const filteredItems = navItems.filter((item) =>
    item.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Handle keyboard navigation in quick jump
  const handleQuickJumpKey = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => Math.min(prev + 1, filteredItems.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => Math.max(prev - 1, 0));
    } else if (e.key === "Enter" && filteredItems[selectedIndex]) {
      e.preventDefault();
      router.push(filteredItems[selectedIndex].href);
      setQuickJumpOpen(false);
    }
  };

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
        } lg:translate-x-0 fixed lg:sticky top-0 left-0 z-50 h-screen w-64 bg-charcoal border-r border-white/10 transition-transform overflow-y-auto`}
      >
        <div className="p-6 border-b border-white/10">
          <img src="/images/laxree-logo.png" alt="LaxRee" className="h-8" />
          <p className="mt-2 font-mono text-[9px] uppercase tracking-[0.3em] text-sand">Admin Console</p>
        </div>

        {/* Quick Jump Button */}
        <div className="p-3">
          <button
            onClick={() => setQuickJumpOpen(true)}
            className="flex w-full items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-sand/60 hover:bg-white/10 transition-colors"
          >
            <Search className="h-4 w-4" />
            <span>Quick jump...</span>
            <kbd className="ml-auto rounded bg-white/10 px-1.5 py-0.5 font-mono text-[10px] text-sand/60">⌘K</kbd>
          </button>
        </div>

        <nav className="px-4 pb-4 flex flex-col gap-0.5">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-[13px] font-medium transition-colors ${
                  isActive
                    ? "bg-brass/10 text-brass"
                    : "text-sand hover:bg-white/5 hover:text-ivory"
                }`}
              >
                <Icon className="h-4 w-4 shrink-0" strokeWidth={1.75} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="sticky bottom-0 left-0 right-0 p-4 border-t border-white/10 bg-charcoal">
          <a
            href="https://l-axreedemo.vercel.app"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-[13px] text-sand hover:bg-white/5 hover:text-ivory transition-colors mb-1"
          >
            <ExternalLink className="h-4 w-4" strokeWidth={1.75} />
            View Website
          </a>
          <button
            onClick={() => {
              logout();
              router.push("/admin/login");
            }}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-[13px] text-sand hover:bg-red-500/10 hover:text-red-400 transition-colors"
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

      {/* Quick Jump Modal */}
      {quickJumpOpen && (
        <div
          className="fixed inset-0 z-[100] bg-black/60 flex items-start justify-center pt-[15vh] px-4"
          onClick={() => setQuickJumpOpen(false)}
        >
          <div
            className="bg-gray-900 border border-white/15 rounded-xl w-full max-w-lg shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Search input */}
            <div className="flex items-center gap-3 px-4 py-3 border-b border-white/10">
              <Search className="h-5 w-5 text-gray-400" />
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setSelectedIndex(0);
                }}
                onKeyDown={handleQuickJumpKey}
                placeholder="Jump to..."
                className="flex-1 bg-transparent text-white text-sm placeholder:text-gray-500 focus:outline-none"
              />
              <kbd className="rounded bg-white/10 px-1.5 py-0.5 font-mono text-[10px] text-gray-400">ESC</kbd>
            </div>
            {/* Results */}
            <div className="max-h-80 overflow-y-auto py-2">
              {filteredItems.length === 0 && (
                <p className="px-4 py-8 text-center text-sm text-gray-500">No results found</p>
              )}
              {filteredItems.map((item, idx) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.href}
                    onClick={() => {
                      router.push(item.href);
                      setQuickJumpOpen(false);
                    }}
                    onMouseEnter={() => setSelectedIndex(idx)}
                    className={`flex w-full items-center gap-3 px-4 py-2.5 text-sm transition-colors ${
                      idx === selectedIndex
                        ? "bg-yellow-600/20 text-yellow-400"
                        : "text-gray-300 hover:bg-white/5"
                    }`}
                  >
                    <Icon className="h-4 w-4 shrink-0" />
                    <span>{item.label}</span>
                    {idx === selectedIndex && (
                      <CornerDownLeft className="h-3.5 w-3.5 ml-auto text-gray-500" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar (mobile + desktop) */}
        <header className="flex items-center justify-between p-4 border-b border-white/10 sticky top-0 bg-charcoal z-30">
          <div className="flex items-center gap-3">
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-ivory lg:hidden">
              {sidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
            <img src="/images/laxree-logo.png" alt="LaxRee" className="h-6 lg:hidden" />
            <span className="hidden lg:block font-mono text-[11px] uppercase tracking-wider text-sand/60">
              {navItems.find((n) => n.href === pathname)?.label || "Admin"}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setQuickJumpOpen(true)}
              className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-sand/60 hover:bg-white/10 transition-colors"
            >
              <Search className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Quick jump...</span>
              <kbd className="rounded bg-white/10 px-1 py-0.5 font-mono text-[10px]">⌘K</kbd>
            </button>
            <a
              href="https://l-axreedemo.vercel.app"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-lg bg-white/5 border border-white/10 px-3 py-1.5 text-xs text-sand hover:text-ivory transition-colors"
            >
              View site
            </a>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-6 md:p-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
