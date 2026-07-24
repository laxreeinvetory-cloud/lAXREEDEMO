"use client";

import { useEffect, useState } from "react";
import {
  TrendingUp,
  TrendingDown,
  Eye,
  MousePointerClick,
  Users,
  Globe,
  Search,
  Smartphone,
  Monitor,
  Chrome,
  MapPin,
  FileText,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";

const inputClass = "w-full rounded-lg border border-white/15 bg-white/10 px-3 py-2 text-sm text-white";
const labelClass = "block text-[11px] font-semibold uppercase tracking-wider text-gray-300 mb-1.5";
const btnPrimary = "rounded-lg bg-yellow-600 text-black px-4 py-2 text-sm font-semibold hover:bg-yellow-500 transition-colors";

export default function AnalyticsPage() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch leads stats for analytics
    fetch("/api/admin/stats")
      .then((r) => r.json())
      .then((data) => {
        if (data.ok) setStats(data.stats);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-yellow-600/30 border-t-yellow-600" />
      </div>
    );
  }

  const totalLeads = stats?.totalLeads || 0;
  const newLeads = stats?.newLeads || 0;

  // Mock analytics data (replace with real analytics API when available)
  const analytics = {
    pageViews: { value: 1987, change: "+12.3%", trend: "up" },
    uniqueVisitors: { value: 1107, change: "+8.7%", trend: "up" },
    leads: { value: totalLeads, change: "+5.2%", trend: "up" },
    conversionRate: { value: "0.15%", change: "-0.3%", trend: "down" },
    whatsappClicks: { value: 42, change: "+18%", trend: "up" },
    catalogueDownloads: { value: 15, change: "+4%", trend: "up" },
  };

  const topPages = [
    { path: "/", views: 590, title: "Homepage" },
    { path: "/products", views: 312, title: "Products" },
    { path: "/products/room-amenities", views: 198, title: "Room Amenities" },
    { path: "/about-us", views: 156, title: "About Us" },
    { path: "/catalogue", views: 134, title: "Catalogue" },
    { path: "/contact-us", views: 98, title: "Contact Us" },
    { path: "/products/furniture", views: 87, title: "Furniture" },
    { path: "/experience-center", views: 65, title: "Experience Center" },
  ];

  const topReferrers = [
    { source: "Google Search", visits: 845, pct: 42 },
    { source: "Direct", visits: 412, pct: 21 },
    { source: "WhatsApp", visits: 298, pct: 15 },
    { source: "LinkedIn", visits: 156, pct: 8 },
    { source: "Facebook", visits: 98, pct: 5 },
    { source: "Instagram", visits: 67, pct: 3 },
    { source: "Email", visits: 89, pct: 4 },
    { source: "Other", visits: 22, pct: 2 },
  ];

  const devices = [
    { name: "Mobile", pct: 68, icon: Smartphone },
    { name: "Desktop", pct: 25, icon: Monitor },
    { name: "Tablet", pct: 7, icon: Monitor },
  ];

  const browsers = [
    { name: "Chrome", pct: 72 },
    { name: "Safari", pct: 18 },
    { name: "Firefox", pct: 5 },
    { name: "Edge", pct: 3 },
    { name: "Other", pct: 2 },
  ];

  const countries = [
    { name: "India", visits: 1456, pct: 73 },
    { name: "UAE", visits: 198, pct: 10 },
    { name: "USA", visits: 89, pct: 4 },
    { name: "UK", visits: 67, pct: 3 },
    { name: "Singapore", visits: 45, pct: 2 },
    { name: "Other", visits: 132, pct: 8 },
  ];

  const seoKeywords = [
    { keyword: "hotel minibar manufacturer india", position: 3, change: 2, volume: "1.2K" },
    { keyword: "hotel supplies ajmer", position: 1, change: 0, volume: "890" },
    { keyword: "hospitality procurement india", position: 5, change: -1, volume: "2.1K" },
    { keyword: "hotel safe box price", position: 7, change: 3, volume: "1.5K" },
    { keyword: "rfid hotel door lock", position: 4, change: 1, volume: "980" },
    { keyword: "hotel furniture manufacturer", position: 8, change: -2, volume: "3.2K" },
    { keyword: "laxree amenities", position: 1, change: 0, volume: "320" },
    { keyword: "bath tub manufacturer india", position: 6, change: 2, volume: "1.8K" },
  ];

  return (
    <div className="min-h-screen">
      <div className="flex items-start justify-between flex-wrap gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white mb-1">Analytics & SEO</h1>
          <p className="text-sm text-gray-400">Website traffic, lead conversion, and SEO keyword tracking</p>
        </div>
        <select className={inputClass + " w-auto"}>
          <option value="30">Last 30 days</option>
          <option value="7">Last 7 days</option>
          <option value="90">Last 90 days</option>
        </select>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {[
          { label: "Page Views", value: analytics.pageViews.value, change: analytics.pageViews.change, trend: analytics.pageViews.trend, icon: Eye },
          { label: "Unique Visitors", value: analytics.uniqueVisitors.value, change: analytics.uniqueVisitors.change, trend: analytics.uniqueVisitors.trend, icon: Users },
          { label: "Leads Generated", value: analytics.leads.value, change: analytics.leads.change, trend: analytics.leads.trend, icon: TrendingUp },
          { label: "Conversion Rate", value: analytics.conversionRate.value, change: analytics.conversionRate.change, trend: analytics.conversionRate.trend, icon: MousePointerClick },
          { label: "WhatsApp Clicks", value: analytics.whatsappClicks.value, change: analytics.whatsappClicks.change, trend: analytics.whatsappClicks.trend, icon: Globe },
          { label: "Catalogue Downloads", value: analytics.catalogueDownloads.value, change: analytics.catalogueDownloads.change, trend: analytics.catalogueDownloads.trend, icon: FileText },
        ].map((metric) => {
          const Icon = metric.icon;
          return (
            <div key={metric.label} className="bg-white/5 border border-white/10 rounded-xl p-5">
              <div className="flex items-center justify-between mb-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-yellow-600/10">
                  <Icon className="h-4.5 w-4.5 text-yellow-500" />
                </div>
                <span className={`flex items-center gap-1 text-xs font-mono ${metric.trend === "up" ? "text-green-400" : "text-red-400"}`}>
                  {metric.trend === "up" ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                  {metric.change}
                </span>
              </div>
              <p className="text-2xl font-bold text-white font-mono">{metric.value}</p>
              <p className="text-[11px] text-gray-400 mt-1">{metric.label}</p>
            </div>
          );
        })}
      </div>

      {/* Two column layout */}
      <div className="grid lg:grid-cols-2 gap-6 mb-8">
        {/* Top Pages */}
        <div className="bg-white/5 border border-white/10 rounded-xl p-5">
          <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
            <FileText className="h-4 w-4 text-yellow-500" />
            Top Pages (30 days)
          </h3>
          <div className="space-y-2">
            {topPages.map((page, i) => {
              const maxViews = topPages[0].views;
              const pct = (page.views / maxViews) * 100;
              return (
                <div key={page.path} className="flex items-center gap-3">
                  <span className="font-mono text-xs text-gray-500 w-6">{i + 1}</span>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-0.5">
                      <span className="text-sm text-white truncate">{page.title}</span>
                      <span className="font-mono text-xs text-gray-400 ml-2">{page.views}</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
                      <div className="h-full rounded-full bg-yellow-600/60" style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Top Referrers */}
        <div className="bg-white/5 border border-white/10 rounded-xl p-5">
          <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
            <Globe className="h-4 w-4 text-yellow-500" />
            Top Referrers (30 days)
          </h3>
          <div className="space-y-2">
            {topReferrers.map((ref) => (
              <div key={ref.source} className="flex items-center gap-3">
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-0.5">
                    <span className="text-sm text-white">{ref.source}</span>
                    <span className="font-mono text-xs text-gray-400">{ref.visits} ({ref.pct}%)</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
                    <div className="h-full rounded-full bg-blue-500/60" style={{ width: `${ref.pct}%` }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Device & Browser Analytics */}
      <div className="grid lg:grid-cols-3 gap-6 mb-8">
        {/* Devices */}
        <div className="bg-white/5 border border-white/10 rounded-xl p-5">
          <h3 className="text-sm font-semibold text-white mb-4">Devices</h3>
          {devices.map((device) => {
            const Icon = device.icon;
            return (
              <div key={device.name} className="mb-3">
                <div className="flex items-center justify-between mb-1">
                  <span className="flex items-center gap-2 text-sm text-white">
                    <Icon className="h-4 w-4 text-gray-400" />
                    {device.name}
                  </span>
                  <span className="font-mono text-xs text-gray-400">{device.pct}%</span>
                </div>
                <div className="h-2 rounded-full bg-white/5 overflow-hidden">
                  <div className="h-full rounded-full bg-green-500/60" style={{ width: `${device.pct}%` }} />
                </div>
              </div>
            );
          })}
        </div>

        {/* Browsers */}
        <div className="bg-white/5 border border-white/10 rounded-xl p-5">
          <h3 className="text-sm font-semibold text-white mb-4">Browsers</h3>
          {browsers.map((browser) => (
            <div key={browser.name} className="mb-3">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm text-white">{browser.name}</span>
                <span className="font-mono text-xs text-gray-400">{browser.pct}%</span>
              </div>
              <div className="h-2 rounded-full bg-white/5 overflow-hidden">
                <div className="h-full rounded-full bg-purple-500/60" style={{ width: `${browser.pct}%` }} />
              </div>
            </div>
          ))}
        </div>

        {/* Countries */}
        <div className="bg-white/5 border border-white/10 rounded-xl p-5">
          <h3 className="text-sm font-semibold text-white mb-4">Countries</h3>
          {countries.map((country) => (
            <div key={country.name} className="mb-3">
              <div className="flex items-center justify-between mb-1">
                <span className="flex items-center gap-2 text-sm text-white">
                  <MapPin className="h-3.5 w-3.5 text-gray-400" />
                  {country.name}
                </span>
                <span className="font-mono text-xs text-gray-400">{country.visits}</span>
              </div>
              <div className="h-2 rounded-full bg-white/5 overflow-hidden">
                <div className="h-full rounded-full bg-orange-500/60" style={{ width: `${country.pct}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* SEO Keyword Tracking */}
      <div className="bg-white/5 border border-white/10 rounded-xl p-5 mb-8">
        <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
          <Search className="h-4 w-4 text-yellow-500" />
          SEO Keyword Tracking
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10">
                <th className="px-3 py-2 text-left font-mono text-[10px] uppercase tracking-wider text-gray-400">Keyword</th>
                <th className="px-3 py-2 text-center font-mono text-[10px] uppercase tracking-wider text-gray-400">Position</th>
                <th className="px-3 py-2 text-center font-mono text-[10px] uppercase tracking-wider text-gray-400">Change</th>
                <th className="px-3 py-2 text-right font-mono text-[10px] uppercase tracking-wider text-gray-400">Search Volume</th>
              </tr>
            </thead>
            <tbody>
              {seoKeywords.map((kw) => (
                <tr key={kw.keyword} className="border-b border-white/5 hover:bg-white/5">
                  <td className="px-3 py-2.5 text-sm text-white">{kw.keyword}</td>
                  <td className="px-3 py-2.5 text-center">
                    <span className={`inline-flex items-center justify-center h-7 w-7 rounded-full text-xs font-bold ${
                      kw.position <= 3 ? "bg-green-500/20 text-green-400" :
                      kw.position <= 10 ? "bg-yellow-500/20 text-yellow-400" :
                      "bg-gray-500/20 text-gray-400"
                    }`}>
                      {kw.position}
                    </span>
                  </td>
                  <td className="px-3 py-2.5 text-center">
                    {kw.change === 0 ? (
                      <span className="text-gray-500 text-xs">—</span>
                    ) : kw.change > 0 ? (
                      <span className="text-green-400 text-xs font-mono">↑{kw.change}</span>
                    ) : (
                      <span className="text-red-400 text-xs font-mono">↓{Math.abs(kw.change)}</span>
                    )}
                  </td>
                  <td className="px-3 py-2.5 text-right font-mono text-xs text-gray-400">{kw.volume}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Lead Conversion Funnel */}
      <div className="bg-white/5 border border-white/10 rounded-xl p-5">
        <h3 className="text-sm font-semibold text-white mb-4">Lead Conversion Funnel (30 days)</h3>
        <div className="space-y-3">
          {[
            { stage: "Page Views", count: 1987, pct: 100, color: "bg-blue-500/60" },
            { stage: "Product Pages Visited", count: 892, pct: 45, color: "bg-cyan-500/60" },
            { stage: "Enquiry/Quotation Started", count: 234, pct: 12, color: "bg-yellow-500/60" },
            { stage: "Form Submitted (Leads)", count: totalLeads || 15, pct: 0.8, color: "bg-orange-500/60" },
            { stage: "Contacted/Closed", count: Math.floor((totalLeads || 15) * 0.4), pct: 0.3, color: "bg-green-500/60" },
          ].map((step) => (
            <div key={step.stage}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm text-white">{step.stage}</span>
                <span className="font-mono text-xs text-gray-400">{step.count} ({step.pct}%)</span>
              </div>
              <div className="h-3 rounded-full bg-white/5 overflow-hidden">
                <div className={`h-full rounded-full ${step.color}`} style={{ width: `${Math.max(step.pct, 2)}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
