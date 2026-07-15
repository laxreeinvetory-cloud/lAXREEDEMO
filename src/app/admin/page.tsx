"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Users, FileText, TrendingUp, Mail, Phone, Hotel, Clock } from "lucide-react";

type Stats = {
  totalLeads: number;
  newLeads: number;
  totalBlogPosts: number;
  publishedPosts: number;
  leadsBySource: Record<string, number>;
};

type RecentLead = {
  id: string;
  name: string;
  phone: string;
  hotel: string | null;
  source: string;
  status: string;
  refNo: string | null;
  createdAt: string;
};

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [recentLeads, setRecentLeads] = useState<RecentLead[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/stats")
      .then((r) => r.json())
      .then((data) => {
        if (data.ok) {
          setStats(data.stats);
          setRecentLeads(data.recentLeads || []);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-brass/30 border-t-brass" />
      </div>
    );
  }

  const statCards = [
    { label: "Total Leads", value: stats?.totalLeads || 0, icon: Users, color: "text-brass", bg: "bg-brass/10" },
    { label: "New Leads", value: stats?.newLeads || 0, icon: TrendingUp, color: "text-emerald-400", bg: "bg-emerald/10" },
    { label: "Blog Posts", value: stats?.totalBlogPosts || 0, icon: FileText, color: "text-blue-400", bg: "bg-blue-500/10" },
    { label: "Published", value: stats?.publishedPosts || 0, icon: FileText, color: "text-purple-400", bg: "bg-purple-500/10" },
  ];

  const sourceLabels: Record<string, string> = {
    contact: "Contact Page",
    quotation: "Quotation Request",
    catalogue: "Catalogue Download",
    dealer: "Dealer Application",
    career: "Career Application",
    enquiry: "Enquiry Modal",
  };

  return (
    <div>
      <h1 className="font-display text-3xl text-ivory mb-2">Dashboard</h1>
      <p className="font-body text-sm text-sand mb-8">Welcome back! Here's what's happening with your website.</p>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <div key={card.label} className="glass-on-charcoal rounded-2xl p-5">
              <div className={`mb-3 flex h-10 w-10 items-center justify-center rounded-full ${card.bg}`}>
                <Icon className={`h-5 w-5 ${card.color}`} strokeWidth={1.75} />
              </div>
              <p className="font-mono text-2xl font-bold text-ivory">{card.value}</p>
              <p className="font-body text-[12px] text-sand mt-1">{card.label}</p>
            </div>
          );
        })}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent leads */}
        <div className="glass-on-charcoal rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-lg text-ivory">Recent Leads</h2>
            <Link href="/admin/leads" className="font-mono text-[11px] uppercase tracking-wider text-brass hover:underline">
              View All →
            </Link>
          </div>
          {recentLeads.length === 0 ? (
            <p className="font-body text-sm text-sand py-8 text-center">No leads yet</p>
          ) : (
            <div className="flex flex-col gap-3">
              {recentLeads.map((lead) => (
                <div key={lead.id} className="flex items-center gap-3 rounded-xl bg-white/5 p-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-brass/10">
                    <Users className="h-4 w-4 text-brass" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-body text-sm text-ivory font-medium truncate">{lead.name}</p>
                    <div className="flex items-center gap-3 text-[11px] text-sand">
                      <span className="flex items-center gap-1"><Phone className="h-3 w-3" />{lead.phone}</span>
                      {lead.hotel && <span className="flex items-center gap-1"><Hotel className="h-3 w-3" />{lead.hotel}</span>}
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`inline-block rounded-full px-2.5 py-1 text-[9px] font-mono uppercase tracking-wider ${
                      lead.status === "new" ? "bg-emerald/20 text-emerald-400" :
                      lead.status === "contacted" ? "bg-blue-500/20 text-blue-400" :
                      lead.status === "quoted" ? "bg-brass/20 text-brass" :
                      "bg-white/10 text-sand"
                    }`}>
                      {lead.status}
                    </span>
                    <p className="font-mono text-[9px] text-sand mt-1">
                      {new Date(lead.createdAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short" })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Leads by source */}
        <div className="glass-on-charcoal rounded-2xl p-6">
          <h2 className="font-display text-lg text-ivory mb-4">Leads by Source</h2>
          {stats && Object.entries(stats.leadsBySource).map(([source, count]) => {
            const max = Math.max(...Object.values(stats.leadsBySource), 1);
            const pct = (count / max) * 100;
            return (
              <div key={source} className="mb-4">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-body text-sm text-sand">{sourceLabels[source] || source}</span>
                  <span className="font-mono text-sm text-ivory font-bold">{count}</span>
                </div>
                <div className="h-2 rounded-full bg-white/5 overflow-hidden">
                  <div className="h-full rounded-full bg-brass transition-all" style={{ width: `${pct}%` }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
