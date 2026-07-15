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
  LogOut,
  ExternalLink,
  Menu,
  X,
} from "lucide-react";

const navItems = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Leads", href: "/admin/leads", icon: Users },
  { label: "Blog Posts", href: "/admin/blog", icon: FileText },
  { label: "Content", href: "/admin/content", icon: Settings },
];

export function AdminShell({ children }: { children: React.ReactNode }) {
  const { user, logout, loading } = useAdmin();
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!loading && !user && pathname !== "/admin/login") {
      router.push("/admin/login");
    }
  }, [user, loading, pathname, router]);

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
        } lg:translate-x-0 fixed lg:sticky top-0 left-0 z-50 h-screen w-64 bg-charcoal border-r border-white/10 transition-transform`}
      >
        <div className="p-6 border-b border-white/10">
          <img src="/images/laxree-logo.png" alt="LaxRee" className="h-8" />
          <p className="mt-2 font-mono text-[9px] uppercase tracking-[0.3em] text-sand">Admin Panel</p>
        </div>

        <nav className="p-4 flex flex-col gap-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 rounded-xl px-4 py-3 text-[14px] font-medium transition-colors ${
                  isActive
                    ? "bg-brass/10 text-brass border border-brass/20"
                    : "text-sand hover:bg-white/5 hover:text-ivory"
                }`}
              >
                <Icon className="h-4 w-4" strokeWidth={1.75} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-white/10">
          <a
            href="https://l-axreedemo.vercel.app"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 rounded-xl px-4 py-3 text-[13px] text-sand hover:bg-white/5 hover:text-ivory transition-colors mb-1"
          >
            <ExternalLink className="h-4 w-4" strokeWidth={1.75} />
            View Website
          </a>
          <button
            onClick={() => {
              logout();
              router.push("/admin/login");
            }}
            className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-[13px] text-sand hover:bg-red-500/10 hover:text-red-400 transition-colors"
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
          {children}
        </main>
      </div>
    </div>
  );
}
